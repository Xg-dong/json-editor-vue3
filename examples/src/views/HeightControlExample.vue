<template>
  <div class="height-control-example">
    <h2>高度控制示例</h2>
    <el-alert title="高度失控问题说明" type="warning" :closable="false" show-icon>
      <p>在某些布局环境中，JsonEditor可能出现高度失控的问题，主要原因包括：</p>
      <ul>
        <li>ResizeObserver循环依赖导致无限布局</li>
        <li>Monaco Editor与容器CSS产生冲突</li>
        <li>在flex或grid布局中缺乏明确的尺寸约束</li>
      </ul>
      <p><strong>解决方案：使用 :fixed-height="true" 和明确的 :width 属性</strong></p>
    </el-alert>

    <!-- 控制面板 -->
    <div class="control-panel">
      <h3>示例控制面板</h3>
      <el-alert
        title="安全提示"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 15px"
      >
        <p>错误示例可能导致浏览器性能问题，默认关闭。请谨慎开启。</p>
      </el-alert>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-switch
            v-model="showWidthErrorExample"
            active-text="显示宽度错误示例"
            inactive-text="隐藏宽度错误示例"
            active-color="#f56c6c"
            inactive-color="#409eff"
          />
        </el-col>
        <el-col :span="8">
          <el-switch
            v-model="showHeightErrorExample"
            active-text="显示高度错误示例"
            inactive-text="隐藏高度错误示例"
            active-color="#f56c6c"
            inactive-color="#409eff"
          />
        </el-col>
        <el-col :span="8">
          <el-button @click="resetAllData" type="primary">重置所有数据</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="demo-section">
      <h3>1. 高度控制对比示例</h3>

      <div v-if="showHeightErrorExample">
        <h4>❌ 错误示例（可能高度失控）</h4>
        <el-alert
          title="注意：此示例可能导致高度失控"
          type="error"
          :closable="false"
          show-icon
          style="margin-bottom: 15px"
        >
          <p>这个示例故意不使用 fixed-height 属性，在某些情况下可能出现高度无限增长。</p>
        </el-alert>
        <div class="error-container">
          <JsonEditor v-model="jsonData1" :height="200" :width="'100%'" placeholder="{}" />
        </div>
      </div>

      <h4 :style="{ marginTop: showHeightErrorExample ? '20px' : '0' }">✅ 正确示例（高度受控）</h4>
      <JsonEditor
        v-model="jsonData1"
        :height="200"
        :width="'100%'"
        :fixed-height="true"
        placeholder="{}"
      />
    </div>

    <div class="demo-section">
      <h3>2. 在Flex容器中的宽度控制对比示例</h3>

      <div v-if="showWidthErrorExample">
        <h4>❌ 错误示例（可能宽度失控）</h4>
        <el-alert
          title="注意：此示例可能导致宽度失控"
          type="error"
          :closable="false"
          show-icon
          style="margin-bottom: 15px"
        >
          <p>这个示例故意不设置正确的CSS约束，可能导致宽度无限增长。</p>
        </el-alert>
        <div class="flex-container-wrong">
          <div class="flex-item-wrong">
            <JsonEditor v-model="jsonData3" :height="150" placeholder="{}" />
          </div>
          <div class="flex-item-wrong">
            <JsonEditor v-model="jsonData4" :height="150" placeholder="{}" />
          </div>
        </div>
      </div>

      <h4 :style="{ marginTop: showWidthErrorExample ? '20px' : '0' }">✅ 正确示例（尺寸受控）</h4>
      <div class="flex-container">
        <div class="flex-item">
          <JsonEditor
            v-model="jsonData3"
            :height="150"
            :width="'100%'"
            :fixed-height="true"
            placeholder="{}"
          />
        </div>
        <div class="flex-item">
          <JsonEditor
            v-model="jsonData4"
            :height="150"
            :width="'100%'"
            :fixed-height="true"
            placeholder="{}"
          />
        </div>
      </div>
    </div>
    <div class="demo-section">
      <h3>4. 复杂布局示例</h3>
      <div class="complex-layout">
        <div class="left-panel">
          <h4>配置面板</h4>
          <el-form label-width="80px">
            <el-form-item label="宽度">
              <el-slider v-model="dynamicWidth" :min="200" :max="600" />
            </el-form-item>
            <el-form-item label="高度">
              <el-slider v-model="dynamicHeight" :min="100" :max="400" />
            </el-form-item>
          </el-form>
        </div>
        <div class="right-panel">
          <h4>动态尺寸编辑器</h4>
          <div
            class="dynamic-container"
            :style="{ width: dynamicWidth + 'px', height: dynamicHeight + 'px' }"
          >
            <JsonEditor
              v-model="jsonData5"
              :height="dynamicHeight"
              :width="'100%'"
              :fixed-height="true"
              placeholder="{}"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>5. 大数据测试</h3>
      <el-button @click="loadLargeData">加载大量数据测试</el-button>
      <JsonEditor
        v-model="largeData"
        :height="300"
        :width="'100%'"
        :fixed-height="true"
        placeholder="{}"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JsonEditor from '../../../src/JsonEditor.vue'

