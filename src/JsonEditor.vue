<script setup lang="ts">
import * as monacoEditor from 'monaco-editor'
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
import { ElMessage, ElTooltip, ElButton } from 'element-plus'
import type { JsonItem } from './type'

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

const elFormItem = computed(() => props.elFormItem || props.elFormItem?.proxy)
const editorContainer = ref<HTMLElement | null>(null)
let editor: any = null
let monaco: typeof monacoEditor | null = null
let readonlyDecorationCollection: any = null

const isFullscreen = ref(false)
const isJsonValid = ref(true)
const errorMessage = ref('')
const monacoTheme = ref('vs')
let observer: MutationObserver | null = null
let resizeObserver: ResizeObserver | null = null
let visibilityObserver: IntersectionObserver | null = null

// 编辑器状态管理
const editorReady = ref(false)
const shouldReinitialize = ref(false)
let deferredInitialization = false

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
  if (editor && monaco) monaco.editor.setTheme(monacoTheme.value)
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
  if (!editor || !monaco || !props.readonlyPaths?.length || isReadonly.value) return
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
      range: new monaco!.Range(
        startPos.lineNumber,
        startPos.column,
        endPos.lineNumber,
        endPos.column
      ),
      options: {
        inlineClassName: 'json-readonly-highlight',
        stickiness: monaco!.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
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
  if (!editor || !monaco) return

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

  // 添加尺寸监控和修复
  const fixAbnormalSizes = () => {
    if (!editorContainer.value) return

    const abnormalElements = editorContainer.value.querySelectorAll(
      '[style*="1.67772e+07px"], [style*="e+07px"]'
    )
    abnormalElements.forEach(el => {
      console.warn('Found abnormal element, fixing:', el)
      const htmlEl = el as HTMLElement
      htmlEl.style.width = '100%'
      htmlEl.style.height = '100%'
      htmlEl.style.maxWidth = '100%'
      htmlEl.style.maxHeight = '100%'
      htmlEl.style.transform = 'none'
    })
  }

  editor.onDidChangeModelContent(() => {
    applyReadonlyDecorations()
    fixAbnormalSizes() // 修复异常尺寸

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
    fixAbnormalSizes() // 失焦时也检查修复
  })

  editor.onDidFocusEditorText(() => {
    handleEditorFocus()
    fixAbnormalSizes() // 聚焦时也检查修复
  })

  // 定期检查和修复异常尺寸
  const sizeCheckInterval = setInterval(() => {
    fixAbnormalSizes()
  }, 2000)

  // 在编辑器销毁时清理定时器
  const originalDispose = editor.dispose
  editor.dispose = () => {
    clearInterval(sizeCheckInterval)
    originalDispose.call(editor)
  }

  applyReadonlyDecorations()
}

/**
 * 检查容器是否在隐藏的父容器中（Tab、Collapse、Drawer等）
 */
function isInHiddenContainer(el: HTMLElement): boolean {
  let current = el.parentElement
  while (current) {
    const style = getComputedStyle(current)

    // 检查常见的隐藏方式
    if (
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      style.opacity === '0' ||
      current.hidden ||
      // Element Plus Tab 面板
      (current.classList.contains('el-tab-pane') && current.style.display === 'none') ||
      // Element Plus Collapse
      (current.classList.contains('el-collapse-item__content') &&
        current.style.display === 'none') ||
      // Element Plus Drawer
      (current.classList.contains('el-drawer') && current.style.display === 'none')
    ) {
      return true
    }

    current = current.parentElement
  }
  return false
}

/**
 * 等待容器变为可见
 */
