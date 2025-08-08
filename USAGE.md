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

#### 排除模式详解 (exclude = true)

当 `exclude` 参数设置为 `true` 时，`pickFieldsSuper` 会返回除指定字段外的所有字段。这在需要过滤敏感信息或保护特定数据时非常有用。

##### 基础排除示例

```typescript
const userData = {
  id: 'USER_001',
  name: 'Alice Wang',
  email: 'alice@company.com',
  password: 'super_secret_password',
  apiKey: 'sk_live_abcd1234...',
  phone: '+86-138-0000-0001',
  department: 'Engineering',
  salary: 150000,
  performance: 'A+',
  profile: {
    bio: 'Full-stack developer',
    avatar: 'https://avatar.url',
    socialSecurity: '123-45-6789',
    bankAccount: '6222-0000-0000-0001',
    preferences: {
      theme: 'dark',
      language: 'zh-CN',
      privateNotes: 'Personal thoughts...'
    }
  }
}

// 排除所有敏感信息，返回安全的用户数据
const publicUserData = pickFieldsSuper(userData, [
  'password',                    // 密码
  'apiKey',                      // API密钥
  'salary',                      // 薪资信息
  'performance',                 // 绩效评估
  'profile.socialSecurity',      // 社会保障号
  'profile.bankAccount',         // 银行账户
  'profile.preferences.privateNotes' // 私人笔记
], true)

// 结果: {
//   id: 'USER_001',
//   name: 'Alice Wang',
//   email: 'alice@company.com',
//   phone: '+86-138-0000-0001',
//   department: 'Engineering',
//   profile: {
//     bio: 'Full-stack developer',
//     avatar: 'https://avatar.url',
//     preferences: {
//       theme: 'dark',
//       language: 'zh-CN'
//     }
//   }
// }
```

##### API 响应过滤

```typescript
// 用户管理系统 - 根据权限过滤返回数据
const fullUserRecord = {
  id: 'USER_123',
  username: 'alice_wang',
  email: 'alice@company.com',
  emailVerified: true,
  phone: '+86-138-0000-0001',
  phoneVerified: false,
  
  // 敏感认证信息
  passwordHash: '$2b$10$abcd1234...',
  salt: 'random_salt_value',
  totpSecret: 'JBSWY3DPEHPK3PXP',
  recoveryTokens: ['token1', 'token2', 'token3'],
  
  // 个人信息
  profile: {
    firstName: 'Alice',
    lastName: 'Wang',
    dateOfBirth: '1990-05-15',
    avatar: 'https://cdn.example.com/avatars/alice.jpg',
    bio: 'Senior Full-stack Developer',
    
    // 私人信息
    idNumber: '110101199005150001',
    passport: 'E12345678',
    address: {
      street: '123 Main Street',
      city: 'Beijing',
      zipCode: '100000',
      country: 'China'
    }
  },
  
  // 工作信息
  employment: {
    position: 'Senior Developer',
    department: 'Engineering',
    startDate: '2020-03-01',
    manager: 'john.doe@company.com',
    
    // 敏感工作信息
    salary: 250000,
    bonus: 50000,
    stockOptions: 1000,
    performanceRating: 'Exceeds Expectations'
  },
  
  // 系统信息
  metadata: {
    createdAt: '2020-03-01T00:00:00Z',
    updatedAt: '2023-12-01T10:30:00Z',
    lastLoginAt: '2023-12-08T09:15:00Z',
    loginCount: 1247,
    
    // 内部系统字段
    internalNotes: 'High performer, promote next cycle',
    riskScore: 0.1,
    complianceFlags: ['background_check_passed']
  }
}

// 不同角色看到的用户信息

// 1. 公开 API - 只返回基本公开信息
const publicProfile = pickFieldsSuper(fullUserRecord, [
  // 排除所有敏感和私人信息
  'passwordHash', 'salt', 'totpSecret', 'recoveryTokens',
  'profile.dateOfBirth', 'profile.idNumber', 'profile.passport', 'profile.address',
  'employment.salary', 'employment.bonus', 'employment.stockOptions', 'employment.performanceRating',
  'metadata.internalNotes', 'metadata.riskScore', 'metadata.complianceFlags'
], true)

// 2. 同事查看 - 可以看到工作相关信息，但不包含薪资和个人隐私
const colleagueView = pickFieldsSuper(fullUserRecord, [
  'passwordHash', 'salt', 'totpSecret', 'recoveryTokens',
  'profile.dateOfBirth', 'profile.idNumber', 'profile.passport', 'profile.address',
  'employment.salary', 'employment.bonus', 'employment.stockOptions', 'employment.performanceRating',
  'metadata.internalNotes', 'metadata.riskScore', 'metadata.complianceFlags'
], true)

// 3. HR 查看 - 可以看到薪资信息，但不能看到技术认证信息
const hrView = pickFieldsSuper(fullUserRecord, [
  'passwordHash', 'salt', 'totpSecret', 'recoveryTokens',
  'metadata.riskScore', 'metadata.complianceFlags'
], true)

// 4. 用户自己查看 - 可以看到大部分信息，但不包含系统内部字段
const selfView = pickFieldsSuper(fullUserRecord, [
  'passwordHash', 'salt', 'totpSecret', 'recoveryTokens',
  'metadata.internalNotes', 'metadata.riskScore', 'metadata.complianceFlags'
], true)
```

