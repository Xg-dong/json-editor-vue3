<template>
  <div class="comparison-example">
    <el-card class="demo-card">
      <template #header>
        <h2>JSON 比较功能演示</h2>
        <p>展示 JSON 对象比较、差异分析、合并冲突检测等功能</p>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <template #header>
              <h3>对象A (原始数据)</h3>
            </template>

            <JsonEditor v-model="objectA" :height="300" @change="onObjectAChange" />

            <div class="object-info">
              <el-descriptions :column="2" size="small" border>
                <el-descriptions-item label="字段数">
                  {{ getFieldCount(objectA) }}
                </el-descriptions-item>
                <el-descriptions-item label="类型">
                  {{ getObjectType(objectA) }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card>
            <template #header>
              <h3>对象B (对比数据)</h3>
            </template>

            <JsonEditor v-model="objectB" :height="300" @change="onObjectBChange" />

            <div class="object-info">
              <el-descriptions :column="2" size="small" border>
                <el-descriptions-item label="字段数">
                  {{ getFieldCount(objectB) }}
                </el-descriptions-item>
                <el-descriptions-item label="类型">
                  {{ getObjectType(objectB) }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row class="mt-20">
        <el-col :span="24">
          <el-card>
            <template #header>
              <h3>比较操作</h3>
            </template>

            <div class="comparison-controls">
              <el-button type="primary" @click="compareObjects" :icon="TrendCharts">
                执行比较
              </el-button>
              <el-button type="success" @click="findDifferences" :icon="Search">
                查找差异
              </el-button>
              <el-button type="warning" @click="mergeWithConflicts" :icon="Connection">
                合并 (检测冲突)
              </el-button>
              <el-button type="info" @click="loadSampleData" :icon="RefreshLeft">
                加载示例数据
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mt-20" v-if="comparisonResult">
        <el-col :span="8">
          <el-card>
            <template #header>
              <h3>比较结果</h3>
            </template>

            <div class="comparison-summary">
              <el-tag
                :type="comparisonResult.isEqual ? 'success' : 'danger'"
                size="large"
                class="mb-10"
              >
                {{ comparisonResult.isEqual ? '完全相同' : '存在差异' }}
              </el-tag>

              <el-descriptions :column="1" size="small" border>
                <el-descriptions-item label="相同字段">
                  <el-tag type="success">{{ comparisonResult.commonFields?.length || 0 }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="仅A有">
                  <el-tag type="warning">{{ comparisonResult.onlyInA?.length || 0 }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="仅B有">
                  <el-tag type="info">{{ comparisonResult.onlyInB?.length || 0 }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="值不同">
                  <el-tag type="danger">{{ comparisonResult.differentValues?.length || 0 }}</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-card>
        </el-col>

        <el-col :span="16">
          <el-card>
            <template #header>
              <h3>详细差异</h3>
            </template>

            <el-tabs v-model="activeTab" type="border-card">
              <el-tab-pane label="字段差异" name="fields">
                <div class="diff-content">
                  <div v-if="comparisonResult.onlyInA?.length > 0" class="diff-section">
                    <h4>仅在对象A中存在:</h4>
                    <div class="field-tags">
                      <el-tag
                        v-for="field in comparisonResult.onlyInA"
                        :key="field"
                        type="warning"
                        class="mr-5 mb-5"
                      >
                        {{ field }}
                      </el-tag>
                    </div>
                  </div>

                  <div v-if="comparisonResult.onlyInB?.length > 0" class="diff-section">
                    <h4>仅在对象B中存在:</h4>
                    <div class="field-tags">
                      <el-tag
                        v-for="field in comparisonResult.onlyInB"
                        :key="field"
                        type="info"
                        class="mr-5 mb-5"
                      >
                        {{ field }}
                      </el-tag>
                    </div>
                  </div>

                  <div v-if="comparisonResult.differentValues?.length > 0" class="diff-section">
                    <h4>值不同的字段:</h4>
                    <div class="value-diffs">
                      <el-card
                        v-for="diff in comparisonResult.differentValues"
                        :key="diff.field"
                        class="diff-card"
                        shadow="hover"
                      >
                        <h5>{{ diff.field }}</h5>
                        <div class="value-comparison">
                          <div class="value-item">
                            <span class="label">对象A:</span>
                            <pre>{{ JSON.stringify(diff.valueA, null, 2) }}</pre>
                          </div>
                          <div class="value-item">
                            <span class="label">对象B:</span>
                            <pre>{{ JSON.stringify(diff.valueB, null, 2) }}</pre>
                          </div>
                        </div>
                      </el-card>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

              <el-tab-pane label="合并结果" name="merge">
                <div v-if="mergeResult">
                  <JsonEditor v-model="mergeResult.merged" :height="250" :readonly="true" />

                  <div v-if="mergeResult.conflicts?.length > 0" class="conflicts-section mt-15">
                    <h4>合并冲突:</h4>
                    <el-alert
                      v-for="conflict in mergeResult.conflicts"
                      :key="conflict.field"
                      :title="`字段冲突: ${conflict.field}`"
                      type="warning"
                      :description="`对象A值: ${JSON.stringify(conflict.valueA)} | 对象B值: ${JSON.stringify(conflict.valueB)}`"
                      class="mb-10"
                      show-icon
                    />
                  </div>
                </div>
              </el-tab-pane>

              <el-tab-pane label="路径分析" name="paths">
                <div class="path-analysis">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <h4>对象A路径:</h4>
                      <div class="path-list">
                        <el-tag v-for="path in pathsA" :key="path" size="small" class="mr-5 mb-5">
                          {{ path }}
                        </el-tag>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <h4>对象B路径:</h4>
                      <div class="path-list">
                        <el-tag v-for="path in pathsB" :key="path" size="small" class="mr-5 mb-5">
                          {{ path }}
                        </el-tag>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>

      <el-row class="mt-20">
        <el-col :span="24">
          <el-card>
            <template #header>
              <h3>交互式比较工具</h3>
            </template>

            <div class="interactive-tools">
              <el-row :gutter="20">
                <el-col :span="8">
                  <h4>字段级比较:</h4>
                  <el-input
                    v-model="fieldToCompare"
                    placeholder="输入字段名进行比较"
                    @keyup.enter="compareField"
                  />
                  <el-button type="primary" @click="compareField" class="mt-10" block>
                    比较字段
                  </el-button>

                  <div v-if="fieldComparisonResult" class="field-result mt-15">
                    <el-alert
                      :title="`字段 ${fieldToCompare} 比较结果`"
                      :type="fieldComparisonResult.isEqual ? 'success' : 'warning'"
                      :description="fieldComparisonResult.description"
                      show-icon
                    />
                  </div>
                </el-col>

                <el-col :span="8">
                  <h4>路径值比较:</h4>
                  <el-input
                    v-model="pathToCompare"
                    placeholder="输入路径 (如: user.profile.name)"
                    @keyup.enter="comparePath"
                  />
                  <el-button type="success" @click="comparePath" class="mt-10" block>
                    比较路径值
                  </el-button>

                  <div v-if="pathComparisonResult" class="path-result mt-15">
                    <el-card class="result-card">
                      <h5>路径: {{ pathToCompare }}</h5>
                      <div class="path-values">
                        <div>
                          <strong>对象A:</strong> {{ JSON.stringify(pathComparisonResult.valueA) }}
                        </div>
                        <div>
                          <strong>对象B:</strong> {{ JSON.stringify(pathComparisonResult.valueB) }}
                        </div>
                        <div>
                          <strong>相等:</strong>
                          <el-tag :type="pathComparisonResult.isEqual ? 'success' : 'danger'">
                            {{ pathComparisonResult.isEqual ? '是' : '否' }}
                          </el-tag>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </el-col>

                <el-col :span="8">
                  <h4>快速操作:</h4>
                  <el-button @click="swapObjects" class="mb-10" block> 交换对象A和B </el-button>
                  <el-button @click="resetObjects" class="mb-10" block> 重置为默认数据 </el-button>
                  <el-button @click="generateRandomData" class="mb-10" block>
                    生成随机测试数据
                  </el-button>
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
import { Search, Connection, RefreshLeft, TrendCharts } from '@element-plus/icons-vue'
import JsonEditor from '../../../src/JsonEditor.vue'
import {
  mergeFieldsSuper,
  getValueByPath,
  collectAllPaths,
  isEqual,
} from '../../../src/utils/index'
import { ElMessage } from 'element-plus'

// 类型定义
interface ComparisonResult {
  isEqual: boolean
  commonFields: string[]
  onlyInA: string[]
  onlyInB: string[]
  differentValues: Array<{
    field: string
    valueA: any
    valueB: any
  }>
}

interface MergeResult {
  merged: any
  conflicts: Array<{
    field: string
    valueA: any
    valueB: any
    resolved: any
  }>
}

interface FieldComparisonResult {
  isEqual: boolean
  description: string
  valueA: any
  valueB: any
}

interface PathComparisonResult {
  valueA: any
  valueB: any
  isEqual: boolean
}

// 比较对象
const objectA = ref<any>({
  id: 1,
  name: '张三',
  age: 30,
  email: 'zhangsan@example.com',
  profile: {
    bio: '前端开发工程师',
    skills: ['Vue', 'JavaScript', 'TypeScript'],
    experience: 5,
  },
  settings: {
    theme: 'light',
    language: 'zh-CN',
  },
  lastLogin: '2024-01-09',
})

const objectB = ref<any>({
  id: 1,
  name: '张三',
  age: 31,
  email: 'zhangsan@newdomain.com',
  profile: {
    bio: '高级前端开发工程师',
    skills: ['Vue', 'React', 'TypeScript', 'Node.js'],
    experience: 6,
    certifications: ['Vue.js Certified'],
  },
  settings: {
    theme: 'dark',
    language: 'zh-CN',
    notifications: true,
  },
  createTime: '2024-01-01',
})

// 比较结果
const comparisonResult = ref<ComparisonResult | null>(null)
const mergeResult = ref<MergeResult | null>(null)
const activeTab = ref('fields')

// 交互式比较
const fieldToCompare = ref('')
const pathToCompare = ref('')
const fieldComparisonResult = ref<FieldComparisonResult | null>(null)
const pathComparisonResult = ref<PathComparisonResult | null>(null)

// 计算属性
const pathsA = computed(() => collectAllPaths(objectA.value))
const pathsB = computed(() => collectAllPaths(objectB.value))

// 获取字段数量
function getFieldCount(obj: any): number {
  if (!obj || typeof obj !== 'object') return 0
  return Object.keys(obj).length
}

// 获取对象类型
function getObjectType(obj: any): string {
  if (obj === null) return 'null'
  if (Array.isArray(obj)) return '数组'
  if (typeof obj === 'object') return '对象'
  return typeof obj
}

// 执行对象比较
function compareObjects() {
  try {
    const result = performDeepComparison(objectA.value, objectB.value)
    comparisonResult.value = result
    activeTab.value = 'fields'
    ElMessage.success('对象比较完成')
  } catch (error) {
    ElMessage.error('比较失败: ' + (error as Error).message)
  }
}

// 深度比较函数
function performDeepComparison(objA: any, objB: any): ComparisonResult {
  const keysA = new Set(Object.keys(objA))
  const keysB = new Set(Object.keys(objB))
  const allKeys = new Set([...keysA, ...keysB])

  const commonFields: string[] = []
  const onlyInA: string[] = []
  const onlyInB: string[] = []
  const differentValues: Array<{ field: string; valueA: any; valueB: any }> = []

  for (const key of allKeys) {
    if (keysA.has(key) && keysB.has(key)) {
      commonFields.push(key)
      if (!isEqual(objA[key], objB[key])) {
        differentValues.push({
          field: key,
          valueA: objA[key],
          valueB: objB[key],
        })
      }
    } else if (keysA.has(key)) {
      onlyInA.push(key)
    } else {
      onlyInB.push(key)
    }
  }

  return {
    isEqual: differentValues.length === 0 && onlyInA.length === 0 && onlyInB.length === 0,
    commonFields,
    onlyInA,
    onlyInB,
    differentValues,
  }
}

// 查找差异
function findDifferences() {
  compareObjects()
  if (comparisonResult.value && !comparisonResult.value.isEqual) {
    ElMessage.info(`发现 ${comparisonResult.value.differentValues.length} 个值差异`)
  }
}

// 合并并检测冲突
function mergeWithConflicts() {
  try {
    // 获取所有字段路径用于合并
    const allPaths = Array.from(
      new Set([...collectAllPaths(objectA.value), ...collectAllPaths(objectB.value)])
    )
    const merged = mergeFieldsSuper(objectA.value, objectB.value, allPaths)
    const conflicts: Array<{
      field: string
      valueA: any
      valueB: any
      resolved: any
    }> = []

    // 检测冲突
    const comparison = performDeepComparison(objectA.value, objectB.value)
    for (const diff of comparison.differentValues) {
      conflicts.push({
        field: diff.field,
        valueA: diff.valueA,
        valueB: diff.valueB,
        resolved: (merged as any)[diff.field],
      })
    }

    mergeResult.value = {
      merged,
      conflicts,
    }

    activeTab.value = 'merge'
    ElMessage.success(`合并完成，发现 ${conflicts.length} 个冲突`)
  } catch (error) {
    ElMessage.error('合并失败: ' + (error as Error).message)
  }
}

// 比较单个字段
function compareField() {
  if (!fieldToCompare.value.trim()) {
    ElMessage.warning('请输入字段名')
    return
  }

  const field = fieldToCompare.value.trim()
  const valueA = (objectA.value as any)[field]
  const valueB = (objectB.value as any)[field]
  const hasA = field in objectA.value
  const hasB = field in objectB.value

  let description = ''
  let isEqualValue = false

  if (!hasA && !hasB) {
    description = '两个对象都不包含此字段'
  } else if (!hasA) {
    description = '仅对象B包含此字段'
  } else if (!hasB) {
    description = '仅对象A包含此字段'
  } else {
    isEqualValue = valueA === valueB
    description = isEqualValue ? '字段值相同' : '字段值不同'
  }

  fieldComparisonResult.value = {
    isEqual: isEqualValue,
    description,
    valueA,
    valueB,
  }
}

// 比较路径值
function comparePath() {
  if (!pathToCompare.value.trim()) {
    ElMessage.warning('请输入路径')
    return
  }

  const path = pathToCompare.value.trim()
  const valueA = getValueByPath(objectA.value, path)
  const valueB = getValueByPath(objectB.value, path)
  const isEqualValue = isEqual(valueA, valueB)

  pathComparisonResult.value = {
    valueA,
    valueB,
    isEqual: isEqualValue,
  }
}

// 加载示例数据
function loadSampleData() {
  const samples = [
    {
      objA: {
        user: { name: 'Alice', age: 25, city: 'Beijing' },
        preferences: { theme: 'light', language: 'en' },
      },
      objB: {
        user: { name: 'Alice', age: 26, city: 'Shanghai' },
        preferences: { theme: 'dark', language: 'en', notifications: true },
      },
    },
    {
      objA: {
        product: { id: 'P001', name: 'Laptop', price: 5999 },
        inventory: { stock: 10, warehouse: 'A' },
      },
      objB: {
        product: { id: 'P001', name: 'Gaming Laptop', price: 6999 },
        inventory: { stock: 8, warehouse: 'B', reserved: 2 },
      },
    },
  ]

  const sample = samples[Math.floor(Math.random() * samples.length)]
  objectA.value = sample.objA
  objectB.value = sample.objB

  ElMessage.success('已加载示例数据')
}

// 交换对象
function swapObjects() {
  const temp = objectA.value
  objectA.value = objectB.value
  objectB.value = temp
  ElMessage.success('已交换对象A和B')
}

// 重置对象
function resetObjects() {
  objectA.value = {
    id: 1,
    name: '张三',
    age: 30,
    email: 'zhangsan@example.com',
    profile: {
      bio: '前端开发工程师',
      skills: ['Vue', 'JavaScript'],
      experience: 3,
    },
    settings: {
      theme: 'light',
      language: 'zh-CN',
    },
    lastLogin: '2024-01-09',
  }
  objectB.value = {
    id: 1,
    name: '张三',
    age: 31,
    email: 'zhangsan@newdomain.com',
    profile: {
      bio: '高级前端开发工程师',
      skills: ['Vue', 'React', 'TypeScript'],
      experience: 5,
      certifications: ['Vue.js Certified'],
    },
    settings: {
      theme: 'dark',
      language: 'zh-CN',
      notifications: true,
    },
    createTime: '2024-01-01',
  }
  comparisonResult.value = null
  mergeResult.value = null
  ElMessage.success('已重置为默认数据')
}

// 生成随机数据
function generateRandomData() {
  const names = ['张三', '李四', '王五', '赵六']
  const skills = ['Vue', 'React', 'Angular', 'TypeScript', 'JavaScript', 'Node.js']

  const randomName = names[Math.floor(Math.random() * names.length)]
  const randomAge = 20 + Math.floor(Math.random() * 40)
  const randomSkills = skills.sort(() => 0.5 - Math.random()).slice(0, 3)

  objectA.value = {
    id: Math.floor(Math.random() * 1000),
    name: randomName,
    age: randomAge,
    profile: {
      bio: '开发工程师',
      skills: randomSkills,
      experience: Math.floor(Math.random() * 10),
    },
    settings: {
      theme: 'light',
      language: 'zh-CN',
    },
    active: Math.random() > 0.5,
    lastLogin: '2024-01-09',
  }

  objectB.value = {
    id: Math.floor(Math.random() * 1000),
    name: randomName,
    age: randomAge + Math.floor(Math.random() * 5),
    profile: {
      bio: '高级开发工程师',
      skills: skills.sort(() => 0.5 - Math.random()).slice(0, 4),
      experience: Math.floor(Math.random() * 10) + 1,
      certifications: ['认证证书'],
    },
    settings: {
      theme: 'dark',
      language: 'zh-CN',
      notifications: true,
    },
    active: Math.random() > 0.5,
    createTime: '2024-01-01',
    extra: 'additional field',
  }

  ElMessage.success('已生成随机测试数据')
}

function onObjectAChange(value: any) {
  objectA.value = value
}

function onObjectBChange(value: any) {
  objectB.value = value
}
</script>

<style scoped>
.comparison-example {
  max-width: 1400px;
  margin: 0 auto;
}

.demo-card {
  margin-bottom: 20px;
}

.object-info {
  margin-top: 15px;
}

.comparison-controls {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.comparison-summary {
  text-align: center;
}

.diff-content {
  max-height: 400px;
  overflow-y: auto;
}

.diff-section {
  margin-bottom: 20px;
}

.diff-section h4 {
  color: #409eff;
  margin-bottom: 10px;
}

.field-tags {
  margin-bottom: 15px;
}

.value-diffs .diff-card {
  margin-bottom: 15px;
}

.value-comparison {
  display: flex;
  gap: 20px;
}

.value-item {
  flex: 1;
}

.value-item .label {
  font-weight: bold;
  color: #666;
}

.value-item pre {
  background-color: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  margin-top: 5px;
  font-size: 12px;
}

.conflicts-section h4 {
  color: #e6a23c;
  margin-bottom: 15px;
}

.path-analysis .path-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.interactive-tools {
  padding: 20px;
  background-color: #fafafa;
  border-radius: 4px;
}

.field-result,
.path-result {
  max-height: 200px;
  overflow-y: auto;
}

.result-card {
  padding: 15px;
}

.path-values div {
  margin-bottom: 8px;
  font-size: 14px;
}

.mt-10 {
  margin-top: 10px;
}

.mt-15 {
  margin-top: 15px;
}

.mt-20 {
  margin-top: 20px;
}

.mb-5 {
  margin-bottom: 5px;
}

.mb-10 {
  margin-bottom: 10px;
}

.mr-5 {
  margin-right: 5px;
}
</style>
