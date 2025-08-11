<template>
  <div class="basic-example">
    <el-card class="demo-card">
      <template #header>
        <h2>基础功能演示</h2>
        <p>展示 JSON Editor 组件的所有基础功能和配置选项</p>
      </template>

      <el-row :gutter="20">
        <el-col :span="16">
          <el-card>
            <template #header>
              <h3>JSON 编辑器</h3>
            </template>

            <div class="controls">
              <el-row :gutter="10">
                <el-col :span="24">
                  <div class="control-group">
                    <el-button type="primary" @click="formatJson">格式化</el-button>
                    <el-button type="success" @click="validateJson">验证</el-button>
                    <el-button type="warning" @click="clearEditor">清空</el-button>
                    <el-button type="info" @click="toggleTheme">切换主题</el-button>
                    <el-button type="danger" @click="resetToDefault">重置</el-button>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10" class="mt-10">
                <el-col :span="6">
                  <el-switch
                    v-model="isReadonly"
                    active-text="只读模式"
                    inactive-text="编辑模式"
                    @change="onReadonlyChange"
                  />
                </el-col>
                <el-col :span="6">
                  <el-switch
                    v-model="strictMode"
                    active-text="严格模式"
                    inactive-text="宽松模式"
                    @change="onStrictModeChange"
                  />
                </el-col>
                <el-col :span="6">
                  <el-switch
                    v-model="autoFormatEnabled"
                    active-text="自动格式化"
                    inactive-text="手动格式化"
                    @change="onAutoFormatChange"
                  />
                </el-col>
                <el-col :span="6">
                  <el-switch
                    v-model="visiblePathsExclude"
                    active-text="排除模式"
                    inactive-text="包含模式"
                    @change="onPathModeChange"
                  />
                </el-col>
              </el-row>

              <el-row :gutter="10" class="mt-10">
                <el-col :span="8">
                  <el-input
                    v-model="editorHeight"
                    placeholder="编辑器高度"
                    @change="onHeightChange"
                  >
                    <template #prepend>高度</template>
                  </el-input>
                </el-col>
                <el-col :span="8">
                  <el-input v-model="editorWidth" placeholder="编辑器宽度" @change="onWidthChange">
                    <template #prepend>宽度</template>
                  </el-input>
                </el-col>
                <el-col :span="8">
                  <div class="color-picker-wrapper">
                    <span class="color-picker-label">背景</span>
                    <el-color-picker
                      v-model="backgroundColor"
                      show-alpha
                      color-format="hex"
                      @change="onBackgroundChange"
                      :predefine="predefineColors"
                    />
                    <el-button
                      size="small"
                      text
                      @click="clearBackgroundColor"
                      class="color-clear-btn"
                    >
                      清除
                    </el-button>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="10" class="mt-10">
                <el-col :span="12">
                  <el-input
                    v-model="placeholderText"
                    placeholder="占位符文本"
                    @change="onPlaceholderChange"
                  >
                    <template #prepend>占位符</template>
                  </el-input>
                </el-col>
                <el-col :span="12">
                  <el-select
                    v-model="selectedSample"
                    placeholder="选择示例数据"
                    @change="loadSelectedSample"
                  >
                    <el-option
                      v-for="(sample, key) in sampleData"
                      :key="key"
                      :label="sample.name"
                      :value="key"
                    />
                  </el-select>
                </el-col>
              </el-row>
            </div>

            <JsonEditor
              ref="editorRef"
              v-model="jsonData"
              :height="currentHeight"
              :width="currentWidth"
              :theme="theme"
              :readonly="isReadonly"
              :strict="strictMode"
              :placeholder="placeholderText"
              :background-color="backgroundColor"
              :visible-paths="currentVisiblePaths"
              :visible-paths-exclude="visiblePathsExclude"
              :readonly-paths="currentReadonlyPaths"
              :show-format-button="true"
              :show-fullscreen-button="true"
              :auto-format="autoFormatEnabled"
              @change="onJsonChange"
              @format="onFormat"
              @validate="onValidate"
              @focus="onFocus"
              @blur="onBlur"
              @fullscreen="onFullscreen"
            />
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card>
            <template #header>
              <h3>配置面板</h3>
            </template>

            <div class="config-panel">
              <!-- 可见字段配置 -->
              <el-collapse v-model="activeCollapse" accordion>
                <el-collapse-item title="可见字段配置" name="visible">
                  <div class="field-config">
                    <el-checkbox-group v-model="visiblePaths" @change="onVisiblePathsChange">
                      <div v-for="path in availablePaths" :key="path" class="field-item">
                        <el-checkbox :value="path">{{ getFieldLabel(path) }}</el-checkbox>
                      </div>
                    </el-checkbox-group>

                    <el-divider />

                    <el-input
                      v-model="customPath"
                      placeholder="自定义路径"
                      @keyup.enter="addCustomPath"
                    >
                      <template #append>
                        <el-button @click="addCustomPath">添加</el-button>
                      </template>
                    </el-input>
                  </div>
                </el-collapse-item>

                <el-collapse-item title="只读字段配置" name="readonly">
                  <div class="field-config">
                    <el-checkbox-group v-model="readonlyPaths" @change="onReadonlyPathsChange">
                      <div v-for="path in availablePaths" :key="path" class="field-item">
                        <el-checkbox :value="path">{{ getFieldLabel(path) }}</el-checkbox>
                      </div>
                    </el-checkbox-group>
                  </div>
                </el-collapse-item>

                <el-collapse-item title="实时信息" name="info">
                  <el-descriptions title="编辑器状态" :column="1" size="small" border>
                    <el-descriptions-item label="JSON状态">
                      <el-tag :type="isValid ? 'success' : 'danger'">
                        {{ isValid ? '有效' : '无效' }}
                      </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="字符数">
                      {{ jsonString.length }}
                    </el-descriptions-item>
                    <el-descriptions-item label="数据类型">
                      {{ getObjectType(parsedData) }}
                    </el-descriptions-item>
                    <el-descriptions-item label="主题">
                      {{ theme === 'light' ? '明亮' : '暗黑' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="模式">
                      {{ isReadonly ? '只读' : '编辑' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="严格模式">
                      {{ strictMode ? '开启' : '关闭' }}
                    </el-descriptions-item>
                  </el-descriptions>
                </el-collapse-item>

                <el-collapse-item title="事件日志" name="events">
                  <div class="event-log">
                    <div v-for="(event, index) in eventLog" :key="index" class="event-item">
                      <span class="event-time">{{ event.time }}</span>
                      <span class="event-type" :class="`event-${event.type}`">{{
                        event.type
                      }}</span>
                      <span class="event-message">{{ event.message }}</span>
                    </div>
                    <el-button size="small" @click="clearEventLog" class="mt-10"
                      >清空日志</el-button
                    >
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row class="mt-20">
        <el-col :span="24">
          <el-card>
            <template #header>
              <h3>数据预览</h3>
            </template>

            <div class="preview-section">
              <el-tabs v-model="activePreviewTab" type="border-card">
                <el-tab-pane label="格式化预览" name="formatted">
                  <div class="formatted-preview">
                    <pre>{{ formatPreview(parsedData) }}</pre>
                  </div>
                </el-tab-pane>

                <el-tab-pane label="原始JSON" name="raw">
                  <div class="raw-preview">
                    <pre>{{ jsonString }}</pre>
                  </div>
                </el-tab-pane>

                <el-tab-pane label="字段结构" name="structure">
                  <div class="structure-preview">
                    <el-tree
                      :data="treeData"
                      :props="{ label: 'label', children: 'children' }"
                      default-expand-all
                    />
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { JsonEditor } from '@idss-d/json-editor-vue3'
import { ElMessage } from 'element-plus'
import { collectAllPaths } from '@idss-d/json-editor-vue3/utils'

// 类型定义
interface SampleDataItem {
  name: string
  data: any
}

interface SampleDataCollection {
  [key: string]: SampleDataItem
}

interface EventLogItem {
  time: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

interface TreeNode {
  label: string
  children?: TreeNode[]
}

// 演示数据
const editorRef = ref()
const jsonData = ref<any>({
  name: '张三',
  age: 30,
  email: 'zhangsan@example.com',
  address: {
    city: '北京',
    district: '朝阳区',
    street: '建国路88号',
  },
  hobbies: ['阅读', '游泳', '编程'],
  isActive: true,
})

const theme = ref<'light' | 'dark'>('light')
const isValid = ref(true)
const isReadonly = ref(false)
const strictMode = ref(false)
const autoFormatEnabled = ref(false)
const visiblePathsExclude = ref(false)
const editorHeight = ref('400')
const editorWidth = ref('100%')
const backgroundColor = ref('')
const placeholderText = ref('请输入 JSON 数据')
const selectedSample = ref<string>('')
const activeCollapse = ref('visible')
const activePreviewTab = ref('formatted')
const eventLog = ref<EventLogItem[]>([])

const jsonString = computed(() => {
  try {
    return JSON.stringify(jsonData.value, null, 2)
  } catch {
    return ''
  }
})

const parsedData = computed(() => {
  try {
    return typeof jsonData.value === 'string' ? JSON.parse(jsonData.value) : jsonData.value
  } catch {
    return null
  }
})

const sampleData: SampleDataCollection = {
  user: {
    name: '用户信息',
    data: {
      id: 1,
      username: 'alice',
      profile: {
        firstName: 'Alice',
        lastName: 'Wang',
        avatar: 'https://example.com/avatar.jpg',
        settings: {
          theme: 'dark',
          language: 'zh-CN',
          notifications: {
            email: true,
            push: false,
          },
        },
      },
      permissions: ['read', 'write', 'delete'],
    },
  },
  product: {
    name: '产品信息',
    data: {
      id: 'P001',
      name: 'MacBook Pro',
      category: '笔记本电脑',
      price: 12999,
      specs: {
        cpu: 'M1 Pro',
        memory: '16GB',
        storage: '512GB SSD',
        display: '14英寸 Liquid Retina XDR',
      },
      inStock: true,
      tags: ['Apple', '笔记本', '专业级'],
    },
  },
  config: {
    name: '系统配置',
    data: {
      database: {
        host: 'localhost',
        port: 5432,
        name: 'myapp',
        ssl: true,
      },
      cache: {
        enabled: true,
        ttl: 3600,
        maxSize: '100MB',
      },
      logging: {
        level: 'info',
        format: 'json',
        outputs: ['console', 'file'],
      },
    },
  },
}

// 可见字段配置
const availablePaths = ref<string[]>([])
const visiblePaths = ref<string[]>([])
const readonlyPaths = ref<string[]>([])
const customPath = ref('')

// 预定义颜色
const predefineColors = [
  '#ffffff',
  '#f8f9fa',
  '#e9ecef',
  '#dee2e6',
  '#ced4da',
  '#adb5bd',
  '#6c757d',
  '#495057',
  '#343a40',
  '#212529',
  '#409eff',
  '#67c23a',
  '#e6a23c',
  '#f56c6c',
  '#909399',
  '#1f2937',
  '#374151',
  '#4b5563',
  '#f3f4f6',
  '#fef3c7',
  '#fecaca',
  '#d1fae5',
  '#dbeafe',
  '#ede9fe',
]

// 监听数据变化，自动收集路径
watch(
  jsonData,
  newValue => {
    try {
      const paths = collectAllPaths(newValue)
      availablePaths.value = paths

      // 初始化时设置一些可见字段
      if (visiblePaths.value.length === 0 && paths.length > 0) {
        visiblePaths.value = paths.slice(0, Math.min(5, paths.length))
      }
    } catch (error) {
      console.warn('收集路径失败:', error)
    }
  },
  { immediate: true, deep: true }
)

const currentHeight = computed(() => {
  const height = editorHeight.value
  return isNaN(Number(height)) ? height : `${height}px`
})

const currentWidth = computed(() => {
  return editorWidth.value || '100%'
})

const currentVisiblePaths = computed(() => {
  if (visiblePaths.value.length === 0) return undefined
  return visiblePathsExclude.value
    ? availablePaths.value.filter(path => !visiblePaths.value.includes(path))
    : visiblePaths.value
})

const currentReadonlyPaths = computed(() => {
  return readonlyPaths.value.length > 0 ? readonlyPaths.value : undefined
})

// 树形结构数据
const treeData = computed((): TreeNode[] => {
  if (!parsedData.value) return []

  function buildTree(obj: any, path = ''): TreeNode[] {
    if (!obj || typeof obj !== 'object') return []

    return Object.keys(obj).map(key => {
      const value = obj[key]
      const currentPath = path ? `${path}.${key}` : key
      const node: TreeNode = {
        label: `${key}: ${getValueLabel(value)}`,
      }

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        node.children = buildTree(value, currentPath)
      }

      return node
    })
  }

  return buildTree(parsedData.value)
})

// 事件处理函数
function onJsonChange(value: any) {
  jsonData.value = value
  addEventLog('info', '数据已更新')
}

function onFormat() {
  addEventLog('success', 'JSON 已格式化')
}

function onValidate(valid: boolean) {
  isValid.value = valid
  addEventLog(valid ? 'success' : 'error', `JSON 验证${valid ? '成功' : '失败'}`)
}

function onFocus() {
  addEventLog('info', '编辑器获得焦点')
}

function onBlur() {
  addEventLog('info', '编辑器失去焦点')
}

function onFullscreen(isFullscreen: boolean) {
  addEventLog('info', `${isFullscreen ? '进入' : '退出'}全屏模式`)
}

// 工具函数
function getObjectType(obj: any): string {
  if (obj === null) return 'null'
  if (Array.isArray(obj)) return 'array'
  return typeof obj
}

function getValueLabel(value: any): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return `Array(${value.length})`
  if (typeof value === 'object') return 'Object'
  if (typeof value === 'string') return `"${value}"`
  return String(value)
}

function getFieldLabel(path: string): string {
  const labels: { [key: string]: string } = {
    name: '姓名',
    age: '年龄',
    email: '邮箱',
    address: '地址',
    'address.city': '城市',
    'address.district': '区域',
    'address.street': '街道',
    hobbies: '爱好',
    isActive: '激活状态',
    id: 'ID',
    username: '用户名',
    profile: '个人资料',
    'profile.firstName': '名字',
    'profile.lastName': '姓氏',
    'profile.avatar': '头像',
    'profile.settings': '设置',
    'profile.settings.theme': '主题',
    'profile.settings.language': '语言',
    'profile.settings.notifications': '通知设置',
    'profile.settings.notifications.email': '邮件通知',
    'profile.settings.notifications.push': '推送通知',
    permissions: '权限',
  }
  return labels[path] || path
}

function formatPreview(obj: any): string {
  if (obj === null || obj === undefined) return '无数据'
  try {
    return JSON.stringify(obj, null, 2)
  } catch {
    return '无法格式化数据'
  }
}

function addEventLog(type: EventLogItem['type'], message: string) {
  const time = new Date().toLocaleTimeString()
  eventLog.value.unshift({ time, type, message })

  // 限制日志条数
  if (eventLog.value.length > 50) {
    eventLog.value = eventLog.value.slice(0, 50)
  }
}

// 操作函数
function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  addEventLog('info', `切换到${theme.value === 'light' ? '明亮' : '暗黑'}主题`)
}

function formatJson() {
  if (editorRef.value?.format) {
    editorRef.value.format()
    addEventLog('success', '执行格式化操作')
  } else {
    ElMessage.warning('编辑器未就绪')
  }
}

function validateJson() {
  if (editorRef.value?.validate) {
    const isValid = editorRef.value.validate()
    addEventLog(isValid ? 'success' : 'error', `JSON ${isValid ? '有效' : '无效'}`)
  } else {
    try {
      JSON.parse(JSON.stringify(jsonData.value))
      addEventLog('success', 'JSON 格式正确')
      ElMessage.success('JSON 格式正确')
    } catch (error) {
      addEventLog('error', 'JSON 格式错误')
      ElMessage.error('JSON 格式错误')
    }
  }
}

function clearEditor() {
  jsonData.value = {}
  addEventLog('warning', '编辑器已清空')
  ElMessage.success('编辑器已清空')
}

function resetToDefault() {
  jsonData.value = {
    name: '张三',
    age: 30,
    email: 'zhangsan@example.com',
    address: {
      city: '北京',
      district: '朝阳区',
      street: '建国路88号',
    },
    hobbies: ['阅读', '游泳', '编程'],
    isActive: true,
  }
  addEventLog('info', '重置为默认数据')
  ElMessage.success('已重置为默认数据')
}

function loadSelectedSample(key: string) {
  const sample = sampleData[key]
  if (sample) {
    jsonData.value = sample.data
    addEventLog('success', `加载${sample.name}示例`)
    ElMessage.success(`已加载${sample.name}示例`)
  }
}

function clearEventLog() {
  eventLog.value = []
  ElMessage.success('事件日志已清空')
}

function addCustomPath() {
  const path = customPath.value.trim()
  if (!path) {
    ElMessage.warning('请输入有效的路径')
    return
  }

  if (!availablePaths.value.includes(path)) {
    availablePaths.value.push(path)
  }

  if (!visiblePaths.value.includes(path)) {
    visiblePaths.value.push(path)
    addEventLog('success', `添加自定义路径: ${path}`)
    ElMessage.success(`已添加路径: ${path}`)
  } else {
    ElMessage.warning('路径已存在')
  }

  customPath.value = ''
}

// 配置变更处理
function onReadonlyChange(value: boolean) {
  addEventLog('info', `切换到${value ? '只读' : '编辑'}模式`)
}

function onStrictModeChange(value: boolean) {
  addEventLog('info', `${value ? '启用' : '禁用'}严格模式`)
}

function onAutoFormatChange(value: boolean) {
  addEventLog('info', `${value ? '启用' : '禁用'}自动格式化`)
}

function onPathModeChange(value: boolean) {
  addEventLog('info', `切换到${value ? '排除' : '包含'}模式`)
}

function onHeightChange(value: string) {
  addEventLog('info', `高度设置为: ${value}`)
}

function onWidthChange(value: string) {
  addEventLog('info', `宽度设置为: ${value}`)
}

function onBackgroundChange(value: string) {
  addEventLog('info', `背景色设置为: ${value || '默认'}`)
}

function clearBackgroundColor() {
  backgroundColor.value = ''
  addEventLog('info', '背景色已清除')
  ElMessage.success('背景色已清除')
}

function onPlaceholderChange(value: string) {
  addEventLog('info', `占位符设置为: ${value}`)
}

function onVisiblePathsChange(paths: string[]) {
  addEventLog('info', `可见字段更新: ${paths.length} 个字段`)
}

function onReadonlyPathsChange(paths: string[]) {
  addEventLog('info', `只读字段更新: ${paths.length} 个字段`)
}
</script>

<style scoped>
.basic-example {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.demo-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.controls {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.control-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.control-group .el-button {
  min-width: 80px;
}

.config-panel {
  max-height: 600px;
  overflow-y: auto;
}

.field-config {
  padding: 10px;
  background-color: #fafafa;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.field-item {
  margin-bottom: 8px;
  padding: 4px 0;
}

.event-log {
  max-height: 250px;
  overflow-y: auto;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.event-item {
  display: flex;
  gap: 10px;
  margin-bottom: 4px;
  padding: 2px 0;
  border-bottom: 1px solid #eee;
}

.event-time {
  color: #666;
  min-width: 70px;
  font-size: 11px;
}

.event-type {
  min-width: 60px;
  font-weight: bold;
  font-size: 11px;
}

.event-success {
  color: #67c23a;
}

.event-error {
  color: #f56c6c;
}

.event-info {
  color: #409eff;
}

.event-warning {
  color: #e6a23c;
}

.event-message {
  flex: 1;
  color: #333;
  font-size: 11px;
}

.preview-section {
  min-height: 300px;
}

.formatted-preview,
.raw-preview {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  overflow: auto;
  max-height: 400px;
  font-family: 'Courier New', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.structure-preview {
  padding: 10px;
  max-height: 400px;
  overflow-y: auto;
}

.mt-10 {
  margin-top: 10px;
}

.mt-20 {
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .basic-example {
    max-width: 100%;
    padding: 10px;
  }
}

@media (max-width: 768px) {
  .control-group {
    justify-content: center;
  }

  .control-group .el-button {
    min-width: 70px;
    font-size: 12px;
  }

  .config-panel {
    max-height: 400px;
  }

  .event-log {
    max-height: 200px;
  }
}

/* 编辑器样式增强 */
:deep(.json-editor) {
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  transition: border-color 0.3s;
}

:deep(.json-editor:hover) {
  border-color: #c0c4cc;
}

:deep(.json-editor.is-focused) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 折叠面板样式 */
:deep(.el-collapse-item__header) {
  font-weight: 600;
  background-color: #f8f9fa;
}

:deep(.el-collapse-item__content) {
  padding: 10px 20px;
  background-color: #ffffff;
}

/* 描述列表样式 */
:deep(.el-descriptions__title) {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-descriptions__label) {
  font-weight: 500;
}

/* 树形组件样式 */
:deep(.el-tree-node__content) {
  height: auto;
  min-height: 26px;
  padding: 2px 0;
}

:deep(.el-tree-node__label) {
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

/* 标签页样式 */
:deep(.el-tabs__item) {
  font-weight: 500;
}

:deep(.el-tabs__content) {
  padding: 15px;
}

/* 输入框组样式 */
:deep(.el-input-group__prepend) {
  background-color: #f5f7fa;
  border-color: #dcdfe6;
  color: #606266;
  font-weight: 500;
}

/* 开关样式 */
:deep(.el-switch__label) {
  font-size: 12px;
}

/* 复选框样式 */
:deep(.el-checkbox__label) {
  font-size: 13px;
  padding-left: 8px;
}

/* 选择器样式 */
:deep(.el-select) {
  width: 100%;
}

/* 按钮样式增强 */
.el-button + .el-button {
  margin-left: 8px;
}

/* 卡片头部样式 */
:deep(.el-card__header) {
  background-color: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
}

:deep(.el-card__body) {
  padding: 20px;
}

/* 加载状态样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  color: #909399;
  font-size: 14px;
  padding: 40px 20px;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

/* 颜色选择器样式 */
.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #f5f7fa;
}

.color-picker-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  min-width: 30px;
}

.color-clear-btn {
  padding: 4px 8px !important;
  font-size: 12px !important;
  height: auto !important;
  line-height: 1 !important;
}

:deep(.el-color-picker__trigger) {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: border-color 0.3s;
}

:deep(.el-color-picker__trigger:hover) {
  border-color: #409eff;
}
</style>