##### 数组数据过滤

```typescript
const employeeList = [
  {
    id: 'EMP_001',
    name: 'Alice Wang',
    position: 'Senior Developer',
    email: 'alice@company.com',
    phone: '+86-138-0001',
    
    // 敏感信息
    salary: 180000,
    socialSecurity: '123-45-6789',
    emergencyContact: {
      name: 'Alice Mother',
      relationship: 'Mother',
      phone: '+86-138-0002'
    },
    performance: {
      rating: 'Excellent',
      goals: ['Learn AI/ML', 'Mentor junior developers'],
      feedback: 'Outstanding technical skills and leadership'
    }
  },
  {
    id: 'EMP_002', 
    name: 'Bob Chen',
    position: 'Product Manager',
    email: 'bob@company.com',
    phone: '+86-138-0003',
    
    salary: 160000,
    socialSecurity: '987-65-4321',
    emergencyContact: {
      name: 'Bob Wife',
      relationship: 'Spouse',
      phone: '+86-138-0004'
    },
    performance: {
      rating: 'Good',
      goals: ['Improve market analysis', 'Launch new product'],
      feedback: 'Strong product vision, needs better stakeholder communication'
    }
  }
]

// 生成员工通讯录 - 排除所有敏感信息
const employeeDirectory = pickFieldsSuper(employeeList, [
  '[].salary',                    // 排除薪资
  '[].socialSecurity',            // 排除社会保障号
  '[].emergencyContact',          // 排除紧急联系人
  '[].performance'                // 排除绩效信息
], true)

// 结果: [
//   {
//     id: 'EMP_001',
//     name: 'Alice Wang', 
//     position: 'Senior Developer',
//     email: 'alice@company.com',
//     phone: '+86-138-0001'
//   },
//   {
//     id: 'EMP_002',
//     name: 'Bob Chen',
//     position: 'Product Manager', 
//     email: 'bob@company.com',
//     phone: '+86-138-0003'
//   }
// ]

// 生成绩效报告 - 只排除个人隐私，保留工作相关信息
const performanceReport = pickFieldsSuper(employeeList, [
  '[].socialSecurity',            // 排除社会保障号
  '[].emergencyContact',          // 排除紧急联系人信息
  '[].phone'                      // 排除个人电话
], true)

// HR 安全视图 - 可以看到薪资但不能看到个人隐私
const hrSafeView = pickFieldsSuper(employeeList, [
  '[].socialSecurity',            // 排除社会保障号
  '[].emergencyContact.phone'     // 排除紧急联系人电话，但保留姓名和关系
], true)
```

##### 配置文件安全化

