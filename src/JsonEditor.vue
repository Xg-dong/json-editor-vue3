<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue'
import {
  Expand as FullIcon,
  Close as ExitFullIcon,
  MagicStick as FormatIcon,
} from '@element-plus/icons-vue'
import {
  mergeFieldsSuper,
  pickFieldsSuper,
  findReadonlyFieldRanges,
  isReadonlyValueChanged,
} from './utils/index'
import { ElMessage } from 'element-plus'
import type { JsonItem, JsonEditorMethods } from './type'

const props = withDefaults(defineProps<JsonItem>(), {
  modelValue: () => ({}),
  readonly: false,
  visiblePathsExclude: false,
  height: 300,
  theme: 'light',
  placeholder: '{}',
  showFormatButton: true,
  showFullscreenButton: true,
  autoFormat: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: object | string]
  'update:error': [error: string | null]
  focus: []
  blur: []
  format: []
  fullscreen: [isFullscreen: boolean]
}>()

const elFormItem = computed(() => props.elFormItem?.proxy || props.elFormItem)
const editorContainer = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let readonlyDecorationCollection: monaco.editor.IEditorDecorationsCollection | null = null

const isFullscreen = ref(false)
const isJsonValid = ref(true)
const errorMessage = ref('')
const monacoTheme = ref('vs')
let observer: MutationObserver | null = null
let resizeObserver: ResizeObserver | null = null

let isInternalChange = false
let isResetting = false
let lastValidValue = ''
const visiblePathsExclude = computed(() => props.visiblePathsExclude ?? false)
const isReadonly = computed(() => props.readonly || false)

const initialValue = computed(() => {
  try {
    let value =
      typeof props.modelValue === 'string'
        ? JSON.parse(props.modelValue || props.placeholder)
        : props.modelValue
    if (props.visiblePaths?.length) {
      value = pickFieldsSuper(value, props.visiblePaths, visiblePathsExclude.value)
    }
    return JSON.stringify(value, null, 2)
  } catch {
    return props.placeholder
  }
})

// 主题管理
const currentTheme = computed(() => {
  if (props.theme === 'dark') return 'vs-dark'
  if (props.theme === 'light') return 'vs'

  // 自动检测主题
  const isDark =
    document.documentElement.classList.contains('dark') ||
    document.documentElement.getAttribute('data-theme') === 'dark'
  return isDark ? 'vs-dark' : 'vs'
})

const pushErrorOfVueFormItemValidation = (state: string = 'error', message: string) => {
  isJsonValid.value = false
  errorMessage.value = message
  if (elFormItem.value) {
    console.debug('Pushing error to Vue Form Item:', state, message)
    elFormItem.value.validateState = state
    elFormItem.value.validateMessage = message
  }
  emit('update:error', message)
}

const clearErrorOfVueFormItemValidation = () => {
  isJsonValid.value = true
  errorMessage.value = ''
  elFormItem.value?.clearValidate?.()
  emit('update:error', '')
}

function updateMonacoTheme() {
  monacoTheme.value = currentTheme.value
  if (editor) monaco.editor.setTheme(monacoTheme.value)
}

function validate(): boolean {
  if (!editor) return false
  const value = editor.getValue()
  try {
    const parsed = JSON.parse(value)
    if (props.strict && (typeof parsed !== 'object' || parsed === null)) {
      throw new Error('Must be a JSON object in strict mode.')
    }
    return true
  } catch (err: any) {
    pushErrorOfVueFormItemValidation('error', err?.message || 'JSON format error')
    return false
  }
}

function reset() {
  if (editor) {
    setEditorValue(initialValue.value)
    clearErrorOfVueFormItemValidation()
  }
}

async function handleEditorChange() {
  if (!editor) return
  if (!validate()) return

  const editedValue = editor.getValue()
  if (isJsonValid.value) {
    const parsed = JSON.parse(editedValue)

    if (props.visiblePaths?.length) {
      const merged = mergeFieldsSuper(
        parsed,
        typeof props.modelValue === 'string' ? JSON.parse(props.modelValue) : props.modelValue,
        props.visiblePaths,
        !visiblePathsExclude.value
      )
      console.debug('Merged value:', merged)
      isInternalChange = true
      emit('update:modelValue', merged)
    } else {
      isInternalChange = true
      emit('update:modelValue', parsed)
    }
  }
}

// 编辑器焦点事件处理
function handleEditorFocus() {
  emit('focus')
}

