# 🎉 JSON Editor Vue3 完整示例套件

这个项目提供了多种方式来体验和测试 JSON Editor Vue3 组件，包括**真实的 npm 包安装体验**。

## 🚀 快速开始 (推荐)

### 🌟 真实组件示例 - 自动构建安装
这是最接近真实使用体验的方式，模拟了从 npm 安装包的完整流程：

```bash
# 在项目根目录运行
./run-examples.sh
# 选择选项 1：真实组件示例

# 或者直接启动
cd examples
./start.sh
```

**特点**:
- ✅ 每次启动时自动构建最新组件
- ✅ 自动安装到 `examples/node_modules/json-editor-vue3`
- ✅ 模拟真实的 `import { JsonEditor } from 'json-editor-vue3'` 导入体验
- ✅ 包含完整的工具函数和类型定义
- ✅ 支持热重载和实时调试

### 📦 自动构建安装流程

示例项目使用以下流程确保始终使用最新的组件代码：

1. **构建组件**: 运行 `npm run build` 生成最新的 dist 文件
2. **创建包结构**: 在 `examples/node_modules/json-editor-vue3/` 创建完整的包结构
3. **复制文件**: 将 dist 目录和必要文件复制到模拟的 node_modules 中
4. **验证安装**: 确保所有必需文件都已正确安装
5. **启动示例**: 启动 Vite 开发服务器

## 📋 示例清单

### 🎯 真实组件示例 (推荐)
**位置**: `examples/`  
**技术栈**: Vue 3 + Vite + Element Plus + 自动构建安装  
**特点**:
- ✅ 完全使用真实的 `JsonEditor.vue` 组件
- ✅ 模拟真实的 npm 包导入：`import { JsonEditor } from 'json-editor-vue3'`
- ✅ 自动构建和安装流程，确保使用最新代码
- ✅ 集成所有工具函数 (`import { pickFieldsSuper } from 'json-editor-vue3/utils'`)
- ✅ 完整的高级功能演示（字段路径、只读等）
- ✅ 实时调试和日志系统
- ✅ 响应式设计

**启动方式**:
```bash
cd examples
./start.sh
# 访问 http://localhost:3000
```

**导入方式**:
```typescript
// 组件导入 - 就像真正的 npm 包一样
import { JsonEditor } from 'json-editor-vue3'

// 工具函数导入
import { pickFieldsSuper, mergeFieldsSuper } from 'json-editor-vue3/utils'

// 样式导入
import 'json-editor-vue3/JsonEditor.css'
```

### 🌐 浏览器示例
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

## 🔧 真实组件示例功能

### 基础功能演示
- **组件配置**: 主题切换、只读模式、自动格式化等
- **API 方法**: format()、focus()、validate()、reset() 等
- **事件监听**: focus、blur、format、fullscreen、error 事件
- **数据操作**: getValue()、setValue() 方法测试

### 高级功能演示
- **字段路径过滤**: 使用 `visiblePaths` 控制可见字段
  ```javascript
  // 支持的路径格式
  "user.name"           // 基础路径
  "data[0].name"        // 数组索引
  "users[].profile"     // 数组通配符
  "**.email"            // 深度通配符
  ```

- **只读字段**: 使用 `readonlyPaths` 设置不可编辑字段
- **排除模式**: 使用 `visiblePathsExclude` 控制过滤逻辑
- **严格模式**: 启用 `strict` 进行严格 JSON 对象验证

### 工具函数测试
- **字段提取**: `pickFieldsSuper()` 函数测试和演示
- **对象合并**: `mergeFieldsSuper()` 安全字段合并
- **差异比较**: `diffPaths()` 和 `diffValues()` 数据比较
- **路径操作**: 复杂嵌套路径的处理和验证

### 实时调试系统
- **事件日志**: 实时监控所有组件事件
- **性能追踪**: API 调用时间和内存使用统计
- **错误捕获**: 详细的错误信息和堆栈跟踪
- **状态检查**: 组件内部状态的实时显示

## 💻 开发者体验

### 自动化流程
真实组件示例提供了完全自动化的开发体验：

```bash
# 一键启动 - 自动处理所有构建和安装
./start.sh

# 自动执行以下步骤：
# 1. 安装示例项目依赖
# 2. 构建最新的组件代码
# 3. 安装到 node_modules/json-editor-vue3
# 4. 启动开发服务器
# 5. 自动打开浏览器
```

### 热重载支持
- 修改组件源码后，重新运行 `npm run install-package` 即可看到更新
- 示例代码支持 Vite 热重载
- 样式变更实时生效

### 调试友好
- 完整的 TypeScript 支持和类型提示
- 详细的控制台日志
- Vue DevTools 完整支持
- 源码映射（Source Maps）

## 🛠️ 开发者指南

### 自定义扩展
1. 基于 `examples/` 创建你的项目
2. 修改 `main.ts` 添加自定义功能
3. 调整组件导入和配置

### 组件集成
```vue
<script setup>
import { JsonEditor } from 'json-editor-vue3'
import { mergeFieldsSuper } from 'json-editor-vue3/utils'

const jsonData = ref({ name: 'Example' })
</script>

<template>
  <JsonEditor 
    v-model="jsonData"
    :visible-paths="['name', 'description']"
    :readonly-paths="['id']"
    @update:error="handleError"
  />
</template>
```

### 包结构说明
自动安装后的包结构：
```
examples/node_modules/json-editor-vue3/
├── dist/
│   ├── index.esm.js          # 主入口
│   ├── JsonEditor.esm.js     # 组件文件
│   ├── utils/
│   │   └── index.esm.js      # 工具函数
│   └── style.css             # 样式文件
├── package.json              # 包信息
├── README.md                 # 文档
└── LICENSE                   # 许可证
```

## 🎯 与传统示例的对比

| 特性 | 真实组件示例 | 传统浏览器示例 |
|------|-------------|---------------|
| **导入方式** | `import { JsonEditor } from 'json-editor-vue3'` | 直接引用 dist 文件 |
| **构建流程** | 自动构建和安装 | 手动构建 |
| **开发体验** | 完整的 Vue 3 + Vite 体验 | 基础 HTML + JS |
| **类型支持** | 完整 TypeScript 支持 | 有限支持 |
| **热重载** | ✅ 支持 | ❌ 不支持 |
| **调试工具** | Vue DevTools + 完整调试 | 基础调试 |
| **真实性** | 100% 模拟真实使用 | 演示用途 |

## 🔄 工作流程建议

### 开发新功能
1. 修改 `src/` 下的组件或工具函数
2. 在示例项目中运行 `npm run install-package`
3. 立即在浏览器中看到更新效果
4. 使用示例页面测试新功能

### 测试和验证
1. 运行 `npm test` 进行单元测试
2. 在真实组件示例中进行集成测试
3. 检查所有示例页面的功能
4. 验证导入路径和类型定义

### 发布准备
1. 确保所有测试通过
2. 确保示例项目正常运行
3. 更新文档和版本号
4. 运行 `npm run build` 生成最终构建产物

这种方式确保了示例项目始终使用最新的组件代码，同时提供了与真实 npm 包完全一致的使用体验。
