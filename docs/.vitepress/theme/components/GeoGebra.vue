<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'

const props = defineProps({
  id: { type: String, required: true }, // GeoGebra 资源 ID
  height: { type: Number, default: 500 }, // 固定高度或最大高度
  showToolbar: { type: Boolean, default: false },
  showAlgebraInput: { type: Boolean, default: false },
})

const container = ref(null)
let applet = null

const initGGB = () => {
  if (!window.GGBApplet) {
    const script = document.createElement('script')
    script.src = 'https://www.geogebra.org/apps/deployggb.js'
    script.async = true
    script.onload = renderApplet
    document.head.appendChild(script)
  } else {
    renderApplet()
  }
}

const renderApplet = () => {
  const params = {
    material_id: props.id,
    width: container.value?.offsetWidth || 800,
    height: props.height,
    showToolBar: props.showToolbar,
    borderColor: null,
    showMenuBar: false,
    showAlgebraInput: props.showAlgebraInput,
    showResetIcon: true,
    enableLabelDrags: false,
    enableShiftDragZoom: false,
    enableRightClick: false,
    capturingThreshold: null,
    showToolBarHelp: false,
    errorDialogsActive: false,
    useBrowserForJS: false,
  }

  applet = new window.GGBApplet(params, true)
  applet.inject(container.value)
}

// 监听窗口缩放，虽然 GGB 有 responsive: true，但有时需要手动 resize 确保 100% 填充
const handleResize = () => {
  const ggbApp = document.querySelector(`article canvas`)
  if (ggbApp && container.value) {
    // 可以在这里通过 GGB 提供的 API 调整尺寸，
    // 但通常 responsive: true 配合容器 width: 100% 即可解决
  }
}

onMounted(() => {
  initGGB()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div
    class="ggb-wrapper"
    style="width: 100%; overflow: hidden; margin: 1rem 0"
  >
    <div ref="container" class="ggb-container"></div>
  </div>
</template>

<style scoped>
.ggb-wrapper {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: #f9f9f9;
}
.ggb-container {
  margin: 0 auto;
  display: block;
}
</style>
