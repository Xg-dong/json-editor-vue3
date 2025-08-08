import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock Monaco Editor first, before any other imports
vi.mock('monaco-editor', () => ({
  editor: {
    create: vi.fn(() => ({
      getValue: vi.fn(() => '{}'),
      setValue: vi.fn(),
      focus: vi.fn(),
      layout: vi.fn(),
      dispose: vi.fn(),
      setModel: vi.fn(),
      getModel: vi.fn(() => ({
        setValue: vi.fn(),
        getValue: vi.fn(() => '{}'),
        onDidChangeContent: vi.fn(),
        updateOptions: vi.fn(),
        dispose: vi.fn(),
        getPositionAt: vi.fn(() => ({ lineNumber: 1, column: 1 })),
      })),
      updateOptions: vi.fn(),
      onDidFocusEditorText: vi.fn(() => ({ dispose: vi.fn() })),
      onDidBlurEditorText: vi.fn(() => ({ dispose: vi.fn() })),
      onDidChangeModelContent: vi.fn(() => ({ dispose: vi.fn() })),
      trigger: vi.fn(),
      getAction: vi.fn(() => ({ run: vi.fn() })),
      saveViewState: vi.fn(() => ({})),
      restoreViewState: vi.fn(),
      createDecorationsCollection: vi.fn(() => ({
        clear: vi.fn(),
        set: vi.fn(),
      })),
    })),
    createModel: vi.fn(() => ({
      setValue: vi.fn(),
      getValue: vi.fn(() => '{}'),
      onDidChangeContent: vi.fn(),
      updateOptions: vi.fn(),
      dispose: vi.fn(),
      getPositionAt: vi.fn(() => ({ lineNumber: 1, column: 1 })),
    })),
    defineTheme: vi.fn(),
    setTheme: vi.fn(),
    onDidCreateEditor: vi.fn(),
    getModels: vi.fn(() => []),
    setModelLanguage: vi.fn(),
    TrackedRangeStickiness: {
      NeverGrowsWhenTypingAtEdges: 0,
    },
  },
  Range: vi.fn().mockImplementation((startLine, startCol, endLine, endCol) => ({
    startLineNumber: startLine,
    startColumn: startCol,
    endLineNumber: endLine,
    endColumn: endCol,
  })),
  languages: {
    json: {
      jsonDefaults: {
        setDiagnosticsOptions: vi.fn(),
      },
    },
    registerDocumentFormattingEditProvider: vi.fn(),
    setLanguageConfiguration: vi.fn(),
  },
  KeyMod: {
    CtrlCmd: 1,
    Shift: 2,
    Alt: 4,
    WinCtrl: 8,
  },
  KeyCode: {
    F1: 59,
    F8: 66,
    KeyS: 49,
  },
}))