```typescript
const fullConfig = {
  app: {
    name: 'MyApp',
    version: '1.2.3',
    environment: 'production',
    debug: false,
    features: {
      newUserRegistration: true,
      advancedAnalytics: true,
      betaFeatures: false
    }
  },
  
  database: {
    host: 'prod-db.company.com',
    port: 5432,
    database: 'myapp_production',
    
    // 敏感数据库信息
    username: 'db_admin',
    password: 'super_secret_db_password',
    ssl: {
      enabled: true,
      cert: '/path/to/production.crt',
      key: '/path/to/production.key',
      ca: '/path/to/ca.crt'
    }
  },
  
  redis: {
    host: 'redis.company.com',
    port: 6379,
    database: 0,
    
    // 敏感 Redis 信息
    password: 'redis_auth_password'
  },
  
  security: {
    cors: {
      origin: ['https://myapp.com', 'https://admin.myapp.com'],
      credentials: true
    },
    rateLimiting: {
      enabled: true,
      maxRequests: 1000,
      windowMs: 60000
    },
    
    // 高度敏感的安全配置
    jwtSecret: 'jwt_super_secret_signing_key',
    encryptionKey: 'aes_256_encryption_master_key',
    apiKeys: {
      stripe: 'sk_live_abcd1234...',
      sendgrid: 'SG.xyz789...',
      aws: 'AKIA1234567890ABCDEF'
    }
  },
  
  external: {
    payment: {
      provider: 'stripe',
      currency: 'USD',
      
      // 敏感支付配置
      webhookSecret: 'whsec_stripe_webhook_secret'
    },
    
    monitoring: {
      enabled: true,
      provider: 'datadog',
      
      // 敏感监控配置
      apiKey: 'dd_api_key_secret'
    }
  }
}

// 生成客户端安全配置 - 排除所有敏感信息
const clientSafeConfig = pickFieldsSuper(fullConfig, [
  // 排除所有密码和密钥
  'database.username',
  'database.password', 
  'database.ssl',
  'redis.password',
  'security.jwtSecret',
  'security.encryptionKey',
  'security.apiKeys',
  'external.payment.webhookSecret',
  'external.monitoring.apiKey'
], true)

// 开发环境配置 - 保留连接信息但隐藏生产密钥
const devConfig = pickFieldsSuper(fullConfig, [
  'database.password',            // 开发环境使用不同密码
  'security.jwtSecret',           // 开发环境使用测试密钥
  'security.encryptionKey',       // 开发环境使用测试密钥
  'security.apiKeys',             // 开发环境使用测试API密钥
  'external.payment.webhookSecret', // 开发环境使用测试webhook
  'external.monitoring.apiKey'    // 开发环境使用不同监控密钥
], true)

// 监控系统配置 - 只需要连接信息，不需要认证密钥
const monitoringConfig = pickFieldsSuper(fullConfig, [
  'database.username',
  'database.password',
  'database.ssl', 
  'redis.password',
  'security.jwtSecret',
  'security.encryptionKey',
  'security.apiKeys',
  'external.payment.webhookSecret'
], true)
```

##### 日志数据清理

```typescript
const applicationLog = {
  timestamp: '2023-12-08T10:30:00Z',
  level: 'INFO',
  service: 'auth-service',
  traceId: 'trace-12345',
  spanId: 'span-67890',
  
  message: 'User login successful',
  
  context: {
    userId: 'USER_789',
    username: 'alice_wang',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    ip: '192.168.1.100',
    
    // 敏感认证信息 - 不应该出现在日志中
    password: 'user_entered_password',
    sessionToken: 'sess_abcd1234efgh5678',
    refreshToken: 'rf_xyz789uvw012',
    apiKey: 'sk_live_sensitive_key'
  },
  
  request: {
    method: 'POST',
    url: '/api/auth/login',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      
      // 敏感请求头
      'authorization': 'Bearer sensitive_access_token',
      'x-api-key': 'api_key_should_not_be_logged'
    },
    
    body: {
      username: 'alice_wang',
      
      // 敏感请求体
      password: 'plain_text_password',
      totpCode: '123456'
    }
  },
  
  response: {
    status: 200,
    headers: {
      'content-type': 'application/json'
    },
    
    body: {
      success: true,
      userId: 'USER_789',
      
      // 敏感响应数据
      accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...',
      refreshToken: 'rf_new_refresh_token_value'
    }
  }
}

// 清理日志 - 移除所有敏感信息
const sanitizedLog = pickFieldsSuper(applicationLog, [
  // 移除敏感的上下文信息
  'context.password',
  'context.sessionToken', 
  'context.refreshToken',
  'context.apiKey',
  
  // 移除敏感的请求头
  'request.headers.authorization',
  'request.headers.x-api-key',
  
  // 移除敏感的请求体
  'request.body.password',
  'request.body.totpCode',
  
  // 移除敏感的响应数据
  'response.body.accessToken',
  'response.body.refreshToken'
], true)

// 结果：清理后的日志保留了调试所需的信息，但移除了所有敏感数据
```

