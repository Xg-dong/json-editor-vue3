# 📝 更新日志

所有重要的项目变更都会记录在这个文件中。

本项目遵循 [语义化版本控制](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2025-08-11

### 添加
- 🎯 重新设计为 Vue 3 专用组件
- 🎨 完整的 Monaco Editor 集成
- 📱 响应式设计和全屏编辑支持
- 🔍 通配符路径支持 (`**`, `[]`)
- 🔒 只读字段保护和高亮
- 🎛️ Element Plus 完整集成
- 🧪 全面的测试覆盖 (81 测试用例)
- 📖 完整的 TypeScript 类型定义
- 🌍 现代浏览器兼容性支持
- 🎛️ 浮动工具栏（格式化和全屏按钮）
- 🔧 智能启动脚本 (`run-examples.sh`)
- 📋 基础 JSON 编辑功能
- 🛠️ JsonUtils 工具函数集合
- 📝 字段提取和合并功能
- 🔍 路径比较和值差异检测
- 📖 完整文档和使用指南

### 变更
- 📦 包名设计为 `@idss-d/json-editor-vue3`
- 🎯 专注于 Vue 3 生态系统
- 🛠️ JsonUtils 工具函数模块化
- 📋 现代化 API 接口设计
- 🎨 使用命名空间样式而非 scoped 样式

### 修复
- ✅ Vue 3 响应式对象兼容性
- 🔧 Monaco Editor 类型定义和导入
- 📱 移动端触摸交互
- 🎨 CSS 变量系统
- 🐛 浮动工具栏 DOM 结构和定位问题
- 🔧 构建脚本路径解析问题
- 📦 示例项目依赖和权限问题
- 🎯 文档中包名和导入路径错误

### 功能特性

#### JsonEditor 组件
- ✅ JSON 语法验证
- 🎨 语法高亮显示
- 📝 实时编辑和预览
- 🔧 自动格式化
- 📱 响应式布局

#### JsonUtils 工具
- `pickFieldsSuper` - 字段提取
- `mergeFieldsSuper` - 字段合并
- `diffPaths` - 路径比较
- `diffValues` - 值差异检测
- `isEqual` - 深度相等比较
- `deepClone` - 深度克隆

### 技术栈
- Vue 3.4+
- TypeScript 5.x
- Element Plus 2.x
- Monaco Editor
- Vitest 测试框架

---

## 版本说明

### 版本号格式
本项目使用 `主版本号.次版本号.修订号` 的格式：

- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

### 变更类型

- `添加` - 新功能
- `变更` - 现有功能的变更
- `弃用` - 即将移除的功能
- `移除` - 已移除的功能
- `修复` - 问题修复
- `安全` - 安全问题修复

### 发布计划

#### v2.0.0 (计划中)
- 🎯 增强的路径表达式系统
- 🔄 改进的数据绑定机制
- 🎨 自定义主题系统
- 📱 移动端优化
- 🌐 国际化支持

#### v1.1.0 (计划中)
- 🔍 搜索和替换功能
- 📊 JSON Schema 验证
- 🎯 自定义验证规则
- 📈 性能优化
- 🔧 插件系统

### 迁移指南

#### 从 json-editor 到 json-editor-vue3

如果你正在从旧版本 `json-editor` 迁移到 `json-editor-vue3`，请参考以下指南：

##### 1. 安装新包

```bash
# 卸载旧包
npm uninstall json-editor

# 安装新包
npm install json-editor-vue3
```

##### 2. 更新导入

```typescript
// 旧版本
import { pickFieldsSuper } from 'json-editor/utils'
import JsonEditor from 'json-editor/JsonEditor'

// 新版本
import { pickFieldsSuper } from 'json-editor-vue3/utils'
import { JsonEditor } from 'json-editor-vue3'
```

##### 3. 组件 API 变更

```vue
<!-- 旧版本 -->
<JsonEditor 
  v-model="data"
  :readonly-paths="['id']"
  @error="handleError"
/>

<!-- 新版本 -->
<JsonEditor 
  v-model="data"
  :readonly-paths="['id']"
  @update:error="handleError"
/>
```

##### 4. 依赖更新

确保你的项目使用以下版本：
- Vue 3.4+
- Element Plus 2.x+
- TypeScript 5.x (如果使用)

### 兼容性

#### 浏览器支持
- Chrome 88+
- Firefox 85+ 
- Safari 14+
- Edge 88+

#### Vue 版本
- Vue 3.4+ ✅
- Vue 2.x ❌ (不支持)

#### Node.js 版本
- Node.js 18+ ✅
- Node.js 16+ ⚠️ (可能支持，但不推荐)
- Node.js 14- ❌ (不支持)

### 许可证

本项目采用 [MIT 许可证](./LICENSE)。
