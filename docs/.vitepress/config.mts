import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Yanke Notes',
  description: 'Yanke 的学习笔记',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '数学', link: '/math/rolling-square' },
      { text: '物理', link: '/physics/buoyancy-demo' },
    ],

    sidebar: {
      '/math/': [
        {
          text: '数学',
          items: [
            { text: '滚动的正方形', link: '/math/rolling-square' },
            {
              text: '2025北京朝阳八年级期末26题',
              link: '/math/grade8-2025S2-final-chaoyang-q26',
            },
          ],
        },
      ],
      '/physics/': [
        {
          text: '物理',
          items: [
            { text: '阿基米德浮力实验', link: '/physics/buoyancy-demo' },
            { text: '凸透镜成像规律', link: '/physics/convex-demo' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yacca/yanke-notes' },
    ],
  },
  outDir: '../dist',
  markdown: {
    math: true,
  },
})
