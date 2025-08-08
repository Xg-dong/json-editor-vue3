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

### 📋 在线示例

我们提供了多个完整的示例，可以直接运行和测试：

#### 🎯 真实组件示例 (推荐)
- **位置**: `examples/vue-app/`
- **特点**: 完全基于真实的 `JsonEditor.vue` 组件
- **功能**: 所有组件功能 + 工具函数测试 + 高级特性演示

```bash
# 运行真实组件示例
cd examples/vue-app
./start.sh
# 访问 http://localhost:3000
```

#### 🌐 浏览器示例
1. **📖 完整功能演示** - `examples/index.html`
   - 展示所有组件功能
   - 实时监控和性能跟踪
   - 多种预设数据模板

2. **🔧 开发调试工具** - `examples/dev.html`
   - 高级开发者界面
   - 详细的 API 调用追踪
   - 内存使用监控

3. **🐛 本地调试示例** - `examples/debug.html`
   - 直接使用本地组件源码
   - 完整的 API 测试覆盖
   - 详细的日志追踪系统

#### 快速运行浏览器示例

```bash
# 克隆项目
git clone https://github.com/your-username/json-editor-vue3.git
cd json-editor-vue3

# 启动 HTTP 服务器
chmod +x examples/start.sh
./examples/start.sh

# 或者手动启动
cd examples
python3 -m http.server 8080
# 然后访问 http://localhost:8080
```

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

## 💡 示例代码

### 表单编辑器

```vue
<template>
  <div>
    <JsonEditor 
      v-model="formData"
      :is-new="isNewUser"
      @change="handleFormChange"
    />
    <button @click="submitForm">提交表单</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JsonEditor from 'json-editor-vue3'

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

const isNewUser = ref(true)

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
      :readonly="!canEdit"
      @change="handleConfigChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { diffValues } from 'json-editor-vue3/utils'

const config = ref({
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

const canEdit = computed(() => {
  // 编辑权限逻辑
  return true
})

const handleConfigChange = (newConfig: any) => {
  const diff = diffValues(config.value, newConfig)
  console.log('配置变更:', diff.changedPaths)
}
</script>
```

## � 测试

```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch
```

## �🤝 贡献指南

我们欢迎所有形式的贡献！请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详细信息。

### 开发设置

```bash
# 克隆项目
git clone https://github.com/bx3mdyy/json-editor-vue3.git
cd json-editor-vue3

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm test

# 构建
npm run build
```

## � 更多文档

- [API 详细文档](./docs/API.md)
- [开发指南](./docs/DEVELOPMENT.md)
- [更新日志](./CHANGELOG.md)

## 📄 许可证

[MIT License](./LICENSE)

## �‍♂️ 支持

