import { defineConfig } from 'vitepress'
import container from 'markdown-it-container'

function parseContainerInfo(info: string, name: string) {
  const raw = info.trim().slice(name.length).trim()
  const attrs: Record<string, string> = {}
  const stripped = raw.replace(
    /(\w+)="([^"]*)"/g,
    (_, key: string, value: string) => {
      attrs[key] = value
      return ' '
    },
  )
  const modifiers = stripped.split(/\s+/).filter(Boolean)

  return { attrs, modifiers }
}

function getGridClasses(modifiers: string[]) {
  const variantMap: Record<string, string> = {
    '2': 'layout-grid--2',
    '3': 'layout-grid--3',
    '4': 'layout-grid--4',
    'sidebar-left': 'layout-grid--sidebar-left',
    'sidebar-right': 'layout-grid--sidebar-right',
    card: 'layout-grid--card',
  }

  const variantClasses = modifiers
    .map((modifier) => variantMap[modifier] ?? '')
    .filter(Boolean)

  const classes = ['layout-grid', ...variantClasses]

  if (modifiers.includes('card')) {
    classes.push('content-card')
  }

  return classes
}

const physicsItems = [
  {
    text: '力学',
    items: [
      { text: '机械运动', link: '/physics/mechanical-motion/' },
      { text: '质量与密度', link: '/physics/mass-and-density/' },
      { text: '力', link: '/physics/force/' },
      { text: '运动和力', link: '/physics/motion-and-force/' },
      { text: '压强', link: '/physics/pressure/' },
      { text: '浮力', link: '/physics/buoyancy/' },
      { text: '功和机械能', link: '/physics/work-and-energy/' },
      { text: '简单机械', link: '/physics/simple-machines/' },
    ],
  },
  {
    text: '电学',
    items: [
      { text: '简单电路', link: '/physics/simple-circuits/' },
      { text: '欧姆定律', link: '/physics/ohms-law/' },
      { text: '电流做功', link: '/physics/electrical-work/' },
      { text: '生活用电', link: '/physics/household-electricity/' },
      { text: '电与磁', link: '/physics/electricity-and-magnetism/' },
      { text: '电磁波及其应用', link: '/physics/electromagnetic-waves/' },
    ],
  },
  {
    text: '热学',
    items: [
      { text: '热现象', link: '/physics/thermal-phenomena/' },
      { text: '内能及其利用', link: '/physics/internal-energy/' },
    ],
  },
  {
    text: '光学',
    items: [
      { text: '光现象', link: '/physics/light-phenomena/' },
      { text: '透镜及其应用', link: '/physics/lens/' },
    ],
  },
  {
    text: '其他',
    items: [
      { text: '声现象', link: '/physics/sound-phenomena/' },
      { text: '能源与可持续发展', link: '/physics/energy-and-sustainability/' },
    ],
  },
  {
    text: '中考复习',
    items: [
      { text: '知识汇总', link: '/physics/review/knowledge-map' },
      { text: '公式汇总', link: '/physics/review/formulas' },
      { text: '解题方法', link: '/physics/review/methods' },
      { text: '易错点专题', link: '/physics/review/common-mistakes' },
    ],
  },
]

const mathItems = [
  { text: '滚动的正方形', link: '/math/rolling-square' },
  { text: '二元均值不等式的几何证明', link: '/math/AM-GM-inequality' },
  {
    text: '2025北京朝阳八年级期末26题',
    link: '/math/grade8-2025S2-final-chaoyang-q26',
  },
]

const computerItems = [
  { text: '命令行工具', link: '/computer/command-line-tools/' },
]

export default defineConfig({
  lang: 'zh-CN',
  title: 'Yanke Notes',
  description: 'Yanke 的学习笔记',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: '数学', items: mathItems },
      {
        text: '物理',
        items: [
          {
            text: '初中物理',
            items: [
              { text: '力学', link: '/physics/mechanical-motion/' },
              { text: '电学', link: '/physics/simple-circuits/' },
              { text: '热学', link: '/physics/thermal-phenomena/' },
              { text: '光学', link: '/physics/light-phenomena/' },
              { text: '其他', link: '/physics/sound-phenomena/' },
              { text: '中考复习', link: '/physics/review/knowledge-map' },
            ],
          },
          { text: 'PhET 仿真', link: '/physics/phet' },
        ],
      },
      { text: '计算机', items: computerItems },
    ],

    sidebar: {
      '/math/': [{ text: '数学', items: mathItems }],
      '/physics/': [
        { text: '初中物理', items: physicsItems },
        { text: 'PhET 仿真', link: '/physics/phet' },
      ],
      '/computer/': [{ text: '计算机', items: computerItems }],
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
          return tokens[idx].nesting === 1
            ? `<div class="formula-card">\n`
            : `</div>\n`
        },
      })

      md.use(container, 'card', {
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            const { attrs } = parseContainerInfo(tokens[idx].info, 'card')
            const classes = ['content-card', attrs.class]
              .filter(Boolean)
              .join(' ')
            const title = attrs.title
              ? `<div class="content-card__title">${md.utils.escapeHtml(attrs.title)}</div>\n`
              : ''

            return `<div class="${classes}">\n${title}`
          } else {
            return `</div>\n`
          }
        },
      })

      md.use(container, 'grid', {
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            const { attrs, modifiers } = parseContainerInfo(
              tokens[idx].info,
              'grid',
            )
            const classes = [...getGridClasses(modifiers), attrs.class]
              .filter(Boolean)
              .join(' ')
            return `<div class="${classes}">\n`
          } else {
            return `</div>\n`
          }
        },
      })

      md.use(container, 'grid-item', {
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            const { attrs } = parseContainerInfo(tokens[idx].info, 'grid-item')
            const classes = ['grid-item', attrs.class].filter(Boolean).join(' ')
            return `<div class="${classes}">\n`
          } else {
            return `</div>\n`
          }
        },
      })
    },
  },
})
