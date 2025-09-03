import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 从本地源码导入样式文件
import '../../src/json-editor.css'

// 完全禁用 Monaco Editor 的 Web Worker 功能
// 这样可以避免在 Vite 环境中的 importScripts 错误
declare global {
  interface Window {
    MonacoEnvironment?: any
  }
}

// 设置 Monaco Environment 来禁用 Web Workers
window.MonacoEnvironment = {
  getWorker: () => {
    // 返回一个虚拟的 worker，实际上不使用 worker 功能
    return {
      postMessage: () => {},
      terminate: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }
  },
}

// 如果是在 Web Worker 环境中，也设置相同的配置
if (typeof self !== 'undefined' && typeof window === 'undefined') {
  ;(self as any).MonacoEnvironment = (window as any).MonacoEnvironment
}

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 注册 Element Plus
app.use(ElementPlus)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.mount('#app')
