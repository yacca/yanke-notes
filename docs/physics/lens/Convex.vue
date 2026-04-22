<script setup>
import { ref, computed } from 'vue'

// 焦距 f，可调节
const f = ref(50)
// 物距 u
const u = ref(120)

// 像距 v: 1/u + 1/v = 1/f => v = (f * u) / (u - f)
const v = computed(() => {
  if (Math.abs(u.value - f.value) < 1) return 9999
  return (f.value * u.value) / (u.value - f.value)
})

// 放大率 M = -v / u
const magnification = computed(() => -v.value / u.value)

// 成像性质
const status = computed(() => {
  const twoF = 2 * f.value
  if (u.value > twoF) return { text: '倒立、缩小的实像', app: '照相机' }
  if (Math.abs(u.value - twoF) < 1) return { text: '倒立、等大的实像', app: '测焦距' }
  if (u.value > f.value && u.value < twoF) return { text: '倒立、放大的实像', app: '投影仪' }
  if (Math.abs(u.value - f.value) < 1) return { text: '不成像', app: '探照灯' }
  return { text: '正立、放大的虚像', app: '放大镜' }
})

const isRealImage = computed(() => u.value > f.value)

// SVG 参数
const width = 650
const height = 300
const centerX = 325
const centerY = 150
const objH = 50

// 物体位置
const objX = computed(() => centerX - u.value)
const objTopY = centerY - objH

// 像的位置
const imgX = computed(() => centerX + v.value)
const imgH = computed(() => Math.abs(magnification.value) * objH)

// 光线斜率
const slope1 = computed(() => objH / f.value)  // 光线1折射后斜率
const slope2 = computed(() => objH / u.value)  // 光线2斜率

// 光线在某个x位置的y坐标
const getRay1Y = (x) => objTopY + slope1.value * (x - centerX)
const getRay2Y = (x) => centerY + slope2.value * (x - centerX)

// 光线终点x坐标
const rayEndX = width - 20
</script>

