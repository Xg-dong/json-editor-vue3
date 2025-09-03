<template>
  <div class="form-example-container">
    <div class="example-header">
      <h2>📋 Element Plus 表单集成示例</h2>
      <p>演示 JsonEditor 组件在 Element Plus 表单中的使用，包括表单验证、数据绑定等功能。</p>
    </div>

    <div class="example-content">
      <!-- 基础表单示例 -->
      <el-card class="example-card" header="基础表单集成">
        <el-form
          ref="basicFormRef"
          :model="basicForm"
          :rules="basicRules"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="basicForm.username" placeholder="请输入用户名" />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="basicForm.email" placeholder="请输入邮箱" />
          </el-form-item>

          <el-form-item label="配置信息" prop="config">
            <JsonEditor
              v-model="basicForm.config"
              placeholder='{"theme": "light", "language": "zh"}'
              :auto-format="true"
              :show-format-button="true"
              @update:error="handleConfigError"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitBasicForm">提交</el-button>
            <el-button @click="resetBasicForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 高级表单示例 -->
      <el-card class="example-card" header="高级表单集成 - 带验证">
        <el-form
          ref="advancedFormRef"
          :model="advancedForm"
          :rules="advancedRules"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="advancedForm.projectName" placeholder="请输入项目名称" />
          </el-form-item>

          <el-form-item label="项目类型" prop="projectType">
            <el-select v-model="advancedForm.projectType" placeholder="请选择项目类型">
              <el-option label="Web应用" value="web" />
              <el-option label="移动应用" value="mobile" />
              <el-option label="桌面应用" value="desktop" />
            </el-select>
          </el-form-item>

          <el-form-item label="环境配置" prop="envConfig" required>
            <JsonEditor
              v-model="advancedForm.envConfig"
              :height="250"
              placeholder='{
  "development": {
    "api": "http://localhost:3000",
    "debug": true
  },
  "production": {
    "api": "https://api.example.com",
    "debug": false
  }
}'
              :auto-format="true"
              :show-format-button="true"
              :show-fullscreen-button="true"
              @update:error="handleEnvConfigError"
            />
          </el-form-item>

          <el-form-item label="特性配置" prop="features">
            <JsonEditor
              v-model="advancedForm.features"
              :height="200"
              :visible-paths="['name', 'enabled', 'config.timeout']"
              :readonly-paths="['name']"
              placeholder='{
  "authentication": {
    "name": "认证模块",
    "enabled": true,
    "config": {
      "timeout": 3600
    }
  }
}'
              :auto-format="true"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitAdvancedForm">提交</el-button>
            <el-button @click="resetAdvancedForm">重置</el-button>
            <el-button type="info" @click="previewFormData">预览数据</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 动态表单示例 -->
      <el-card class="example-card" header="动态表单 - JSON Schema">
        <el-form
          ref="dynamicFormRef"
          :model="dynamicForm"
          :rules="dynamicRules"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="Schema定义" prop="schema">
            <JsonEditor
              v-model="dynamicForm.schema"
              :height="300"
              :auto-format="true"
              :show-format-button="true"
              @update:error="handleSchemaError"
            />
          </el-form-item>

          <el-form-item label="数据验证" prop="data">
            <JsonEditor
              v-model="dynamicForm.data"
              :height="200"
              :auto-format="true"
              @update:error="handleDataError"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="validateSchema">验证Schema</el-button>
            <el-button @click="generateSampleData">生成示例数据</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 表单数据展示 -->
      <el-card class="example-card" header="当前表单数据">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基础表单" name="basic">
            <JsonEditor
              :model-value="basicForm"
              :readonly="true"
              :height="200"
              :auto-format="true"
            />
          </el-tab-pane>

          <el-tab-pane label="高级表单" name="advanced">
            <JsonEditor
              :model-value="advancedForm"
              :readonly="true"
              :height="300"
              :auto-format="true"
            />
          </el-tab-pane>

          <el-tab-pane label="动态表单" name="dynamic">
            <JsonEditor
              :model-value="dynamicForm"
              :readonly="true"
              :height="300"
              :auto-format="true"
            />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import JsonEditor from '../../../src/JsonEditor.vue'
import type { FormInstance, FormRules } from 'element-plus'

// 表单引用
const basicFormRef = ref<FormInstance>()
const advancedFormRef = ref<FormInstance>()
const dynamicFormRef = ref<FormInstance>()

// 选项卡状态
const activeTab = ref('basic')

// 错误状态
const configError = ref<string | null>(null)
const envConfigError = ref<string | null>(null)
const schemaError = ref<string | null>(null)
const dataError = ref<string | null>(null)

// 基础表单数据
const basicForm = reactive({
  username: 'admin',
  email: 'admin@example.com',
  config: {
    theme: 'light',
    language: 'zh',
    notifications: true,
    autoSave: false,
  },
})

// 高级表单数据
const advancedForm = reactive({
  projectName: '示例项目',
  projectType: 'web',
  envConfig: {
    development: {
      api: 'http://localhost:3000',
      debug: true,
      cors: true,
    },
    production: {
      api: 'https://api.example.com',
      debug: false,
      cors: false,
    },
  },
  features: {
    authentication: {
      name: '认证模块',
      enabled: true,
      config: {
        timeout: 3600,
        maxAttempts: 3,
      },
    },
    logging: {
      name: '日志模块',
      enabled: true,
      config: {
        level: 'info',
        retention: 30,
      },
    },
  },
})

