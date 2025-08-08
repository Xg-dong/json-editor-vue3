#!/bin/bash

echo "🎯 JSON Editor Vue3 完整示例测试"
echo "========================================"

# 检查当前目录
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

echo ""
echo "📋 可用选项："
echo "  1. 🎯 真实组件示例 (推荐) - 基于真实 Vue 组件"
echo "  2. 🧪 运行单元测试"
echo ""

read -p "请选择要运行的选项 (1-2): " choice

case $choice in
    1)
        echo ""
        echo "🎯 启动真实组件示例..."
        echo "这个示例完全基于真实的 JsonEditor.vue 组件"
        echo ""
        
        cd examples/vue-app || { echo "❌ vue-app 目录不存在"; exit 1; }
        
        if [ ! -f "start.sh" ]; then
            echo "❌ 启动脚本不存在"
            exit 1
        fi
        
        chmod +x start.sh
        ./start.sh
        ;;
        
    2)
        echo ""
        echo "🧪 运行单元测试..."
        
        if command -v npm &> /dev/null; then
            npm test
            
            if [ $? -eq 0 ]; then
                echo ""
                echo "✅ 所有测试通过！"
                echo ""
                read -p "是否要启动示例？(y/n): " start_example
                
                if [ "$start_example" = "y" ] || [ "$start_example" = "Y" ]; then
                    exec $0  # 重新运行脚本选择示例
                fi
            else
                echo "❌ 测试失败"
                exit 1
            fi
        else
            echo "❌ 请先安装 Node.js 和 npm"
            exit 1
        fi
        ;;
        
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac
