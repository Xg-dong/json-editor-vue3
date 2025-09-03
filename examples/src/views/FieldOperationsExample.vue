<template>
  <div class="field-operations-example">
    <el-card class="demo-card">
      <template #header>
        <h2>字段操作功能演示</h2>
        <p>展示字段可见性控制、只读操作、动态字段管理等高级功能</p>
      </template>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-card>
            <template #header>
              <h3>字段配置面板</h3>
            </template>

            <div class="field-config">
              <h4>可见性控制</h4>
              <div class="visibility-controls">
                <el-checkbox-group v-model="visibleFields" @change="updateVisibility">
                  <div v-for="field in allFields" :key="field" class="field-checkbox">
                    <el-checkbox :value="field">
                      {{ fieldLabels[field] || field }}
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>

              <el-divider />

              <h4>只读控制</h4>
              <div class="readonly-controls">
                <el-checkbox-group v-model="readonlyFields" @change="updateReadonly">
                  <div v-for="field in allFields" :key="field" class="field-checkbox">
                    <el-checkbox :value="field">
                      {{ fieldLabels[field] || field }}
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>

              <el-divider />

              <h4>字段路径管理</h4>
              <div class="path-management">
                <el-input
                  v-model="newFieldPath"
                  placeholder="输入字段路径 (如: user.profile.bio)"
                  @keyup.enter="addFieldPath"
                />
                <el-button type="primary" @click="addFieldPath" class="mt-10" block>
                  添加字段路径
                </el-button>

                <div class="custom-paths mt-15">
                  <el-tag
                    v-for="(path, index) in customFieldPaths"
                    :key="index"
                    closable
                    @close="removeFieldPath(index)"
                    class="mr-5 mb-5"
                  >
                    {{ path }}
                  </el-tag>
                </div>
              </div>

              <el-divider />

              <h4>快速操作</h4>
              <div class="quick-actions">
                <el-button @click="showAllFields" class="mb-10" block> 显示所有字段 </el-button>
                <el-button @click="hideAllFields" class="mb-10" block> 隐藏所有字段 </el-button>
                <el-button @click="resetFieldConfig" class="mb-10" block> 重置配置 </el-button>
                <el-button @click="loadFieldPreset" class="mb-10" block> 加载预设 </el-button>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="16">
          <el-card>
            <template #header>
              <h3>字段操作演示</h3>
            </template>

            <el-tabs v-model="activeEditorTab" type="border-card">
              <el-tab-pane label="可见性控制" name="visibility">
                <div class="editor-section">
                  <p><strong>当前可见字段:</strong> {{ visibleFields.join(', ') || '无' }}</p>
                  <JsonEditor
                    ref="visibilityEditor"
                    v-model="demoData"
                    :height="350"
                    :visible-paths="visibleFields"
                    :show-format-button="true"
                    @change="onDataChange"
                  />
                </div>
              </el-tab-pane>

              <el-tab-pane label="只读控制" name="readonly">
                <div class="editor-section">
                  <p><strong>只读字段:</strong> {{ readonlyFields.join(', ') || '无' }}</p>
                  <JsonEditor
                    ref="readonlyEditor"
                    v-model="demoData"
                    :height="350"
                    :readonly-paths="readonlyFields"
                    :show-format-button="true"
                    @change="onDataChange"
                  />
                </div>
              </el-tab-pane>

              <el-tab-pane label="动态字段" name="dynamic">
                <div class="editor-section">
                  <div class="dynamic-controls mb-15">
                    <el-button type="success" @click="addDynamicField"> 添加字段 </el-button>
                    <el-button type="warning" @click="removeDynamicField"> 移除字段 </el-button>
                    <el-button type="info" @click="modifyFieldValue"> 修改字段值 </el-button>
                  </div>

                  <JsonEditor
                    ref="dynamicEditor"
                    v-model="dynamicData"
                    :height="300"
                    @change="onDynamicDataChange"
                  />
                </div>
              </el-tab-pane>

              <el-tab-pane label="路径操作" name="paths">
                <div class="editor-section">
                  <div class="path-operations">
                    <el-row :gutter="15">
                      <el-col :span="12">
                        <h4>路径值操作</h4>
                        <el-input v-model="operationPath" placeholder="字段路径" class="mb-10" />
                        <el-input
                          v-model="operationValue"
                          placeholder="新值 (JSON格式)"
                          class="mb-10"
                        />
                        <el-button @click="setPathValue" class="mb-5" block> 设置路径值 </el-button>
                        <el-button @click="getPathValue" class="mb-5" block> 获取路径值 </el-button>
                        <el-button @click="deletePathValue" class="mb-5" block>
                          删除路径
                        </el-button>
                      </el-col>

                      <el-col :span="12">
                        <h4>操作结果</h4>
                        <div class="operation-result">
                          <pre v-if="pathOperationResult">{{ pathOperationResult }}</pre>
                          <span v-else class="placeholder">执行操作后显示结果</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>

                  <JsonEditor
                    ref="pathEditor"
                    v-model="pathData"
                    :height="250"
                    @change="onPathDataChange"
                  />
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
              <h3>实时字段分析</h3>
            </template>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-card class="analysis-card">
                  <h4>字段统计</h4>
                  <el-descriptions :column="1" border>
                    <el-descriptions-item label="总字段数">
                      {{ allFields.length }}
                    </el-descriptions-item>
                    <el-descriptions-item label="可见字段">
                      {{ visibleFields.length }}
                    </el-descriptions-item>
                    <el-descriptions-item label="只读字段">
                      {{ readonlyFields.length }}
                    </el-descriptions-item>
                    <el-descriptions-item label="自定义路径">
                      {{ customFieldPaths.length }}
                    </el-descriptions-item>
                  </el-descriptions>
                </el-card>
              </el-col>

              <el-col :span="8">
                <el-card class="analysis-card">
                  <h4>字段类型分析</h4>
                  <div class="type-analysis">
                    <div v-for="(count, type) in fieldTypeStats" :key="type" class="type-item">
                      <el-tag :type="getTypeTagType(String(type))">
                        {{ type }}: {{ count }}
                      </el-tag>
                    </div>
                  </div>
                </el-card>
              </el-col>

              <el-col :span="8">
                <el-card class="analysis-card">
                  <h4>操作历史</h4>
                  <div class="operation-history">
                    <div v-for="(op, index) in operationHistory" :key="index" class="history-item">
                      <span class="operation-time">{{ op.time }}</span>
                      <span class="operation-type">{{ op.type }}</span>
                      <span class="operation-detail">{{ op.detail }}</span>
                    </div>

                    <el-button size="small" @click="clearHistory" class="mt-10">
                      清空历史
                    </el-button>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import JsonEditor from '../../../src/JsonEditor.vue'