function waitForContainerVisible(el: HTMLElement): Promise<void> {
  return new Promise(resolve => {
    const checkVisibility = () => {
      const rect = el.getBoundingClientRect()
      const isVisible =
        rect.width > 0 &&
        rect.height > 0 &&
        getComputedStyle(el).display !== 'none' &&
        !isInHiddenContainer(el)

      if (isVisible) {
        resolve()
        return true
      }
      return false
    }

    // 立即检查
    if (checkVisibility()) return

    let intersectionObserver: IntersectionObserver | null = null

    // 使用 MutationObserver 监听DOM变化（处理v-if、Tab切换等）
    const mutationObserver = new MutationObserver(() => {
      if (checkVisibility()) {
        mutationObserver.disconnect()
        intersectionObserver?.disconnect()
        resolve()
      }
    })

    // 使用 IntersectionObserver 监听可见性变化（如果可用的话）
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        entries => {
          const entry = entries[0]
          if (
            entry.isIntersecting &&
            entry.boundingClientRect.width > 0 &&
            entry.boundingClientRect.height > 0
          ) {
            mutationObserver.disconnect()
            intersectionObserver?.disconnect()
            resolve()
          }
        },
        { threshold: 0.1 }
      )

      // 开始监听容器
      intersectionObserver.observe(el)
    }

    // 开始监听
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'hidden'],
    })

    // 超时处理
    setTimeout(() => {
      mutationObserver.disconnect()
      intersectionObserver?.disconnect()
      console.warn('Container visibility timeout, proceeding with initialization')
      resolve()
    }, 10000) // 10秒超时
  })
}

/**
 * 安全的编辑器初始化
 */
async function initializeEditor(): Promise<void> {
  if (!editorContainer.value || !monaco) {
    console.error('Editor container or Monaco not available')
    return
  }

  // 等待容器准备就绪
  await nextTick()

  // 等待容器真正可见
  await waitForContainerVisible(editorContainer.value)

  const container = editorContainer.value

  // 强制设置容器样式
  container.style.position = 'relative'
  container.style.overflow = 'hidden'
  container.style.width = '100%'
  container.style.height = '100%'

  // 等待样式生效
  await new Promise(resolve => setTimeout(resolve, 50))

  // 获取实际尺寸
  const rect = container.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) {
    // 容器还没有尺寸，延迟初始化
    setTimeout(initializeEditor, 100)
    return
  }

  const width = Math.max(rect.width || 300, 200)
  const height = Math.max(rect.height || 150, 100)

  console.debug('Editor initialization - container dimensions:', { width, height, rect })

  // 验证尺寸合理性
  if (width > 50000 || height > 50000) {
    console.error('Detected abnormal container size, aborting editor creation')
    return
  }

  try {
    // 如果编辑器已存在，先销毁
    if (editor) {
      editor.dispose()
      editor = null
    }

    editor = monaco.editor.create(container, {
      value: initialValue.value,
      language: 'json',
      theme: currentTheme.value,
      readOnly: isReadonly.value,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbers: 'on',
      glyphMargin: false,
      folding: true,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3,
      renderLineHighlight: 'line',
      contextmenu: true,
      selectOnLineNumbers: true,
      roundedSelection: false,
      cursorStyle: 'line',
      cursorBlinking: 'blink',
      fontSize: 14,
      fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", "Consolas", monospace',
    })

    // 立即布局
    editor.layout({
      width: Math.floor(width),
      height: Math.floor(height),
    })

    editorReady.value = true
    shouldReinitialize.value = false
    deferredInitialization = false

    // 绑定事件和监听器
    setTimeout(() => {
      bindModelListeners()
      setupLayoutMonitoring()
    }, 100)

    console.debug('Monaco Editor initialized successfully')
  } catch (error) {
    console.error('Failed to create Monaco Editor:', error)
    editorReady.value = false
  }
}

/**
 * 设置布局监控
 */
