#!/bin/bash
# 示例项目启动脚本 - 自动构建和安装组件

set -e

cd "$(dirname "$0")"

echo "🚀 启动 JSON Editor Vue3 示例项目..."

# 检查是否在 examples 目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在 examples 目录下运行此脚本"
    exit 1
fi

echo "📦 安装示例项目依赖..."
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    npm install
fi

echo "🔧 构建并安装 JSON Editor Vue3 组件..."
npm run install-package

echo "🌟 启动开发服务器..."
echo "📍 服务将在 http://localhost:3000 启动"
echo "🎯 你可以在浏览器中测试所有组件功能"
echo ""

# 启动开发服务器
npm run dev