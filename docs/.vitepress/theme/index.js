import DefaultTheme from 'vitepress/theme'
import GeoGebra from './components/GeoGebra.vue'
import ExternalHtmlView from './components/ExternalHtmlView.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('GeoGebra', GeoGebra)
    app.component('ExternalHtmlView', ExternalHtmlView)
  },
}
