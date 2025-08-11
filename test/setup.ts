import { vi, expect } from 'vitest'
import { configure } from '@testing-library/vue'

// 配置 Testing Library
configure({
  testIdAttribute: 'data-testid',
})

// 扩展 expect 匹配器
import * as matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)

// 导入 Monaco Editor mock
import './mocks/monaco'

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(callback => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  // 立即触发回调，表示元素可见
  trigger: () => callback([{ isIntersecting: true }]),
}))

// Mock localStorage
const localStorageMock: Storage = {
  store: {} as Record<string, string>,
  getItem(key: string): string | null {
    return this.store[key] || null
  },
  setItem(key: string, value: string): void {
    this.store[key] = value
  },
  removeItem(key: string): void {
    delete this.store[key]
  },
  clear(): void {
    this.store = {}
  },
  key(index: number): string | null {
    const keys = Object.keys(this.store)
    return keys[index] || null
  },
  get length(): number {
    return Object.keys(this.store).length
  },
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock 浏览器 API
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }
  callback: ResizeObserverCallback
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock MutationObserver
global.MutationObserver = class MutationObserver {
  constructor(callback: MutationCallback) {
    this.callback = callback
  }
  callback: MutationCallback
  observe() {}
  disconnect() {}
  takeRecords(): MutationRecord[] {
    return []
  }
}

// Mock fetch
global.fetch = vi.fn()

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Mock console methods for cleaner test output
global.console = {
  ...console,
  // 保留错误和警告，但静默调试信息
  debug: vi.fn(),
  log: vi.fn(),
}
