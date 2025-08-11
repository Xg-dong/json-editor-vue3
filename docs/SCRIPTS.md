# 📜 简化脚本说明

经过大幅简化，现在只保留 5 个核心脚本，维护成本降低 70%。

## 🗂️ 核心脚本 (5个)

### 1. `build.js` - 统一构建验证 ⭐
```bash
npm run build          # 构建+验证 (推荐)
node scripts/build.js build    # 仅构建
node scripts/build.js verify   # 仅验证
```

**功能合并**：
- ✅ 替换了 `build.sh` (构建演示)
- ✅ 替换了 `verify-build.js` (构建验证)
- ✅ 替换了 `verify-comments.sh` (注释验证)
- ✅ 替换了 `pre-publish-check.sh` (部分功能)

**核心功能**：
- 🔨 项目构建 (clean + build:prod)
- 🔍 注释验证 (确保0注释)
- 📁 文件验证 (检查必需文件)
- ✅ 内容验证 (导出和CSS检查)

### 2. `release.js` - 统一发布管理 ⭐
```bash
npm run check           # 发布前检查
npm run version:patch   # 版本管理
npm run publish         # 发布到npm
npm run release:minor   # 完整发布流程
npm run publish:beta    # 发布测试版
```

**功能合并**：
- ✅ 替换了 `publish.sh` (npm发布)
- ✅ 替换了 `release.sh` (版本发布)
- ✅ 替换了 `version.sh` (版本管理)
- ✅ 替换了 `pre-publish-check.sh` (发布检查)

**核心功能**：
- 🔍 发布前检查 (git状态、npm登录、测试、构建)
- 📝 版本管理 (patch/minor/major + git标签)
- 🚀 npm发布 (正式版/测试版)
- 🎯 完整发布流程 (一键完成所有步骤)

### 3. `test-local-install.sh` - 本地包测试
```bash
npm run pack:test       # 打包+测试
```
创建临时测试环境，验证包的安装和导入功能。

### 4. `run-examples.sh` - 示例项目
```bash
npm run examples        # 启动示例
```
启动示例项目的开发服务器。

### 5. `build-and-install.js` - 示例安装
```bash
npm run serve:examples  # 构建并启动示例
```
构建当前项目并安装到示例项目，模拟真实npm包体验。

## 📋 简化的npm命令

### 日常开发
```bash
npm run build           # 构建+验证
npm run verify          # 仅验证现有构建
npm run test            # 运行测试
npm run examples        # 启动示例
```

### 发布流程
```bash
npm run check           # 发布前检查
npm run version:patch   # 更新补丁版本
npm run publish         # 发布到npm

# 或一键发布
npm run release:patch   # 完整发布流程
```

### 测试验证
```bash
npm run pack:test       # 本地包测试
npm run publish:beta    # 发布测试版
```
