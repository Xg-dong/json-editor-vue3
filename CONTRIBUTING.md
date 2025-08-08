# 🤝 贡献指南

感谢您对 `json-editor-vue3` 项目的关注！我们非常欢迎各种形式的贡献，包括但不限于：

- 🐛 报告 Bug
- ✨ 建议新功能
- 📖 改进文档
- 🔧 提交代码
- 🧪 编写测试
- 🎨 改进 UI/UX

## � 快速开始

### 开发环境要求

- **Node.js**: 18+ 
- **npm**: 8+ (推荐使用 pnpm)
- **Git**: 2.x+

### 获取代码

```bash
# 1. Fork 项目到你的 GitHub 账户

# 2. 克隆你的 fork
git clone https://github.com/YOUR_USERNAME/json-editor-vue3.git
cd json-editor-vue3

# 3. 添加上游仓库
git remote add upstream https://github.com/bx3mdyy/json-editor-vue3.git

# 4. 安装依赖
npm install
# 或者使用 pnpm (推荐)
pnpm install
```

### 开发工作流

```bash
# 创建开发分支
git checkout -b feature/your-feature-name

# 开始开发...
npm run dev

# 运行测试
npm test

# 运行类型检查
npm run type-check

# 构建项目
npm run build

# 提交更改
git add .
git commit -m "feat: add your feature description"

# 推送到你的 fork
git push origin feature/your-feature-name

# 创建 Pull Request
```

## 📋 开发指南

### 项目结构

```
json-editor-vue3/
├── src/                    # 源代码
│   ├── index.ts           # 入口文件
│   ├── JsonEditor.vue     # 主组件
│   ├── type.ts            # 类型定义
│   └── utils/             # 工具函数
│       └── JsonUtils.ts   # JSON 工具
├── test/                  # 测试文件
│   ├── JsonUtils.spec.ts
│   ├── JsonUtils.diff.spec.ts
│   ├── vue3-integration.spec.ts
│   ├── element-plus-integration.spec.ts
│   ├── JsonEditor.simple.spec.ts
│   └── browser-compatibility.spec.ts
├── docs/                  # 文档
├── package.json
├── vite.config.ts        # Vite 配置
├── vitest.config.ts      # 测试配置
└── tsconfig.json         # TypeScript 配置
```

### 代码规范

#### TypeScript 规范

```typescript
// ✅ 推荐：使用明确的类型定义
interface UserData {
  id: number
  name: string
  profile?: {
    bio: string
    avatar?: string
  }
}

// ✅ 推荐：函数应该有清晰的类型签名
function processUserData(data: UserData): ProcessedUser {
  // 实现...
}

// ❌ 避免：使用 any 类型
function processData(data: any): any {
  // 不推荐
}
```

#### Vue 组件规范

```vue
<template>
  <!-- 使用语义化的 HTML 结构 -->
  <div class="json-editor">
    <div class="json-editor__toolbar">
      <!-- 工具栏内容 -->
    </div>
    <div class="json-editor__content">
      <!-- 编辑器内容 -->
    </div>
  </div>
</template>

<script setup lang="ts">
// ✅ 推荐：使用 composition API + TypeScript
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: object | string
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false
})

// ✅ 推荐：使用响应式引用
const editorRef = ref<HTMLElement>()
const errorMessage = ref<string | null>(null)

// ✅ 推荐：计算属性有明确的返回类型
const isValidJson = computed((): boolean => {
  // 计算逻辑
  return true
})
</script>

<style scoped>
/* ✅ 推荐：使用 BEM 命名规范 */
.json-editor {
  /* 组件样式 */
}

.json-editor__toolbar {
  /* 工具栏样式 */
}

.json-editor__content {
  /* 内容样式 */
}
</style>
```

#### 测试规范

```typescript
// ✅ 推荐：测试文件命名
// ComponentName.spec.ts
// utils.spec.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { JsonEditor } from '../src'

describe('JsonEditor', () => {
  // ✅ 推荐：清晰的测试描述
  it('should render with default props', () => {
    const wrapper = mount(JsonEditor)
    expect(wrapper.exists()).toBe(true)
  })

  // ✅ 推荐：测试用户交互
  it('should emit update:modelValue when content changes', async () => {
    const wrapper = mount(JsonEditor, {
      props: { modelValue: {} }
    })
    
    // 模拟用户操作
    await wrapper.find('.json-editor').trigger('input')
    
    // 验证结果
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
```

