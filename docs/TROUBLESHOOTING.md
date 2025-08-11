# 🔧 故障排除指南

## 常见问题及解决方案

### 1. 组件无法解析错误

#### 错误信息
```
Failed to resolve component: el-tooltip
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
```

#### 原因
这个错误通常出现在使用打包后的组件时，表示 Element Plus 组件没有被正确注册或导入。

#### 解决方案

**方案 1：全局注册 Element Plus（推荐）**

在您的项目入口文件（通常是 `main.js` 或 `main.ts`）中完整注册 Element Plus：

```javascript
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
```

**方案 2：按需注册组件**

如果您只想注册必需的组件：

```javascript
import { createApp } from 'vue'
import { ElButton, ElTooltip, ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)
app.component('ElButton', ElButton)
app.component('ElTooltip', ElTooltip)
app.config.globalProperties.$message = ElMessage
app.mount('#app')
```

**方案 3：使用自动导入插件**

安装 `unplugin-auto-import` 和 `unplugin-vue-components`：

```bash
npm install -D unplugin-auto-import unplugin-vue-components
```

在 `vite.config.js` 中配置：

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

### 2. Monaco Editor 相关错误

#### 错误信息
```
Cannot read properties of undefined (reading 'create')
```

#### 解决方案

确保正确安装和配置 Monaco Editor：

```bash
npm install monaco-editor@>=0.44.0
```

在 Vite 项目中，可能需要配置 Monaco Editor 的 worker：

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ['monaco-editor']
  }
})
```

### 3. CSS 样式问题

#### 问题
组件样式不正确或缺失。

#### 解决方案

确保导入了必要的 CSS 文件：

```javascript
// 导入 Element Plus 样式
import 'element-plus/dist/index.css'

// 如果使用 Monaco Editor，可能需要额外配置
import 'monaco-editor/min/vs/editor/editor.main.css'
```

### 4. TypeScript 类型错误

#### 问题
TypeScript 项目中出现类型定义错误。

#### 解决方案

确保在 `tsconfig.json` 中包含了正确的类型定义：

```json
{
  "compilerOptions": {
    "types": ["vue", "element-plus", "monaco-editor"]
  }
}
```

### 5. 构建时错误

#### 问题
在打包时出现依赖相关错误。

#### 解决方案

确保 `vite.config.js` 或 `webpack.config.js` 中正确配置了外部依赖：

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['vue', 'element-plus', 'monaco-editor'],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          'monaco-editor': 'Monaco'
        }
      }
    }
  }
})
```

## 🆘 获取帮助

如果上述解决方案不能解决您的问题，请：

1. 检查 [GitHub Issues](https://github.com/Xg-dong/json-editor-vue3/issues)
2. 创建新的 Issue 并提供详细的错误信息和环境信息
3. 参考 [示例项目](../examples/) 中的完整配置

## 📝 版本兼容性

| 组件版本 | Vue 版本 | Element Plus 版本 | Monaco Editor 版本 |
|---------|----------|------------------|-------------------|
| 1.x.x   | ^3.0.0   | ^2.0.0          | >=0.44.0          |

## 🔄 更新指南

升级组件版本时，请注意：

1. 查看 [CHANGELOG](./CHANGELOG.md) 了解破坏性变更
2. 更新相关依赖到兼容版本
3. 检查配置文件是否需要调整
