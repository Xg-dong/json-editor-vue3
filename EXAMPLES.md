# 🎉 JSON Editor Vue3 完整示例套件

恭喜！我已经为你创建了一个完整的示例套件，包含了基于真实 `JsonEditor.vue` 组件的功能演示。

## 📋 示例清单

### 🎯 真实组件示例 (推荐)
**位置**: `examples/vue-app/`
**技术栈**: Vue 3 + Vite + Element Plus + 真实组件
**特点**:
- ✅ 完全使用真实的 `JsonEditor.vue` 组件
- ✅ 集成所有工具函数 (`src/utils/`)
- ✅ 完整的高级功能演示（字段路径、只读等）
- ✅ 实时调试和日志系统
- ✅ 响应式设计

**启动方式**:
```bash
cd examples/vue-app
./start.sh
# 访问 http://localhost:3000
```

## 🚀 快速开始

### 方式一：一键启动 (推荐)
```bash
# 在项目根目录运行
./run-examples.sh
# 选择选项 1：真实组件示例
```

### 方式二：直接启动真实组件示例
```bash
cd examples/vue-app
./start.sh
```

### 方式三：运行测试后启动示例
```bash
./run-examples.sh
# 选择选项 2：运行单元测试
# 测试通过后选择启动示例
```

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
- **`pickFieldsSuper`**: 字段路径提取功能
- **`mergeFieldsSuper`**: 智能字段合并功能
- **`findReadonlyFieldRanges`**: 只读范围查找功能
- **`isReadonlyValueChanged`**: 只读字段变更检测

### 实时调试系统
- **操作日志**: 记录所有组件操作和 API 调用
- **错误追踪**: 详细的错误信息和堆栈跟踪
- **状态监控**: 实时显示组件数据状态
- **日志导出**: 支持导出调试日志

## 📱 响应式支持

所有示例都完全支持移动设备：
- 自适应布局设计
- 触摸友好的交互
- 移动端优化体验

## 🛠️ 开发者指南

### 自定义扩展
1. 基于 `examples/vue-app/` 创建你的项目
2. 修改 `app.js` 添加自定义功能
3. 调整 `index.html` 自定义界面

### 组件集成
```vue
<script setup>
import JsonEditor from '@/JsonEditor.vue'
import { mergeFieldsSuper } from '@/utils/JsonUtils.ts'

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

## 📊 性能测试

真实组件示例包含性能监控功能：
- 内存使用跟踪
- 操作响应时间
- 数据变更频率
- 错误发生率

## 🔍 调试技巧

1. **查看实时日志**: 所有操作都会在日志面板显示
2. **测试 API 方法**: 使用按钮直接调用组件方法
3. **监控数据状态**: 实时查看组件内部数据
4. **错误追踪**: 错误信息会高亮显示
5. **导出调试信息**: 可以导出日志进行离线分析

## 🎯 下一步

现在你有了完整的示例套件，可以：

1. **学习组件用法**: 通过示例了解所有功能
2. **测试集成效果**: 在真实环境中测试组件
3. **自定义开发**: 基于示例创建你的应用
4. **反馈改进**: 发现问题或建议新功能

享受使用 JSON Editor Vue3！🎉