### 提交信息规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### 类型 (type)

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 重构代码
- `perf`: 性能优化
- `test`: 测试相关
- `build`: 构建系统或外部依赖更改
- `ci`: CI 配置更改
- `chore`: 其他更改

#### 示例

```bash
# 新功能
git commit -m "feat(JsonEditor): add full-screen editing mode"

# 修复 bug
git commit -m "fix(JsonUtils): handle null values in pickFieldsSuper"

# 文档更新
git commit -m "docs(README): add installation instructions"

# 重构
git commit -m "refactor(utils): extract path parsing logic"

# 测试
git commit -m "test(JsonEditor): add component integration tests"
```

## 🐛 报告 Bug

在提交 Bug 报告之前，请：

1. 检查 [现有 Issues](https://github.com/bx3mdyy/json-editor-vue3/issues) 确保问题未被报告
2. 确保使用的是最新版本
3. 提供详细的重现步骤

### Bug 报告模板

```markdown
**描述**
简洁清晰地描述 bug。

**重现步骤**
1. 前往 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

**期望行为**
描述你期望发生的行为。

**实际行为**
描述实际发生的行为。

**截图**
如果适用，添加截图以帮助解释你的问题。

**环境信息**
- 操作系统: [例如 macOS 14.0]
- 浏览器: [例如 Chrome 120]
- Node.js 版本: [例如 18.17.0]
- Vue 版本: [例如 3.4.0]
- json-editor-vue3 版本: [例如 1.0.0]

**附加信息**
添加关于问题的任何其他信息。
```

## ✨ 功能请求

我们欢迎新功能建议！在提交之前，请：

1. 检查是否已有相似的功能请求
2. 考虑功能的通用性和必要性
3. 提供详细的使用场景

### 功能请求模板

```markdown
**功能描述**
简洁清晰地描述你想要的功能。

**问题/需求**
描述这个功能要解决的问题或满足的需求。

**建议的解决方案**
描述你希望如何实现这个功能。

**替代方案**
描述你考虑过的其他解决方案。

**使用场景**
提供具体的使用场景和示例。

**附加信息**
添加关于功能请求的任何其他信息。
```

## 📝 代码贡献

### Pull Request 流程

1. **Fork 仓库** 并创建特性分支
2. **编写代码** 遵循项目规范
3. **添加测试** 确保新功能有测试覆盖
4. **运行测试** 确保所有测试通过
5. **更新文档** 如果需要的话
6. **提交 PR** 并等待 review

### PR 要求

- ✅ 所有测试必须通过
- ✅ 代码覆盖率不能降低
- ✅ 遵循代码规范
- ✅ 提交信息符合规范
- ✅ 更新相关文档
- ✅ 添加必要的测试

### PR 模板

```markdown
**类型**
- [ ] Bug 修复
- [ ] 新功能
- [ ] 重构
- [ ] 文档更新
- [ ] 其他

**描述**
简要描述这个 PR 的目的和更改内容。

**相关 Issue**
修复 #(issue number)

**更改内容**
- 添加了 XXX 功能
- 修复了 XXX 问题
- 重构了 XXX 模块

**测试**
- [ ] 添加了新测试
- [ ] 所有测试通过
- [ ] 手动测试通过

**文档**
- [ ] 更新了 README
- [ ] 更新了 API 文档
- [ ] 更新了使用示例

**检查清单**
- [ ] 代码遵循项目规范
- [ ] 提交信息符合规范
- [ ] 没有破坏性更改
- [ ] 向后兼容
```

## 🧪 测试指南

### 运行测试

```bash
# 运行所有测试
npm test

# 运行测试并监听变化
npm run test:watch

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行特定测试文件
npm test JsonUtils.spec.ts
```

### 测试结构

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('Feature Name', () => {
  beforeEach(() => {
    // 测试前的设置
  })

  afterEach(() => {
    // 测试后的清理
  })

  describe('when condition is met', () => {
    it('should behave correctly', () => {
      // 测试实现
      expect(result).toBe(expected)
    })
  })
})
```

### 测试覆盖率

我们要求：
- 代码行覆盖率 ≥ 90%
- 分支覆盖率 ≥ 85%
- 函数覆盖率 ≥ 90%

## 📚 文档贡献

### 文档类型

- **README.md**: 项目介绍和快速开始
- **USAGE.md**: 详细使用指南
- **API.md**: API 参考文档
- **CHANGELOG.md**: 版本更新日志
- **CONTRIBUTING.md**: 贡献指南

### 文档规范

- 使用 Markdown 格式
- 包含代码示例
- 保持内容的准确性和时效性
- 使用清晰的标题和段落结构

## 🎨 设计指南

### CSS 规范

```css
/* ✅ 推荐：使用 CSS 变量 */
:root {
  --json-editor-primary-color: #409eff;
  --json-editor-border-color: #dcdfe6;
  --json-editor-bg-color: #ffffff;
}

/* ✅ 推荐：BEM 命名 */
.json-editor {
  color: var(--json-editor-primary-color);
}

.json-editor__header {
  border-bottom: 1px solid var(--json-editor-border-color);
}

.json-editor__header--collapsed {
  display: none;
}
```

### 响应式设计

```css
/* 移动端优先 */
.json-editor {
  width: 100%;
}

/* 平板 */
@media (min-width: 768px) {
  .json-editor {
    max-width: 750px;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .json-editor {
    max-width: 1200px;
  }
}
```

## 🔒 安全指南

### 报告安全问题

如果您发现安全漏洞，请 **不要** 在公开 Issue 中报告。请发送邮件至：[security@example.com]

### 安全最佳实践

- 始终验证用户输入
- 避免在客户端存储敏感信息
- 使用 HTTPS 传输敏感数据
- 定期更新依赖项

## 🏷️ 发布流程

### 版本发布

1. 更新 `package.json` 中的版本号
2. 更新 `CHANGELOG.md`
3. 创建 release tag
4. 发布到 npm

```bash
# 发布流程
npm run build
npm run test
npm version patch|minor|major
git push --tags
npm publish
```

## 💬 交流方式

- **GitHub Issues**: 提交 bug 报告和功能请求
- **GitHub Discussions**: 一般讨论和问答
- **Email**: [maintainer@example.com]

## 🙏 致谢

感谢所有贡献者的付出！

### 贡献者名单

- [@bx3mdyy](https://github.com/bx3mdyy) - 项目维护者

### 开源项目致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - Vue 3 组件库
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - 代码编辑器
- [Vitest](https://vitest.dev/) - 测试框架

## 📄 许可证

通过贡献代码，您同意您的贡献将在 [MIT 许可证](./LICENSE) 下获得许可。

```bash
# 运行所有测试
npm run test:run

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行测试 UI
npm run test:ui
```

### 4. 构建

```bash
# 清理构建目录
npm run clean

# 构建项目
npm run build

# 构建类型定义
npm run build:types
```

## 📂 项目结构

```
json-editor/
├── src/                    # 源代码
│   ├── utils/             # 工具函数
│   │   └── JsonUtils.ts   # JSON 处理工具
│   ├── JsonEditor.vue     # Vue 组件
│   ├── type.ts           # TypeScript 类型定义
│   └── index.ts          # 主入口文件
├── test/                  # 测试文件
│   ├── JsonUtils.test.ts         # 基础功能测试
│   ├── JsonUtils.diff.test.ts    # 差异功能测试
│   └── JsonUtils.vitest.test.ts  # Vitest 测试套件
├── scripts/               # 脚本文件
│   └── release.sh        # 发布脚本
├── .github/              # GitHub Actions
│   └── workflows/
│       ├── ci.yml        # CI/CD 流水线
│       └── release.yml   # 发布流程
├── dist/                 # 构建输出目录
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
├── rollup.config.js      # 构建配置
└── vitest.config.ts      # 测试配置
```

## 🔧 配置文件说明

### package.json
- 项目元数据和依赖管理
- NPM 脚本定义
- 发布配置

### tsconfig.json
- TypeScript 编译配置
- 路径映射和类型检查规则

### rollup.config.js
- 多格式构建配置 (CJS, ESM)
- 外部依赖处理
- 插件配置

### vitest.config.ts
- 测试框架配置
- 覆盖率报告设置

## 📦 构建输出

构建后的文件结构：

```
dist/
├── index.js              # CJS 主入口
├── index.esm.js          # ESM 主入口
├── index.d.ts            # 类型定义
├── utils/
│   ├── JsonUtils.js      # CJS 工具模块
│   ├── JsonUtils.esm.js  # ESM 工具模块
│   └── JsonUtils.d.ts    # 工具类型定义
├── JsonEditor.js         # CJS 组件
├── JsonEditor.esm.js     # ESM 组件
└── JsonEditor.d.ts       # 组件类型定义
```

## 🚀 发布流程

### 自动发布（推荐）

1. **开发完成后提交代码**
   ```bash
   git add .
   git commit -m "feat: 新功能描述"
   git push origin main
   ```

2. **使用发布脚本**
   ```bash
   # 发布补丁版本（1.0.0 -> 1.0.1）
   ./scripts/release.sh patch
   
   # 发布小版本（1.0.0 -> 1.1.0）
   ./scripts/release.sh minor
   
   # 发布大版本（1.0.0 -> 2.0.0）
   ./scripts/release.sh major
   
   # 发布测试版本（1.0.0 -> 1.0.1-beta.0）
   ./scripts/release.sh beta
   ```

### 手动发布

1. **更新版本号**
   ```bash
   npm version patch|minor|major
   ```

2. **构建项目**
   ```bash
   npm run build
   ```

3. **发布到 NPM**
   ```bash
   npm publish
   ```

## 🧪 测试策略

### 测试类型

1. **单元测试** - 测试单个函数的功能
2. **集成测试** - 测试模块间的交互
3. **性能测试** - 验证大数据处理性能
4. **边界测试** - 测试极端情况

### 测试覆盖率目标

- 语句覆盖率：> 90%
- 分支覆盖率：> 85%
- 函数覆盖率：> 95%
- 行覆盖率：> 90%

### 添加新测试

在 `test/` 目录下创建对应的测试文件：

```typescript
import { describe, it, expect } from 'vitest'
import { yourFunction } from '../src/utils/JsonUtils'

describe('功能描述', () => {
  it('应该正确处理正常情况', () => {
    const result = yourFunction(input)
    expect(result).toEqual(expected)
  })
  
  it('应该正确处理边界情况', () => {
    // 边界测试
  })
})
```

## 🐛 调试指南

### 开发时调试

1. **使用 console.debug**
   ```typescript
   console.debug('调试信息', { data })
   ```

2. **TypeScript 编译错误**
   ```bash
   npm run type-check
   ```

3. **运行时错误**
   - 检查测试用例
   - 使用测试 UI 调试

### 构建问题

1. **清理构建缓存**
   ```bash
   npm run clean
   npm run build
   ```

2. **依赖问题**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📋 代码规范

### TypeScript 规范

- 优先使用类型推导
- 为公共 API 提供明确的类型注解
- 使用 interface 而不是 type（除非需要联合类型）

### 命名规范

- 函数：camelCase
- 类型：PascalCase
- 常量：UPPER_SNAKE_CASE
- 文件名：PascalCase（组件）或 camelCase（工具）

### 注释规范

```typescript
/**
 * 函数描述
 * @param param1 参数1描述
 * @param param2 参数2描述
 * @returns 返回值描述
 * @example
 * ```typescript
 * const result = myFunction('input')
 * console.log(result) // 输出结果
 * ```
 */
export function myFunction(param1: string, param2: number): string {
  // 实现
}
```

## 🔄 版本管理

### 语义化版本控制

- **MAJOR**: 不兼容的 API 变更
- **MINOR**: 向下兼容的功能新增
- **PATCH**: 向下兼容的问题修复

### 分支策略

- `main`: 生产分支，只接受 PR
- `develop`: 开发分支，功能开发的基础分支
- `feature/*`: 功能分支
- `hotfix/*`: 紧急修复分支

### 提交信息规范

```
type(scope): subject

body

footer
```

类型：
- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档
- `style`: 格式（不影响代码运行）
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建过程或辅助工具变动

## 🤝 贡献指南

### 提交 PR 流程

1. Fork 项目
2. 创建功能分支
3. 编写代码和测试
4. 确保所有检查通过
5. 提交 Pull Request

### PR 检查清单

- [ ] 代码风格符合规范
- [ ] 添加了相应的测试
- [ ] 测试覆盖率达标
- [ ] 文档已更新
- [ ] 类型定义正确

## 📞 支持

- 🐛 Bug 报告：[GitHub Issues](https://github.com/bx3mdyy/json-editor/issues)
- 💡 功能请求：[GitHub Discussions](https://github.com/bx3mdyy/json-editor/discussions)
- 📖 文档：[README.md](./README.md)
