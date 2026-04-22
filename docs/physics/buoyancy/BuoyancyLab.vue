<template>
  <div class="lab-wrapper">
    <div class="controls-panel">
      <h4>实验控制台</h4>
      <div class="control-group">
        <label>调整物块高度 (<i>Y</i>): </label>
        <input 
          type="range" 
          v-model.number="objectY" 
          :min="minY" 
          :max="maxY" 
          step="1"
        />
      </div>
      
      <div class="data-display">
        <p><strong>物块状态:</strong> <span :class="statusClass">{{ statusText }}</span></p>
        <p><strong>物块高度 <i>Y</i><sub>top</sub>:</strong> {{ objectY }} px</p>
        <p><strong>浸入深度 <i>h</i>:</strong> {{ immersionDepth.toFixed(0) }} px</p>
        <div class="force-readout">
          <strong>弹簧测力计读数 (<i>F</i>):</strong>
          <span class="force-value">{{ displayForce }} N</span>
        </div>
      </div>
    </div>

    <div class="visual-stage">
      <div class="reference-line water-level-line" :style="{ top: waterTop + 'px' }">
        <span>Liquid Surface</span>
      </div>
      <div class="reference-line base-level-line" :style="{ top: stageHeight + 'px' }">
        <span>Base Level (Y=400)</span>
      </div>

      <div class="scale-setup" :style="{ top: scaleSetupTop + 'px' }">
        <div class="scale-body">
          <div class="scale-marks"></div>
          <div class="scale-pointer" :style="{ transform: 'translateY(' + pointerOffset + 'px)' }"></div>
        </div>
        <div class="scale-hook-point" ref="scaleHook"></div>
      </div>

      <div 
        class="object-box" 
        :style="{ 
          top: objectY + 'px', 
          height: objectHeight + 'px',
          width: objectWidth + 'px'
        }"
      >
        <div class="object-attach-point" ref="objectAttach"></div>
        <span class="obj-label">Obj</span>
      </div>

      <div class="beaker-container" :style="{ bottom: beakerBottom + 'px' }">
        <div class="beaker-glass">
          <div class="water-liquid" :style="{ height: liquidHeight + 'px' }"></div>
        </div>
      </div>

      <svg class="connecting-line-svg">
        <line 
          :x1="stageWidth / 2" 
          :y1="scaleSetupTop + scaleBodyHeight" 
          :x2="stageWidth / 2" 
          :y2="objectY" 
          stroke="#444" 
          stroke-width="2"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// --- 舞台尺寸与布局常量 ---
const stageWidth = 350;
const stageHeight = 400; // 实验台总高度 Y-max
const beakerBottom = 10;   // 烧杯距离底部的距离

// --- 物理参数设置 ---
const G_obj = 10.0;             // 物体重力 (N)
const k_buoyancy = 0.08;        // 模拟浮力系数 (N/px, 模拟 rho*g*S)
const objectHeight = 80;        // 物块高度 (px)
const objectWidth = 60;         // 物块宽度 (px)

// --- 实验器材位置常量 ---
const scaleSetupTop = 10;       // 测力计顶部 Y 坐标
const scaleBodyHeight = 90;     // 测力计主体高度
const beakerHeight = 180;       // 烧杯高度
const liquidHeight = 150;       // 烧杯内液体高度
const beakerBorderWidth = 8;    // 烧杯边框宽度 (px)

// 计算水面在舞台上的绝对 Y 坐标
// 水面 Y = 舞台高度 - 烧杯距离底部 - 烧杯底边框 - 液体高度
const waterTop = computed(() => stageHeight - beakerBottom - beakerBorderWidth - liquidHeight);

// --- 响应式变量 ---
// 物块顶部的 Y 坐标，这是用户唯一控制的变量
// minY: 紧贴测力计底部; maxY: 紧贴烧杯底部
const scaleHookY = scaleSetupTop + scaleBodyHeight;
const minY = ref(scaleHookY + 10); // 留 10px 间距给线
const maxY = ref(stageHeight - beakerBottom - objectHeight - 5); 
const objectY = ref(scaleHookY + 50); // 初始位置：空中


// --- 核心物理逻辑计算 ---

// 1. 计算物块底部的 Y 坐标
const objectBottomY = computed(() => objectY.value + objectHeight);

// 2. 计算浸入深度 h (px)
// 逻辑：只有当 objectBottomY > waterTop 时才开始浸入
const immersionDepth = computed(() => {
  if (objectBottomY.value <= waterTop.value) {
    return 0; // 完全在空中
  } else if (objectY.value >= waterTop.value) {
    return objectHeight; // 完全浸入水下
  } else {
    // 部分浸入: 底部的 Y 坐标减去水面的 Y 坐标
    return objectBottomY.value - waterTop.value;
  }
});

// 3. 计算浮力 F_buy
const buoyancyForce = computed(() => {
  return immersionDepth.value * k_buoyancy;
});

// 4. 计算弹簧测力计读数 F = G - F_buy
const displayForce = computed(() => {
  const f = G_obj - buoyancyForce.value;
  return Math.max(0, f).toFixed(2); // 防止出现负数读数
});

