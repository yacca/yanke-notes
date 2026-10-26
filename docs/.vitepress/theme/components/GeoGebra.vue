<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  id: { type: String, required: true }, // GeoGebra 资源 ID
  // 画布的逻辑尺寸：GGB 先按这个尺寸渲染，再整体等比缩放到容器宽度。
  // 必须保持固定值，不能取容器宽度（否则文字等绝对定位的元素会被裁掉）。
  width: { type: Number, default: 800 },
  height: { type: Number, default: 500 },
  showToolbar: { type: Boolean, default: false },
  showAlgebraInput: { type: Boolean, default: false },
})

const container = ref(null)
let applet = null

// GGB 只认「类名」，会从画布元素向上查找带该类名的祖先容器，
// 找到后把整个画布按 transform 等比缩放到该容器的尺寸。
const SCALE_CONTAINER_CLASS = 'ggb-scale-target'

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
    width: props.width,
    height: props.height,
    scaleContainerClass: SCALE_CONTAINER_CLASS,
    allowUpscale: true, // 容器比逻辑尺寸宽时同样铺满
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

onMounted(() => {
  initGGB()
})
</script>

<template>
  <div
    class="ggb-wrapper ggb-scale-target"
    :style="{ aspectRatio: `${props.width} / ${props.height}` }"
  >
    <div ref="container" class="ggb-container"></div>
  </div>
</template>

<style scoped>
.ggb-wrapper {
  width: 100%;
  overflow: hidden;
  margin: 1rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: #f9f9f9;
}
.ggb-container {
  width: 100%;
  height: 100%;
}
</style>
