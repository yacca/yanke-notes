import DefaultTheme from 'vitepress/theme'
import GeoGebra from './components/GeoGebra.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('GeoGebra', GeoGebra)
  }
}