##### 通配符排除

```typescript
const complexUserData = {
  publicInfo: {
    name: 'Alice Wang',
    bio: 'Software Engineer',
    avatar: 'https://avatar.url'
  },
  
  contactInfo: {
    workEmail: 'alice@company.com',
    personalEmail: 'alice.personal@gmail.com',
    workPhone: '+86-138-0001',
    personalPhone: '+86-139-0001',
    address: {
      work: '123 Office Street',
      home: '456 Home Street'
    }
  },
  
  preferences: {
    publicSettings: {
      theme: 'dark',
      language: 'zh-CN'
    },
    privateSettings: {
      autoSave: true,
      notifications: false,
      personalNotes: 'My private thoughts...'
    }
  },
  
  socialAccounts: {
    github: {
      username: 'alice-dev',
      publicRepos: 42,
      privateToken: 'ghp_secret_token_123'
    },
    linkedin: {
      profile: 'alice-wang-dev',
      connections: 500,
      accessToken: 'linkedin_oauth_token_456'
    }
  }
}

// 使用通配符排除所有包含 "private" 的字段
const noPrivateData = pickFieldsSuper(complexUserData, [
  '**private*',                   // 排除所有包含 private 的字段
  '**Token',                      // 排除所有 Token 结尾的字段
  '**personalEmail',              // 排除个人邮箱
  '**personalPhone',              // 排除个人电话
  '**address.home'                // 排除家庭地址
], true)

// 排除所有深层嵌套的敏感字段
const publicSafeData = pickFieldsSuper(complexUserData, [
  '**Token',                      // 所有令牌
  '**personal*',                  // 所有个人相关信息
  '**private*',                   // 所有私人信息
  '**Notes'                       // 所有笔记
], true)
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

// 排除数组中所有元素的 password 字段
const safeUsers = pickFieldsSuper(users, ['[].password'], true)
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

#### 排除模式 (exclude = true)

当 `exclude` 参数设置为 `true` 时，`mergeFieldsSuper` 会合并除指定字段外的所有字段。这在需要保护某些字段不被覆盖时非常有用。

##### 保护系统字段 - 防止意外覆盖

```typescript
const originalRecord = {
  id: 'USER_001',
  createdAt: '2023-01-15T08:30:00Z',
  createdBy: 'system',
  version: 1,
  metadata: {
    hash: 'abc123def456',
    signature: 'encrypted_signature',
    internalFlags: {
      isVerified: true,
      migrationStatus: 'completed'
    }
  },
  userData: {
    name: 'Alice Wang',
    email: 'alice@company.com',
    department: 'Engineering',
    settings: {
      theme: 'dark',
      notifications: true
    }
  }
}

const userUpdate = {
  id: 'HACKED_ID',                   // 恶意尝试修改ID
  createdAt: '2023-12-01T10:00:00Z', // 尝试修改创建时间
  version: 999,                      // 尝试修改版本号
  metadata: {
    hash: 'malicious_hash',          // 尝试修改哈希
    signature: 'fake_signature',     // 尝试修改签名
    internalFlags: {
      isVerified: false,             // 尝试修改验证状态
      migrationStatus: 'pending'
    }
  },
  userData: {
    name: 'Alice Wang (Updated)',     // 合法的用户数据更新
    email: 'alice.new@company.com',
    department: 'Product',
    settings: {
      theme: 'light',
      notifications: false,
      language: 'en'                 // 新增设置
    }
  }
}

// 安全合并：保护系统字段，只允许更新用户数据
const protectedMerge = mergeFieldsSuper(originalRecord, userUpdate, [
  'id',                              // 保护ID不被修改
  'createdAt',                       // 保护创建时间
  'createdBy',                       // 保护创建者
  'version',                         // 保护版本号
  'metadata.hash',                   // 保护数据哈希
  'metadata.signature',              // 保护数字签名
  'metadata.internalFlags.isVerified' // 保护验证状态
], true)

