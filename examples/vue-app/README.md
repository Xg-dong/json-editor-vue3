# JSON Editor Vue3 真实组件示例

这是一个完全基于真实 `JsonEditor.vue` 组件和相关工具函数的完整示例应用。

## 🎯 特性

- ✅ **真实组件**: 直接使用 `src/JsonEditor.vue` 组件，不是重新实现
- ✅ **完整功能**: 演示所有组件功能和 API 方法
- ✅ **工具函数**: 测试所有 `JsonUtils.ts` 中的工具函数
- ✅ **高级功能**: 字段路径过滤、只读字段、数据合并等
- ✅ **实时调试**: 详细的日志系统和操作追踪
- ✅ **响应式设计**: 适配各种屏幕尺寸

## 🚀 快速开始

### 安装和运行

```bash
# 进入示例目录
cd examples/vue-app

# 安装依赖并启动
./start.sh

# 或者手动操作
npm install
npm run dev
```

### 访问应用

应用将在 http://localhost:3000 启动

## 📋 功能演示

### 1. 基础功能演示
- 编辑器配置（主题、高度、只读模式等）
- 基本 API 方法调用（格式化、验证、聚焦等）
- 事件监听和处理
- 数据的获取和设置

### 2. 高级功能演示
- **字段路径过滤**: 使用 `visiblePaths` 控制可见字段
- **只读字段**: 使用 `readonlyPaths` 设置只读字段
- **排除模式**: 使用 `visiblePathsExclude` 控制过滤模式
- **严格模式**: 启用 `strict` 模式进行严格验证

### 3. 工具函数测试
- `pickFieldsSuper`: 字段路径提取
- `mergeFieldsSuper`: 字段智能合并
- `findReadonlyFieldRanges`: 只读范围查找
- `isReadonlyValueChanged`: 只读字段变更检测

### 4. 实时调试
- 详细的操作日志
- 错误追踪和处理
- 性能监控
- 数据状态展示

## 🔧 支持的字段路径格式

```javascript
// 基础路径
"user.name"
"user.profile.email"

// 数组索引
"data[0].name"
"items[1].properties.value"

// 数组通配符
"users[].name"        // 所有用户的名字
"items[].tags[]"      // 所有项目的所有标签

// 深度通配符
"**.name"             // 任意深度的 name 字段
"user.**.email"       // user 下任意深度的 email 字段
```

## 📊 组件 API 方法

### 基础方法
- `format()`: 格式化 JSON
- `focus()`: 聚焦编辑器
- `blur()`: 失去焦点
- `validate()`: 验证 JSON
- `reset()`: 重置到初始值

### 数据方法
- `getValue()`: 获取当前值
- `setValue(value)`: 设置新值

### 界面方法
- `toggleFullscreen()`: 切换全屏模式

### 事件监听
- `@focus`: 编辑器获得焦点
- `@blur`: 编辑器失去焦点
- `@format`: 格式化操作完成
- `@fullscreen`: 全屏状态改变
- `@update:error`: 错误状态更新

## 🛠️ 开发说明

### 项目结构
```
vue-app/
├── index.html          # 主页面
├── app.js             # 主应用逻辑
├── package.json       # 依赖配置
├── vite.config.js     # Vite 配置
├── start.sh           # 启动脚本
└── README.md          # 说明文档
```

### 依赖项
- Vue 3: 响应式框架
- Element Plus: UI 组件库
- Monaco Editor: 代码编辑器
- Vite: 构建工具

### 自定义扩展

你可以基于这个示例进行扩展：

1. 添加更多测试用例
2. 集成到你的项目中
3. 自定义主题和样式
4. 添加更多工具函数测试

## 🔍 调试技巧

1. **查看日志**: 所有操作都会记录在日志面板中
2. **错误追踪**: 错误信息会高亮显示在日志中
3. **状态监控**: 实时查看组件数据状态
4. **API测试**: 使用按钮测试各种 API 方法
5. **导出日志**: 可以导出日志进行离线分析

## 📱 响应式支持

该示例完全支持移动设备：
- 自适应布局
- 触摸友好的交互
- 优化的移动端体验

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests 来改进这个示例！