import { getValueByPath, collectAllPaths } from '../../../src/utils/index'
import { ElMessage } from 'element-plus'

// 类型定义
interface OperationHistory {
  time: string
  type: string
  detail: string
}

interface FieldTypeStats {
  [key: string]: number
}

interface FieldLabels {
  [key: string]: string
}

// 字段配置相关
const visibleFields = ref<string[]>(['user.name', 'user.email', 'user.profile.bio'])
const readonlyFields = ref<string[]>(['user.id', 'metadata.created'])
const newFieldPath = ref('')
const customFieldPaths = ref<string[]>([])
const activeEditorTab = ref('visibility')

// 所有可用字段
const allFields = computed(() => {
  const paths = collectAllPaths(demoData.value)
  const basicFields = [
    'user.name',
    'user.email',
    'user.age',
    'user.profile.bio',
    'user.profile.skills',
    'metadata.version',
  ]
  return Array.from(new Set([...basicFields, ...paths, ...customFieldPaths.value]))
})

// 字段标签映射
const fieldLabels: FieldLabels = {
  'user.name': '用户名',
  'user.email': '邮箱',
  'user.age': '年龄',
  'user.id': '用户ID',
  'user.profile.bio': '个人简介',
  'user.profile.skills': '技能',
  'user.profile.settings.theme': '主题',
  'metadata.created': '创建时间',
  'metadata.updated': '更新时间',
  'metadata.version': '版本',
}

// 动态数据相关
const dynamicData = ref<any>({
  name: '动态数据测试',
  value: 100,
  items: ['item1', 'item2'],
})