// 结果：只有 userData 部分被更新，所有系统字段保持原值
```

##### 数据库更新 - 保护主键和审计字段

```typescript
const currentProduct = {
  id: 'PROD_12345',                 // 主键，不可修改
  sku: 'IPH15-128-BLK',             // SKU，不可修改
  name: 'iPhone 15 128GB Black',
  price: 999.99,
  description: 'Latest iPhone model',
  audit: {
    createdAt: '2023-10-01T00:00:00Z',  // 审计字段，不可修改
    createdBy: 'admin',                 // 审计字段，不可修改
    updatedAt: '2023-11-15T10:30:00Z',  // 由系统自动更新
    updatedBy: 'product_manager',       // 由系统自动更新
    version: 3                          // 版本控制，由系统管理
  },
  inventory: {
    stock: 100,
    warehouse: 'WH-001',
    lastStockUpdate: '2023-11-15T10:30:00Z' // 系统字段
  },
  category: 'Electronics',
  tags: ['smartphone', 'premium'],
  isActive: true
}

const productUpdate = {
  name: 'iPhone 15 128GB Black (Limited Edition)',
  price: 1099.99,                   // 价格更新
  description: 'Latest iPhone model with exclusive design',
  inventory: {
    stock: 85,                      // 库存更新
    warehouse: 'WH-002',            // 仓库变更
    lastStockUpdate: '2023-12-01T14:00:00Z', // 试图修改系统时间戳
    reservedStock: 15               // 新增字段
  },
  tags: ['smartphone', 'premium', 'limited'],
  promotionPrice: 999.99,           // 新增促销价格
  // 恶意尝试修改不可变字段
  id: 'MODIFIED_ID',
  sku: 'MODIFIED_SKU',
  audit: {
    createdAt: '2023-12-01T00:00:00Z',
    createdBy: 'hacker',
    version: 999
  }
}

// 安全更新：保护主键、SKU、审计字段和系统时间戳
const safeProductUpdate = mergeFieldsSuper(currentProduct, productUpdate, [
  'id',                             // 保护主键
  'sku',                            // 保护SKU
  'audit.createdAt',                // 保护创建时间
  'audit.createdBy',                // 保护创建者
  'audit.updatedAt',                // 保护更新时间（由系统控制）
  'audit.updatedBy',                // 保护更新者（由系统控制）
  'audit.version',                  // 保护版本号（由系统控制）
  'inventory.lastStockUpdate'       // 保护库存更新时间戳
], true)

// 结果：产品信息被更新，但所有受保护的字段保持原值
```

##### 配置合并 - 保护敏感配置

```typescript
const currentConfig = {
  database: {
    host: 'prod-db.company.com',
    port: 5432,
    database: 'myapp_production',
    username: 'app_user',
    password: 'super_secret_password',    // 敏感信息
    ssl: {
      enabled: true,
      cert: '/path/to/prod.crt',          // 敏感路径
      key: '/path/to/prod.key'            // 敏感路径
    },
    connectionPool: {
      min: 5,
      max: 20,
      acquireTimeoutMillis: 30000
    }
  },
  redis: {
    host: 'prod-redis.company.com',
    port: 6379,
    password: 'redis_secret_key',         // 敏感信息
    db: 0
  },
  security: {
    jwtSecret: 'jwt_super_secret_key',    // 高度敏感
    encryptionKey: 'aes_encryption_key',  // 高度敏感
    sessionTimeout: 3600,
    rateLimiting: {
      enabled: true,
      maxRequests: 1000,
      windowMs: 60000
    }
  },
  features: {
    enableDebug: false,
    enableMetrics: true,
    maintenanceMode: false,
    newUserRegistration: true
  },
  external: {
    paymentGateway: {
      apiKey: 'payment_api_secret',       // 敏感API密钥
      webhookSecret: 'webhook_secret',    // 敏感webhook密钥
      environment: 'production'
    }
  }
}

