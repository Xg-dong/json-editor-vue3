#!/usr/bin/env node
/**
 * 构建组件并安装到示例项目的 node_modules 中
 * 模拟真实的 npm 包安装体验
 */

import { execSync } from 'child_process'
import { existsSync, mkdirSync, rmSync, cpSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const examplesDir = join(rootDir, 'examples')
const nodeModulesDir = join(examplesDir, 'node_modules')
const packageDir = join(nodeModulesDir, 'json-editor-vue3')

console.log('🚀 开始构建和安装 JSON Editor Vue3...')

// 1. 构建组件
console.log('📦 构建组件...')
try {
    execSync('npm run build', {
        cwd: rootDir,
        stdio: 'pipe'
    })
    console.log('✅ 组件构建完成')
} catch (error) {
    console.error('❌ 构建失败:', error.message)
    process.exit(1)
}

// 2. 创建 node_modules 目录
console.log('📁 准备安装目录...')
if (existsSync(packageDir)) {
    rmSync(packageDir, { recursive: true, force: true })
}
mkdirSync(packageDir, { recursive: true })

// 3. 复制构建产物
console.log('📋 复制构建产物...')
const distDir = join(rootDir, 'dist')
const targetDistDir = join(packageDir, 'dist')

if (existsSync(distDir)) {
    cpSync(distDir, targetDistDir, { recursive: true })
    console.log('✅ 构建产物复制完成')
} else {
    console.error('❌ 构建产物不存在')
    process.exit(1)
}

// 4. 复制 package.json
console.log('📄 创建包信息...')
const originalPackageJson = join(rootDir, 'package.json')
const targetPackageJson = join(packageDir, 'package.json')

if (existsSync(originalPackageJson)) {
    cpSync(originalPackageJson, targetPackageJson)
    console.log('✅ package.json 复制完成')
}

// 5. 复制必要文件
const filesToCopy = [
    'README.md',
    'LICENSE',
    'USAGE.md'
]

filesToCopy.forEach(file => {
    const sourcePath = join(rootDir, file)
    const targetPath = join(packageDir, file)

    if (existsSync(sourcePath)) {
        cpSync(sourcePath, targetPath)
        console.log(`✅ ${file} 复制完成`)
    }
})

// 6. 创建类型声明文件的符号链接（如果不存在）
const typesDir = join(packageDir, 'types')
if (!existsSync(typesDir)) {
    mkdirSync(typesDir, { recursive: true })

    // 创建主要的类型导出文件
    const mainTypesContent = `
export * from './dist/index'
export { default as JsonEditor } from './dist/JsonEditor'
`
    writeFileSync(join(packageDir, 'index.d.ts'), mainTypesContent)
}

// 7. 验证安装
console.log('🔍 验证安装...')
const requiredFiles = [
    'dist/index.esm.js',
    'dist/JsonEditor.esm.js',
    'dist/utils/index.esm.js',
    'dist/style.css',
    'package.json'
]

let allFilesExist = true
requiredFiles.forEach(file => {
    const filePath = join(packageDir, file)
    if (!existsSync(filePath)) {
        console.error(`❌ 缺少文件: ${file}`)
        allFilesExist = false
    }
})

if (allFilesExist) {
    console.log('✅ 所有必需文件已安装')
    console.log(`📍 安装路径: ${packageDir}`)
    console.log('🎉 JSON Editor Vue3 安装完成！')

    // 显示可用的导入路径
    console.log('\n📚 可用的导入路径:')
    console.log('  • 主组件: import { JsonEditor } from "json-editor-vue3"')
    console.log('  • 工具函数: import { pickFieldsSuper } from "json-editor-vue3/utils"')
    console.log('  • 样式文件: import "json-editor-vue3/JsonEditor.css"')
} else {
    console.error('❌ 安装验证失败')
    process.exit(1)
}