// 路径操作相关
const pathData = ref({
  test: {
    nested: {
      value: 'test value',
    },
  },
})
const operationPath = ref('test.nested.value')
const operationValue = ref('"new value"')
const pathOperationResult = ref<string>('')

// 演示数据
const demoData = ref({
  user: {
    id: 1,
    name: '张三',
    age: 30,
    email: 'zhangsan@example.com',
    profile: {
      bio: '前端开发工程师',
      avatar: 'avatar.jpg',
      skills: ['Vue', 'JavaScript', 'TypeScript'],
      settings: {
        theme: 'dark',
        language: 'zh-CN',
        notifications: true,
      },
    },
  },
  metadata: {
    created: '2024-01-01',
    updated: '2024-01-09',
    version: '1.0.0',
  },
})

// 操作历史
const operationHistory = ref<OperationHistory[]>([])

// 字段类型统计
const fieldTypeStats = computed((): FieldTypeStats => {
  const stats: FieldTypeStats = {}

  function analyzeValue(value: any): string {
    if (value === null) return 'null'
    if (Array.isArray(value)) return 'array'
    return typeof value
  }

  function traverse(obj: any, path = ''): void {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key
        const type = analyzeValue(value)
        stats[type] = (stats[type] || 0) + 1

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          traverse(value, currentPath)
        }
      })
    }
  }

  traverse(demoData.value)
  return stats
})

// 字段配置函数
function updateVisibility() {
  console.log('可见字段已更新:', visibleFields.value)
}

function updateReadonly() {
  console.log('只读字段已更新:', readonlyFields.value)
}

function addFieldPath() {
  if (newFieldPath.value.trim()) {
    if (!customFieldPaths.value.includes(newFieldPath.value.trim())) {
      customFieldPaths.value.push(newFieldPath.value.trim())
      newFieldPath.value = ''
      ElMessage.success('字段路径已添加')
    } else {
      ElMessage.warning('字段路径已存在')
    }
  }
}

function removeFieldPath(index: number) {
  customFieldPaths.value.splice(index, 1)
  ElMessage.success('字段路径已移除')
}

function showAllFields() {
  visibleFields.value = [...allFields.value]
  ElMessage.success('已显示所有字段')
}

function hideAllFields() {
  visibleFields.value = []
  ElMessage.success('已隐藏所有字段')
}

function resetFieldConfig() {
  visibleFields.value = ['user.name', 'user.email', 'user.profile.bio']
  readonlyFields.value = ['user.id', 'metadata.created']
  customFieldPaths.value = []
  ElMessage.success('字段配置已重置')
}

function loadFieldPreset() {
  visibleFields.value = [
    'user.name',
    'user.email',
    'user.age',
    'user.profile.bio',
    'user.profile.skills',
  ]
  readonlyFields.value = ['user.id', 'metadata.created', 'metadata.version']
  ElMessage.success('预设配置已加载')
}

// 编辑器事件处理
function onDataChange(value: any) {
  console.log('数据已更改:', value)
  addToHistory('数据变更', '编辑器数据已更新')
}

function onDynamicDataChange(value: any) {
  dynamicData.value = value
  console.log('动态数据已更改:', value)
}

function onPathDataChange(value: any) {
  pathData.value = value
  console.log('路径数据已更改:', value)
}

// 动态字段操作
function addDynamicField() {
  const fieldName = `field${Date.now()}`
  const newData = { ...dynamicData.value }
  newData[fieldName] = `新字段值 ${Math.floor(Math.random() * 100)}`
  dynamicData.value = newData
  ElMessage.success(`已添加字段: ${fieldName}`)
}

function removeDynamicField() {
  const keys = Object.keys(dynamicData.value)
  if (keys.length > 0) {
    const keyToRemove = keys[keys.length - 1]
    const newData = { ...dynamicData.value }
    delete newData[keyToRemove]
    dynamicData.value = newData
    ElMessage.success(`已移除字段: ${keyToRemove}`)
  } else {
    ElMessage.warning('没有可移除的字段')
  }
}

