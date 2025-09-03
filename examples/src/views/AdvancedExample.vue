<template>
  <div class="advanced-example">
    <el-card class="demo-card">
      <template #header>
        <h2>高级功能演示</h2>
        <p>展示字段可见性控制、只读模式、全屏编辑等高级功能</p>
      </template>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-card>
            <template #header>
              <h3>字段可见性控制</h3>
            </template>

            <el-row :gutter="20">
              <el-col :span="8">
                <h4>字段配置</h4>
                <div class="field-controls">
                  <div v-for="field in availableFields" :key="field" class="field-item">
                    <el-checkbox v-model="visibleFields[field]" @change="updateVisibility">
                      {{ fieldLabels[field] }}
                    </el-checkbox>
                  </div>

                  <el-divider />

                  <h5>自定义字段路径</h5>
                  <el-input
                    v-model="customFieldPath"
                    placeholder="如: profile.settings.theme"
                    @keyup.enter="addCustomField"
                  />
                  <el-button type="primary" size="small" @click="addCustomField" class="mt-10">
                    添加字段
                  </el-button>
                </div>
              </el-col>

              <el-col :span="16">
                <JsonEditor
                  ref="visibilityEditorRef"
                  v-model="visibilityData"
                  :height="350"
                  :visible-paths="currentVisibleFields"
                  :show-format-button="true"
                  @change="onVisibilityChange"
                />
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mt-20">
        <el-col :span="12">
          <el-card>
            <template #header>
              <h3>只读模式</h3>
            </template>

            <div class="readonly-controls">
              <el-switch v-model="isReadonly" active-text="只读模式" inactive-text="编辑模式" />

              <el-button type="info" @click="loadReadonlyData" class="ml-10"> 加载数据 </el-button>
            </div>

            <JsonEditor
              v-model="readonlyData"
              :height="300"
              :readonly="isReadonly"
              :show-copy-button="true"
            />
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card>
            <template #header>
              <h3>主题和样式</h3>
            </template>

            <div class="theme-controls">
              <el-radio-group v-model="selectedTheme" @change="updateTheme">
                <el-radio value="light">浅色主题</el-radio>
                <el-radio value="dark">深色主题</el-radio>
              </el-radio-group>

              <el-divider />

              <el-button type="success" @click="toggleFullscreen" :icon="FullScreen">
                全屏编辑
              </el-button>
            </div>

            <JsonEditor
              v-model="themeData"
              :height="250"
              :theme="selectedTheme"
              :show-fullscreen-button="true"
              @fullscreen="onFullscreen"
            />
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mt-20">
        <el-col :span="24">
          <el-card>
            <template #header>
              <h3>事件监听演示</h3>
            </template>

            <el-row :gutter="20">
              <el-col :span="12">
                <JsonEditor
                  v-model="eventData"
                  :height="300"
                  @change="onEventChange"
                  @focus="onEventFocus"
                  @blur="onEventBlur"
                  @format="onEventFormat"
                  @validate="onEventValidate"
                  @copy="onEventCopy"
                />
              </el-col>

              <el-col :span="12">
                <div class="event-log">
                  <h4>事件日志</h4>
                  <div class="log-content">
                    <div
                      v-for="(log, index) in eventLogs"
                      :key="index"
                      class="log-item"
                      :class="`log-${log.type}`"
                    >
                      <span class="log-time">{{ log.time }}</span>
                      <span class="log-event">{{ log.event }}</span>
                      <span class="log-detail">{{ log.detail }}</span>
                    </div>
                  </div>
                  <el-button size="small" @click="clearLogs" class="mt-10"> 清空日志 </el-button>
                </div>
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
import { FullScreen } from '@element-plus/icons-vue'
import JsonEditor from '../../../src/JsonEditor.vue'
import { ElMessage } from 'element-plus'

// 类型定义
interface VisibleFields {
  [key: string]: boolean
}

interface FieldLabels {
  [key: string]: string
}

interface EventLog {
  time: string
  event: string
  detail: string
  type: 'info' | 'success' | 'error' | 'warning'
}

// 字段可见性控制
const availableFields = ['name', 'age', 'email', 'address', 'hobbies', 'profile', 'settings']
const fieldLabels: FieldLabels = {
  name: '姓名',
  age: '年龄',
  email: '邮箱',
  address: '地址',
  hobbies: '爱好',
  profile: '个人资料',
  settings: '设置',
}

const visibleFields = ref<VisibleFields>({
  name: true,
  age: true,
  email: true,
  address: false,
  hobbies: true,
  profile: false,
  settings: false,
})

const customFieldPath = ref('')
const visibilityEditorRef = ref()

const visibilityData = ref({
  name: '李四',
  age: 28,
  email: 'lisi@example.com',
  address: {
    city: '上海',
    district: '浦东新区',
    street: '陆家嘴环路1000号',
  },
  hobbies: ['音乐', '旅行', '摄影'],
  profile: {
    bio: '前端开发工程师',
    skills: ['Vue', 'React', 'TypeScript'],
    experience: 5,
  },
  settings: {
    theme: 'dark',
    language: 'zh-CN',
    notifications: {
      email: true,
      push: false,
      sms: true,
    },
  },
})

