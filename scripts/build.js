#!/usr/bin/env node

/**
 * 统一构建和验证脚本
 * 替换: build.sh, verify-build.js, verify-comments.sh
 */

import { execSync } from 'child_process';
import fs from 'fs';

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command) {
    try {
        return execSync(command, { stdio: 'inherit', encoding: 'utf8' });
    } catch (error) {
        log(`❌ 命令失败: ${command}`, 'red');
        process.exit(1);
    }
}

function buildProject() {
    log('🔨 开始构建...', 'blue');
    exec('npm run clean');
    exec('npm run build:prod');
    log('✅ 构建完成', 'green');
}

function verifyComments() {
    log('🔍 验证注释移除...', 'blue');

    const files = execSync("find dist -type f \\( -name '*.js' -o -name '*.d.ts' -o -name '*.css' \\) | wc -l", { encoding: 'utf8' });
    const totalFiles = parseInt(files.trim());

    const singleComments = execSync("find dist -type f \\( -name '*.js' -o -name '*.d.ts' -o -name '*.css' \\) -exec grep -l '//' {} \\; 2>/dev/null | wc -l", { encoding: 'utf8' });
    const multiComments = execSync("find dist -type f \\( -name '*.js' -o -name '*.d.ts' -o -name '*.css' \\) -exec grep -l '/\\*' {} \\; 2>/dev/null | wc -l", { encoding: 'utf8' });

    const single = parseInt(singleComments.trim());
    const multi = parseInt(multiComments.trim());

    if (single === 0 && multi === 0) {
        log(`✅ 注释验证通过: ${totalFiles} 个文件，0 注释`, 'green');
    } else {
        log(`❌ 发现注释: 单行 ${single} 个，多行 ${multi} 个`, 'red');
        process.exit(1);
    }
}

function verifyBuildFiles() {
    log('📁 验证构建文件...', 'blue');

    const requiredFiles = [
        'dist/index.esm.js',
        'dist/index.cjs.js',
        'dist/index.d.ts',
        'dist/JsonEditor.esm.js',
        'dist/JsonEditor.cjs.js',
        'dist/JsonEditor.d.ts',
        'dist/JsonEditor.css',
        'dist/utils/index.esm.js',
        'dist/utils/index.cjs.js',
        'dist/utils/index.d.ts'
    ];

    let totalSize = 0;
    let missingFiles = 0;

    for (const file of requiredFiles) {
        if (fs.existsSync(file)) {
            const size = fs.statSync(file).size;
            totalSize += size;
        } else {
            log(`❌ 缺少文件: ${file}`, 'red');
            missingFiles++;
        }
    }

    if (missingFiles === 0) {
        log(`✅ 文件验证通过: ${requiredFiles.length} 个文件，${(totalSize / 1024).toFixed(2)} KB`, 'green');
    } else {
        log(`❌ 缺少 ${missingFiles} 个必需文件`, 'red');
        process.exit(1);
    }

    // 验证文件内容
    try {
        const indexContent = fs.readFileSync('dist/index.esm.js', 'utf8');
        const utilsContent = fs.readFileSync('dist/utils/index.esm.js', 'utf8');
        const cssContent = fs.readFileSync('dist/JsonEditor.css', 'utf8');

        if (indexContent.includes('export') &&
            utilsContent.includes('collectAllPaths') &&
            cssContent.length > 0) {
            log('✅ 文件内容验证通过', 'green');
        } else {
            log('❌ 文件内容验证失败', 'red');
            process.exit(1);
        }
    } catch (error) {
        log('❌ 无法读取文件内容', 'red');
        process.exit(1);
    }
}

// 主函数
function main() {
    const args = process.argv.slice(2);
    let command = args[0];

    if (!command) {
        log('🚀 统一构建验证工具', 'blue');
        console.log(`
用法:
  node scripts/build.js build    # 仅构建
  node scripts/build.js verify   # 仅验证
  node scripts/build.js full     # 构建+验证 (默认)

示例:
  node scripts/build.js          # 完整流程
  node scripts/build.js build    # 仅构建
  node scripts/build.js verify   # 仅验证现有构建
        `);
        command = 'full';
    }

    switch (command) {
        case 'build':
            buildProject();
            break;

        case 'verify':
            verifyComments();
            verifyBuildFiles();
            break;

        case 'full':
        default:
            buildProject();
            verifyComments();
            verifyBuildFiles();
            log('🎉 构建和验证全部完成！', 'green');
            break;
    }
}

main();
