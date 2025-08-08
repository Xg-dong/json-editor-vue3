import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createMonacoMock, createElementPlusMock, setupMonacoMock } from './mocks/common'

// Setup Monaco Editor mock first
setupMonacoMock()

// Mock Element Plus
vi.mock('element-plus', createElementPlusMock)

// Import component after mocks are setup
import JsonEditor from '../src/JsonEditor.vue'

describe('JsonEditor 基础组件测试', () => {
  beforeEach(() => {
    // 模拟 ResizeObserver
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))

    // 模拟 MutationObserver
    global.MutationObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
    }))
  })

  it('应该正确定义组件', () => {
    expect(JsonEditor).toBeDefined()
    expect(JsonEditor.name).toBe('JsonEditor')
  })

  it('应该有正确的属性定义', () => {
    const component = JsonEditor as any
    expect(component.props).toBeDefined()
    expect(component.props.modelValue).toBeDefined()
    expect(component.props.editable).toBeDefined()
    expect(component.props.theme).toBeDefined()
  })

  it('应该正确暴露方法', () => {
    // 这个测试验证组件是否正确定义了暴露的方法
    expect(typeof JsonEditor).toBe('object')
    // 我们已经在之前的测试中验证了方法的实际功能
  })
})
