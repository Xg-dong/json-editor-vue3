# 🎯 JSON Editor Vue3

[![NPM Version](https://img.shields.io/npm/v/json-editor-vue3.svg)](https://www.npmjs.com/package/json-editor-vue3)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://v3.vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element_Plus-2.x-blue.svg)](https://element-plus.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

基于 **Vue 3**、**Element Plus** 和 **Monaco Editor** 的强大 JSON 编辑器组件，提供完整的 JSON 编辑、验证、路径裁剪、合并比较等功能。

## ✨ 特性

### 🎨 编辑器功能
- 🖋️ **Monaco Editor 集成** - 专业级代码编辑体验
- 🎯 **JSON 语法高亮** - 清晰的 JSON 格式显示
- ✅ **实时语法验证** - 即时检测 JSON 格式错误
- 🔧 **自动格式化** - 一键美化 JSON 格式
- 🌙 **主题切换** - 支持明亮/暗黑主题

### 📋 数据处理
- 🎯 **字段路径裁剪** - 精确控制显示和编辑的字段
- 🔀 **智能数据合并** - 灵活的字段合并策略
- 📊 **数据差异比较** - 可视化数据变更
- 🔒 **只读字段支持** - 防止误编辑重要字段
- 🔍 **通配符路径** - 支持 `**` 和 `[]` 通配符

### 🎛️ 用户体验
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🖥️ **全屏编辑** - 沉浸式编辑体验
- ⌨️ **快捷键支持** - 提高编辑效率
- 🔄 **双向绑定** - 完整的 Vue 3 v-model 支持
- 🎯 **Element Plus 集成** - 原生组件生态

## 🚀 快速开始

### 安装

```bash
# npm
npm install json-editor-vue3

# yarn
yarn add json-editor-vue3

# pnpm
pnpm add json-editor-vue3
```

### 📋 完整示例

我们提供了完整的示例项目，可以直接运行和测试：

#### 🎯 Vue 3 示例项目 (推荐)
**位置**: `examples/`
**特点**: 完全基于真实的 `JsonEditor.vue` 组件，模拟真实 npm 包安装体验

```bash
# 快速启动示例
./run-examples.sh

# 或者直接启动
cd examples
./start.sh  # Linux/Mac
start.bat   # Windows
# 访问 http://localhost:3000
```

**示例页面包括**:
- **基础示例** (`BasicExample.vue`) - 组件基本使用方法和常用配置
- **高级示例** (`AdvancedExample.vue`) - 字段路径过滤、只读模式等高级功能
- **字段操作示例** (`FieldOperationsExample.vue`) - 复杂字段路径操作演示
- **工具函数示例** (`UtilsExample.vue`) - JsonUtils 工具函数测试
- **对比示例** (`ComparisonExample.vue`) - 多种配置对比演示

### 基础使用

```vue
<template>
  <div class="demo">
    <h2>JSON Editor Demo</h2>
    <JsonEditor
      v-model="jsonData"
      :readonly="false"
      style="height: 400px"
      @update:error="handleError"
    />
    
    <div class="result">
      <h3>当前数据：</h3>
      <pre>{{ JSON.stringify(jsonData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { JsonEditor } from 'json-editor-vue3'

const jsonData = ref({
  name: 'Alice',
  age: 25,
  skills: ['Vue', 'TypeScript', 'Node.js'],
  profile: {
    bio: 'Full-stack developer',
    location: 'Beijing'
  }
})

const handleError = (error: string | null) => {
  if (error) {
    console.error('JSON 格式错误:', error)
  }
}
</script>
```

### 注册组件

```typescript
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { JsonEditor } from 'json-editor-vue3'

const app = createApp(App)
app.use(ElementPlus)
app.component('JsonEditor', JsonEditor)
app.mount('#app')
```

## 📖 高级功能

### 字段路径裁剪

```vue
<template>
  <JsonEditor
    v-model="userData"
    :visible-paths="visiblePaths"
    :visible-paths-exclude="false"
  />
</template>

<script setup>
const userData = ref({
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  password: 'secret123',
  profile: {
    bio: 'Developer',
    avatar: 'avatar.jpg',
    social: {
      github: 'alice',
      twitter: '@alice'
    }
  }
})

// 只显示安全字段，隐藏敏感信息
const visiblePaths = [
  'name',
  'email', 
  'profile.bio',
  'profile.social.github'
]
</script>
```

### 只读字段保护

```vue
<template>
  <JsonEditor
    v-model="configData"
    :readonly-paths="readonlyPaths"
  />
</template>

<script setup>
const configData = ref({
  version: '1.0.0',        // 只读
  buildTime: '2023-12-01', // 只读
  features: {
    debug: true,           // 可编辑
    apiUrl: 'https://api.example.com' // 可编辑
  }
})

const readonlyPaths = [
  'version',
  'buildTime'
]
</script>
```

### 通配符路径

```vue
<template>
  <JsonEditor
    v-model="usersData"
    :visible-paths="wildcardPaths"
  />
</template>

<script setup>
const usersData = ref({
  users: [
    { id: 1, name: 'Alice', password: 'secret1' },
    { id: 2, name: 'Bob', password: 'secret2' }
  ],
  admins: [
    { id: 101, name: 'Admin', password: 'admin123' }
  ]
})

// 使用通配符只显示所有用户的 id 和 name，隐藏密码
const wildcardPaths = [
  'users[].id',
  'users[].name',
  'admins[].id', 
  'admins[].name'
]
</script>
```

## 📋 API 文档

### JsonEditor Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `modelValue` | `object \| string` | `{}` | JSON 数据，支持 v-model |
| `readonly` | `boolean` | `false` | 是否只读模式 |
| `visiblePaths` | `string[]` | `undefined` | 可见字段路径列表 |
| `visiblePathsExclude` | `boolean` | `false` | 路径过滤模式：`false`包含，`true`排除 |
| `readonlyPaths` | `string[]` | `undefined` | 只读字段路径列表 |
| `height` | `string \| number` | `300` | 编辑器高度 |
| `theme` | `'light' \| 'dark'` | `'light'` | 编辑器主题 |
| `placeholder` | `string` | `'{}'` | 空数据时的占位符 |
| `showFormatButton` | `boolean` | `true` | 是否显示格式化按钮 |
| `showFullscreenButton` | `boolean` | `true` | 是否显示全屏按钮 |
| `autoFormat` | `boolean` | `true` | 是否自动格式化 |
| `elFormItem` | `object` | `undefined` | Element Plus 表单项实例 |

### JsonEditor Events

| 事件 | 参数 | 描述 |
|------|------|------|
| `update:modelValue` | `(value: object \| string)` | 数据更新事件 |
| `update:error` | `(error: string \| null)` | 错误状态更新 |
| `focus` | `()` | 编辑器获得焦点 |
| `blur` | `()` | 编辑器失去焦点 |
| `format` | `()` | 格式化操作完成 |
| `fullscreen` | `(isFullscreen: boolean)` | 全屏状态切换 |

### JsonEditor Methods

| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `format()` | - | `void` | 格式化 JSON |
| `focus()` | - | `void` | 聚焦编辑器 |
| `blur()` | - | `void` | 失焦编辑器 |
| `toggleFullscreen()` | - | `void` | 切换全屏模式 |
| `validate()` | - | `boolean` | 验证 JSON 格式 |
| `getValue()` | - | `object \| string` | 获取当前值 |
| `setValue(value)` | `object \| string` | `void` | 设置编辑器值 |

## 🛠️ JsonUtils 工具函数

除了组件本身，还提供了强大的 JSON 处理工具函数：

```typescript
import { 
  pickFieldsSuper,
  mergeFieldsSuper,
  diffPaths,
  diffValues,
  findReadonlyFieldRanges
} from 'json-editor-vue3/utils'

// 字段提取
const picked = pickFieldsSuper(data, ['name', 'profile.bio'])

// 字段合并  
const merged = mergeFieldsSuper(original, patch, ['name', 'age'])

// 路径比较
const pathDiff = diffPaths(obj1, obj2)

// 值差异
const valueDiff = diffValues(obj1, obj2)
```

详细的工具函数文档请参考 [USAGE.md](./USAGE.md)。

## 🎨 主题定制

### CSS 变量

```css
:root {
  /* 编辑器主色调 */
  --json-editor-primary-color: #409eff;
  --json-editor-border-color: #dcdfe6;
  --json-editor-bg-color: #ffffff;
  
  /* 按钮样式 */
  --json-editor-button-hover-bg: #ecf5ff;
  --json-editor-button-active-bg: #3a8ee6;
  
  /* 全屏模式 */
  --json-editor-fullscreen-bg: #ffffff;
  --json-editor-fullscreen-z-index: 9999;
  
  /* 错误状态 */
  --json-editor-error-color: #f56c6c;
  --json-editor-error-bg: #fef0f0;
}
```

### 暗黑主题

```css
[data-theme="dark"] {
  --json-editor-bg-color: #1e1e1e;
  --json-editor-border-color: #3e3e3e;
  --json-editor-text-color: #d4d4d4;
}
```

## 🌍 浏览器兼容性

| ![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) |
| --- | --- | --- | --- |
| Chrome 88+ | Firefox 85+ | Safari 14+ | Edge 88+ |

## 💡 完整示例代码

### 表单编辑器

```vue
<template>
  <div>
    <JsonEditor 
      v-model="formData"
      :visible-paths="['user.name', 'user.email', 'user.profile.bio']"
      @update:modelValue="handleFormChange"
    />
    <el-button @click="submitForm">提交表单</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { JsonEditor } from 'json-editor-vue3'

const formData = ref({
  user: {
    name: '',
    email: '',
    profile: {
      age: 0,
      bio: ''
    }
  }
})

const handleFormChange = (newData: any) => {
  console.log('表单数据变化:', newData)
}

const submitForm = () => {
  console.log('提交数据:', formData.value)
}
</script>
```

### 配置管理编辑器

```vue
<template>
  <div>
    <JsonEditor 
      v-model="config"
      :readonly-paths="['system.id', 'system.version']"
      :visible-paths-exclude="true"
      @update:modelValue="handleConfigChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { diffValues } from 'json-editor-vue3/utils'

const config = ref({
  system: {
    id: 'SYS_001',
    version: '1.0.0'
  },
  database: {
    host: 'localhost',
    port: 5432,
    ssl: true
  },
  cache: {
    enabled: true,
    ttl: 3600
  }
})

const handleConfigChange = (newConfig: any) => {
  const diff = diffValues(config.value, newConfig)
  console.log('配置变更:', diff.changedPaths)
}
</script>
```

## 🧪 测试

```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch
```

## 📚 更多文档

- [📘 详细使用指南](./USAGE.md) - JsonUtils 工具函数完整文档
- [🎉 示例项目说明](./EXAMPLES.md) - 完整示例项目使用指南
- [📋 项目报告](./PROJECT_REPORT.md) - 项目技术细节和状态
- [📝 更新日志](./CHANGELOG.md)

## 📄 许可证

[MIT License](./LICENSE)

## 🙋‍♂️ 支持

如果您有任何问题，请：
- 查看 [示例项目](./examples/)
- 阅读 [详细文档](./USAGE.md)
- 查看项目 [GitHub 页面](https://github.com/Xg-dong/json-editor-vue3)