<template>
  <div class="lens-container">
    <div class="controls">
      <div class="label-row">
        <span>物距 u = <strong>{{ u }}</strong> px</span>
        <span class="f-info">焦距 f = <strong>{{ f }}</strong> px</span>
      </div>
      <input type="range" v-model.number="u" min="10" max="250" step="1" class="slider" />

      <div class="label-row" style="margin-top: 0.75rem;">
        <span>焦距 f = <strong>{{ f }}</strong> px</span>
      </div>
      <input type="range" v-model.number="f" min="20" max="80" step="5" class="slider" />
    </div>

    <svg :viewBox="`0 0 ${width} ${height}`" class="experiment-svg">
      <!-- 主光轴 -->
      <line x1="0" :y1="centerY" :x2="width" :y2="centerY" class="axis" />

      <!-- 焦点和2F点标记 -->
      <g class="markers">
        <!-- 左侧 F 和 2F -->
        <circle :cx="centerX - f" :cy="centerY" r="4" fill="#ff4757" />
        <circle :cx="centerX - 2*f" :cy="centerY" r="4" fill="#5352ed" />
        <text :x="centerX - f" :y="centerY + 22" class="marker-text">F</text>
        <text :x="centerX - 2*f" :y="centerY + 22" class="marker-text">2F</text>

        <!-- 右侧 F' 和 2F' -->
        <circle :cx="centerX + f" :cy="centerY" r="4" fill="#ff4757" />
        <circle :cx="centerX + 2*f" :cy="centerY" r="4" fill="#5352ed" />
        <text :x="centerX + f" :y="centerY + 22" class="marker-text">F'</text>
        <text :x="centerX + 2*f" :y="centerY + 22" class="marker-text">2F'</text>
      </g>

      <!-- 凸透镜 -->
      <path :d="`M ${centerX} 35 Q ${centerX+20} ${centerY} ${centerX} 265 Q ${centerX-20} ${centerY} ${centerX} 35`"
            fill="rgba(0, 168, 255, 0.12)" stroke="#00a8ff" stroke-width="2.5" />
      <text :x="centerX" :y="25" class="lens-label">凸透镜</text>

      <!-- 物体（绿色箭头，向上） -->
      <g :transform="`translate(${objX}, ${centerY})`">
        <line x1="0" y1="0" x2="0" :y2="-objH" stroke="#2ed573" stroke-width="4" stroke-linecap="round" />
        <polygon points="-7,-42 0,-54 7,-42" fill="#2ed573" />
        <text x="0" :y="-objH - 12" class="obj-label">物</text>
      </g>

      <!-- 光线绘制 -->
      <g v-if="Math.abs(u - f) >= 1" class="rays">
        <!-- 光线1（粉色）：平行于主光轴入射，折射后过焦点方向 -->
        <!-- 入射部分 -->
        <line :x1="objX" :y1="objTopY" :x2="centerX" :y2="objTopY"
              stroke="#e84393" stroke-width="2" />
        <!-- 折射后向右延伸 -->
        <line :x1="centerX" :y1="objTopY"
              :x2="rayEndX" :y2="getRay1Y(rayEndX)"
              stroke="#e84393" stroke-width="2" />

        <!-- 光线2（蓝色）：过光心 -->
        <line :x1="objX" :y1="objTopY"
              :x2="rayEndX" :y2="getRay2Y(rayEndX)"
              stroke="#0984e3" stroke-width="2" />
        <!-- 光心标记点 -->
        <circle :cx="centerX" :cy="centerY" r="3" fill="#0984e3" />

        <!-- 虚像时的反向延长线 -->
        <template v-if="!isRealImage">
          <!-- 光线1反向延长到像的位置 -->
          <line :x1="centerX" :y1="objTopY"
                :x2="imgX" :y2="centerY - imgH"
                stroke="#e84393" stroke-width="2" stroke-dasharray="8,5" />
          <!-- 光线2反向延长到像的位置 -->
          <line :x1="centerX" :y1="centerY"
                :x2="imgX" :y2="centerY - imgH"
                stroke="#0984e3" stroke-width="2" stroke-dasharray="8,5" />
        </template>
      </g>

      <!-- 像 -->
      <g v-if="Math.abs(u - f) >= 1" :transform="`translate(${imgX}, ${centerY})`">
        <!-- 实像：倒立（向下），虚像：正立（向上） -->
        <line x1="0" y1="0" x2="0" :y2="isRealImage ? imgH : -imgH"
              :stroke="isRealImage ? '#ffa502' : 'rgba(255, 165, 0, 0.6)'"
              :stroke-dasharray="isRealImage ? 'none' : '8,5'"
              stroke-width="4" stroke-linecap="round" />
        <!-- 箭头 -->
        <polygon v-if="isRealImage"
                 :points="`-7,${imgH-8} 0,${imgH} 7,${imgH-8}`"
                 fill="#ffa502" />
        <polygon v-else
                 :points="`-7,${-imgH+8} 0,${-imgH} 7,${-imgH+8}`"
                 fill="rgba(255, 165, 0, 0.6)" />
        <text x="0" :y="isRealImage ? imgH + 18 : -imgH - 12" class="img-label">像</text>
      </g>

      <!-- 图例 -->
      <g transform="translate(20, 270)">
        <line x1="0" y1="0" x2="25" y2="0" stroke="#e84393" stroke-width="2" />
        <text x="30" y="4" class="legend-text">平行光线</text>
        <line x1="110" y1="0" x2="135" y2="0" stroke="#0984e3" stroke-width="2" />
        <text x="140" y="4" class="legend-text">过光心光线</text>
        <line x1="250" y1="0" x2="275" y2="0" stroke="#999" stroke-width="2" stroke-dasharray="8,5" />
        <text x="280" y="4" class="legend-text">反向延长线</text>
      </g>
    </svg>

    <div class="result-card">
      <div class="status-text">成像性质：<strong>{{ status.text }}</strong></div>
      <div class="app-text">应用：{{ status.app }}</div>
      <div class="info-text">
        像距 v = {{ Math.abs(v) > 1000 ? '∞' : v.toFixed(1) }} px，
        放大率 |M| = {{ Math.abs(magnification).toFixed(2) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.lens-container {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  border: 1px solid var(--vp-c-divider);
}
.controls { margin-bottom: 1.5rem; }
.label-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}
.slider { width: 100%; cursor: pointer; }
.experiment-svg {
  background: white;
  border-radius: 8px;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
}
.axis { stroke: #bdc3c7; stroke-width: 1; }
.marker-text {
  font-size: 14px;
  text-anchor: middle;
  fill: #57606f;
  font-weight: 600;
}
.lens-label {
  font-size: 13px;
  text-anchor: middle;
  fill: #00a8ff;
  font-weight: 500;
}
.obj-label {
  font-size: 13px;
  text-anchor: middle;
  fill: #2ed573;
  font-weight: 600;
}
.img-label {
  font-size: 13px;
  text-anchor: middle;
  fill: #ffa502;
  font-weight: 600;
}
.legend-text {
  font-size: 11px;
  fill: #666;
}
.rays { opacity: 0.9; }
.result-card {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--vp-c-brand-soft);
  border-left: 4px solid var(--vp-c-brand);
  border-radius: 4px;
}
.status-text { font-size: 1.1rem; color: var(--vp-c-text-1); }
.app-text { font-size: 0.9rem; opacity: 0.8; margin-top: 0.25rem; }
.info-text {
  font-size: 0.85rem;
  opacity: 0.7;
  margin-top: 0.25rem;
  font-family: ui-monospace, monospace;
}
</style>
