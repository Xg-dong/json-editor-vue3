#!/usr/bin/env node

/**
 * 统一发布管理脚本
 * 替换: publish.sh, release.sh, version.sh, pre-publish-check.sh
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

const args = process.argv.slice(2);
const command = args[0];

// 颜色输出
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

function exec(command, options = {}) {
    try {
        return execSync(command, {
            stdio: 'inherit',
            encoding: 'utf8',
            ...options
        });
    } catch (error) {
        log(`❌ 命令执行失败: ${command}`, 'red');
        process.exit(1);
    }
}

function checkGitStatus() {
    try {
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        if (status.trim()) {
            log('❌ 工作目录不干净，请先提交所有更改', 'red');
            process.exit(1);
        }
        log('✅ git工作目录干净', 'green');
    } catch (error) {
        log('❌ 无法检查git状态', 'red');
        process.exit(1);
    }
}

function checkNpmLogin() {
    try {
        execSync('npm whoami', { stdio: 'pipe' });
        log('✅ npm已登录', 'green');
    } catch (error) {
        log('❌ 请先登录npm: npm login', 'red');
        process.exit(1);
    }
}

function runTests() {
    log('🧪 运行测试...', 'blue');
    exec('npm run test:run');
}

function buildProject() {
    log('🔨 构建项目...', 'blue');
    exec('npm run build');
}

function verifyBuild() {
    log('🔍 验证构建...', 'blue');
    // 构建验证已在 build.js 脚本中完成
    log('✅ 构建验证完成', 'green');
}

function updateVersion(versionType) {
    log(`🔄 更新版本 (${versionType})...`, 'blue');

    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    const currentVersion = pkg.version;

    exec(`npm version ${versionType} --no-git-tag-version`);

    const newPkg = JSON.parse(readFileSync('package.json', 'utf8'));
    const newVersion = newPkg.version;

    log(`✅ 版本更新: ${currentVersion} -> ${newVersion}`, 'green');

    // 重新构建
    buildProject();
    verifyBuild();

    // 提交更改
    exec('git add package.json');
    exec(`git commit -m "chore: bump version to ${newVersion}"`);
    exec(`git tag -a "v${newVersion}" -m "Release v${newVersion}"`);

    return newVersion;
}

function publishToNpm(tag = 'latest') {
    log('🚀 发布到npm...', 'blue');
    const publishCmd = tag === 'latest' ? 'npm publish' : `npm publish --tag ${tag}`;
    exec(publishCmd);
    log('✅ 发布成功！', 'green');
}

// 主要命令处理
function main() {
    if (!command) {
        console.log(`
🚀 统一发布管理工具

用法:
  node scripts/release.js check          # 发布前检查
  node scripts/release.js version <type> # 版本管理 (patch|minor|major|版本号)
  node scripts/release.js publish        # 发布到npm
  node scripts/release.js release <type> # 完整发布流程 (patch|minor|major)
  node scripts/release.js beta          # 发布测试版

示例:
  node scripts/release.js check
  node scripts/release.js version patch
  node scripts/release.js publish
  node scripts/release.js release minor
  node scripts/release.js beta
        `);
        return;
    }

    switch (command) {
        case 'check':
            log('🔍 发布前检查...', 'blue');
            checkGitStatus();
            runTests();
            buildProject();
            verifyBuild();
            log('✅ 所有检查通过！', 'green');
            break;

        case 'version':
            const versionType = args[1];
            if (!versionType) {
                log('❌ 请指定版本类型: patch|minor|major|版本号', 'red');
                process.exit(1);
            }
            checkGitStatus();
            const newVersion = updateVersion(versionType);
            log(`💡 运行 'node scripts/release.js publish' 发布版本 ${newVersion}`, 'yellow');
            break;

        case 'publish':
            checkNpmLogin();
            checkGitStatus();
            publishToNpm();
            const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
            log(`📋 包信息: https://www.npmjs.com/package/${pkg.name}`, 'blue');
            break;

        case 'release':
            const releaseType = args[1] || 'patch';
            log(`🚀 完整发布流程 (${releaseType})...`, 'blue');
            checkGitStatus();
            checkNpmLogin();
            runTests();
            const version = updateVersion(releaseType);
            publishToNpm();
            log(`🎉 发布完成！版本: ${version}`, 'green');
            log(`💡 运行 'git push origin main --tags' 推送到远程仓库`, 'yellow');
            break;

        case 'beta':
            log('🚀 发布测试版...', 'blue');
            checkNpmLogin();
            runTests();
            buildProject();
            publishToNpm('beta');
            break;

        default:
            log(`❌ 未知命令: ${command}`, 'red');
            process.exit(1);
    }
}

main();