function modifyFieldValue() {
  const keys = Object.keys(dynamicData.value)
  if (keys.length > 0) {
    const keyToModify = keys[0]
    const newData = { ...dynamicData.value }
    newData[keyToModify] = `修改值 ${Math.floor(Math.random() * 1000)}`
    dynamicData.value = newData
    ElMessage.success(`已修改字段: ${keyToModify}`)
  } else {
    ElMessage.warning('没有可修改的字段')
  }
}

// 路径操作函数
function setPathValue() {
  try {
    const value = JSON.parse(operationValue.value)
    const keys = operationPath.value.split('.')
    const newData = JSON.parse(JSON.stringify(pathData.value))

    let current = newData
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value

    pathData.value = newData
    pathOperationResult.value = `已设置 ${operationPath.value} = ${JSON.stringify(value)}`
    ElMessage.success('路径值已设置')
  } catch (error) {
    ElMessage.error('设置失败: ' + (error as Error).message)
  }
}

function getPathValue() {
  try {
    const value = getValueByPath(pathData.value, operationPath.value)
    pathOperationResult.value = `${operationPath.value} = ${JSON.stringify(value, null, 2)}`
    ElMessage.success('路径值已获取')
  } catch (error) {
    ElMessage.error('获取失败: ' + (error as Error).message)
    pathOperationResult.value = `获取失败: ${(error as Error).message}`
  }
}

function deletePathValue() {
  try {
    const keys = operationPath.value.split('.')
    const newData = JSON.parse(JSON.stringify(pathData.value))

    let current = newData
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        throw new Error(`路径不存在: ${keys.slice(0, i + 1).join('.')}`)
      }
      current = current[keys[i]]
    }

    const lastKey = keys[keys.length - 1]
    if (lastKey in current) {
      delete current[lastKey]
      pathData.value = newData
      pathOperationResult.value = `已删除路径: ${operationPath.value}`
      ElMessage.success('路径已删除')
    } else {
      throw new Error(`路径不存在: ${operationPath.value}`)
    }
  } catch (error) {
    ElMessage.error('删除失败: ' + (error as Error).message)
    pathOperationResult.value = `删除失败: ${(error as Error).message}`
  }
}

// 获取类型标签样式
function getTypeTagType(type: string): string {
  const typeMap: { [key: string]: string } = {
    string: 'primary',
    number: 'success',
    boolean: 'warning',
    object: 'info',
    array: 'danger',
    null: '',
  }
  return typeMap[type] || ''
}

// 添加操作历史记录
function addToHistory(type: string, detail: string) {
  operationHistory.value.unshift({
    time: new Date().toLocaleTimeString(),
    type,
    detail,
  })

  // 保持最多 10 条历史记录
  if (operationHistory.value.length > 10) {
    operationHistory.value = operationHistory.value.slice(0, 10)
  }
}

// 清空操作历史
function clearHistory() {
  operationHistory.value = []
  ElMessage.success('历史记录已清空')
}
</script>

<style scoped>
.field-operations-example {
  max-width: 1400px;
  margin: 0 auto;
}

.demo-card {
  margin-bottom: 20px;
}

.field-config {
  padding: 15px;
}

.field-checkbox {
  margin-bottom: 8px;
}

.visibility-controls,
.readonly-controls {
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.path-management {
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.custom-paths {
  min-height: 40px;
  padding: 10px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background-color: #fafafa;
}

.quick-actions button {
  width: 100%;
}

.editor-section {
  padding: 15px;
}

.dynamic-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.path-operations {
  margin-bottom: 20px;
}

.operation-result {
  min-height: 150px;
  max-height: 300px;
  overflow-y: auto;
  padding: 15px;
  background-color: #f9f9f9;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.operation-result .placeholder {
  color: #999;
  font-style: italic;
}

.analysis-card {
  height: 250px;
}

.type-analysis {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.type-item {
  display: flex;
  align-items: center;
}

.operation-history {
  max-height: 180px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 12px;
  padding: 5px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.operation-time {
  color: #666;
  min-width: 60px;
}

.operation-type {
  font-weight: bold;
  color: #409eff;
  min-width: 60px;
}

.operation-detail {
  color: #333;
  flex: 1;
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

.mb-15 {
  margin-bottom: 15px;
}

.mr-5 {
  margin-right: 5px;
}
</style>