// 动态表单数据
const dynamicForm = reactive({
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 50,
      },
      age: {
        type: 'number',
        minimum: 0,
        maximum: 120,
      },
      email: {
        type: 'string',
        format: 'email',
      },
    },
    required: ['name', 'email'],
  },
  data: {
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com',
  },
})

// 自定义验证函数
const validateJsonConfig = (rule: any, value: any, callback: any) => {
  if (configError.value) {
    callback(new Error(configError.value))
  } else if (!value || typeof value !== 'object') {
    callback(new Error('请输入有效的JSON配置'))
  } else {
    callback()
  }
}

const validateEnvConfig = (rule: any, value: any, callback: any) => {
  if (envConfigError.value) {
    callback(new Error(envConfigError.value))
  } else if (!value || typeof value !== 'object') {
    callback(new Error('请输入有效的环境配置'))
  } else if (!value.development || !value.production) {
    callback(new Error('必须包含 development 和 production 环境配置'))
  } else {
    callback()
  }
}

// 表单验证规则
const basicRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度应为 2-20 字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  config: [{ validator: validateJsonConfig, trigger: 'change' }],
}

const advancedRules: FormRules = {
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  projectType: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
  envConfig: [{ validator: validateEnvConfig, trigger: 'change' }],
}

const dynamicRules: FormRules = {
  schema: [{ required: true, message: '请输入Schema定义', trigger: 'change' }],
  data: [{ required: true, message: '请输入验证数据', trigger: 'change' }],
}

// 错误处理函数
const handleConfigError = (error: string | null) => {
  configError.value = error
  basicFormRef.value?.validateField('config')
}

const handleEnvConfigError = (error: string | null) => {
  envConfigError.value = error
  advancedFormRef.value?.validateField('envConfig')
}

const handleSchemaError = (error: string | null) => {
  schemaError.value = error
}

const handleDataError = (error: string | null) => {
  dataError.value = error
}

// 表单提交函数
const submitBasicForm = async () => {
  if (!basicFormRef.value) return

  try {
    await basicFormRef.value.validate()
    ElMessage.success('基础表单验证通过！')
    console.log('基础表单数据:', basicForm)
  } catch (error) {
    ElMessage.error('表单验证失败，请检查输入')
  }
}

const submitAdvancedForm = async () => {
  if (!advancedFormRef.value) return

  try {
    await advancedFormRef.value.validate()
    ElMessage.success('高级表单验证通过！')
    console.log('高级表单数据:', advancedForm)
  } catch (error) {
    ElMessage.error('表单验证失败，请检查输入')
  }
}

// 表单重置函数
const resetBasicForm = () => {
  basicFormRef.value?.resetFields()
  Object.assign(basicForm, {
    username: '',
    email: '',
    config: {},
  })
}

const resetAdvancedForm = () => {
  advancedFormRef.value?.resetFields()
  Object.assign(advancedForm, {
    projectName: '',
    projectType: '',
    envConfig: {},
    features: {},
  })
}

// 预览表单数据
const previewFormData = () => {
  ElMessageBox.alert(JSON.stringify(advancedForm, null, 2), '表单数据预览', {
    confirmButtonText: '确定',
    customClass: 'json-preview-dialog',
  })
}

// Schema验证
const validateSchema = () => {
  if (schemaError.value || dataError.value) {
    ElMessage.error('请先修复JSON格式错误')
    return
  }

  try {
    // 这里可以集成实际的JSON Schema验证库
    ElMessage.success('Schema验证通过！')
  } catch (error) {
    ElMessage.error('Schema验证失败')
  }
}

// 生成示例数据
const generateSampleData = () => {
  if (dynamicForm.schema && dynamicForm.schema.properties) {
    const sampleData: any = {}
    const props = dynamicForm.schema.properties

    for (const [key, prop] of Object.entries(props as any)) {
      if (prop.type === 'string') {
        sampleData[key] = `示例${key}`
      } else if (prop.type === 'number') {
        sampleData[key] = 123
      } else if (prop.type === 'boolean') {
        sampleData[key] = true
      }
    }

    dynamicForm.data = sampleData
    ElMessage.success('已生成示例数据')
  }
}
</script>

<style scoped>
.form-example-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.example-header {
  margin-bottom: 20px;
  text-align: center;
}

.example-header h2 {
  color: #409eff;
  margin-bottom: 10px;
}

.example-header p {
  color: #666;
  font-size: 14px;
}

.example-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.example-card {
  margin-bottom: 20px;
}

.example-card :deep(.el-card__header) {
  background-color: #f5f7fa;
  font-weight: bold;
  color: #409eff;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 5px;
}

:deep(.json-preview-dialog) {
  width: 600px;
}

:deep(.json-preview-dialog .el-message-box__content) {
  font-family: 'Courier New', Monaco, monospace;
  white-space: pre-wrap;
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-example-container {
    padding: 10px;
  }

  .example-content {
    gap: 15px;
  }

  :deep(.el-form-item__label) {
    font-size: 14px;
  }
}
</style>
