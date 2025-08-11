@echo off
REM 本地包安装脚本 (Windows 版本)
REM 此脚本用于在 examples 项目中安装本地构建的包

echo 🚀 本地包安装脚本开始运行...

REM 检查是否在正确的目录
if not exist "package.json" (
    echo ❌ 错误: 未找到 package.json 文件
    echo 请确保在 examples 目录下运行此脚本
    exit /b 1
)

REM 检查本地包文件是否存在
set PACKAGE_FILE=..\idss-d-json-editor-vue3-1.0.0.tgz
if not exist "%PACKAGE_FILE%" (
    echo ❌ 错误: 未找到本地包文件 %PACKAGE_FILE%
    echo 请先在根目录运行 'npm run pack' 来生成包文件
    exit /b 1
)

echo 📦 发现本地包文件: %PACKAGE_FILE%

REM 清理之前的安装（如果指定了 --clean 参数）
if "%1"=="--clean" (
    echo 🧹 清理之前的安装...
    if exist node_modules rmdir /s /q node_modules
    if exist package-lock.json del package-lock.json
)

REM 安装本地包
echo 📥 安装本地包...
npm install "%PACKAGE_FILE%"
if errorlevel 1 (
    echo ❌ 安装本地包失败
    exit /b 1
)

REM 安装其他依赖
echo 📥 安装其他依赖...
npm install
if errorlevel 1 (
    echo ❌ 安装依赖失败
    exit /b 1
)

echo ✅ 本地包安装完成！
echo.
echo 🎯 下一步: 运行 'npm run dev' 启动开发服务器
