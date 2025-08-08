# 📘 JsonUtils 使用指南

这个文档详细介绍了 `json-editor-vue3` 包中 JsonUtils 工具函数的所有功能和使用方法。

## 📚 目录

- [快速开始](#快速开始)
- [字段操作](#字段操作)
  - [pickFieldsSuper](#pickFieldsSuper)
  - [mergeFieldsSuper](#mergeFieldsSuper)
- [路径比较](#路径比较)
  - [diffPaths](#diffPaths)
- [值差异检测](#值差异检测)
  - [diffValues](#diffValues)
- [只读字段处理](#只读字段处理)
  - [findReadonlyFieldRanges](#findReadonlyFieldRanges)
  - [isReadonlyValueChanged](#isReadonlyValueChanged)
- [工具函数](#工具函数)
  - [parsePath](#parsePath)
  - [isPathMatch](#isPathMatch)
  - [isEqual](#isEqual)
  - [deepClone](#deepClone)
- [通配符模式](#通配符模式)
- [实际应用场景](#实际应用场景)

## 🚀 快速开始

```typescript
// 导入工具函数
import {
  pickFieldsSuper,
  mergeFieldsSuper,
  diffPaths,
  diffValues,
  findReadonlyFieldRanges,
  isReadonlyValueChanged,
  parsePath,
  isPathMatch,
  isEqual,
  deepClone
} from 'json-editor-vue3/utils'

// 或者单独导入
import { pickFieldsSuper } from 'json-editor-vue3/utils'
```

## 📋 字段操作

### pickFieldsSuper

从对象中提取或排除指定字段，支持复杂的路径模式。

#### 语法

```typescript
pickFieldsSuper(input: any, pathStrings: string[], exclude?: boolean): any
```

#### 参数

- `input` - 输入对象
- `pathStrings` - 字段路径数组
- `exclude` - 是否为排除模式，默认 `false`

#### 基础用法

```typescript
const user = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  password: 'secret123',
  profile: {
    bio: 'Developer',
    avatar: 'avatar.jpg',
    social: {
      github: 'alice',
      twitter: '@alice'
    }
  }
}

// 提取基础字段
const basicInfo = pickFieldsSuper(user, ['name', 'email'])
// 结果: { name: 'Alice', email: 'alice@example.com' }

// 提取嵌套字段
const profileInfo = pickFieldsSuper(user, ['name', 'profile.bio', 'profile.social.github'])
// 结果: { 
//   name: 'Alice', 
//   profile: { 
//     bio: 'Developer', 
//     social: { github: 'alice' } 
//   } 
// }

// 排除敏感信息
const safeUser = pickFieldsSuper(user, ['password'], true)
// 结果: user 对象但不包含 password 字段
```

#### 数组处理

```typescript
const users = [
  { id: 1, name: 'Alice', password: 'secret1' },
  { id: 2, name: 'Bob', password: 'secret2' }
]

// 提取数组中所有元素的 name 字段
const names = pickFieldsSuper(users, ['[].name'])
// 结果: [{ name: 'Alice' }, { name: 'Bob' }]

// 提取数组中所有元素的 id 和 name
const idNames = pickFieldsSuper(users, ['[].id', '[].name'])
// 结果: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
```

#### 通配符用法

```typescript
const data = {
  users: [
    { id: 1, name: 'Alice', settings: { theme: 'dark' } },
    { id: 2, name: 'Bob', settings: { theme: 'light' } }
  ],
  admins: [
    { id: 101, name: 'Admin', settings: { theme: 'auto' } }
  ]
}

// 使用 ** 深度通配符提取所有 id
const allIds = pickFieldsSuper(data, ['**id'])
// 结果包含所有层级的 id 字段

// 使用 [] 数组通配符提取所有用户名
const allNames = pickFieldsSuper(data, ['users[].name', 'admins[].name'])
// 或者使用更简单的方式
const allNames2 = pickFieldsSuper(data, ['**[].name'])
```

### mergeFieldsSuper

将补丁对象的指定字段合并到原始对象中。

#### 语法

```typescript
mergeFieldsSuper(origin: any, patch: any, pathStrings: string[], exclude?: boolean): any
```

#### 参数

- `origin` - 原始对象
- `patch` - 补丁对象
- `pathStrings` - 需要合并的字段路径
- `exclude` - 是否为排除模式，默认 `false`

#### 基础用法

```typescript
const original = {
  name: 'Alice',
  age: 25,
  profile: {
    bio: 'Developer',
    skills: ['JavaScript'],
    experience: 3
  }
}

const patch = {
  name: 'Alice Wang',
  age: 26,
  profile: {
    bio: 'Senior Developer',
    skills: ['JavaScript', 'TypeScript'],
    experience: 5
  }
}

// 只合并 name 和 profile.bio 字段
const merged = mergeFieldsSuper(original, patch, ['name', 'profile.bio'])
// 结果: {
//   name: 'Alice Wang',
//   age: 25,  // 保持原值
//   profile: {
//     bio: 'Senior Developer',  // 已更新
//     skills: ['JavaScript'],   // 保持原值
//     experience: 3             // 保持原值
//   }
// }
```

#### 数组合并

```typescript
const originalUsers = {
  users: [
    { id: 1, name: 'Alice', active: true },
    { id: 2, name: 'Bob', active: false }
  ]
}

const patchUsers = {
  users: [
    { id: 1, name: 'Alice Smith', active: true },
    { id: 2, name: 'Bob Johnson', active: true }
  ]
}

// 只更新用户的活跃状态
const mergedUsers = mergeFieldsSuper(originalUsers, patchUsers, ['users[].active'])
// 结果: users 数组中所有用户的 active 字段被更新，name 保持不变
```

#### 条件合并

```typescript
const config = {
  database: { host: 'localhost', port: 5432, ssl: false },
  cache: { enabled: true, ttl: 3600 },
  debug: true
}

const configUpdate = {
  database: { host: 'prod-server', port: 5432, ssl: true },
  cache: { enabled: true, ttl: 7200 },
  debug: false
}

// 只更新生产环境相关配置，保留调试设置
const prodConfig = mergeFieldsSuper(config, configUpdate, ['database.host', 'database.ssl', 'cache.ttl'])
```

## 🔍 路径比较

### diffPaths

比较两个对象的路径结构，返回交集、差集和并集。

#### 语法

```typescript
diffPaths(objA: any, objB: any): PathDiffResult
```

#### 返回类型

```typescript
interface PathDiffResult {
  intersection: string[]  // 交集：两个对象都有的路径
  differenceA: string[]   // A 独有：只有 A 对象有的路径
  differenceB: string[]   // B 独有：只有 B 对象有的路径
  union: string[]         // 并集：所有路径的合集
}
```

#### 使用示例

```typescript
const objA = {
  name: 'Alice',
  age: 25,
  profile: {
    bio: 'Developer',
    github: 'alice'
  }
}

const objB = {
  name: 'Bob',
  email: 'bob@example.com',
  profile: {
    bio: 'Designer',
    twitter: '@bob'
  }
}

const pathDiff = diffPaths(objA, objB)

console.log(pathDiff.intersection)  // ['name', 'profile', 'profile.bio']
console.log(pathDiff.differenceA)   // ['age', 'profile.github']
console.log(pathDiff.differenceB)   // ['email', 'profile.twitter']
console.log(pathDiff.union)         // ['name', 'age', 'profile', 'profile.bio', 'profile.github', 'email', 'profile.twitter']
```

#### 实际应用

```typescript
// API 版本兼容性检查
const apiV1Schema = { name: 'string', age: 'number', email: 'string' }
const apiV2Schema = { name: 'string', age: 'number', phone: 'string' }

const schemaDiff = diffPaths(apiV1Schema, apiV2Schema)

if (schemaDiff.differenceA.length > 0) {
  console.log('V2 中移除的字段:', schemaDiff.differenceA)
}

if (schemaDiff.differenceB.length > 0) {
  console.log('V2 中新增的字段:', schemaDiff.differenceB)
}
```

## 📊 值差异检测

### diffValues

检测两个对象的值差异，返回详细的变更信息。

#### 语法

```typescript
diffValues(objA: any, objB: any, options?: DiffOptions): ValueDiffResult
```

#### 参数

```typescript
interface DiffOptions {
  includeAdded?: boolean     // 包含新增字段，默认 true
  includeRemoved?: boolean   // 包含删除字段，默认 true
  includeModified?: boolean  // 包含修改字段，默认 true
}
```

#### 返回类型

```typescript
interface ValueDiffResult {
  changedPaths: string[]     // 所有变化的路径
  changedObject: any         // 差异对象（只包含变化的字段）
  addedPaths: string[]       // 新增的路径
  removedPaths: string[]     // 删除的路径
  modifiedPaths: string[]    // 修改的路径
}
```

#### 基础用法

```typescript
const before = {
  name: 'Alice',
  age: 25,
  profile: {
    bio: 'Developer',
    skills: ['JavaScript']
  }
}

const after = {
  name: 'Alice Smith',  // 修改
  age: 25,              // 未变
  email: 'alice@example.com',  // 新增
  profile: {
    bio: 'Senior Developer',    // 修改
    skills: ['JavaScript', 'TypeScript'],  // 修改
    location: 'Beijing'         // 新增
  }
  // age 字段被删除
}

const diff = diffValues(before, after)

console.log(diff.modifiedPaths)  // ['name', 'profile.bio', 'profile.skills']
console.log(diff.addedPaths)     // ['email', 'profile.location']
console.log(diff.removedPaths)   // []
console.log(diff.changedPaths)   // 所有变化路径的合集
```

#### 选项控制

```typescript
// 只检测修改的字段，忽略新增和删除
const modifiedOnly = diffValues(before, after, {
  includeAdded: false,
  includeRemoved: false,
  includeModified: true
})

// 只检测新增的字段
const addedOnly = diffValues(before, after, {
  includeAdded: true,
  includeRemoved: false,
  includeModified: false
})
```

#### 实际应用

```typescript
// 表单变更追踪
function trackFormChanges(originalData: any, currentData: any) {
  const diff = diffValues(originalData, currentData)
  
  if (diff.changedPaths.length === 0) {
    console.log('表单无变更')
    return false
  }
  
  console.log('变更字段:', diff.changedPaths)
  return true
}

// 配置文件变更检测
function detectConfigChanges(oldConfig: any, newConfig: any) {
  const diff = diffValues(oldConfig, newConfig)
  
  const criticalPaths = ['database.host', 'database.port', 'api.key']
  const hasCriticalChanges = diff.changedPaths.some(path => 
    criticalPaths.includes(path)
  )
  
  if (hasCriticalChanges) {
    console.warn('检测到关键配置变更，需要重启服务')
  }
  
  return diff
}
```

## 🔒 只读字段处理

### findReadonlyFieldRanges

在 JSON 文本中查找只读字段的位置范围，用于编辑器高亮显示。

#### 语法

```typescript
findReadonlyFieldRanges(jsonText: string, readonlyPaths: string[]): FieldRange[]
```

#### 返回类型

```typescript
interface FieldRange {
  path: string        // 字段路径
  startIndex: number  // 开始位置
  endIndex: number    // 结束位置
  line: number        // 行号
  column: number      // 列号
}
```

#### 使用示例

```typescript
const jsonText = `{
  "name": "Alice",
  "age": 25,
  "readonly": true,
  "profile": {
    "bio": "Developer"
  }
}`

const readonlyPaths = ['readonly', 'profile.bio']
const ranges = findReadonlyFieldRanges(jsonText, readonlyPaths)

// 结果包含每个只读字段在文本中的精确位置
ranges.forEach(range => {
  console.log(`字段 ${range.path} 位于第 ${range.line} 行，第 ${range.column} 列`)
  console.log(`文本位置: ${range.startIndex} - ${range.endIndex}`)
})
```

#### Monaco Editor 集成

```typescript
// 在 Monaco Editor 中高亮只读字段
function highlightReadonlyFields(editor: monaco.editor.IStandaloneCodeEditor, readonlyPaths: string[]) {
  const model = editor.getModel()
  if (!model) return
  
  const jsonText = model.getValue()
  const ranges = findReadonlyFieldRanges(jsonText, readonlyPaths)
  
  const decorations = ranges.map(range => ({
    range: new monaco.Range(range.line, range.column, range.line, range.column + range.path.length),
    options: {
      isWholeLine: false,
      className: 'readonly-field',
      glyphMarginClassName: 'readonly-glyph'
    }
  }))
  
  editor.deltaDecorations([], decorations)
}
```

### isReadonlyValueChanged

检测只读字段的值是否发生了变化。

#### 语法

```typescript
isReadonlyValueChanged(oldJsonText: string, newJsonText: string, readonlyPaths: string[]): boolean
```

#### 使用示例

```typescript
const oldJson = '{"name": "Alice", "age": 25, "readonly": true}'
const newJson = '{"name": "Bob", "age": 25, "readonly": true}'
const readonlyPaths = ['name', 'readonly']

const hasReadonlyChange = isReadonlyValueChanged(oldJson, newJson, readonlyPaths)
// 返回 true，因为 name 字段发生了变化

// 编辑器验证示例
function validateEdit(oldText: string, newText: string, readonlyPaths: string[]) {
  if (isReadonlyValueChanged(oldText, newText, readonlyPaths)) {
    throw new Error('不能修改只读字段')
  }
  return true
}
```

## 🛠️ 工具函数

### parsePath

将路径字符串解析为路径数组。

#### 语法

```typescript
parsePath(path: string): string[]
```

#### 使用示例

```typescript
console.log(parsePath('user.profile.name'))     // ['user', 'profile', 'name']
console.log(parsePath('users[0].name'))         // ['users', '0', 'name']
console.log(parsePath('data[].items[].id'))     // ['data', '[]', 'items', '[]', 'id']
```

### isPathMatch

检查目标路径是否匹配模式路径（支持通配符）。

#### 语法

```typescript
isPathMatch(targetPath: string[], patternPath: string[]): boolean
```

#### 使用示例

```typescript
const targetPath = ['users', '0', 'name']
const patternPath1 = ['users', '[]', 'name']     // 数组通配符
const patternPath2 = ['**', 'name']              // 深度通配符

console.log(isPathMatch(targetPath, patternPath1))  // true
console.log(isPathMatch(targetPath, patternPath2))  // true
```

### isEqual

比较两个值是否相等，支持 Vue 响应式对象。

#### 语法

```typescript
isEqual(a: any, b: any): boolean
```

#### 使用示例

```typescript
import { ref, reactive } from 'vue'

const obj1 = { name: 'Alice', age: 25 }
const obj2 = { name: 'Alice', age: 25 }
const reactiveObj = reactive({ name: 'Alice', age: 25 })
const refObj = ref({ name: 'Alice', age: 25 })

console.log(isEqual(obj1, obj2))              // true
console.log(isEqual(obj1, reactiveObj))       // true
console.log(isEqual(obj1, refObj.value))      // true
```

### deepClone

深拷贝对象或数组。

#### 语法

```typescript
deepClone<T>(obj: T): T
```

#### 使用示例

```typescript
const original = {
  name: 'Alice',
  profile: {
    skills: ['JavaScript', 'Vue']
  }
}

const cloned = deepClone(original)
cloned.profile.skills.push('TypeScript')

console.log(original.profile.skills)  // ['JavaScript', 'Vue'] - 原对象不受影响
console.log(cloned.profile.skills)    // ['JavaScript', 'Vue', 'TypeScript']
```

## 🎯 通配符模式

### ** 深度通配符

匹配任意深度的字段路径。

```typescript
const data = {
  level1: {
    level2: {
      level3: {
        target: 'found'
      }
    }
  },
  other: {
    target: 'also found'
  }
}

// 提取所有深度的 target 字段
const targets = pickFieldsSuper(data, ['**target'])
// 结果包含 level1.level2.level3.target 和 other.target
```

### [] 数组通配符

匹配数组中的所有元素。

```typescript
const data = {
  users: [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]
}

// 提取所有用户的 name
const names = pickFieldsSuper(data, ['users[].name'])
// 结果: { users: [{ name: 'Alice' }, { name: 'Bob' }] }
```

### 组合使用

```typescript
const complexData = {
  departments: [
    {
      name: 'Engineering',
      teams: [
        {
          name: 'Frontend',
          members: [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' }
          ]
        }
      ]
    }
  ]
}

// 提取所有成员的 id
const memberIds = pickFieldsSuper(complexData, ['**members[].id'])
// 使用组合通配符处理复杂嵌套结构
```

## 📋 实际应用场景

### 1. API 数据过滤

```typescript
// 过滤敏感信息
function sanitizeUserData(users: any[]) {
  return pickFieldsSuper(users, ['password', 'secretKey', 'internalId'], true)
}

// 提取公开信息
function getPublicProfile(user: any) {
  return pickFieldsSuper(user, [
    'name', 
    'avatar', 
    'profile.bio', 
    'profile.social.github'
  ])
}
```

### 2. 表单状态管理

```typescript
// 追踪表单变更
class FormTracker {
  private originalData: any
  
  constructor(initialData: any) {
    this.originalData = deepClone(initialData)
  }
  
  getChanges(currentData: any) {
    return diffValues(this.originalData, currentData)
  }
  
  hasChanges(currentData: any) {
    const diff = this.getChanges(currentData)
    return diff.changedPaths.length > 0
  }
  
  getChangedFields(currentData: any) {
    const diff = this.getChanges(currentData)
    return pickFieldsSuper(currentData, diff.changedPaths)
  }
}
```

### 3. 配置文件管理

```typescript
// 配置合并策略
function mergeConfig(baseConfig: any, userConfig: any, allowedPaths: string[]) {
  // 只允许用户修改特定字段
  return mergeFieldsSuper(baseConfig, userConfig, allowedPaths)
}

// 配置验证
function validateConfigChanges(oldConfig: any, newConfig: any, readonlyPaths: string[]) {
  const diff = diffValues(oldConfig, newConfig)
  const readonlyChanges = diff.changedPaths.filter(path => 
    readonlyPaths.some(readonly => path.startsWith(readonly))
  )
  
  if (readonlyChanges.length > 0) {
    throw new Error(`不能修改只读配置: ${readonlyChanges.join(', ')}`)
  }
}
```

### 4. 数据同步和版本控制

```typescript
// 增量更新
function createIncrementalUpdate(oldData: any, newData: any) {
  const diff = diffValues(oldData, newData)
  
  return {
    version: Date.now(),
    changes: diff.changedObject,
    paths: diff.changedPaths,
    operations: {
      added: diff.addedPaths,
      modified: diff.modifiedPaths,
      removed: diff.removedPaths
    }
  }
}

// 应用增量更新
function applyIncrementalUpdate(baseData: any, update: any) {
  return mergeFieldsSuper(baseData, update.changes, update.paths)
}
```

### 5. 权限控制

```typescript
// 基于角色的字段访问控制
const ROLE_PERMISSIONS = {
  admin: ['**'],  // 管理员可以访问所有字段
  user: ['name', 'email', 'profile.bio'],  // 普通用户只能访问基本信息
  guest: ['name']  // 访客只能看到名字
}

function filterDataByRole(data: any, userRole: string) {
  const allowedPaths = ROLE_PERMISSIONS[userRole] || []
  return pickFieldsSuper(data, allowedPaths)
}

function validateUpdatePermission(data: any, updates: any, userRole: string) {
  const allowedPaths = ROLE_PERMISSIONS[userRole] || []
  const diff = diffValues(data, updates)
  
  const unauthorizedChanges = diff.changedPaths.filter(path => 
    !allowedPaths.some(allowed => 
      allowed === '**' || path.startsWith(allowed)
    )
  )
  
  if (unauthorizedChanges.length > 0) {
    throw new Error(`权限不足，无法修改: ${unauthorizedChanges.join(', ')}`)
  }
}
```

这些工具函数为处理复杂的 JSON 数据操作提供了强大而灵活的解决方案。通过组合使用不同的函数，可以轻松实现各种数据处理需求。

## API文档

### pickFieldsSuper(data, fields)

从对象中提取指定字段，支持通配符路径。

```javascript
const data = {
  name: 'Alice',
  profile: {
    bio: 'Developer',
    skills: ['JavaScript', 'Python']
  }
}

const result = pickFieldsSuper(data, ['name', 'profile.skills[0]'])
// 输出: { name: 'Alice', profile: { skills: ['JavaScript'] } }
```

#### 支持的路径格式：
- `field` - 普通字段
- `nested.field` - 嵌套字段
- `array[0]` - 数组索引
- `**field` - 递归搜索字段
- `[].item` - 数组中的每个对象的item字段

### mergeFieldsSuper(target, source, allowedFields)

安全地合并对象字段，只允许指定字段被修改。

```javascript
const target = { name: 'Alice', age: 25 }
const source = { name: 'Bob', age: 30, role: 'admin' }
const result = mergeFieldsSuper(target, source, ['name'])
// 输出: { name: 'Bob', age: 25 } (age保持不变，role被忽略)
```

### diffPaths(objA, objB)

比较两个对象的路径结构差异。

```javascript
const objA = { a: 1, b: 2 }
const objB = { a: 2, c: 3 }
const result = diffPaths(objA, objB)
// 输出: {
//   onlyInA: ['b'],
//   onlyInB: ['c'], 
//   intersection: ['a']
// }
```

### diffValues(objA, objB)

比较两个对象的值差异。

```javascript
const objA = { a: 1, b: 2 }
const objB = { a: 2, b: 2 }
const result = diffValues(objA, objB)
// 输出: {
//   changedPaths: ['a'],
//   unchangedPaths: ['b']
// }
```

## 高级功能

### 通配符路径支持

```javascript
const data = {
  users: [
    { name: 'Alice', profile: { bio: 'Dev' } },
    { name: 'Bob', profile: { bio: 'Designer' } }
  ]
}

// 提取所有用户的name
pickFieldsSuper(data, ['users[].name'])

// 递归搜索所有bio字段
pickFieldsSuper(data, ['**bio'])
```

### Vue响应式支持

工具函数自动处理Vue的ref和reactive对象：

```javascript
import { ref } from 'vue'

const reactiveData = ref({
  name: 'Alice',
  age: 25
})

const result = pickFieldsSuper(reactiveData, ['name'])
// 自动解包ref，正常处理
```

## 类型支持

包含完整的TypeScript类型定义：

```typescript
import type { JsonPath, DiffResult } from 'json-editor/utils'

const paths: JsonPath[] = ['name', 'profile.bio']
const result: DiffResult = diffPaths(objA, objB)
```

## 依赖要求

- Vue 3.x (可选，仅在使用Vue组件时需要)
- Node.js >= 16
- 支持ESM和CommonJS

## 许可证

MIT
