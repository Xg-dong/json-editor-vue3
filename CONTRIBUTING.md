# 📝 项目信息

这是一个Vue 3 JSON 编辑器组件项目。

## 📋 项目概述

`json-editor-vue3` 是基于 Vue 3、Element Plus 和 Monaco Editor 开发的专业 JSON 编辑器组件，提供强大的字段路径裁剪、合并、比较等功能。

## 🔧 开发环境

### 系统要求
- **Node.js**: 18+
- **npm**: 8+
- **Git**: 2.x+

### 本地开发

```bash
# 克隆项目
git clone https://github.com/Xg-dong/json-editor-vue3.git
cd json-editor-vue3

# 安装依赖
npm install

# 启动示例项目
cd examples
./start.sh  # Linux/Mac
start.bat   # Windows

# 运行测试
npm test

# 构建项目
npm run build
```

## 📁 项目结构

```
json-editor-vue3/
├── src/                    # 源代码
│   ├── index.ts           # 入口文件
│   ├── JsonEditor.vue     # 主组件
│   ├── type.ts            # 类型定义
│   └── utils/             # 工具函数
├── test/                  # 测试文件
├── examples/              # 示例项目
├── scripts/               # 构建脚本
└── docs/                  # 文档
```

## 🧪 测试指南

```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行特定测试文件
npm test JsonUtils.spec.ts
```

## 📚 文档

- [README.md](./README.md) - 项目介绍和使用指南
- [USAGE.md](./USAGE.md) - 详细使用文档
- [EXAMPLES.md](./EXAMPLES.md) - 示例项目说明
- [PROJECT_REPORT.md](./PROJECT_REPORT.md) - 项目技术报告
- [CHANGELOG.md](./CHANGELOG.md) - 版本更新日志

## 📄 许可证

本项目采用 [MIT 许可证](./LICENSE)。

---

**作者**: 菜鸟东子  
**项目地址**: https://github.com/Xg-dong/json-editor-vue3
