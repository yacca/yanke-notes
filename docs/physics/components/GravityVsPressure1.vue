<template>
  <div class="force-demo-container">
    <div class="control-panel">
      <div class="label-row">
        <span class="label-text">向上拉力 (F<sub>拉</sub>):</span>
        <span class="value-text">{{ pullForce }} N</span>
      </div>
      <input
        type="range"
        v-model.number="pullForce"
        min="0"
        max="110"
        step="1"
        class="slider"
      />
    </div>

    <div class="canvas-wrapper">
      <svg viewBox="0 -30 400 480" preserveAspectRatio="xMidYMid meet">
        <!-- 桌面 -->
        <rect
          x="50"
          :y="tableTop"
          width="300"
          height="20"
          fill="#8d6e63"
          stroke="#5d4037"
          stroke-width="2"
        />
        <line
          x1="50"
          :y1="tableTop"
          x2="350"
          :y2="tableTop"
          stroke="#5d4037"
          stroke-width="1"
        />

        <!-- 方块 -->
        <rect
          :y="boxY - 100"
          x="150"
          width="100"
          height="100"
          fill="#fafafa"
          stroke="#999"
          stroke-width="2"
          class="box-anim"
        />

        <!-- 重力箭头（向下） -->
        <g>
          <line
            :x1="200"
            :y1="boxY - 50"
            :x2="200"
            :y2="boxY - 50 + gravityLen.shaft"
            stroke="#52c41a"
            stroke-width="3"
          />
          <polygon
            :points="gravityArrowPoints"
            fill="#52c41a"
          />
          <text :x="210" :y="boxY - 50 + gravityLen.total + 15" class="force-label green">
            G = 100N
          </text>
        </g>

        <!-- 拉力箭头（向上） -->
        <g v-if="pullForce > 0">
          <line
            :x1="200"
            :y1="boxY - 100"
            :x2="200"
            :y2="boxY - 100 - pullLen.shaft"
            stroke="#1890ff"
            stroke-width="3"
          />
          <polygon
            :points="pullArrowPoints"
            fill="#1890ff"
          />
          <text :x="210" :y="boxY - 100 - pullLen.total - 5" class="force-label blue">
            F
            <tspan baseline-shift="sub" font-size="10">拉</tspan>
            = {{ pullForce }}N
          </text>
        </g>

        <!-- 压力箭头（向下） -->
        <g v-if="pressForce > 0 && pullForce <= G">
          <line
            x1="200"
            :y1="tableTop"
            x2="200"
            :y2="tableTop + pressLen.shaft"
            stroke="#ff4d4f"
            stroke-width="3"
          />
          <polygon
            :points="pressArrowPoints"
            fill="#ff4d4f"
          />
          <text :x="210" :y="tableTop + pressLen.total + 15" class="force-label red">
            F
            <tspan baseline-shift="sub" font-size="10">压</tspan>
            = {{ pressForce }}N
          </text>
        </g>
      </svg>
    </div>

    <div class="info-panel">
      <p v-if="pullForce >= 100" class="status warning">状态：已拉起/临界</p>
      <p v-else class="status">状态：平衡静止</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const G = 100
const pullForce = ref(0)

// 桌面顶部位置
const tableTop = 260

// 压力计算
const pressForce = computed(() => Math.max(0, G - pullForce.value))

// 方块底部的 Y 坐标：拉力大于100时向上移动
// 注意：方块有 stroke-width=2，所以底部需要在桌面顶部之上 2px
const boxY = computed(() => {
  const ground = tableTop - 2
  if (pullForce.value > G) {
    return ground - (pullForce.value - G) * 2
  }
  return ground
})

// 箭头参数
const ARROW_BASE_WIDTH = 12 // 三角形底边宽度固定
const ARROW_NORMAL_HEAD = 15 // 三角形正常高度
const ARROW_SHAFT_SCALE = 1.0 // 100N时线段长度100px

// 计算箭头尺寸
function calcArrowLen(force) {
  const shaftNormal = ARROW_SHAFT_SCALE * force // 线段长度
  const totalNormal = shaftNormal + ARROW_NORMAL_HEAD // 正常总长度

  // 当总长度 < 两个正常高度时，等比例缩小
  if (totalNormal < ARROW_NORMAL_HEAD * 2) {
    const half = totalNormal / 2
    return { total: totalNormal, shaft: half, head: half }
  }

  // 否则三角形保持正常大小
  return { total: totalNormal, shaft: shaftNormal, head: ARROW_NORMAL_HEAD }
}

const gravityLen = computed(() => calcArrowLen(G))
const pullLen = computed(() => calcArrowLen(pullForce.value))
const pressLen = computed(() => calcArrowLen(pressForce.value))

// 箭头三角形顶点计算（向下箭头）
function downArrowPoints(x, y, headHeight) {
  const halfBase = ARROW_BASE_WIDTH / 2
  return `${x},${y + headHeight} ${x - halfBase},${y} ${x + halfBase},${y}`
}

// 箭头三角形顶点计算（向上箭头）
function upArrowPoints(x, y, headHeight) {
  const halfBase = ARROW_BASE_WIDTH / 2
  return `${x},${y - headHeight} ${x - halfBase},${y} ${x + halfBase},${y}`
}

// 重力箭头（向下）
const gravityArrowPoints = computed(() =>
  downArrowPoints(200, boxY.value - 50 + gravityLen.value.shaft, gravityLen.value.head)
)

// 拉力箭头（向上）
const pullArrowPoints = computed(() =>
  upArrowPoints(200, boxY.value - 100 - pullLen.value.shaft, pullLen.value.head)
)

// 压力箭头（向下）
const pressArrowPoints = computed(() =>
  downArrowPoints(200, tableTop + pressLen.value.shaft, pressLen.value.head)
)
</script>

<style scoped>
.force-demo-container {
  max-width: 450px;
  margin: 1rem auto;
  font-family: sans-serif;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fdfdfd;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.control-panel {
  padding: 15px;
  background: #f5f5f5;
  border-bottom: 1px solid #eee;
}

.label-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.label-text {
  font-weight: bold;
  color: #444;
}
.value-text {
  color: #1890ff;
  font-weight: bold;
}

.slider {
  width: 100%;
  cursor: pointer;
}

.canvas-wrapper {
  padding: 10px;
  background: white;
}

svg {
  width: 100%;
  height: auto;
  display: block;
}

.box-anim {
  transition: y 0.1s linear;
}

.force-label {
  font-size: 14px;
  font-weight: 600;
  user-select: none;
}

.green {
  fill: #52c41a;
}
.red {
  fill: #ff4d4f;
}
.blue {
  fill: #1890ff;
}

.info-panel {
  padding: 10px;
  text-align: center;
  font-size: 13px;
  background: #fafafa;
}

.status {
  color: #666;
  margin: 0;
}
.warning {
  color: #fa8c16;
  font-weight: bold;
}

sub {
  font-size: 0.6em;
}
</style>