const currentVisibleFields = computed(() => {
  return Object.keys(visibleFields.value).filter(key => visibleFields.value[key])
})

// 只读模式
const isReadonly = ref(false)
const readonlyData = ref<any>({
  system: {
    version: '1.0.0',
    build: '20240109',
    environment: 'production',
  },
  config: {
    api: {
      baseUrl: 'https://api.example.com',
      timeout: 5000,
      retries: 3,
    },
    features: {
      authentication: true,
      logging: true,
      monitoring: true,
    },
  },
})

// 主题控制
const selectedTheme = ref<'light' | 'dark'>('light')
const themeData = ref({
  ui: {
    primaryColor: '#409eff',
    secondaryColor: '#67c23a',
    layout: {
      sidebar: true,
      header: true,
      footer: false,
    },
  },
  features: ['editor', 'preview', 'export'],
})

// 事件监听
const eventData = ref({
  message: 'Hello World',
  timestamp: new Date().toISOString(),
  data: {
    count: 0,
    items: ['item1', 'item2'],
  },
})

const eventLogs = ref<EventLog[]>([])

function updateVisibility() {
  // 触发编辑器更新可见字段
  if (
    visibilityEditorRef.value &&
    typeof visibilityEditorRef.value.updateVisibleFields === 'function'
  ) {
    visibilityEditorRef.value.updateVisibleFields(currentVisibleFields.value)
  }
}

function addCustomField() {
  if (customFieldPath.value.trim()) {
    const path = customFieldPath.value.trim()
    visibleFields.value[path] = true
    customFieldPath.value = ''
    updateVisibility()
    ElMessage.success(`已添加字段: ${path}`)
  }
}

function onVisibilityChange(value: any) {
  visibilityData.value = value
}

function loadReadonlyData() {
  readonlyData.value = {
    system: {
      version: '1.0.0',
      build: '20240109',
      environment: 'production',
    },
    config: {
      api: {
        baseUrl: 'https://api.example.com',
        timeout: 5000,
        retries: 3,
      },
      features: {
        authentication: true,
        logging: true,
        monitoring: true,
      },
    },
    timestamp: new Date().toISOString(),
    data: {
      users: Math.floor(Math.random() * 1000),
      orders: Math.floor(Math.random() * 500),
      revenue: (Math.random() * 100000).toFixed(2),
    },
    status: 'active',
  }
  ElMessage.success('已加载新数据')
}

function updateTheme() {
  ElMessage.info(`已切换到${selectedTheme.value === 'light' ? '浅色' : '深色'}主题`)
}

function toggleFullscreen() {
  ElMessage.info('请点击编辑器右上角的全屏按钮')
}

function onFullscreen(isFullscreen: boolean) {
  ElMessage.success(`${isFullscreen ? '进入' : '退出'}全屏模式`)
}

// 事件处理函数
function addEventLog(event: string, detail: string, type: EventLog['type'] = 'info') {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    event,
    detail,
    type,
  })

  // 限制日志数量
  if (eventLogs.value.length > 50) {
    eventLogs.value = eventLogs.value.slice(0, 50)
  }
}

function onEventChange(value: any) {
  eventData.value = value
  addEventLog('change', `数据已更新: ${JSON.stringify(value).length} 字符`, 'success')
}

function onEventFocus() {
  addEventLog('focus', '编辑器获得焦点', 'info')
}

function onEventBlur() {
  addEventLog('blur', '编辑器失去焦点', 'info')
}

function onEventFormat() {
  addEventLog('format', 'JSON 已格式化', 'success')
}

function onEventValidate(valid: boolean) {
  addEventLog('validate', `验证结果: ${valid ? '有效' : '无效'}`, valid ? 'success' : 'error')
}

function onEventCopy() {
  addEventLog('copy', '内容已复制到剪贴板', 'success')
}

function clearLogs() {
  eventLogs.value = []
}
</script>

<style scoped>
.advanced-example {
  max-width: 1400px;
  margin: 0 auto;
}

.demo-card {
  margin-bottom: 20px;
}

.field-controls {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #e6e6e6;
}

.field-item {
  margin-bottom: 10px;
}

.readonly-controls {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.theme-controls {
  margin-bottom: 15px;
}

.event-log {
  height: 300px;
  display: flex;
  flex-direction: column;
}

.log-content {
  flex: 1;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 10px;
  background-color: #f9f9f9;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.log-item {
  margin-bottom: 5px;
  display: flex;
  gap: 10px;
}

.log-time {
  color: #666;
  min-width: 80px;
}

.log-event {
  font-weight: bold;
  min-width: 80px;
}

.log-detail {
  color: #333;
}

.log-success .log-event {
  color: #67c23a;
}

.log-error .log-event {
  color: #f56c6c;
}

.log-info .log-event {
  color: #409eff;
}

.mt-10 {
  margin-top: 10px;
}

.mt-20 {
  margin-top: 20px;
}

.ml-10 {
  margin-left: 10px;
}
</style>