function setupLayoutMonitoring(): void {
  if (!editor || !editorContainer.value) return

  const container = editorContainer.value

  // 监控和修复异常尺寸
  const monitorLayout = () => {
    if (!editor) return

    const layoutInfo = editor.getLayoutInfo()
    if (layoutInfo.width > 50000 || layoutInfo.height > 50000) {
      console.warn('Detected abnormal layout, forcing re-initialization')
      shouldReinitialize.value = true
      reinitializeEditor()
    }
  }

  // 设置布局监控定时器
  const layoutMonitorTimer = setInterval(monitorLayout, 2000)

  // 在组件销毁时清理定时器
  const originalDispose = editor.dispose
  editor.dispose = () => {
    clearInterval(layoutMonitorTimer)
    originalDispose.call(editor)
  }

  // 改进的 ResizeObserver
  let resizeTimer: number | null = null
  resizeObserver = new ResizeObserver(entries => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      if (!editor || !editorReady.value) return

      const entry = entries[0]
      if (entry && entry.contentRect) {
        const newWidth = Math.max(Math.floor(entry.contentRect.width), 200)
        const newHeight = Math.max(Math.floor(entry.contentRect.height), 100)

        // 验证新尺寸
        if (newWidth < 50000 && newHeight < 50000 && newWidth > 0 && newHeight > 0) {
          try {
            editor.layout({
              width: newWidth,
              height: newHeight,
            })
          } catch (error) {
            console.warn('Editor layout error:', error)
          }
        }
      }
    }, 150)
  })

  resizeObserver.observe(container)

  // 监听容器可见性变化（处理Tab切换、Drawer打开关闭等）
  visibilityObserver = new IntersectionObserver(
    entries => {
      const entry = entries[0]
      if (
        entry.isIntersecting &&
        entry.boundingClientRect.width > 0 &&
        entry.boundingClientRect.height > 0
      ) {
        // 容器变为可见时，检查是否需要重新初始化
        if (shouldReinitialize.value || !editorReady.value) {
          reinitializeEditor()
        } else {
          // 重新布局
          setTimeout(() => {
            if (editor) {
              try {
                editor.layout()
              } catch (error) {
                console.warn('Editor layout error on visibility change:', error)
              }
            }
          }, 100)
        }
      }
    },
    { threshold: 0.1 }
  )

  visibilityObserver.observe(container)
}

/**
 * 重新初始化编辑器
 */
async function reinitializeEditor(): Promise<void> {
  if (deferredInitialization) return

  deferredInitialization = true
  editorReady.value = false

  console.debug('Reinitializing Monaco Editor...')

  // 清理现有编辑器
  if (editor) {
    editor.dispose()
    editor = null
  }

  // 等待一帧后重新初始化
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 100))

  await initializeEditor()
}

onMounted(async () => {
  // 直接使用 monaco-editor
  monaco = monacoEditor

  updateMonacoTheme()
  observer = new MutationObserver(updateMonacoTheme)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme'],
  })

  console.debug('Monaco Editor mounting...', editorContainer.value)

  // 使用新的初始化逻辑
  if (editorContainer.value) {
    await initializeEditor()
  } else {
    // 如果容器还没准备好，延迟初始化
    await nextTick()
    if (editorContainer.value) {
      await initializeEditor()
    }
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  resizeObserver?.disconnect()
  visibilityObserver?.disconnect()
  editor?.dispose()
  readonlyDecorationCollection?.clear()

  // 重置状态
  editorReady.value = false
  shouldReinitialize.value = false
  deferredInitialization = false
})

watch(
  () => currentTheme.value,
  (val: string) => {
    monacoTheme.value = val
    if (editor && monaco) monaco.editor.setTheme(val)
  }
)

