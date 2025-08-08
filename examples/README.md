# JSON Editor Vue3 使用示例

这个目录包含了 JSON Editor Vue3 组件的完整使用示例，展示了组件的所有功能特性。

## 📁 目录结构

### `vue-app/` - Vue 3 + Vite 真实组件示例
这是一个完整的 Vue 3 应用，使用真实的 JsonEditor.vue 组件：
- 🎯 真实组件导入和使用
- ⚙️ 完整的工具函数集成
- 🔧 高级功能演示（字段路径、只读等）
-  实时日志和调试信息
- ⚡ Vite 开发环境，支持热重载

## 🚀 快速开始

### 方法一：使用项目根目录的启动脚本（推荐）
```bash
cd /path/to/json-editor
./run-examples.sh
# 选择选项 1：真实组件示例
```

### 方法二：直接启动 Vue 应用
```bash
cd examples/vue-app
npm install
npm run dev
```

## 🎯 功能特性演示

### 1. 真实组件集成
- **完整导入**: 直接使用 `src/JsonEditor.vue`
- **工具函数**: 集成 `src/utils/` 中的所有工具函数
- **类型支持**: 完整的 TypeScript 类型定义

### 2. 高级功能展示
- **字段路径管理**: `visiblePaths`, `readonlyPaths`
- **工具函数测试**: `mergeFieldsSuper`, `pickFieldsSuper` 等
- **事件处理**: 完整的事件监听和处理
- **响应式数据**: Vue 3 Composition API

### 3. 开发体验
- **热重载**: Vite 开发服务器支持
- **实时调试**: 完整的开发工具集成
- **性能监控**: 组件性能和内存使用追踪

## 🔧 自定义和扩展

### 修改示例配置
在 `vue-app/app.js` 中修改配置：

```javascript
const editorConfig = reactive({
  theme: 'light',
  readonly: false,
  height: 400,
  // 添加你的配置
});
```

### 添加自定义功能
```javascript
const customFunction = () => {
  // 使用组件方法
  editorRef.value?.format();
  // 使用工具函数
  const result = mergeFieldsSuper(data, patch, paths);
};
```

### 工具函数测试
示例中包含完整的工具函数测试用例：
- `mergeFieldsSuper`: 字段合并功能
- `pickFieldsSuper`: 字段提取功能
- `findReadonlyFieldRanges`: 只读范围检测
- `isReadonlyValueChanged`: 只读变化检测

## 📱 响应式设计

Vue 应用示例支持完整的响应式设计：
- 📱 移动设备: 优化的触摸交互
- 📟 平板设备: 自适应布局
- 🖥️ 桌面设备: 完整功能展示

## 🔍 调试技巧

### 1. Vue DevTools
安装 Vue DevTools 浏览器扩展来调试组件状态。

### 2. 组件方法调用
在浏览器控制台中：
```javascript
// 访问组件实例
window.editorInstance = app._instance.refs.editorRef;

// 调用组件方法
window.editorInstance.format();
window.editorInstance.validate();
```

### 3. 实时日志
应用内置了完整的日志系统，可以实时查看：
- 组件事件
- 工具函数调用
- 数据变化
- 性能指标

## 🐛 常见问题

### Q: 组件导入失败
A: 确保在项目根目录运行，检查 `vite.config.js` 中的路径别名配置。

### Q: 工具函数无法使用
A: 检查 `src/utils/index.ts` 是否正确导出所需函数。

### Q: Vite 开发服务器启动失败
A: 确保已安装依赖：`npm install`，检查端口是否被占用。

## 📖 技术栈

- **Vue 3**: Composition API + `<script setup>`
- **Vite**: 现代前端构建工具
- **Element Plus**: Vue 3 UI 组件库
- **Monaco Editor**: 微软代码编辑器
- **TypeScript**: 类型安全

## 🎓 学习资源

这个示例是学习以下技术的完美起点：
- Vue 3 Composition API 开发模式
- Vite 构建工具使用
- 组件库集成最佳实践
- Monaco Editor 高级集成
- TypeScript 在 Vue 中的应用

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进示例！

---

💡 **提示**: 这个真实组件示例展示了 JsonEditor 在实际 Vue 3 项目中的完整使用方式，是最佳的学习和参考材料！