// 5. 计算测力计指针偏移 (视觉效果)
// 指针在 0N 时最低 (模拟弹簧拉伸最长)，G_obj N 时最高 (模拟无浮力)
// 这里设计为读数越小，指针越向上收
const pointerOffset = computed(() => {
  const maxOffset = 60; // G_obj (10N) 时的最大偏移
  const scale = maxOffset / G_obj; 
  // 读数越小 (浮力越大)，偏移量越小 (指针越靠上)
  return (parseFloat(displayForce.value)) * scale;
});


// --- 状态文本 ---
const statusText = computed(() => {
  if (immersionDepth.value <= 0) return "空中 (未浸入)";
  if (immersionDepth.value >= objectHeight) return "完全浸入";
  return "部分浸入";
});

const statusClass = computed(() => {
  if (immersionDepth.value <= 0) return "status-air";
  if (immersionDepth.value >= objectHeight) return "status-full";
  return "status-partial";
});

</script>

<style scoped>
/* 全局容器：Flex 布局将控制面板和演示例分开 */
.lab-wrapper {
  display: flex;
  gap: 25px;
  padding: 20px;
  background: #f4f7f6;
  border-radius: 15px;
  border: 1px solid #e0e0e0;
  color: #333;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
}

/* 控制面板样式 */
.controls-panel {
  flex: 0 0 280px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.controls-panel h4 {
  margin-top: 0;
  border-bottom: 2px solid #42b983;
  padding-bottom: 8px;
  color: #2c3e50;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  font-size: 0.9rem;
  font-weight: bold;
}

input[type="range"] {
  width: 100%;
  cursor: pointer;
}

.data-display {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
  font-size: 0.9rem;
  border: 1px solid #eee;
}

.data-display p {
  margin: 6px 0;
}

.force-readout {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed #ccc;
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.force-value {
  color: #e74c3c;
  font-weight: bold;
  font-size: 1.3rem;
}

/* 状态颜色 */
.status-air { color: #7f8c8d; }
.status-partial { color: #f39c12; font-weight: bold;}
.status-full { color: #2980b9; font-weight: bold;}


/* --- 演示舞台样式 --- */
.visual-stage {
  position: relative;
  width: 350px;
  height: 400px; /* 同 stageHeight 常量 */
  background: white;
  border-radius: 10px;
  border: 2px solid #ddd;
  overflow: hidden; /* 防止物体越界 */
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* 参考线 */
.reference-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
}
.reference-line span {
  font-size: 10px;
  padding: 1px 4px;
  background: rgba(255,255,255,0.7);
  transform: translateY(-50%);
}

.water-level-line {
  border-top: 1px dashed rgba(0, 150, 255, 0.7);
  color: rgba(0, 100, 200, 0.8);
}
.base-level-line {
  border-top: 1px solid #aaa;
  color: #555;
}


/* 弹簧测力计 */
.scale-setup {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 100px; /* 略大于主体以容纳连接点 */
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scale-body {
  width: 44px;
  height: 90px; /* 同 scaleBodyHeight */
  background: #f1c40f;
  border: 2px solid #333;
  border-radius: 4px;
  position: relative;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.scale-marks {
  position: absolute;
  left: 5px;
  top: 10px;
  bottom: 10px;
  width: 10px;
  border-left: 2px solid #333;
  /* 简单的刻度线视觉效果 */
  background: linear-gradient(to bottom, #333 1px, transparent 1px);
  background-size: 100% 10px;
}

.scale-pointer {
  position: absolute;
  right: 5px;
  top: 10px; /* 0点位置 (对应 G_obj N) */
  width: 20px;
  height: 3px;
  background: #e74c3c;
  border-radius: 2px;
  transition: transform 0.1s ease-out; /* 弹簧动的效果 */
  z-index: 11;
}

/* 物理连接点 (视觉上的小挂钩) */
.scale-hook-point, .object-attach-point {
  width: 8px;
  height: 8px;
  background: #444;
  border-radius: 50%;
}
.scale-hook-point {
  margin-top: -2px; /* 紧贴测力计底部 */
}


/* 物块样式 */
.object-box {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: #8e6e46; /* 棕色木块感 */
  border: 2px solid #5d4037;
  border-radius: 4px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
  /* 确保 top 属性的过渡平滑 (可选，为了增强手动滑动的连贯性) */
  /* transition: top 0.05s linear; */
}

.object-attach-point {
  margin-top: -4px; /* 紧贴物块顶部 */
}

.obj-label {
  color: white;
  font-size: 12px;
  font-weight: bold;
  margin-top: auto;
  margin-bottom: auto;
}


/* 烧杯与液体 */
.beaker-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 180px; /* 同 beakerHeight */
  z-index: 2;
}

.beaker-glass {
  width: 100%;
  height: 100%;
  border: 4px solid #7f8c8d;
  border-top: none;
  border-radius: 0 0 15px 15px;
  background: rgba(255, 255, 255, 0.4);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end; /* 液体从底部填充 */
}

.water-liquid {
  width: 100%;
  background: rgba(52, 152, 219, 0.5); /* 蓝色液体 */
  border-top: 2px solid rgba(41, 128, 185, 0.8);
  /* 液体高度由计算属性直接控制，这里不加过渡以维持物理同步 */
}

/* 细线：SVG 覆盖层 */
.connecting-line-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4; /* 在物块和测力计之间 */
  pointer-events: none; /* 允许点击穿透 */
}
</style>