// 控制开关
const showWidthErrorExample = ref(false)
const showHeightErrorExample = ref(false)

// 数据
const jsonData1 = ref({
  name: '测试数据1',
  value: 123,
})

const jsonData2 = ref({
  name: '测试数据2',
  value: 456,
})

const jsonData3 = ref({
  left: '左侧数据',
})

const jsonData4 = ref({
  right: '右侧数据',
})

const jsonData5 = ref({
  dynamic: '动态尺寸测试',
  config: {
    width: 300,
    height: 200,
  },
})

const dynamicWidth = ref(300)
const dynamicHeight = ref(200)

const largeData = ref({})

function loadLargeData() {
  // 生成大量数据来测试高度控制
  const data: any = {}
  for (let i = 0; i < 100; i++) {
    data[`field_${i}`] = {
      id: i,
      name: `字段${i}`,
      description: `这是第${i}个字段的描述信息，用于测试大量数据时的高度控制效果`,
      metadata: {
        type: 'string',
        required: i % 2 === 0,
        default: `默认值${i}`,
      },
      nested: {
        level1: {
          level2: {
            level3: `深层嵌套数据${i}`,
          },
        },
      },
    }
  }
  largeData.value = data
}

function resetAllData() {
  jsonData1.value = {
    name: '测试数据1',
    value: 123,
  }
  jsonData2.value = {
    name: '测试数据2',
    value: 456,
  }
  jsonData3.value = {
    left: '左侧数据',
  }
  jsonData4.value = {
    right: '右侧数据',
  }
  jsonData5.value = {
    dynamic: '动态尺寸测试',
    config: {
      width: 300,
      height: 200,
    },
  }
  largeData.value = {}
  dynamicWidth.value = 300
  dynamicHeight.value = 200
}
</script>

<style scoped>
.height-control-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.demo-section h3 {
  margin-top: 0;
  color: #409eff;
}

.control-panel {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.control-panel h3 {
  margin-top: 0;
  color: #606266;
}

.error-container {
  border: 2px dashed #f56c6c;
  padding: 15px;
  border-radius: 4px;
  background-color: #fef0f0;
  margin-bottom: 15px;
}

.flex-container {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  width: 100%;
  overflow: hidden;
}

.flex-item {
  flex: 1;
  min-width: 0; /* 重要：防止flex item超出容器 */
  max-width: 50%; /* 限制最大宽度 */
  overflow: hidden;
}

/* 错误示例的样式 - 故意不限制尺寸 */
.flex-container-wrong {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  border: 2px dashed #f56c6c;
  padding: 10px;
  border-radius: 4px;
  background-color: #fef0f0;
}

.flex-item-wrong {
  flex: 1;
  /* 注意：这里故意不添加 min-width: 0 和 max-width 约束 */
}

.complex-layout {
  display: flex;
  gap: 20px;
  margin-top: 15px;
}

.left-panel {
  width: 250px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  flex-shrink: 0;
}

.right-panel {
  flex: 1;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  min-width: 0;
}

.dynamic-container {
  border: 2px dashed #409eff;
  border-radius: 4px;
  padding: 10px;
  transition: all 0.3s ease;
  overflow: hidden;
  resize: none;
}
</style>
