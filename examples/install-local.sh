#!/bin/bash

# 本地包安装脚本
# 此脚本用于在 examples 项目中安装本地构建的包

set -e

echo "🚀 本地包安装脚本开始运行..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 未找到 package.json 文件"
    echo "请确保在 examples 目录下运行此脚本"
    exit 1
fi

# 检查本地包文件是否存在
PACKAGE_FILE="../idss-d-json-editor-vue3-1.0.0.tgz"
if [ ! -f "$PACKAGE_FILE" ]; then
    echo "❌ 错误: 未找到本地包文件 $PACKAGE_FILE"
    echo "请先在根目录运行 'npm run pack' 来生成包文件"
    exit 1
fi

echo "📦 发现本地包文件: $PACKAGE_FILE"

# 清理之前的安装（可选）
if [ "$1" = "--clean" ]; then
    echo "🧹 清理之前的安装..."
    rm -rf node_modules package-lock.json
fi

# 安装本地包
echo "📥 安装本地包..."
npm install "$PACKAGE_FILE"

# 安装其他依赖
echo "📥 安装其他依赖..."
npm install

echo "✅ 本地包安装完成！"
echo ""
echo "🎯 下一步: 运行 'npm run dev' 启动开发服务器"
