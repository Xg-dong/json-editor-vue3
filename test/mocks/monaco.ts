import { vi } from 'vitest'

// Monaco Editor Mock
const mockEditor = {
  getValue: vi.fn(() => '{}'),
  setValue: vi.fn(),
  focus: vi.fn(),
  layout: vi.fn(),
  dispose: vi.fn(),
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

// Mock monaco-editor module
vi.mock('monaco-editor', () => mockMonaco)

// Mock monaco-editor/esm/vs/editor/editor.api
vi.mock('monaco-editor/esm/vs/editor/editor.api', () => mockMonaco)

export { mockMonaco, mockEditor }
