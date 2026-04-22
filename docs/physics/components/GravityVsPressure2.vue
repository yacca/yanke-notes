<template>
  <div class="demo-container">
    <div class="controls">
      <div class="label-row">
        旋转角度: <strong>{{ angle }}°</strong>
      </div>
      <input
        type="range"
        v-model="angle"
        min="0"
        max="90"
        step="1"
        class="slider"
      />
    </div>

    <svg viewBox="0 0 400 350" class="stage">
      <defs>
        <marker
          id="arrow-red"
          markerWidth="4"
          markerHeight="4"
          refX="0"
          refY="2"
          orient="auto"
        >
          <path d="M0,0 L4,2 L0,4 Z" fill="#ff4757" />
        </marker>
        <marker
          id="arrow-green"
          markerWidth="4"
          markerHeight="4"
          refX="0"
          refY="2"
          orient="auto"
        >
          <path d="M0,0 L4,2 L0,4 Z" fill="#2ed573" />
        </marker>
      </defs>

      <line
        x1="20"
        y1="203"
        x2="380"
        y2="203"
        stroke="#ddd"
        stroke-width="1"
        stroke-dasharray="5,5"
      />

      <g
        :style="{
          transform: `rotate(${angle}deg)`,
          transformOrigin: '200px 200px',
        }"
      >
        <path
          d="M 50,200 L 200,200 L 200,50"
          fill="none"
          stroke="#444"
          stroke-width="5"
          stroke-linecap="square"
          stroke-linejoin="square"
        />

        <rect
          x="117.5"
          y="117.5"
          width="80"
          height="80"
          fill="#ced4da"
          stroke="#495057"
          stroke-width="1"
        />

        <g v-if="f1Length > 5">
          <line
            x1="158"
            y1="197.5"
            x2="158"
            :y2="197.5 + f1Length"
            stroke="#ff4757"
            stroke-width="3"
            marker-end="url(#arrow-red)"
          />
        </g>

        <g v-if="f2Length > 5">
          <line
            x1="197.5"
            y1="158"
            :x2="197.5 + f2Length"
            y2="158"
            stroke="#ff4757"
            stroke-width="3"
            marker-end="url(#arrow-red)"
          />
        </g>
      </g>

      <g :transform="gravityTransform">
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="100"
          stroke="#2ed573"
          stroke-width="3"
          marker-end="url(#arrow-green)"
        />
        <text
          x="10"
          y="95"
          fill="#2ed573"
          font-weight="bold"
          font-style="italic"
          font-size="16"
        >
          G
        </text>
      </g>

      <text
        v-if="f1Length > 20"
        :x="f1TagPos.x"
        :y="f1TagPos.y"
        fill="#ff4757"
        font-weight="bold"
        font-style="italic"
        font-size="14"
      >
        F
        <tspan dy="3" font-size="10">1</tspan>
      </text>

      <text
        v-if="f2Length > 20"
        :x="f2TagPos.x"
        :y="f2TagPos.y"
        fill="#ff4757"
        font-weight="bold"
        font-style="italic"
        font-size="14"
      >
        F
        <tspan dy="3" font-size="10">2</tspan>
      </text>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const angle = ref(0)
const gBase = 100

const f1Length = computed(() => gBase * Math.cos((angle.value * Math.PI) / 180))
const f2Length = computed(() => gBase * Math.sin((angle.value * Math.PI) / 180))

function rotatePoint(cx, cy, x, y, ang) {
  const rad = (ang * Math.PI) / 180
  const cos = Math.cos(rad),
    sin = Math.sin(rad)
  return {
    x: cos * (x - cx) - sin * (y - cy) + cx,
    y: sin * (x - cx) + cos * (y - cy) + cy,
  }
}

const gravityTransform = computed(() => {
  // 方块中心 (117.5 + 40, 117.5 + 40) = (157.5, 157.5)
  const pos = rotatePoint(200, 200, 157.5, 157.5, angle.value)
  return `translate(${pos.x}, ${pos.y})`
})

const f1TagPos = computed(() => {
  // 起点197.5 + 长度
  const pos = rotatePoint(200, 200, 158, 197.5 + f1Length.value, angle.value)
  return { x: pos.x + 10, y: pos.y + 12 }
})

const f2TagPos = computed(() => {
  // 起点197.5 + 长度
  const pos = rotatePoint(200, 200, 197.5 + f2Length.value, 158, angle.value)
  return { x: pos.x + 10, y: pos.y - 5 }
})
</script>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 12px;
}
.stage {
  width: 100%;
  max-width: 500px;
  height: auto;
}
.controls {
  margin-bottom: 5px;
  width: 100%;
  max-width: 300px;
  text-align: center;
}
.label-row {
  font-size: 1.1em;
  margin-bottom: 5px;
  color: #555;
}
.slider {
  width: 100%;
  cursor: pointer;
  margin: 0;
}
text {
  user-select: none;
  pointer-events: none;
  font-family: 'Times New Roman', serif;
}
</style>
