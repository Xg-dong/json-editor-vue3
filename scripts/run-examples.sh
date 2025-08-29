#!/bin/bash
# JSON Editor Vue3 示例运行脚本

set -e

# 获取脚本所在目录的父目录（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
EXAMPLES_DIR="$PROJECT_ROOT/examples"

echo "🎯 JSON Editor Vue3 示例运行器"
echo "=================================="
echo ""
echo "请选择要运行的示例:"
echo "1. 🌟 真实组件示例 (推荐) - Vue 3 + Vite + 自动构建安装"
echo "2. 🧪 运行单元测试"
echo "3. 📋 查看项目信息"
echo "4. 🔧 仅构建组件"
echo "5. ❌ 退出"
echo ""

read -p "请输入选项 (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🚀 启动真实组件示例..."
        echo "📋 特性:"
        echo "   • 完全基于真实的 JsonEditor.vue 组件"
        echo "   • 自动构建和安装到 node_modules"
        echo "   • 模拟真实的 npm 包使用体验"
        echo "   • 所有工具函数和高级功能演示"
        echo ""
        
        # 检查 examples 目录
        if [ ! -d "$EXAMPLES_DIR" ]; then
            echo "❌ examples 目录不存在: $EXAMPLES_DIR"
            exit 1
        fi
        npm run build:test

        cd "$EXAMPLES_DIR"
        
        # 检查 package.json
        if [ ! -f "package.json" ]; then
            echo "❌ examples/package.json 不存在"
            exit 1
        fi
        
        # 检查 start.sh 脚本
        if [ ! -f "start.sh" ]; then
            echo "❌ examples/start.sh 不存在，尝试直接运行 npm run dev"
            echo "📍 确保你在 examples 目录中运行了 npm install"
            echo ""
            
            # 检查 node_modules
            if [ ! -d "node_modules" ]; then
                echo "📦 正在安装依赖..."
                npm install
            fi
            
            echo "🌟 启动开发服务器..."
            npm run dev
        else
            # 运行启动脚本
            echo "🎯 使用 start.sh 脚本启动..."
            ./start.sh
        fi
        ;;
    2)
        echo ""
        echo "🧪 运行单元测试..."
        cd "$PROJECT_ROOT"
        npm test
        
        echo ""
        echo "测试完成！你也可以运行:"
        echo "• npm run test:coverage - 生成覆盖率报告"
        echo "• npm run test:ui - 启动测试 UI"
        
        read -p "是否启动示例项目? (y/n): " start_examples
        if [ "$start_examples" = "y" ] || [ "$start_examples" = "Y" ]; then
            echo ""
            echo "🚀 启动示例项目..."
            cd "$EXAMPLES_DIR"
            if [ -f "start.sh" ]; then
                ./start.sh
            else
                npm run dev
            fi
        fi
        ;;
    3)
        echo ""
        echo "📋 JSON Editor Vue3 项目信息"
        echo "============================="
        echo "• 组件: Vue 3 + TypeScript + Monaco Editor"
        echo "• UI库: Element Plus"
        echo "• 构建: Vite"
        echo "• 测试: Vitest"
        echo ""
        
        cd "$PROJECT_ROOT"
        
        if [ -f "docs/PROJECT_REPORT.md" ]; then
            echo "📄 详细项目报告: docs/PROJECT_REPORT.md"
        fi
        
        if [ -f "docs/USAGE.md" ]; then
            echo "📚 使用指南: docs/USAGE.md"
        fi
        
        if [ -f "docs/EXAMPLES.md" ]; then
            echo "🎉 示例说明: docs/EXAMPLES.md"
        fi
        
        echo ""
        echo "🌐 在线文档和示例:"
        echo "• examples/index.html - 完整功能演示"
        echo "• examples/ - Vue 3 真实组件示例"
        echo ""
        
        read -p "是否启动示例项目? (y/n): " start_examples
        if [ "$start_examples" = "y" ] || [ "$start_examples" = "Y" ]; then
            cd "$EXAMPLES_DIR"
            if [ -f "start.sh" ]; then
                ./start.sh
            else
                npm run dev
            fi
        fi
        ;;
    4)
        echo ""
        echo "🔧 构建组件..."
        cd "$PROJECT_ROOT"
        npm run build
        
        echo ""
        echo "✅ 构建完成！构建产物位于 dist/ 目录"
        echo ""
        echo "可用文件:"
        echo "• dist/index.esm.js - ES模块入口"
        echo "• dist/JsonEditor.esm.js - 组件文件"
        echo "• dist/utils/index.esm.js - 工具函数"
        echo "• dist/JsonEditor.css - 样式文件"
        echo ""
        
        read -p "是否同时安装到示例项目? (y/n): " install_to_examples
        if [ "$install_to_examples" = "y" ] || [ "$install_to_examples" = "Y" ]; then
            echo ""
            echo "📦 安装到示例项目..."
            cd "$SCRIPT_DIR"
            node build-and-install.js
            echo "✅ 安装完成！"
        fi
        ;;
    5)
        echo "👋 再见！"
        exit 0
        ;;
    *)
        echo "❌ 无效选项，请输入 1-5"
        exit 1
        ;;
esac
