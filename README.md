# 🎯 JSON Editor Vue3

[![NPM Version](https://img.shields.io/npm/v/@idss-d/json-editor-vue3.svg)](https://www.npmjs.com/package/@idss-d/json-editor-vue3)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://v3.vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element_Plus-2.x-blue.svg)](https://element-plus.org/)

基于 **Vue 3**、**Element Plus** 和 **Monaco Editor** 的 JSON 编辑器组件。

## ✨ 特性

- 🖋️ **Monaco Editor** - 专业级代码编辑体验
- 🎯 **JSON 语法高亮** - 实时语法验证和格式化
- 🔧 **字段路径控制** - 精确控制显示和编辑字段
- 🌙 **主题切换** - 支持明亮/暗黑主题
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🎛️ **浮动工具栏** - 格式化和全屏功能
- 🔒 **只读字段** - 支持部分字段只读模式

## 🚀 安装

```bash
npm install @idss-d/json-editor-vue3
```

### 📦 依赖要求

组件依赖以下库，需要在您的项目中安装：

```bash
# 必需依赖
npm install vue@^3.0.0 element-plus@^2.0.0

# 可选依赖（如果需要 Monaco Editor 功能）
npm install monaco-editor@>=0.44.0
```

### 🔧 全局注册 Element Plus

确保在您的项目中正确注册了 Element Plus：

```javascript
// main.js 或 main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 导入 JSON Editor 样式
import '@idss-d/json-editor-vue3/JsonEditor.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
```

## 📖 基础使用

```vue
<template>
  <JsonEditor
    v-model="jsonData"
    :height="400"
    theme="light"
    @update:error="handleError"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { JsonEditor } from '@idss-d/json-editor-vue3'
// 别忘了导入样式文件
import '@idss-d/json-editor-vue3/JsonEditor.css'

const jsonData = ref({
  name: 'Alice',
  age: 25,
  skills: ['Vue', 'TypeScript']
})

const handleError = (error: string | null) => {
  console.error('JSON 错误:', error)
}
</script>
```

## 🎛️ 主要配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `object \| string` | `{}` | JSON 数据，支持 v-model |
| `readonly` | `boolean` | `false` | 只读模式 |
| `visiblePaths` | `string[]` | - | 可见字段路径 |
| `readonlyPaths` | `string[]` | - | 只读字段路径 |
| `height` | `string \| number` | `300` | 编辑器高度 |
| `width` | `string` | `'100%'` | 编辑器宽度 |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | 主题模式 |
| `showFormatButton` | `boolean` | `true` | 显示格式化按钮 |
| `showFullscreenButton` | `boolean` | `true` | 显示全屏按钮 |
| `autoFormat` | `boolean` | `true` | 自动格式化 |
| `backgroundColor` | `string` | - | 编辑器背景色 |

## 🎮 本地示例

### 快速启动示例

```bash
# 克隆项目
git clone https://github.com/Xg-dong/json-editor-vue3.git
cd json-editor-vue3

# 安装依赖
npm install

# 使用便捷脚本启动示例
cd scripts
./run-examples.sh
```

选择选项 1 即可自动构建并启动示例项目。

### 手动启动示例

```bash
# 1. 构建并安装组件到示例项目
npm run examples

# 或者分步骤：
# 构建组件
npm run build

# 安装到示例项目
cd scripts
node build-and-install.js

# 启动示例
cd ../examples
npm run dev
```

访问 http://localhost:3000/ 查看完整示例。

### 示例内容

- 📝 **基础使用** - 基本的 JSON 编辑功能
- 🎛️ **高级功能** - 字段路径控制、只读模式等
- 📋 **表单集成** - 与 Element Plus 表单的集成
- 🔄 **数据比较** - JSON 数据对比和合并
- ⚙️ **字段操作** - 字段裁剪、提取等操作
- 🛠️ **工具函数** - 各种实用工具函数演示

## 📚 文档

- [📘 详细使用指南](./docs/USAGE.md) - 完整 API 和高级功能
- [🎉 示例项目](./docs/EXAMPLES.md) - 完整示例项目说明
- [📋 开发指南](./docs/SCRIPTS.md) - 开发和构建命令
- [🔧 故障排除](./docs/TROUBLESHOOTING.md) - 常见问题解决方案

## ⚠️ 重要提示

使用本组件前，请确保您的项目中已正确安装和注册了 Element Plus。如果遇到 `Failed to resolve component: el-tooltip` 等错误，请参考 [故障排除指南](./docs/TROUBLESHOOTING.md)。

## 📄 许可证

[MIT License](./LICENSE)