如果您有任何问题，请：
- 创建 [Issue](https://github.com/your-username/json-editor-vue3/issues)
- 查看 [文档](https://github.com/your-username/json-editor-vue3/wiki)
- 加入讨论 [Discussions](https://github.com/your-username/json-editor-vue3/discussions)

### 完整的数据处理流程

```typescript
import {
  pickFieldsSuper,
  mergeFieldsSuper,
  diffValues,
  generateValueDiffJson
} from './JsonUtils'

// 原始数据
const originalData = {
  user: {
    id: 1,
    name: 'Alice',
    profile: {
      bio: 'Developer',
      skills: ['JavaScript', 'Python'],
      settings: { theme: 'dark', notifications: true }
    }
  },
  metadata: { created: '2023-01-01', version: '1.0' }
}

// 更新数据
const updatedData = {
  user: {
    id: 1,
    name: 'Alice Wang',
    profile: {
      bio: 'Senior Developer',
      skills: ['JavaScript', 'Python', 'TypeScript'],
      settings: { theme: 'light', notifications: true, language: 'en' }
    }
  },
  metadata: { created: '2023-01-01', version: '1.1', lastModified: '2023-12-01' }
}

// 1. 检测差异
const diff = diffValues(originalData, updatedData)
console.log('变化的字段:', diff.changedPaths)
console.log('新增的字段:', diff.addedPaths)
console.log('修改的字段:', diff.modifiedPaths)

// 2. 提取用户相关字段
const userFields = pickFieldsSuper(updatedData, ['user.**'])
console.log('用户数据:', userFields)

// 3. 只合并技能和主题设置
const partialMerge = mergeFieldsSuper(originalData, updatedData, [
  'user.profile.skills',
  'user.profile.settings.theme'
])
console.log('部分合并结果:', partialMerge)

// 4. 生成差异 JSON（只包含修改的字段）
const modifiedOnly = generateValueDiffJson(originalData, updatedData, 'object', {
  includeAdded: false,
  includeRemoved: false,
  includeModified: true
})
console.log('只包含修改的字段:', modifiedOnly)
```

### 处理复杂嵌套数组

```typescript
const complexData = {
  teams: [
    {
      name: 'Frontend',
      members: [
        { id: 1, name: 'Alice', role: 'Lead' },
        { id: 2, name: 'Bob', role: 'Developer' }
      ],
      projects: [
        { id: 101, name: 'Website', status: 'active' },
        { id: 102, name: 'Mobile App', status: 'planning' }
      ]
    },
    {
      name: 'Backend',
      members: [
        { id: 3, name: 'Charlie', role: 'Lead' },
        { id: 4, name: 'David', role: 'Developer' }
      ],
      projects: [
        { id: 201, name: 'API', status: 'active' }
      ]
    }
  ]
}

// 提取所有成员的姓名
const memberNames = pickFieldsSuper(complexData, ['teams[].members[].name'])

// 提取所有项目状态
const projectStatuses = pickFieldsSuper(complexData, ['teams[].projects[].status'])

// 使用通配符提取所有 ID
const allIds = pickFieldsSuper(complexData, ['**id'])

// 更新所有活跃项目的状态
const statusUpdate = { teams: [{ projects: [{ status: 'completed' }] }] }
const updatedProjects = mergeFieldsSuper(complexData, statusUpdate, ['**status'])
```

## ⚡ 性能优化

### 大型数据处理

JsonUtils 针对大型数据集进行了优化：

- **路径缓存**: 避免重复路径解析
- **浅拷贝优化**: 只在必要时进行深拷贝
- **早期退出**: 在比较过程中尽早确定结果
- **内存友好**: 避免创建不必要的中间对象

### 性能测试结果

- 1000 个对象的差异比较: ~40ms
- 复杂嵌套结构提取: ~10ms
- 通配符路径匹配: ~15ms

### 最佳实践

1. **批量操作**: 一次处理多个路径比多次单独处理更高效
2. **路径复用**: 缓存解析后的路径数组
3. **渐进式比较**: 对于大型对象，考虑分批比较
4. **合理使用通配符**: 精确路径比通配符性能更好

## 🔍 调试和故障排除

### 常见问题

1. **路径格式错误**
   ```typescript
   // ❌ 错误
   pickFieldsSuper(data, ['user.hobbies.0'])
   
   // ✅ 正确
   pickFieldsSuper(data, ['user.hobbies[0]'])
   ```

2. **通配符使用不当**
   ```typescript
   // ❌ 错误：过度使用通配符影响性能
   pickFieldsSuper(data, ['**'])
   
   // ✅ 正确：具体的通配符模式
   pickFieldsSuper(data, ['users[].profile.**'])
   ```

3. **响应式对象处理**
   ```typescript
   // ❌ 错误：直接比较响应式对象
   obj1 === obj2
   
   // ✅ 正确：使用 isEqual 函数
   isEqual(obj1, obj2)
   ```

### 调试技巧

1. **启用警告**: 注意控制台的警告信息，了解哪些字段被忽略
2. **路径验证**: 使用 `parsePath` 函数验证路径格式
3. **分步测试**: 先测试简单路径，再逐步增加复杂度

## 📝 更新日志

### v2.0.0 (当前版本)
- ✨ 新增完整的 diff 功能（路径比较、值差异检测）
- 🎨 改进路径格式，数组索引用 `[]` 包围
- 🚀 性能优化，支持大型数据集处理
- 🔧 增强通配符支持
- 📚 完善 TypeScript 类型定义

### v1.0.0
- 🎉 初始版本
- 📦 基础字段提取和合并功能
- 🛣️ 支持基本路径格式和通配符
- 🔗 Vue 响应式对象兼容

## 📄 许可证

本项目采用 MIT 许可证。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

---

**JsonUtils** - 让 JSON 数据处理变得简单而强大！ 🚀