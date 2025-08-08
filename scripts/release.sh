#!/bin/bash

# 发布脚本
# 用法: ./scripts/release.sh [patch|minor|major|beta]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数定义
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查参数
VERSION_TYPE=${1:-patch}

if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major|beta)$ ]]; then
    log_error "无效的版本类型: $VERSION_TYPE"
    log_info "用法: $0 [patch|minor|major|beta]"
    exit 1
fi

log_info "开始发布流程，版本类型: $VERSION_TYPE"

# 检查是否在 main 分支
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" != "main" && "$VERSION_TYPE" != "beta" ]]; then
    log_error "发布正式版本必须在 main 分支进行"
    log_info "当前分支: $CURRENT_BRANCH"
    exit 1
fi

# 检查工作目录是否干净
if ! git diff-index --quiet HEAD --; then
    log_error "工作目录不干净，请先提交所有更改"
    exit 1
fi

# 拉取最新代码
log_info "拉取最新代码..."
git pull origin $CURRENT_BRANCH

# 安装依赖
log_info "安装依赖..."
npm ci

# 运行测试
log_info "运行测试..."
npm run test:run

# 运行类型检查
log_info "运行类型检查..."
npm run type-check

# 运行代码检查
log_info "运行代码检查..."
npm run lint:check

# 运行格式检查
log_info "运行格式检查..."
npm run format:check

# 构建项目
log_info "构建项目..."
npm run build

# 更新版本号
log_info "更新版本号..."
if [[ "$VERSION_TYPE" == "beta" ]]; then
    NEW_VERSION=$(npm version prerelease --preid=beta --no-git-tag-version)
else
    NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version)
fi

log_success "新版本号: $NEW_VERSION"

# 提交版本更新
log_info "提交版本更新..."
git add package.json package-lock.json
git commit -m "chore: bump version to $NEW_VERSION"

# 创建标签
log_info "创建标签..."
git tag $NEW_VERSION

# 推送到远程仓库
log_info "推送到远程仓库..."
git push origin $CURRENT_BRANCH
git push origin $NEW_VERSION

# 发布到 NPM
log_info "发布到 NPM..."
if [[ "$VERSION_TYPE" == "beta" ]]; then
    npm publish --tag beta
else
    npm publish
fi

log_success "🎉 发布完成！"
log_info "版本: $NEW_VERSION"
log_info "NPM: https://www.npmjs.com/package/json-editor"
log_info "GitHub: https://github.com/Xg-dong/json-editor-vue3/releases/tag/$NEW_VERSION"
