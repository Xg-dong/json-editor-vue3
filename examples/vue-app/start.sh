#!/bin/bash

echo "🎯 JSON Editor Vue3 真实组件示例"
echo "=================================="

# 检查是否在正确目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在 examples/vue-app 目录下运行此脚本"
    exit 1
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 请先安装 npm"
    exit 1
fi

echo "📦 安装依赖..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ 依赖安装完成"
    echo ""
    echo "🚀 启动开发服务器..."
    echo "应用将在 http://localhost:3000 启动"
    echo ""
    echo "📋 功能说明："
    echo "  ✅ 使用真实的 JsonEditor.vue 组件"
    echo "  ✅ 完整的工具函数测试"
    echo "  ✅ 高级功能演示（字段路径、只读等）"
    echo "  ✅ 实时日志和调试信息"
    echo ""
    
    npm run dev
else
    echo "❌ 依赖安装失败"
    exit 1
fi
