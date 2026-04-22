<template>
  <div class="external-html-container">
    <iframe :src="url" frameborder="0" class="html-iframe"></iframe>
  </div>
</template>

<script setup>
defineProps({
  url: String,
})
</script>

<style scoped>
.external-html-container {
  width: 100%;
  /* 计算高度：视口高度减去导航栏高度（默认通常是 64px） */
  height: calc(100vh - var(--vp-nav-height));
  overflow: hidden;
}

.html-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
