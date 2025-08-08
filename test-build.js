#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 测试新的Vite构建系统...');

// 检查构建文件是否存在
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

// 测试导入
console.log('\n📦 测试ESM导入...');
try {
    // 测试utils
    const { JsonUtils } = require('./dist/utils/JsonUtils.cjs.js');
    console.log('✅ JsonUtils导入成功');

    // 测试主入口
    const main = require('./dist/index.cjs.js');
    console.log('✅ 主入口导入成功');

    // 简单功能测试
    const testData = { a: 1, b: { c: 2 } };
    const result = JsonUtils.pickFieldsSuper(testData, ['a']);
    if (result.a === 1) {
        console.log('✅ JsonUtils功能测试通过');
    } else {
        console.log('❌ JsonUtils功能测试失败');
        process.exit(1);
    }

} catch (error) {
    console.log('❌ 导入测试失败:', error.message);
    process.exit(1);
}

console.log('\n🎉 所有测试通过！新的Vite构建系统工作正常！');