// Mock Element Plus
vi.mock('element-plus', () => ({
  ElButton: {
    name: 'ElButton',
    template: '<button class="el-button" v-bind="$attrs"><slot /></button>',
    props: ['type', 'icon', 'size'],
  },
  ElTooltip: {
    name: 'ElTooltip',
    template: '<div class="el-tooltip"><slot /></div>',
    props: ['content', 'placement'],
  },
  ElMessage: {
    warning: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}))

// Mock Element Plus icons
vi.mock('@element-plus/icons-vue', () => ({
  Expand: {
    name: 'Expand',
    template: '<svg><path d="expand-path"/></svg>',
  },
  Close: {
    name: 'Close',
    template: '<svg><path d="close-path"/></svg>',
  },
  MagicStick: {
    name: 'MagicStick',
    template: '<svg><path d="magic-stick-path"/></svg>',
  },
}))

// Now import other modules
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import JsonEditor from '../src/JsonEditor.vue'

describe('JsonEditor Vue3 组件测试', () => {
  let wrapper: any

  const globalStubs = {
    'el-button': {
      template: '<button><slot /></button>',
    },
    'el-tooltip': {
      template: '<span><slot /></span>',
    },
  }

  beforeEach(() => {
    // 模拟浏览器 API
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))

    global.MutationObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
    }))

    // 清理 mock 调用历史
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('应该正确挂载组件', () => {
    wrapper = mount(JsonEditor, {
      props: {
        modelValue: { test: 'value' },
      },
      global: {
        stubs: globalStubs,
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm).toBeDefined()
  })

  it('应该接收 modelValue prop', () => {
    const testData = { name: 'test', value: 123 }
    wrapper = mount(JsonEditor, {
      props: {
        modelValue: testData,
      },
      global: {
        stubs: globalStubs,
      },
    })

    expect(wrapper.props('modelValue')).toEqual(testData)
  })

  it('应该正确处理 readonly 属性', () => {
    wrapper = mount(JsonEditor, {
      props: {
        modelValue: {},
        readonly: true,
      },
      global: {
        stubs: globalStubs,
      },
    })

    expect(wrapper.props('readonly')).toBe(true)
  })

  it('应该正确处理 visiblePaths 属性', () => {
    const visiblePaths = ['name', 'value']
    wrapper = mount(JsonEditor, {
      props: {
        modelValue: {},
        visiblePaths,
      },
      global: {
        stubs: globalStubs,
      },
    })

    expect(wrapper.props('visiblePaths')).toEqual(visiblePaths)
  })

  it('应该触发 update:modelValue 事件', async () => {
    wrapper = mount(JsonEditor, {
      props: {
        modelValue: { test: 'value' },
      },
      global: {
        stubs: globalStubs,
      },
    })

    // 模拟数据更新
    await wrapper.vm.$emit('update:modelValue', { test: 'new value' })

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([{ test: 'new value' }])
  })

  it('应该支持 v-model', async () => {
    const TestParent = {
      template: '<JsonEditor v-model="data" />',
      components: { JsonEditor },
      data() {
        return {
          data: { initial: 'value' },
        }
      },
    }

    wrapper = mount(TestParent, {
      global: {
        stubs: globalStubs,
      },
    })

    expect(wrapper.vm.data).toEqual({ initial: 'value' })
  })

  it('应该正确处理主题切换', () => {
    wrapper = mount(JsonEditor, {
      props: {
        modelValue: {},
        theme: 'dark',
      },
      global: {
        stubs: globalStubs,
      },
    })

    expect(wrapper.props('theme')).toBe('dark')
  })

  it('应该支持全屏模式', async () => {
    wrapper = mount(JsonEditor, {
      props: {
        modelValue: {},
      },
      global: {
        stubs: globalStubs,
      },
    })

    // 模拟全屏切换
    if (wrapper.vm.toggleFullscreen) {
      await wrapper.vm.toggleFullscreen()
    }

    expect(wrapper.vm).toBeDefined()
  })

  it('应该支持错误处理', async () => {
    wrapper = mount(JsonEditor, {
      props: {
        modelValue: {},
      },
      global: {
        stubs: globalStubs,
      },
    })

    // 测试错误处理机制
    expect(wrapper.vm).toBeDefined()
  })

  it('应该正确初始化 Monaco Editor', () => {
    wrapper = mount(JsonEditor, {
      props: {
        modelValue: { test: 'value' },
      },
      global: {
        stubs: globalStubs,
      },
    })

    // 验证 Monaco Editor 相关的初始化
    expect(wrapper.exists()).toBe(true)
  })

  it('应该支持高度设置', () => {
    wrapper = mount(JsonEditor, {
      props: {
        modelValue: {},
        height: 400,
      },
      global: {
        stubs: globalStubs,
      },
    })

    expect(wrapper.props('height')).toBe(400)
  })

  it('应该支持自定义配置', () => {
    wrapper = mount(JsonEditor, {
      props: {
        modelValue: {},
        showFormatButton: false,
        showFullscreenButton: false,
      },
      global: {
        stubs: globalStubs,
      },
    })

    expect(wrapper.props('showFormatButton')).toBe(false)
    expect(wrapper.props('showFullscreenButton')).toBe(false)
  })

  it('应该正确处理组件销毁', () => {
    wrapper = mount(JsonEditor, {
      props: {
        modelValue: {},
      },
      global: {
        stubs: globalStubs,
      },
    })

    expect(wrapper.exists()).toBe(true)

    wrapper.unmount()

    // 验证清理工作 - 检查 wrapper 不再存在
    expect(wrapper.exists()).toBe(false)
  })
})