function handleEditorBlur() {
  emit('blur')
  if (validate()) {
    elFormItem.value?.validate()
    handleEditorChange()
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (isFullscreen.value && e.key === 'Escape') {
    e.stopPropagation()
    e.preventDefault()
    toggleFullscreen()
  }
}

function applyReadonlyDecorations() {
  if (!editor || !props.readonlyPaths?.length || isReadonly.value) return
  const model = editor.getModel()
  if (!model) return

  const jsonText = model.getValue()
  const ranges = findReadonlyFieldRanges(jsonText, props.readonlyPaths, {
    includeComma: false,
  })

  const decorations = ranges.map(range => {
    const startPos = model.getPositionAt(range.start)
    const endPos = model.getPositionAt(range.end)
    return {
      range: new monaco.Range(
        startPos.lineNumber,
        startPos.column,
        endPos.lineNumber,
        endPos.column
      ),
      options: {
        inlineClassName: 'json-readonly-highlight',
        stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        // 阻止键盘和鼠标编辑
        hoverMessage: { value: '只读字段不可编辑' },
        // 阻止光标进入只读区域
        afterCursorSticky: 'never',
      },
    }
  })

  if (readonlyDecorationCollection) {
    readonlyDecorationCollection.set(decorations)
  } else {
    readonlyDecorationCollection = editor.createDecorationsCollection(decorations)
  }
}

function setEditorValue(value: string) {
  if (!editor) return

  const viewState = editor.saveViewState()
  const oldModel = editor.getModel()
  const newModel = monaco.editor.createModel(value, 'json')
  editor.setModel(newModel)
  if (oldModel && oldModel !== newModel) {
    oldModel.dispose()
  }

  // 使用 setTimeout 来确保模型设置完成后再恢复状态
  setTimeout(() => {
    try {
      if (viewState) editor!.restoreViewState(viewState)
      editor!.focus()
    } catch (err: any) {
      if (err?.message !== 'Canceled') {
        console.error('restoreViewState failed:', err)
      }
    }
    bindModelListeners()
  }, 0)
}

function bindModelListeners() {
  if (!editor) return
  const model = editor.getModel()
  if (!model) return

  lastValidValue = editor.getValue()

  editor.onDidChangeModelContent(() => {
    applyReadonlyDecorations()
    if (!editor || isResetting) {
      isResetting = false
      return
    }

    try {
      if (
        isReadonlyValueChanged(initialValue.value, editor.getValue(), props.readonlyPaths || [])
      ) {
        isResetting = true
        setEditorValue(lastValidValue)
        ElMessage.warning('只读字段不可编辑')
        return
      }
    } catch (err: any) {
      pushErrorOfVueFormItemValidation('error', err?.message || 'JSON format error')
    }

    try {
      JSON.parse(editor.getValue())
      lastValidValue = editor.getValue()
      clearErrorOfVueFormItemValidation()
    } catch {}
  })

  editor.onDidBlurEditorText(() => {
    handleEditorBlur()
  })

  editor.onDidFocusEditorText(() => {
    handleEditorFocus()
  })

  applyReadonlyDecorations()
}

onMounted(() => {
  updateMonacoTheme()
  observer = new MutationObserver(updateMonacoTheme)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme'],
  })

  editor = monaco.editor.create(editorContainer.value!, {
    value: initialValue.value,
    language: 'json',
    theme: currentTheme.value,
    automaticLayout: false,
    minimap: { enabled: false },
    scrollbar: { vertical: 'auto', horizontal: 'auto' },
    readOnly: isReadonly.value,
    wordWrap: 'on',
    formatOnPaste: props.autoFormat,
    formatOnType: props.autoFormat,
  })

  bindModelListeners()

  resizeObserver = new ResizeObserver(() => editor?.layout())
  resizeObserver.observe(editorContainer.value!)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  resizeObserver?.disconnect()
  editor?.dispose()
  readonlyDecorationCollection?.clear()
})

watch(
  () => currentTheme.value,
  val => {
    monacoTheme.value = val
    if (editor) monaco.editor.setTheme(val)
  }
)

watch(
  () => isReadonly.value,
  val => editor?.updateOptions({ readOnly: val })
)

watch(
  () => props.readonlyPaths,
  () => {
    applyReadonlyDecorations()
  },
  { deep: true, immediate: false }
)

watch(
  () => props.modelValue,
  val => {
    let value: any
    try {
      value = typeof val === 'string' ? JSON.parse(val) : val
    } catch {
      value = {}
    }

    if (props.visiblePaths?.length) {
      value = pickFieldsSuper(value, props.visiblePaths, visiblePathsExclude.value)
    }

    const json = JSON.stringify(value, null, 2)
    if (editor && editor.getValue() !== json) {
      isResetting = true
      lastValidValue = json
      setEditorValue(json)
    }

    nextTick(() => applyReadonlyDecorations())
    if (isInternalChange) {
      isInternalChange = false
    }
  },
  { deep: true }
)