const configUpdate = {
  database: {
    // 尝试修改敏感的数据库配置
    host: 'hacker-db.evil.com',
    username: 'hacker',
    password: 'hacked_password',
    ssl: {
      cert: '/tmp/malicious.crt',
      key: '/tmp/malicious.key'
    },
    connectionPool: {
      min: 10,                            // 合法的连接池调整
      max: 50,
      acquireTimeoutMillis: 45000
    }
  },
  redis: {
    password: 'compromised_redis_key',
    db: 1                                 // 合法的数据库选择
  },
  security: {
    jwtSecret: 'compromised_jwt',
    encryptionKey: 'weak_key',
    sessionTimeout: 7200,                 // 合法的超时设置
    rateLimiting: {
      maxRequests: 2000,                  // 合法的限流调整
      windowMs: 120000
    }
  },
  features: {
    enableDebug: true,                    // 合法的功能开关
    enableMetrics: false,
    newUserRegistration: false
  },
  external: {
    paymentGateway: {
      apiKey: 'stolen_api_key',
      webhookSecret: 'stolen_webhook',
      environment: 'development'          // 合法的环境切换
    }
  }
}

// 安全配置更新：保护所有密码、密钥、证书等敏感信息
const secureConfigUpdate = mergeFieldsSuper(currentConfig, configUpdate, [
  'database.host',                        // 保护数据库主机
  'database.username',                    // 保护数据库用户名
  'database.password',                    // 保护数据库密码
  'database.ssl.cert',                    // 保护SSL证书路径
  'database.ssl.key',                     // 保护SSL密钥路径
  'redis.password',                       // 保护Redis密码
  'security.jwtSecret',                   // 保护JWT密钥
  'security.encryptionKey',               // 保护加密密钥
  'external.paymentGateway.apiKey',       // 保护支付API密钥
  'external.paymentGateway.webhookSecret' // 保护Webhook密钥
], true)

// 结果：只有非敏感的配置项被更新，所有密钥和敏感信息保持不变
```

##### 用户资料更新 - 保护身份验证信息

```typescript
const userProfile = {
  id: 'USER_789',
  authentication: {
    email: 'user@company.com',           // 需要验证流程才能修改
    phoneVerified: true,                 // 系统验证状态
    emailVerified: true,                 // 系统验证状态
    twoFactorEnabled: true,              // 安全设置
    lastPasswordChange: '2023-10-01T00:00:00Z',
    failedLoginAttempts: 0,              // 安全计数器
    accountLocked: false,                // 安全状态
    passwordHash: '$2b$10$...',          // 敏感哈希
    recoveryTokens: ['token1', 'token2'] // 敏感恢复令牌
  },
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    displayName: 'John D.',
    bio: 'Software Engineer',
    avatar: 'https://example.com/avatar.jpg',
    preferences: {
      theme: 'dark',
      language: 'en',
      timezone: 'UTC+8',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    }
  },
  professional: {
    title: 'Senior Developer',
    department: 'Engineering',
    manager: 'alice@company.com',
    startDate: '2022-03-01',
    skills: ['JavaScript', 'Python', 'Docker']
  }
}

const profileUpdate = {
  authentication: {
    // 恶意尝试修改身份验证相关信息
    email: 'hacker@evil.com',
    phoneVerified: false,
    emailVerified: false,
    twoFactorEnabled: false,
    failedLoginAttempts: 0,
    accountLocked: false,
    passwordHash: 'weak_hash',
    recoveryTokens: ['malicious_token']
  },
  profile: {
    firstName: 'John',
    lastName: 'Smith',                   // 合法的姓名更新
    displayName: 'John Smith',
    bio: 'Senior Software Engineer',     // 合法的简介更新
    avatar: 'https://newsite.com/new-avatar.jpg',
    preferences: {
      theme: 'light',                    // 合法的偏好设置
      language: 'zh-CN',
      timezone: 'UTC+8',
      notifications: {
        email: false,
        push: true,
        sms: true
      }
    }
  },
  professional: {
    title: 'Tech Lead',                  // 合法的职位更新
    skills: ['JavaScript', 'Python', 'Docker', 'Kubernetes'] // 技能更新
  }
}

