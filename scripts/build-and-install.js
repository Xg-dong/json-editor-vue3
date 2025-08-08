#!/usr/bin/env node
/**
 * 构建组件并安装到示例项目的 node_modules 中
 * 模拟真实的 npm 包安装体验
 */

import { execSync } from 'child_process'
import { existsSync, mkdirSync, rmSync, cpSync, writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const examplesDir = join(rootDir, 'examples')
const nodeModulesDir = join(examplesDir, 'node_modules')
const packageDir = join(nodeModulesDir, 'json-editor-vue3')

console.log('🚀 开始构建和安装 JSON Editor Vue3...')

// 1. 清理之前的构建
console.log('🧹 清理之前的构建...')
try {
    execSync('npm run clean', {
        cwd: rootDir,
        stdio: 'pipe'
    })
    console.log('✅ 清理完成')
} catch (error) {
    console.log('⚠️  清理命令未找到，跳过清理步骤')
}

// 2. 使用优化的生产构建
console.log('📦 使用优化配置构建组件...')
try {
    execSync('npm run build:prod', {
        cwd: rootDir,
        stdio: 'pipe'
    })
    console.log('✅ 优化构建完成')
} catch (error) {
    console.error('❌ 构建失败:', error.message)
    console.error('尝试使用备用构建命令...')
    try {
        execSync('npm run build', {
            cwd: rootDir,
            stdio: 'pipe'
        })
        console.log('✅ 备用构建完成')
    } catch (fallbackError) {
        console.error('❌ 备用构建也失败:', fallbackError.message)
        process.exit(1)
    }
}

// 3. 创建 node_modules 目录
console.log('📁 准备安装目录...')
if (existsSync(packageDir)) {
    rmSync(packageDir, { recursive: true, force: true })
}
mkdirSync(packageDir, { recursive: true })

// 4. 复制构建产物
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

// 5. 复制 package.json
console.log('📄 创建包信息...')
const originalPackageJson = join(rootDir, 'package.json')
const targetPackageJson = join(packageDir, 'package.json')

if (existsSync(originalPackageJson)) {
    cpSync(originalPackageJson, targetPackageJson)
    console.log('✅ package.json 复制完成')
}

// 6. 复制必要文件
const filesToCopy = [
    'README.md',
    'LICENSE',
    'USAGE.md',
    'CHANGELOG.md'
]

filesToCopy.forEach(file => {
    const sourcePath = join(rootDir, file)
    const targetPath = join(packageDir, file)

    if (existsSync(sourcePath)) {
        cpSync(sourcePath, targetPath)
        console.log(`✅ ${file} 复制完成`)
    } else {
        console.log(`⚠️  ${file} 不存在，跳过`)
    }
})

// 7. 创建类型声明文件索引
console.log('📝 创建类型声明索引...')
const typesDir = join(packageDir, 'types')
if (!existsSync(typesDir)) {
    mkdirSync(typesDir, { recursive: true })
}

// 创建主要的类型导出文件
const mainTypesContent = `export * from './dist/index'
export { default as JsonEditor } from './dist/JsonEditor'
export * from './dist/utils/index'
`
writeFileSync(join(packageDir, 'index.d.ts'), mainTypesContent)
console.log('✅ 类型声明文件创建完成')

// 8. 验证构建产物的完整性
console.log('🔍 验证构建产物...')
const requiredFiles = [
    // ES 模块文件
    'dist/index.esm.js',
    'dist/JsonEditor.esm.js', 
    'dist/utils/index.esm.js',
    // CommonJS 文件
    'dist/index.cjs.js',
    'dist/JsonEditor.cjs.js',
    'dist/utils/index.cjs.js',
    // CSS 样式文件
    'dist/JsonEditor.css',
    // 类型声明文件
    'dist/index.d.ts',
    'dist/JsonEditor.d.ts',
    'dist/utils/index.d.ts',
    // 包信息
    'package.json'
]

// 可选文件（不存在也不会报错）
const optionalFiles = [
    'dist/style.css',
    'dist/chunks'
]

let allFilesExist = true
const missingFiles = []
const existingFiles = []

requiredFiles.forEach(file => {
    const filePath = join(packageDir, file)
    if (!existsSync(filePath)) {
        console.error(`❌ 缺少必需文件: ${file}`)
        missingFiles.push(file)
        allFilesExist = false
    } else {
        existingFiles.push(file)
    }
})

// 检查可选文件
optionalFiles.forEach(file => {
    const filePath = join(packageDir, file)
    if (existsSync(filePath)) {
        console.log(`✅ 找到可选文件: ${file}`)
        existingFiles.push(file)
    } else {
        console.log(`⚠️  可选文件不存在: ${file}`)
    }
})

// 9. 验证文件内容（检查是否已删除注释）
console.log('🔍 验证代码压缩效果...')
const filesToCheck = [
    'dist/JsonEditor.esm.js',
    'dist/utils/index.esm.js'
]

filesToCheck.forEach(file => {
    const filePath = join(packageDir, file)
    if (existsSync(filePath)) {
        const content = readFileSync(filePath, 'utf8')
        const hasComments = /\/\/|\/\*[\s\S]*?\*\//.test(content)
        const hasConsole = /console\.(log|debug|info|warn|error)/.test(content)
        
        if (hasComments) {
            console.log(`⚠️  ${file} 仍包含注释`)
        } else {
            console.log(`✅ ${file} 注释已删除`)
        }
        
        if (hasConsole) {
            console.log(`⚠️  ${file} 仍包含 console 语句`)
        } else {
            console.log(`✅ ${file} console 语句已删除`)
        }
        
        // 显示文件大小
        const sizeKB = (content.length / 1024).toFixed(2)
        console.log(`📊 ${file} 大小: ${sizeKB} KB`)
    }
})

// 10. 最终验证和报告
if (allFilesExist) {
    console.log('\n✅ 所有必需文件已安装')
    console.log(`📍 安装路径: ${packageDir}`)
    console.log(`📁 已安装 ${existingFiles.length} 个文件`)
    
    // 显示可用的导入路径
    console.log('\n📚 可用的导入路径:')
    console.log('  • 主组件: import { JsonEditor } from "json-editor-vue3"')
    console.log('  • 工具函数: import { pickFieldsSuper } from "json-editor-vue3/utils"')
    console.log('  • 样式文件: import "json-editor-vue3/JsonEditor.css"')
    console.log('  • CommonJS: const { JsonEditor } = require("json-editor-vue3")')
    
    // 显示文件大小统计
    console.log('\n📊 构建统计:')
    existingFiles.filter(f => f.endsWith('.js')).forEach(file => {
        const filePath = join(packageDir, file)
        if (existsSync(filePath)) {
            const content = readFileSync(filePath, 'utf8')
            const sizeKB = (content.length / 1024).toFixed(2)
            console.log(`  • ${file}: ${sizeKB} KB`)
        }
    })
    
    console.log('\n🎉 JSON Editor Vue3 优化构建安装完成！')
} else {
    console.error(`\n❌ 安装验证失败，缺少 ${missingFiles.length} 个必需文件:`)
    missingFiles.forEach(file => console.error(`  • ${file}`))
    process.exit(1)
}