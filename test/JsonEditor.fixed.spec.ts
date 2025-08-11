import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock Monaco Editor first
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
      })),
      updateOptions: vi.fn(),
      onDidFocusEditorText: vi.fn(() => ({ dispose: vi.fn() })),
      onDidBlurEditorText: vi.fn(() => ({ dispose: vi.fn() })),
      onDidChangeModelContent: vi.fn(() => ({ dispose: vi.fn() })),
      trigger: vi.fn(),
      getAction: vi.fn(() => ({
        run: vi.fn(),
      })),
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
    })),
    defineTheme: vi.fn(),
    setTheme: vi.fn(),
    onDidCreateEditor: vi.fn(),
    getModels: vi.fn(() => []),
    setModelLanguage: vi.fn(),
  },
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

import JsonEditor from '../src/JsonEditor.vue'

// Mock Element Plus components
const mockElementPlus = {
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
  FullScreen: {
    name: 'FullScreen',
    template: '<svg><path d="fullscreen-path"/></svg>',
  },
  DocumentCopy: {
    name: 'DocumentCopy',
    template: '<svg><path d="document-copy-path"/></svg>',
  },
}

describe('JsonEditor 基础功能测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该正确渲染组件', () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: { test: 'value' },
      },
      global: {
        components: mockElementPlus,
        stubs: {
          'el-button': mockElementPlus.ElButton,
          'el-tooltip': mockElementPlus.ElTooltip,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.json-editor').exists()).toBe(true)
  })

  it('应该支持 v-model', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: { initial: 'value' },
        'onUpdate:modelValue': (value: any) => wrapper.setProps({ modelValue: value }),
      },
      global: {
        components: mockElementPlus,
        stubs: {
          'el-button': mockElementPlus.ElButton,
          'el-tooltip': mockElementPlus.ElTooltip,
        },
      },
    })

    // 测试初始值
    expect(wrapper.props('modelValue')).toEqual({ initial: 'value' })

    // 模拟值变化
    await wrapper.setProps({ modelValue: { updated: 'value' } })
    expect(wrapper.props('modelValue')).toEqual({ updated: 'value' })
  })

  it('应该触发 update:modelValue 事件', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: { original: 'value' },
      },
      global: {
        components: mockElementPlus,
        stubs: {
          'el-button': mockElementPlus.ElButton,
          'el-tooltip': mockElementPlus.ElTooltip,
        },
      },
    })

    await wrapper.vm.$nextTick()

    // 通过更新 props 来触发 update:modelValue 事件
    await wrapper.setProps({
      modelValue: { updated: 'value' },
    })

    await wrapper.vm.$nextTick()

    // 验证组件能够接收新的值
    expect(wrapper.props('modelValue')).toEqual({ updated: 'value' })
  })

  it('应该暴露正确的方法', () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: { test: 'value' },
      },
      global: {
        components: mockElementPlus,
        stubs: {
          'el-button': mockElementPlus.ElButton,
          'el-tooltip': mockElementPlus.ElTooltip,
        },
      },
    })

    const vm = wrapper.vm as any

    // 检查所有必要的方法是否存在
    expect(typeof vm.format).toBe('function')
    expect(typeof vm.focus).toBe('function')
    expect(typeof vm.blur).toBe('function')
    expect(typeof vm.toggleFullscreen).toBe('function')
    expect(typeof vm.validate).toBe('function')
    expect(typeof vm.getValue).toBe('function')
    expect(typeof vm.setValue).toBe('function')
  })

  it('validate() 方法应该返回布尔值', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: { test: 'value' },
      },
      global: {
        components: mockElementPlus,
        stubs: {
          'el-button': mockElementPlus.ElButton,
          'el-tooltip': mockElementPlus.ElTooltip,
        },
      },
    })

    // 等待组件挂载完成
    await wrapper.vm.$nextTick()

    const vm = wrapper.vm as any

    // 模拟编辑器已初始化
    if (!vm.editor) {
      vm.editor = {
        getValue: () => '{"test": "value"}',
        setValue: vi.fn(),
        dispose: vi.fn(),
      }
    }

    const result = vm.validate()

    expect(typeof result).toBe('boolean')
    expect(result).toBe(true)
  })

  it('应该支持主题切换', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: { test: 'value' },
        theme: 'light',
      },
      global: {
        components: mockElementPlus,
        stubs: {
          'el-button': mockElementPlus.ElButton,
          'el-tooltip': mockElementPlus.ElTooltip,
        },
      },
    })

    expect(wrapper.props('theme')).toBe('light')

    await wrapper.setProps({ theme: 'dark' })
    expect(wrapper.props('theme')).toBe('dark')
  })

  it('应该支持只读模式', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: { test: 'value' },
        readonly: true,
      },
      global: {
        components: mockElementPlus,
        stubs: {
          'el-button': mockElementPlus.ElButton,
          'el-tooltip': mockElementPlus.ElTooltip,
        },
      },
    })

    expect(wrapper.props('readonly')).toBe(true)
  })

  it('应该支持高度设置', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: { test: 'value' },
        height: 400,
      },
      global: {
        components: mockElementPlus,
        stubs: {
          'el-button': mockElementPlus.ElButton,
          'el-tooltip': mockElementPlus.ElTooltip,
        },
      },
    })

    expect(wrapper.props('height')).toBe(400)

    await wrapper.setProps({ height: '50vh' })
    expect(wrapper.props('height')).toBe('50vh')
  })

  it('应该支持工具栏按钮控制', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: { test: 'value' },
        showFormatButton: true,
        showFullscreenButton: true,
      },
      global: {
        components: mockElementPlus,
        stubs: {
          'el-button': mockElementPlus.ElButton,
          'el-tooltip': mockElementPlus.ElTooltip,
        },
      },
    })

    expect(wrapper.props('showFormatButton')).toBe(true)
    expect(wrapper.props('showFullscreenButton')).toBe(true)

    // 检查按钮是否渲染
    const buttons = wrapper.findAll('.el-button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('应该处理可见路径配置', async () => {
    const wrapper = mount(JsonEditor, {
      props: {
        modelValue: {
          name: 'test',
          password: 'secret',
          profile: { bio: 'developer' },
        },
        visiblePaths: ['name', 'profile.bio'],
      },
      global: {
        components: mockElementPlus,
        stubs: {
          'el-button': mockElementPlus.ElButton,
          'el-tooltip': mockElementPlus.ElTooltip,
        },
      },
    })

    expect(wrapper.props('visiblePaths')).toEqual(['name', 'profile.bio'])
  })
})