// 安全的资料更新：保护所有身份验证和安全相关字段
const safeProfileUpdate = mergeFieldsSuper(userProfile, profileUpdate, [
  'id',                                  // 保护用户ID
  'authentication'                       // 保护整个身份验证对象
], true)

// 或者更精确地保护特定的身份验证字段
const preciseProfileUpdate = mergeFieldsSuper(userProfile, profileUpdate, [
  'id',
  'authentication.email',               // 邮箱需要通过验证流程修改
  'authentication.phoneVerified',       // 系统验证状态
  'authentication.emailVerified',       // 系统验证状态
  'authentication.twoFactorEnabled',    // 需要特殊权限修改
  'authentication.lastPasswordChange',  // 系统记录
  'authentication.failedLoginAttempts', // 系统计数器
  'authentication.accountLocked',       // 系统安全状态
  'authentication.passwordHash',        // 密码哈希
  'authentication.recoveryTokens'       // 恢复令牌
], true)

// 结果：用户可以更新个人资料和职业信息，但不能修改身份验证相关的安全字段
```

##### 数组元素的选择性更新

```typescript
const teamData = {
  teams: [
    {
      id: 'TEAM_001',
      name: 'Frontend Team',
      lead: 'alice@company.com',
      members: [
        {
          id: 'EMP_001',
          name: 'Alice Wang',
          role: 'Tech Lead',
          salary: 120000,                // 敏感信息
          performance: 'A',              // 敏感信息
          personalNotes: 'Excellent',    // 敏感信息
          contact: {
            email: 'alice@company.com',
            phone: '+86-138-0000-0001',  // 个人隐私
            emergencyContact: 'Alice Mother' // 个人隐私
          }
        },
        {
          id: 'EMP_002', 
          name: 'Bob Chen',
          role: 'Senior Developer',
          salary: 100000,
          performance: 'B+',
          personalNotes: 'Good team player',
          contact: {
            email: 'bob@company.com',
            phone: '+86-138-0000-0002',
            emergencyContact: 'Bob Wife'
          }
        }
      ]
    },
    {
      id: 'TEAM_002',
      name: 'Backend Team', 
      lead: 'charlie@company.com',
      members: [
        {
          id: 'EMP_003',
          name: 'Charlie Liu',
          role: 'Tech Lead',
          salary: 125000,
          performance: 'A+',
          personalNotes: 'Outstanding leadership',
          contact: {
            email: 'charlie@company.com',
            phone: '+86-138-0000-0003',
            emergencyContact: 'Charlie Father'
          }
        }
      ]
    }
  ]
}

const teamUpdate = {
  teams: [
    {
      id: 'TEAM_001',
      name: 'Frontend Engineering Team',  // 合法的团队名称更新
      members: [
        {
          id: 'EMP_001',
          name: 'Alice Wang',
          role: 'Principal Engineer',      // 合法的角色更新
          salary: 999999,                  // 尝试修改薪资
          performance: 'F',                // 尝试修改绩效
          personalNotes: 'Needs improvement', // 尝试修改个人笔记
          contact: {
            email: 'alice.new@company.com', // 合法的邮箱更新
            phone: 'HACKED',               // 尝试修改个人电话
            emergencyContact: 'Hacker'     // 尝试修改紧急联系人
          }
        },
        {
          id: 'EMP_002',
          role: 'Staff Engineer',          // 合法的角色更新
          salary: 888888,                  // 尝试修改薪资
          performance: 'A+++',             // 尝试修改绩效
          contact: {
            email: 'bob.new@company.com'   // 合法的邮箱更新
          }
        }
      ]
    }
  ]
}

// 团队数据更新：保护薪资、绩效、个人隐私等敏感信息
const secureTeamUpdate = mergeFieldsSuper(teamData, teamUpdate, [
  'teams[].members[].salary',            // 保护薪资信息
  'teams[].members[].performance',       // 保护绩效评估
  'teams[].members[].personalNotes',     // 保护个人评价
  'teams[].members[].contact.phone',     // 保护个人电话
  'teams[].members[].contact.emergencyContact' // 保护紧急联系人
], true)

// 结果：团队和角色信息可以更新，工作邮箱可以更新，但薪资、绩效、个人隐私信息保持不变
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