watch(
  () => isReadonly.value,
  (val: boolean) => editor?.updateOptions({ readOnly: val })
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
  (val: any) => {
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
    // 进入全屏前保存当前尺寸
    const currentRect = el.getBoundingClientRect()
    el.dataset.originalWidth = currentRect.width.toString()
    el.dataset.originalHeight = currentRect.height.toString()

    el.style.position = 'fixed'
    el.style.top = '0'
    el.style.left = '0'
    el.style.width = '100vw'
    el.style.height = '100vh'
    el.style.zIndex = '1000'
    el.style.minWidth = '0'
    el.style.minHeight = '0'
  } else {
    // 退出全屏时恢复样式
    el.style.position = ''
    el.style.top = ''
    el.style.left = ''
    el.style.width = ''
    el.style.height = ''
    el.style.zIndex = ''
    el.style.minWidth = ''
    el.style.minHeight = ''

    // 清理数据属性
    delete el.dataset.originalWidth
    delete el.dataset.originalHeight
  }

  isFullscreen.value = !isFullscreen.value
  emit('fullscreen', isFullscreen.value)

  // 延迟布局，确保 DOM 更新完成
  setTimeout(() => {
    try {
      editor?.layout()
    } catch (error) {
      console.warn('Editor layout error in fullscreen toggle:', error)
    }
  }, 150)
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

/**
 * 手动重新初始化编辑器（用于处理容器显示时机问题）
 */
async function reinitialize(): Promise<void> {
  console.debug('Manual reinitialize requested')
  shouldReinitialize.value = true
  await reinitializeEditor()
}

/**
 * 检查编辑器是否已准备就绪
 */
function isReady(): boolean {
  return editorReady.value && !!editor
}

// 暴露给父组件的方法
defineExpose({
  format: formatJson,
  focus: focusEditor,
  blur: blurEditor,
  toggleFullscreen,
  validate: validateJson,
  validateAsync,
  getValue: getCurrentValue,
  setValue: setCurrentValue,
  reset,
  reinitialize,
  isReady,
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
    <div class="editor" ref="editorContainer"></div>
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
</template>
<style>
.json-editor {
  position: relative;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  height: 100%;
  background-color: var(--el-bg-color, #fff);
  min-height: 94px;
  min-width: 200px; /* 添加最小宽度 */
  max-width: 100%; /* 防止超出容器 */
  overflow: hidden; /* 防止内容溢出 */
}
.json-editor.is-error {
  border-color: var(--el-color-danger);
}
.json-editor .editor {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 94px;
  min-width: 200px; /* 添加最小宽度 */
  max-width: 100%; /* 防止超出 */
  max-height: 100%; /* 防止超出 */
  overflow: hidden; /* 确保不会出现异常尺寸 */
}
.json-editor .floating-toolbar {
  position: absolute;
  top: 0;
  right: 10px;
  display: flex;
  backdrop-filter: blur(2px);
  background-color: rgba(255, 255, 255, 0);
  pointer-events: none;
  z-index: 1001;
}
.json-editor .floating-toolbar .el-button {
  font-size: 18px;
  padding: 0;
  background-color: transparent;
  border: none;
  box-shadow: none;
  outline: none;
  pointer-events: auto;
}
.json-editor .floating-toolbar .el-button + .el-button {
  margin-left: 1px;
}
.json-editor.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 1000 !important;
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
  border: none !important;
  border-radius: 0 !important;
}
.json-editor.fullscreen .editor {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
}
.json-editor .error-text {
  font-size: 12px;
  color: var(--el-color-danger);
  margin: 4px 0 0 4px;
}
.json-editor .json-readonly-highlight {
  background-color: rgba(191, 223, 12, 0.1);
  color: rgb(240, 14, 14);
  user-select: none;
  pointer-events: none;
}
/* 防止 Monaco Editor 异常尺寸 */
.json-editor .monaco-editor {
  max-width: 100% !important;
  max-height: 100% !important;
  width: 100% !important;
  height: 100% !important;
}
.json-editor .monaco-editor .overflow-guard {
  max-width: 100% !important;
  max-height: 100% !important;
  width: 100% !important;
  height: 100% !important;
}
.json-editor .monaco-editor .monaco-scrollable-element {
  max-width: 100% !important;
  max-height: 100% !important;
}
/* 特别限制那些可能出现异常transform的元素 */
.json-editor .monaco-editor [style*='1.67772e+07px'] {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  transform: none !important;
}
</style>
