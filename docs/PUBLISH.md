# NPM 发布流程指南

## 📦 本地包创建和测试

### 1. 创建本地包
```bash
# 构建并打包
npm run pack

# 测试本地包安装
npm run pack:test

# 完整的发布前检查
npm run pre-publish
```

### 2. 验证包内容
```bash
# 预览包内容（不实际创建文件）
npm pack --dry-run

# 查看包信息
npm view @idss-d/json-editor-vue3
```

## 🚀 版本管理

### 语义化版本更新
```bash
# 补丁版本 (1.0.0 -> 1.0.1) - 修复bug
npm run version:patch

# 次版本 (1.0.0 -> 1.1.0) - 新功能
npm run version:minor  

# 主版本 (1.0.0 -> 2.0.0) - 破坏性更改
npm run version:major

# 自定义版本号
./scripts/version.sh 1.2.3
```

### 版本发布流程
每次版本更新会：
1. 更新 package.json 中的版本号
2. 重新构建项目
3. 验证构建产出
4. 创建 git commit
5. 创建 git tag

## 📤 NPM 发布

### 发布准备
```bash
# 1. 确保已登录npm
npm whoami

# 如果未登录
npm login

# 2. 运行发布前检查
npm run pre-publish
```

### 发布命令
```bash
# 发布正式版
npm run publish

# 发布测试版（beta）
npm run publish:beta

# 手动发布
npm publish
```

### 发布后验证
```bash
# 查看已发布的包
npm view json-editor-vue3

# 查看所有版本
npm view json-editor-vue3 versions --json

# 安装测试
npm install json-editor-vue3
```

## 🔍 包信息

### 包结构
```
@idss-d/json-editor-vue3@1.0.0
├── dist/                    # 构建产出
│   ├── index.esm.js        # ESM 主入口
│   ├── index.cjs.js        # CJS 主入口  
│   ├── index.d.ts          # TypeScript 类型定义
│   ├── JsonEditor.esm.js   # 组件 ESM
│   ├── JsonEditor.cjs.js   # 组件 CJS
│   ├── JsonEditor.css      # 组件样式
│   └── utils/              # 工具函数
├── docs/                   # 文档
├── README.md              # 项目说明
└── LICENSE                # 许可证
```

### 导入方式
```javascript
// ESM
import { JsonEditor } from '@idss-d/json-editor-vue3';
import { collectAllPaths } from '@idss-d/json-editor-vue3/utils';

// CJS
const { JsonEditor } = require('@idss-d/json-editor-vue3');
const { collectAllPaths } = require('@idss-d/json-editor-vue3/utils');

// CSS
import '@idss-d/json-editor-vue3/JsonEditor.css';
```

## 🛠️ 脚本说明

### 构建相关
- `npm run build` - 生产构建
- `npm run clean` - 清理构建产出
- `npm run verify:comments` - 验证注释移除

### 测试相关  
- `npm run test` - 运行测试
- `npm run pack:test` - 测试本地包安装
- `npm run pre-publish` - 发布前完整检查

### 发布相关
- `npm run version:patch/minor/major` - 版本更新
- `npm run publish` - 发布到npm
- `npm run publish:beta` - 发布测试版

## ⚠️ 注意事项

1. **发布前检查**：确保运行 `npm run pre-publish` 通过所有检查
2. **版本管理**：遵循语义化版本规范
3. **Git状态**：发布前确保工作目录干净
4. **测试覆盖**：确保所有测试通过
5. **文档更新**：更新 CHANGELOG.md 和相关文档

## 🔄 完整发布流程

```bash
# 1. 开发完成后，运行所有检查
npm run pre-publish

# 2. 更新版本号
npm run version:patch  # 或 minor/major

# 3. 推送到远程仓库
git push origin main --tags

# 4. 发布到npm
npm run publish

# 5. 验证发布结果
npm view json-editor-vue3
```

## 📊 发布统计

- **包大小**: ~37 kB (压缩后)
- **解压大小**: ~134 kB
- **文件数量**: 31 个文件
- **支持格式**: ESM + CJS + TypeScript
- **零依赖**: 运行时无外部依赖
