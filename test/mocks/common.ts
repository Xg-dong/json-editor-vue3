import { vi } from 'vitest'

// 创建完整的 Monaco Editor mock
export const createMonacoMock = () => {
  const mockEditor = {
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
  }

  const mockMonaco = {
    editor: {
      create: vi.fn(() => mockEditor),
      createModel: vi.fn(() => mockEditor.getModel()),
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
  }

  return { mockMonaco, mockEditor }
}

// 创建 Element Plus mock
export const createElementPlusMock = () => ({
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
  FullScreen: {
    name: 'FullScreen',
    template: '<svg><path d="fullscreen-path"/></svg>',
  },
  DocumentCopy: {
    name: 'DocumentCopy',
    template: '<svg><path d="document-copy-path"/></svg>',
  },
})

// 应用 Monaco mock
export const setupMonacoMock = () => {
  const { mockMonaco } = createMonacoMock()
  vi.mock('monaco-editor', () => mockMonaco)
  return mockMonaco
}
