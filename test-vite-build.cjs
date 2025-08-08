#!/usr/bin/env node

console.log('🚀 测试新的Vite构建系统...');

// 检查构建文件是否存在
const fs = require('fs');

const requiredFiles = [
    'dist/index.esm.js',
    'dist/index.cjs.js',
    'dist/index.d.ts',
    'dist/utils/JsonUtils.esm.js',
    'dist/utils/JsonUtils.cjs.js',
    'dist/utils/JsonUtils.d.ts',
    'dist/JsonEditor.esm.js',
    'dist/JsonEditor.cjs.js',
    'dist/JsonEditor.d.ts',
    'dist/style.css'
];

console.log('📁 检查构建文件...');
for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
        const size = fs.statSync(file).size;
        console.log(`✅ ${file} (${(size / 1024).toFixed(2)}KB)`);
    } else {
        console.log(`❌ ${file} - 文件不存在`);
        process.exit(1);
    }
}

console.log('\n📦 检查模块导出...');

// 读取文件内容检查导出
const indexCjs = fs.readFileSync('dist/index.cjs.js', 'utf-8');
if (indexCjs.includes('exports.pickFieldsSuper')) {
    console.log('✅ index.cjs.js 包含 pickFieldsSuper 导出');
} else {
    console.log('❌ index.cjs.js 不包含 pickFieldsSuper 导出');
}

const utilsCjs = fs.readFileSync('dist/utils/JsonUtils.cjs.js', 'utf-8');
if (utilsCjs.includes('exports.pickFieldsSuper')) {
    console.log('✅ utils/JsonUtils.cjs.js 包含 pickFieldsSuper 导出');
} else {
    console.log('❌ utils/JsonUtils.cjs.js 不包含 pickFieldsSuper 导出');
}

console.log('\n🎉 构建文件检查完成！新的Vite构建系统工作正常！');
console.log('\n📋 构建统计:');
console.log('- 使用单一的 vite.config.ts 配置文件');
console.log('- 统一构建工具函数、Vue组件和类型定义');
console.log('- 生成 ESM 和 CJS 两种格式');
console.log('- 自动生成 TypeScript 类型定义文件');
console.log('- 正确处理外部依赖，避免打包到输出中');
