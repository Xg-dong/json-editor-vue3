<template>
  <div class="utils-example">
    <el-card class="demo-card">
      <template #header>
        <h2>工具函数演示</h2>
        <p>展示 JSON Editor 提供的各种工具函数功能</p>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <template #header>
              <h3>字段裁剪 (pickFields)</h3>
            </template>

            <div class="function-demo">
              <h4>原始数据:</h4>
              <JsonEditor v-model="pickFieldsData" :height="200" :readonly="true" />

              <div class="controls">
                <h4>选择要操作的字段:</h4>
                <el-checkbox-group v-model="selectedPickFields">
                  <el-checkbox v-for="field in availablePickFields" :key="field" :value="field">
                    {{ field }}
                  </el-checkbox>
                </el-checkbox-group>

                <div class="operation-mode mt-10">
                  <el-radio-group v-model="pickExcludeMode">
                    <el-radio :value="false">保留模式 (只保留选中字段)</el-radio>
                    <el-radio :value="true">排除模式 (排除选中字段)</el-radio>
                  </el-radio-group>
                </div>

                <el-button type="primary" @click="executePick" class="mt-10"> 执行裁剪 </el-button>
              </div>

              <div v-if="pickResult">
                <h4>裁剪结果:</h4>
                <JsonEditor v-model="pickResult" :height="150" :readonly="true" />
                <div class="result-info">
                  <el-tag :type="pickExcludeMode ? 'warning' : 'success'">
                    {{ pickExcludeMode ? '排除模式' : '保留模式' }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card>
            <template #header>
              <h3>深度字段裁剪 (pickFieldsDeep)</h3>
            </template>

            <div class="function-demo">
              <div class="controls">
                <h4>字段路径 (支持嵌套):</h4>
                <el-input
                  v-model="deepPickPath"
                  placeholder="如: user.profile.name"
                  @keyup.enter="addDeepPickPath"
                />
                <el-button size="small" @click="addDeepPickPath" class="mt-5"> 添加路径 </el-button>

                <div class="path-list mt-10">
                  <el-tag
                    v-for="(path, index) in deepPickPaths"
                    :key="index"
                    closable
                    @close="removeDeepPickPath(index)"
                    class="mr-5 mb-5"
                  >
                    {{ path }}
                  </el-tag>
                </div>

                <div class="operation-mode mt-10">
                  <el-radio-group v-model="deepPickExcludeMode">
                    <el-radio :value="false">保留模式</el-radio>
                    <el-radio :value="true">排除模式</el-radio>
                  </el-radio-group>
                </div>

                <el-button type="primary" @click="executeDeepPick" class="mt-10">
                  执行深度裁剪
                </el-button>
              </div>

              <div v-if="deepPickResult">
                <h4>深度裁剪结果:</h4>
                <JsonEditor v-model="deepPickResult" :height="200" :readonly="true" />
                <div class="result-info">
                  <el-tag :type="deepPickExcludeMode ? 'warning' : 'success'">
                    {{ deepPickExcludeMode ? '排除模式' : '保留模式' }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mt-20">
        <el-col :span="12">
          <el-card>
            <template #header>
              <h3>对象合并 (mergeObjects)</h3>
            </template>

            <div class="function-demo">
              <h4>对象A:</h4>
              <JsonEditor v-model="mergeObjectA" :height="150" />

              <h4 class="mt-10">对象B:</h4>
              <JsonEditor v-model="mergeObjectB" :height="150" />

              <div class="controls">
                <h4>合并字段选择:</h4>
                <el-checkbox-group v-model="selectedMergeFields">
                  <el-checkbox v-for="field in availableMergeFields" :key="field" :value="field">
                    {{ field }}
                  </el-checkbox>
                </el-checkbox-group>

                <div class="operation-mode mt-10">
                  <el-radio-group v-model="mergeExcludeMode">
                    <el-radio :value="false">包含模式 (只合并选中字段)</el-radio>
                    <el-radio :value="true">排除模式 (合并除选中字段外的所有字段)</el-radio>
                  </el-radio-group>
                </div>

                <el-button type="primary" @click="executeMerge" class="mt-10"> 合并对象 </el-button>
              </div>

              <div v-if="mergeResult">
                <h4>合并结果:</h4>
                <JsonEditor v-model="mergeResult" :height="150" :readonly="true" />
                <div class="result-info">
                  <el-tag :type="mergeExcludeMode ? 'warning' : 'success'">
                    {{ mergeExcludeMode ? '排除模式' : '包含模式' }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card>
            <template #header>
              <h3>路径操作工具</h3>
            </template>

            <div class="function-demo">
              <h4>测试数据:</h4>
              <JsonEditor v-model="pathTestData" :height="120" :readonly="true" />

              <div class="controls">
                <h4>测试路径:</h4>
                <el-input v-model="testPath" placeholder="如: user.profile.settings[0].name" />

                <el-button type="primary" @click="testGetValueByPath" class="mt-10">
                  获取路径值
                </el-button>
                <el-button type="success" @click="collectAllPathsHandler" class="mt-10">
                  收集所有路径
                </el-button>
              </div>

              <div v-if="pathValue !== undefined" class="result-box">
                <h4>路径值:</h4>
                <pre>{{ JSON.stringify(pathValue, null, 2) }}</pre>
              </div>

              <div v-if="allPaths.length > 0" class="result-box">
                <h4>所有路径:</h4>
                <div class="path-tags">
                  <el-tag
                    v-for="path in allPaths"
                    :key="path"
                    class="mr-5 mb-5"
                    @click="testPath = path"
                    style="cursor: pointer"
                  >
                    {{ path }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mt-20">
        <el-col :span="24">
          <el-card>
            <template #header>
              <h3>批量操作演示</h3>
            </template>

            <div class="function-demo">
              <el-row :gutter="20">
                <el-col :span="8">
                  <h4>数据集合:</h4>
                  <JsonEditor v-model="batchData" :height="300" />
                </el-col>

                <el-col :span="8">
                  <div class="batch-controls">
                    <h4>批量操作:</h4>

                    <el-card class="operation-card">
                      <h5>1. 批量字段裁剪</h5>
                      <el-input v-model="batchPickFields" placeholder="字段名，用逗号分隔" />
                      <div class="mt-5">
                        <el-radio-group v-model="batchPickExcludeMode" size="small">
                          <el-radio :value="false">保留</el-radio>
                          <el-radio :value="true">排除</el-radio>
                        </el-radio-group>
                      </div>
                      <el-button size="small" @click="executeBatchPick" class="mt-5">
                        批量裁剪
                      </el-button>
                    </el-card>

                    <el-card class="operation-card mt-10">
                      <h5>2. 批量深度裁剪</h5>
                      <el-input v-model="batchDeepPaths" placeholder="路径，用逗号分隔" />
                      <div class="mt-5">
                        <el-radio-group v-model="batchDeepExcludeMode" size="small">
                          <el-radio :value="false">保留</el-radio>
                          <el-radio :value="true">排除</el-radio>
                        </el-radio-group>
                      </div>
                      <el-button size="small" @click="executeBatchDeepPick" class="mt-5">
                        批量深度裁剪
                      </el-button>
                    </el-card>

                    <el-card class="operation-card mt-10">
                      <h5>3. 批量路径值提取</h5>
                      <el-input v-model="batchExtractPath" placeholder="提取路径" />
                      <el-button size="small" @click="executeBatchExtract" class="mt-5">
                        批量提取
                      </el-button>
                    </el-card>

                    <el-card class="operation-card mt-10">
                      <h5>4. 批量安全合并演示</h5>
                      <el-input v-model="batchMergeFields" placeholder="合并字段，用逗号分隔" />
                      <div class="mt-5">
                        <el-radio-group v-model="batchMergeExcludeMode" size="small">
                          <el-radio :value="false">包含</el-radio>
                          <el-radio :value="true">排除</el-radio>
                        </el-radio-group>
                      </div>
                      <el-button size="small" @click="executeBatchSecureMerge" class="mt-5">
                        批量安全合并
                      </el-button>
                    </el-card>
                  </div>
                </el-col>

                <el-col :span="8">
                  <h4>操作结果:</h4>
                  <JsonEditor v-model="batchResult" :height="300" :readonly="true" />
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mt-20">
        <el-col :span="24">
          <el-card>
            <template #header>
              <h3>Exclude 模式使用场景演示</h3>
            </template>

            <div class="function-demo">
              <el-row :gutter="20">
                <el-col :span="8">
                  <h4>用户资料数据:</h4>
                  <JsonEditor v-model="securityDemoData" :height="300" />
                </el-col>

                <el-col :span="8">
                  <h4>安全场景演示:</h4>

                  <el-card class="operation-card">
                    <h5>1. 保护敏感信息</h5>
                    <p class="demo-description">排除密码、内部ID等敏感字段</p>
                    <el-button size="small" @click="executeSecurityFilter" class="mt-5">
                      过滤敏感信息
                    </el-button>
                  </el-card>

                  <el-card class="operation-card mt-10">
                    <h5>2. 安全更新演示</h5>
                    <p class="demo-description">合并用户更新，但保护系统字段</p>
                    <el-button size="small" @click="executeSecureUpdate" class="mt-5">
                      安全更新
                    </el-button>
                  </el-card>

                  <el-card class="operation-card mt-10">
                    <h5>3. API响应清理</h5>
                    <p class="demo-description">移除内部字段，只返回公开信息</p>
                    <el-button size="small" @click="executeApiCleanup" class="mt-5">
                      清理API响应
                    </el-button>
                  </el-card>
                </el-col>

                <el-col :span="8">
                  <h4>安全操作结果:</h4>
                  <JsonEditor v-model="securityResult" :height="300" :readonly="true" />
                  <div v-if="securityResultInfo" class="result-info mt-10">
                    <el-alert
                      :title="securityResultInfo.title"
                      :description="securityResultInfo.description"
                      type="info"
                      show-icon
                    />
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import JsonEditor from '../../../src/JsonEditor.vue'
import {
  pickFieldsSuper,
  mergeFieldsSuper,
  getValueByPath,
  collectAllPaths,
} from '../../../src/utils/index'
import { ElMessage } from 'element-plus'
import type { Ref } from 'vue'

// 字段裁剪演示
const pickFieldsData = ref({
  id: 1,
  name: '张三',
  age: 30,
  email: 'zhangsan@example.com',
  phone: '13800138000',
  address: '北京市朝阳区',
  department: '技术部',
  salary: 15000,
  createTime: '2024-01-01',
  updateTime: '2024-01-09',
})

const availablePickFields = computed(() => Object.keys(pickFieldsData.value))
const selectedPickFields = ref(['name', 'email', 'department'])
const pickExcludeMode = ref(false)
const pickResult = ref<any>(null)

// 深度字段裁剪演示
const deepPickPath = ref('')
const deepPickPaths = ref(['user.name', 'user.profile.bio', 'settings.theme'])
const deepPickExcludeMode = ref(false)
const deepPickResult = ref<any>(null)

const deepPickData = ref({
  user: {
    id: 1,
    name: '李四',
    age: 28,
    profile: {
      bio: '前端开发工程师',
      avatar: 'avatar.jpg',
      skills: ['Vue', 'React', 'TypeScript'],
      social: {
        github: 'lisi',
        twitter: '@lisi',
      },
    },
  },
  settings: {
    theme: 'dark',
    language: 'zh-CN',
    notifications: {
      email: true,
      push: false,
    },
  },
  metadata: {
    version: '1.0.0',
    lastLogin: '2024-01-09',
  },
})

// 对象合并演示
const mergeObjectA = ref({
  name: '张三',
  age: 30,
  skills: ['JavaScript', 'Vue'],
  config: {
    theme: 'light',
    language: 'zh-CN',
  },
})

const mergeObjectB = ref({
  email: 'zhangsan@example.com',
  age: 31,
  skills: ['TypeScript', 'React'],
  config: {
    notifications: true,
    timezone: 'Asia/Shanghai',
  },
})

const availableMergeFields = computed(() => {
  const allPaths = Array.from(
    new Set([...collectAllPaths(mergeObjectA.value), ...collectAllPaths(mergeObjectB.value)])
  )
  return allPaths
})

const selectedMergeFields = ref(['name', 'age', 'config.theme'])
const mergeExcludeMode = ref(false)
const mergeResult = ref<any>(null)

// 路径操作演示
const pathTestData = ref({
  user: {
    profile: {
      name: '王五',
      settings: [
        { name: 'theme', value: 'dark' },
        { name: 'language', value: 'zh-CN' },
      ],
    },
  },
  data: {
    items: ['item1', 'item2', 'item3'],
    count: 3,
  },
})

const testPath = ref('user.profile.name')
const pathValue = ref<any>(undefined)
const allPaths: Ref<string[]> = ref([])

// 批量操作演示
const batchData = ref([
  {
    id: 1,
    name: '用户1',
    email: 'user1@example.com',
    department: '技术部',
    salary: 15000,
    password: 'secret123',
  },
  {
    id: 2,
    name: '用户2',
    email: 'user2@example.com',
    department: '产品部',
    salary: 12000,
    password: 'secret456',
  },
  {
    id: 3,
    name: '用户3',
    email: 'user3@example.com',
    department: '设计部',
    salary: 13000,
    password: 'secret789',
  },
])

const batchPickFields = ref('name,email,department')
const batchPickExcludeMode = ref(false)
const batchDeepPaths = ref('name,email')
const batchDeepExcludeMode = ref(false)
const batchExtractPath = ref('name')
const batchMergeFields = ref('password,salary')
const batchMergeExcludeMode = ref(true)
const batchResult = ref<any[]>([])

// 安全场景演示
const securityDemoData = ref({
  id: 'USER_001',
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  password: 'hashed_password_123',
  internalId: 'INTERNAL_12345',
  role: 'user',
  permissions: ['read', 'write'],
  profile: {
    bio: '软件工程师',
    avatar: 'avatar.jpg',
    socialSecurityNumber: '123-45-6789',
    bankAccount: '6225-8888-9999-0000',
  },
  system: {
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-09T10:30:00Z',
    loginCount: 156,
    lastLoginIP: '192.168.1.100',
  },
})

const securityResult = ref<any>(null)
const securityResultInfo = ref<any>(null)

// 执行字段裁剪
function executePick() {
  try {
    pickResult.value = pickFieldsSuper(
      pickFieldsData.value,
      selectedPickFields.value,
      pickExcludeMode.value
    )
    const mode = pickExcludeMode.value ? '排除' : '保留'
    ElMessage.success(`字段裁剪成功 (${mode}模式)`)
  } catch (error) {
    ElMessage.error('字段裁剪失败: ' + (error as Error).message)
  }
}

// 添加深度裁剪路径
function addDeepPickPath() {
  if (deepPickPath.value.trim() && !deepPickPaths.value.includes(deepPickPath.value.trim())) {
    deepPickPaths.value.push(deepPickPath.value.trim())
    deepPickPath.value = ''
  }
}

// 移除深度裁剪路径
function removeDeepPickPath(index: number) {
  deepPickPaths.value.splice(index, 1)
}

// 执行深度字段裁剪
function executeDeepPick() {
  try {
    deepPickResult.value = pickFieldsSuper(
      deepPickData.value,
      deepPickPaths.value,
      deepPickExcludeMode.value
    )
    const mode = deepPickExcludeMode.value ? '排除' : '保留'
    ElMessage.success(`深度字段裁剪成功 (${mode}模式)`)
  } catch (error) {
    ElMessage.error('深度裁剪失败: ' + (error as Error).message)
  }
}

// 执行对象合并
function executeMerge() {
  try {
    mergeResult.value = mergeFieldsSuper(
      mergeObjectA.value,
      mergeObjectB.value,
      selectedMergeFields.value,
      mergeExcludeMode.value
    )
    const mode = mergeExcludeMode.value ? '排除' : '包含'
    ElMessage.success(`对象合并成功 (${mode}模式)`)
  } catch (error) {
    ElMessage.error('对象合并失败: ' + (error as Error).message)
  }
}

// 测试获取路径值
function testGetValueByPath() {
  try {
    pathValue.value = getValueByPath(pathTestData.value, testPath.value)
    ElMessage.success('路径值获取成功')
  } catch (error) {
    ElMessage.error('路径值获取失败: ' + (error as Error).message)
  }
}

// 收集所有路径
function collectAllPathsHandler() {
  try {
    allPaths.value = collectAllPaths(pathTestData.value)
    ElMessage.success(`收集到 ${allPaths.value.length} 个路径`)
  } catch (error) {
    ElMessage.error('路径收集失败: ' + (error as Error).message)
  }
}

// 批量字段裁剪
function executeBatchPick() {
  try {
    const fields = batchPickFields.value
      .split(',')
      .map(s => s.trim())
      .filter(s => s)
    batchResult.value = batchData.value.map(item =>
      pickFieldsSuper(item, fields, batchPickExcludeMode.value)
    )
    const mode = batchPickExcludeMode.value ? '排除' : '保留'
    ElMessage.success(`批量字段裁剪成功 (${mode}模式)`)
  } catch (error) {
    ElMessage.error('批量字段裁剪失败: ' + (error as Error).message)
  }
}

// 批量深度裁剪
function executeBatchDeepPick() {
  try {
    const paths = batchDeepPaths.value
      .split(',')
      .map(s => s.trim())
      .filter(s => s)
    batchResult.value = batchData.value.map(item =>
      pickFieldsSuper(item, paths, batchDeepExcludeMode.value)
    )
    const mode = batchDeepExcludeMode.value ? '排除' : '保留'
    ElMessage.success(`批量深度裁剪成功 (${mode}模式)`)
  } catch (error) {
    ElMessage.error('批量深度裁剪失败: ' + (error as Error).message)
  }
}

// 批量路径值提取
function executeBatchExtract() {
  try {
    batchResult.value = batchData.value.map(item => ({
      original: item,
      extracted: getValueByPath(item, batchExtractPath.value),
    }))
    ElMessage.success('批量路径值提取成功')
  } catch (error) {
    ElMessage.error('批量路径值提取失败: ' + (error as Error).message)
  }
}

// 批量安全合并
function executeBatchSecureMerge() {
  try {
    const fields = batchMergeFields.value
      .split(',')
      .map(s => s.trim())
      .filter(s => s)

    // 模拟更新数据
    const updates = batchData.value.map(item => ({
      ...item,
      name: item.name + ' (已更新)',
      email: item.email.replace('@', '+updated@'),
      salary: item.salary + 1000,
      password: 'new_password_123',
    }))

    batchResult.value = batchData.value.map((item, index) =>
      mergeFieldsSuper(item, updates[index], fields, batchMergeExcludeMode.value)
    )

    const mode = batchMergeExcludeMode.value ? '排除' : '包含'
    ElMessage.success(`批量安全合并成功 (${mode}模式)`)
  } catch (error) {
    ElMessage.error('批量安全合并失败: ' + (error as Error).message)
  }
}

// 安全过滤演示
function executeSecurityFilter() {
  try {
    // 排除敏感信息
    securityResult.value = pickFieldsSuper(
      securityDemoData.value,
      [
        'password',
        'internalId',
        'profile.socialSecurityNumber',
        'profile.bankAccount',
        'system.lastLoginIP',
      ],
      true
    )

    securityResultInfo.value = {
      title: '敏感信息过滤完成',
      description:
        '已移除密码、内部ID、社会保险号、银行账户和登录IP等敏感信息，只保留安全的公开信息。',
    }

    ElMessage.success('敏感信息过滤成功')
  } catch (error) {
    ElMessage.error('安全过滤失败: ' + (error as Error).message)
  }
}

// 安全更新演示
function executeSecureUpdate() {
  try {
    // 模拟用户更新请求
    const userUpdate = {
      name: '张三（已更新）',
      email: 'zhangsan.new@example.com',
      phone: '13800138001',
      password: 'hacked_password', // 恶意尝试修改密码
      internalId: 'HACKED_ID', // 恶意尝试修改内部ID
      role: 'admin', // 恶意尝试提升权限
      profile: {
        bio: '高级软件工程师',
        avatar: 'new_avatar.jpg',
        socialSecurityNumber: '999-99-9999', // 恶意尝试修改SSN
        bankAccount: '1111-2222-3333-4444', // 恶意尝试修改银行账户
      },
      system: {
        loginCount: 999999, // 恶意尝试修改系统数据
        lastLoginIP: '0.0.0.0', // 恶意尝试修改IP
      },
    }

    // 安全合并，保护系统字段和敏感信息
    securityResult.value = mergeFieldsSuper(
      securityDemoData.value,
      userUpdate,
      [
        'password',
        'internalId',
        'role',
        'permissions',
        'profile.socialSecurityNumber',
        'profile.bankAccount',
        'system',
      ],
      true
    )

    securityResultInfo.value = {
      title: '安全更新完成',
      description:
        '用户资料已更新，但系统自动保护了密码、内部ID、角色权限、社会保险号、银行账户和系统数据不被恶意修改。',
    }

    ElMessage.success('安全更新成功')
  } catch (error) {
    ElMessage.error('安全更新失败: ' + (error as Error).message)
  }
}

// API响应清理演示
function executeApiCleanup() {
  try {
    // 只保留公开API应该返回的字段
    securityResult.value = pickFieldsSuper(
      securityDemoData.value,
      ['id', 'name', 'email', 'role', 'profile.bio', 'profile.avatar'],
      false
    )

    securityResultInfo.value = {
      title: 'API响应清理完成',
      description: '已清理内部字段，只返回公开API应该暴露的用户基本信息，确保数据安全。',
    }

    ElMessage.success('API响应清理成功')
  } catch (error) {
    ElMessage.error('API清理失败: ' + (error as Error).message)
  }
}
</script>

<style scoped>
.utils-example {
  max-width: 1400px;
  margin: 0 auto;
}

.demo-card {
  margin-bottom: 20px;
}

.function-demo {
  padding: 15px;
}

.controls {
  margin: 15px 0;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.operation-mode {
  padding: 10px;
  background-color: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
}

.path-list {
  min-height: 40px;
  padding: 10px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background-color: #fafafa;
}

.path-tags {
  max-height: 200px;
  overflow-y: auto;
}

.result-box {
  margin-top: 15px;
  padding: 15px;
  background-color: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
}

.result-box pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.result-info {
  margin-top: 10px;
  text-align: center;
}

.batch-controls {
  padding: 15px;
}

.operation-card {
  padding: 15px;
}

.operation-card h5 {
  margin: 0 0 10px 0;
  color: #409eff;
}

.demo-description {
  font-size: 12px;
  color: #666;
  margin: 5px 0;
}

.mt-5 {
  margin-top: 5px;
}

.mt-10 {
  margin-top: 10px;
}

.mt-20 {
  margin-top: 20px;
}

.mr-5 {
  margin-right: 5px;
}

.mb-5 {
  margin-bottom: 5px;
}
</style>