watch(
  [() => props.visiblePaths, () => props.visiblePathsExclude],
  () => {
    if (!editor) return

    let value: any
    try {
      value =
        typeof props.modelValue === 'string'
          ? JSON.parse(props.modelValue || '{}')
          : props.modelValue
    } catch {
      value = {}
    }

    if (props.visiblePaths?.length) {
      value = pickFieldsSuper(value, props.visiblePaths, visiblePathsExclude.value)
    }

    const json = JSON.stringify(value, null, 2)
    if (editor.getValue() !== json) {
      isResetting = true
      lastValidValue = json
      setEditorValue(json)
    }
  },
  { deep: true }
)

function formatJson() {
  if (!editor) return
  try {
    console.debug('Formatting JSON in editor...')
    const formatted = JSON.stringify(JSON.parse(editor.getValue()), null, 2)
    setEditorValue(formatted)
    emit('format')
  } catch {}
}

function toggleFullscreen() {
  const el = editorContainer.value
  if (!el) return

  if (!isFullscreen.value) {
    el.style.width = '100vw'
    el.style.height = '100vh'
    el.style.minWidth = '0'
    el.style.minHeight = '0'
  } else {
    el.removeAttribute('style')
  }

  isFullscreen.value = !isFullscreen.value
  emit('fullscreen', isFullscreen.value)
  nextTick(() => editor?.layout())
}

// 组件方法实现
function focusEditor() {
  editor?.focus()
}

function blurEditor() {
  // Monaco Editor 没有直接的 blur 方法，我们可以聚焦到其他元素
  if (editorContainer.value) {
    editorContainer.value.blur()
  }
}

function getCurrentValue(): object | string {
  if (!editor) return props.modelValue || {}

  try {
    const value = editor.getValue()
    return JSON.parse(value)
  } catch {
    return editor.getValue()
  }
}

function setCurrentValue(value: object | string) {
  if (!editor) return

  try {
    const jsonString = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
    setEditorValue(jsonString)
  } catch {
    console.error('Invalid value provided to setValue')
  }
}

function validateJson(): boolean {
  return validate()
}

function validateAsync(): Promise<true> {
  const result = validate()
  if (result) return Promise.resolve(true)
  return Promise.reject(new Error(errorMessage.value))
}

// 暴露给父组件的方法
defineExpose({
  format: formatJson,
  focus: focusEditor,
  blur: blurEditor,
  toggleFullscreen,
  validate: validateJson,
  getValue: getCurrentValue,
  setValue: setCurrentValue,
  reset,
})
</script>

<template>
  <div
    :class="[
      'json-editor',
      {
        fullscreen: isFullscreen,
        'is-error': !isJsonValid || elFormItem?.validateState === 'error',
      },
    ]"
    :style="{
      backgroundColor: props.backgroundColor || 'var(--el-bg-color, #fff)',
      width: props.width || '100%',
      height: typeof props.height === 'number' ? `${props.height}px` : props.height || '300px',
    }"
    @keydown="handleKeydown"
  >
    <div class="editor" ref="editorContainer">
      <div
        v-if="props.showFormatButton || props.showFullscreenButton"
        class="toolbar floating-toolbar"
      >
        <el-tooltip v-if="props.showFormatButton" content="格式化 JSON" placement="top">
          <el-button size="small" :icon="FormatIcon" @click="formatJson" circle />
        </el-tooltip>
        <el-tooltip
          v-if="props.showFullscreenButton"
          :content="isFullscreen ? '退出全屏' : '全屏编辑'"
          placement="top"
        >
          <el-button
            size="small"
            :icon="isFullscreen ? ExitFullIcon : FullIcon"
            @click="toggleFullscreen"
            circle
          />
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.json-editor {
  position: relative;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  height: 100%;
  background-color: var(--el-bg-color, #fff);
  min-height: 94px;
}
.json-editor.is-error {
  border-color: var(--el-color-danger);
}
.editor {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 94px;
}
.floating-toolbar {
  position: absolute;
  right: 20px;
  display: flex;
  backdrop-filter: blur(2px);
  background-color: rgba(255, 255, 255, 0);
  pointer-events: none;
  z-index: 10;
}
.floating-toolbar .el-button {
  font-size: 18px;
  padding: 0;
  background-color: transparent;
  border: none;
  box-shadow: none;
  outline: none;
  pointer-events: auto;
}
.floating-toolbar .el-button + .el-button {
  margin-left: 1px;
}
.json-editor.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
}
.error-text {
  font-size: 12px;
  color: var(--el-color-danger);
  margin: 4px 0 0 4px;
}
:deep(.json-readonly-highlight) {
  background-color: rgba(191, 223, 12, 0.1);
  color: rgb(240, 14, 14);
  user-select: none;
  pointer-events: none;
}
</style>
