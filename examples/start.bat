@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 启动 JSON Editor Vue3 示例项目...
echo.

:: 检查是否在 examples 目录
if not exist "package.json" (
    echo ❌ 错误: 请在 examples 目录下运行此脚本
    pause
    exit /b 1
)

echo 📦 安装示例项目依赖...
if not exist "node_modules" (
    call npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)

echo 🔧 构建并安装 JSON Editor Vue3 组件...
call npm run install-package
if errorlevel 1 (
    echo ❌ 组件构建或安装失败
    pause
    exit /b 1
)

echo 🌟 启动开发服务器...
echo 📍 服务将在 http://localhost:3000 启动
echo 🎯 你可以在浏览器中测试所有组件功能
echo.

:: 启动开发服务器
call npm run dev