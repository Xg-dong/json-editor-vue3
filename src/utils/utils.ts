import { isRef, unref, isReactive, toRaw } from 'vue'
import lodashIsEqual from 'lodash/isEqual.js'
import type { PlainObject } from './types'

/**
 * 判断一个值是否为纯对象（即非数组且非null的对象）
 */
export function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * 判断两个值是否相等，处理 Vue 响应式和 NaN 情况
 * @param a 第一个值
 * @param b 第二个值
 * @returns 如果相等返回 true，否则返回 false
 */
export function isEqual(a: any, b: any): boolean {
  if (isRef(a)) a = unref(a)
  if (isReactive(a)) a = toRaw(a)

  if (isRef(b)) b = unref(b)
  if (isReactive(b)) b = toRaw(b)

  if (Number.isNaN(a) && Number.isNaN(b)) return true

  return lodashIsEqual(a, b)
}

/**
 * 深拷贝一个对象或数组（不支持函数、循环引用等复杂情况）
 * @param obj 需要拷贝的对象或数组
 * @returns 拷贝后的新对象或数组
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 收集对象中所有的路径
 * @param obj 目标对象
 * @param currentPath 当前路径
 * @returns 所有路径的数组
 */
export function collectAllPaths(obj: any, currentPath: (string | number)[] = []): string[] {
  const results: string[] = []

  if (currentPath.length > 0) {
    // 将路径转换为字符串，数组索引用 [] 包围
    const pathStr = currentPath
      .map((segment, index) => {
        if (typeof segment === 'number') {
          // 数组索引用 [] 包围
          return `[${segment}]`
        } else {
          // 对象属性名，如果不是第一个则添加点号
          return index === 0 ? segment : `.${segment}`
        }
      })
      .join('')
    results.push(pathStr)
  }

  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return results
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      results.push(...collectAllPaths(item, [...currentPath, index]))
    })
  } else if (isPlainObject(obj)) {
    Object.keys(obj).forEach(key => {
      results.push(...collectAllPaths(obj[key], [...currentPath, key]))
    })
  }

  return results.filter(path => path.length > 0) // 过滤掉空路径
}

/**
 * 解析新格式的路径（如 "hobbies[0]" 或 "profile.skills[1]"）
 * @param path 路径字符串
 * @returns 解析后的路径数组
 */
export function parseNewPathFormat(path: string): (string | number)[] {
  const parts: (string | number)[] = []
  let current = ''
  let i = 0

  while (i < path.length) {
    const char = path[i]

    if (char === '.') {
      // 遇到点号，保存当前部分
      if (current) {
        parts.push(current)
        current = ''
      }
    } else if (char === '[') {
      // 遇到数组索引开始
      if (current) {
        parts.push(current)
        current = ''
      }

      // 提取数组索引
      i++ // 跳过 [
      let indexStr = ''
      while (i < path.length && path[i] !== ']') {
        indexStr += path[i]
        i++
      }

      if (indexStr && !isNaN(Number(indexStr))) {
        parts.push(Number(indexStr))
      }
      // i 现在指向 ]，会在循环末尾自动 +1
    } else {
      current += char
    }

    i++
  }

  // 添加最后一部分
  if (current) {
    parts.push(current)
  }

  return parts
}

/**
 * 获取指定路径的值（支持新的路径格式）
 * @param obj 目标对象
 * @param path 路径字符串（如 "hobbies[0]" 或 "profile.skills[1]"）
 * @returns 路径对应的值，如果路径不存在返回 undefined
 */
export function getValueByPath(obj: any, path: string): any {
  // 解析新格式的路径
  const pathParts = parseNewPathFormat(path)
  let current = obj

  for (const part of pathParts) {
    if (current === null || current === undefined) {
      return undefined
    }

    current = current[part]
  }

  return current
}
