import { defineConfig } from 'vitepress'
import container from 'markdown-it-container'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Yanke Notes',
  description: 'Yanke 的学习笔记',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
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
      {
        text: '物理',
        items: [
          { text: '压强', link: '/physics/pressure/' },
          { text: '浮力', link: '/physics/buoyancy/' },
          { text: '透镜', link: '/physics/lens/' },
        ],
      },
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
          text: '初中物理',
          items: [
            { text: '压强', link: '/physics/pressure/' },
            { text: '浮力', link: '/physics/buoyancy/' },
            { text: '透镜', link: '/physics/lens/' },
          ],
        },
        {
          text: 'PhET 仿真',
          items: [
            { text: '浮力', link: '/physics/buoyancy/phet-buoyancy' },
            { text: '几何光学', link: '/physics/lens/phet-geometric-optics' },
          ],
        },
      ],
    },

    outline: {
      level: [2, 4],
      label: '页面导航',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yacca/yanke-notes' },
    ],
  },
  outDir: '../dist',
  markdown: {
    math: true,
    config: (md) => {
      md.use(container, 'formula', {
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            // 开标签：渲染一个带特定类名的 div
            return `<div class="formula-card">\n`
          } else {
            // 闭标签
            return `</div>\n`
          }
        },
      })
    },
  },
})
