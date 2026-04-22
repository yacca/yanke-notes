<script setup>
import { ref } from 'vue'

const force = ref(0)
const wallX = 300 // 墙表面 X 坐标
const contactY = 110 // 手墙接触点 Y 坐标
const arrowThickness = 12 // 箭头的固定粗细
const maxHeadLen = 30 // 大力时箭头的最大长度

const resetForce = () => {
  force.value = 0
}

/**
 * 绘制高度动态的 PhET 风格箭头
 * @param {string} dir - 'right' (手对墙) 或 'left' (墙对手)
 */
const getArrowPath = (dir) => {
  const f = force.value
  if (f <= 0) return ''

  // 1. 总长度与力成正比 (200N = 160px)
  const totalLen = (f / 200) * 160

  /**
   * 2. 动态比例逻辑：
   * 为了实现“在力小时箭头也呈压扁形状”：
   * 我们设定线段（躯干）占总长的 50%，头部（三角形高）占总长的 50%。
   * 当总长超过某个阈值（如 60px）后，头部长度固定在 maxHeadLen，其余全是躯干。
   */
  let headLen, shaftLen
  if (totalLen < maxHeadLen * 2) {
    shaftLen = totalLen / 2
    headLen = totalLen / 2
  } else {
    headLen = maxHeadLen
    shaftLen = totalLen - maxHeadLen
  }

  const halfT = arrowThickness / 2
  const halfH = 12 // 箭头的半宽（固定粗细）

  if (dir === 'right') {
    return `
      M 0 ${-halfT} 
      L ${shaftLen} ${-halfT} 
      L ${shaftLen} ${-halfH} 
      L ${totalLen} 0 
      L ${shaftLen} ${halfH} 
      L ${shaftLen} ${halfT} 
      L 0 ${halfT} 
      Z`
  } else {
    return `
      M 0 ${-halfT} 
      L ${-shaftLen} ${-halfT} 
      L ${-shaftLen} ${-halfH} 
      L ${-totalLen} 0 
      L ${-shaftLen} ${halfH} 
      L ${-shaftLen} ${halfT} 
      L 0 ${halfT} 
      Z`
  }
}
</script>

<template>
  <div class="phet-box">
    <div class="force-readout">
      推力: <span class="highlight">{{ force }} N</span>
    </div>

    <svg viewBox="0 0 500 220" class="stage">
      <rect
        x="0"
        y="170"
        width="500"
        height="50"
        fill="#aed581"
        stroke="#333"
        stroke-width="2"
      />

      <rect
        :x="wallX"
        y="30"
        width="30"
        height="140"
        fill="#95a5a6"
        stroke="#333"
        stroke-width="2.5"
      />

      <g
        :transform="`translate(${wallX}, ${contactY})`"
        fill="#ffdbac"
        stroke="#8d5524"
        stroke-width="1.5"
      >
        <path
          d="M -120 -15 L -45 -15 C -35 -15 -25 -25 -15 -25 L -5 -25 C -2 -25 0 -18 0 -10 L 0 20 C 0 28 -2 35 -5 35 L -15 35 C -25 35 -35 25 -45 25 L -120 25 Z"
        />
      </g>

      <g :transform="`translate(${wallX}, ${contactY})`">
        <path
          v-if="force > 0"
          :d="getArrowPath('right')"
          fill="#ef5350"
          stroke="#333"
        />
        <path
          v-if="force > 0"
          :d="getArrowPath('left')"
          fill="#42a5f5"
          stroke="#333"
        />
      </g>

      <g
        v-if="force > 20"
        :transform="`translate(${wallX}, ${contactY - 30})`"
        class="labels"
      >
        <text x="35" y="0" fill="#c62828">作用力</text>
        <text x="-25" y="0" text-anchor="end" fill="#1565c0">反作用力</text>
      </g>
    </svg>

    <div class="control-area">
      <input
        type="range"
        min="0"
        max="200"
        v-model.number="force"
        @mouseup="resetForce"
        @touchend="resetForce"
      />
      <div class="scale">
        <span>0 (N)</span>
        <span>100 (N)</span>
        <span>200 (N)</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phet-box {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: #f5f5f5;
  border: 2px solid #444;
  border-radius: 4px;
}

.force-readout {
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
  color: #666;
  margin-bottom: 10px;
}

.highlight {
  color: #f57c00;
  font-family: monospace;
}

.stage {
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
}

.labels text {
  font-size: 14px;
  font-weight: 800;
}

.control-area {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

input[type='range'] {
  width: 80%;
  cursor: grab;
}

input[type='range']:active {
  cursor: grabbing;
}

.scale {
  width: 80%;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  font-weight: bold;
  margin-top: 5px;
}
</style>
