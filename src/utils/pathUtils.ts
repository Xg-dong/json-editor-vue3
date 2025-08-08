import type { ParsedPath, PlainObject } from './types'
import { isPlainObject } from './utils'

/**
 * 解析字段路径字符串，支持点分隔符、数组索引、无索引数组标记及 ** 通配符
 * 例如：
 *  - "a.b[0].c" 解析为 ["a", "b", 0, "c"]
 *  - "arr[].item[].name" 解析为 ["arr", null, "item", null, "name"]
 *  - "**a" 解析为 ["**", "a"]
 *  - "c[0].**a" 解析为 ["c", 0, "**", "a"]
 * @param path 字符串形式的字段路径
 * @returns 解析后的路径数组，数组元素可能是字符串（字段名）、数字（数组索引）、null（无索引数组）或"**"（任意路径通配符）
 */
export function parsePath(path: string): ParsedPath {
  const parts: ParsedPath = []

  // 处理开头的 **
  if (path.startsWith('**')) {
    parts.push('**')
    path = path.slice(2)
    if (path.startsWith('.')) {
      path = path.slice(1)
    }
  }

  const dotParts = path.split('.')

  dotParts.forEach(part => {
    // 处理中间的 **
    if (part === '**') {
      parts.push('**')
      return
    }

    const regex = /([^[\]]+)|\[(\d*|\*)\]/g
    let match: RegExpExecArray | null
    while ((match = regex.exec(part))) {
      if (match[1] !== undefined) {
        // 检查是否包含 **
        if (match[1].includes('**')) {
          const subParts = match[1].split('**')
          subParts.forEach((subPart, index) => {
            if (index > 0) parts.push('**')
            if (subPart) parts.push(subPart)
          })
        } else {
          parts.push(match[1])
        }
      } else if (match[2] === '' || match[2] === '*') {
        parts.push(null)
      } else if (match[2]) {
        parts.push(Number(match[2]))
      }
    }
  })

  // 这里把纯数字字符串转成数字（除了 ** 通配符）
  return parts.map(p => {
    if (typeof p === 'string' && p !== '**') {
      const n = Number(p)
      return isNaN(n) ? p : n
    }
    return p
  })
}

/**
 * 检查路径是否匹配，支持 ** 通配符
 */
export function isPathMatch(
  targetPath: (string | number)[],
  patternPath: (string | number | null)[]
): boolean {
  let targetIndex = 0
  let patternIndex = 0

  while (patternIndex < patternPath.length && targetIndex < targetPath.length) {
    const pattern = patternPath[patternIndex]

    if (pattern === '**') {
      // 处理 ** 通配符
      if (patternIndex === patternPath.length - 1) {
        // ** 在末尾，匹配剩余所有路径
        return true
      }

      const nextPattern = patternPath[patternIndex + 1]

      // 查找下一个匹配点
      for (let i = targetIndex; i <= targetPath.length; i++) {
        if (
          i === targetPath.length ||
          nextPattern === null ||
          nextPattern === targetPath[i] ||
          (typeof nextPattern === 'number' && typeof targetPath[i] === 'number')
        ) {
          // 递归检查剩余部分
          if (isPathMatch(targetPath.slice(i), patternPath.slice(patternIndex + 1))) {
            return true
          }
        }
      }
      return false
    } else if (pattern === null) {
      // 数组通配符，匹配任意数字索引
      if (typeof targetPath[targetIndex] === 'number') {
        targetIndex++
        patternIndex++
      } else {
        return false
      }
    } else if (pattern === targetPath[targetIndex]) {
      // 精确匹配
      targetIndex++
      patternIndex++
    } else {
      return false
    }
  }

  // 检查是否完全匹配
  return targetIndex === targetPath.length && patternIndex === patternPath.length
}

/**
 * 收集所有匹配指定模式的路径
 * @param obj 目标对象
 * @param patternPath 模式路径
 * @param currentPath 当前路径
 * @returns 匹配的路径数组
 */
export function collectMatchingPaths(
  obj: any,
  patternPath: (string | number | null)[],
  currentPath: (string | number)[] = []
): (string | number)[][] {
  const results: (string | number)[][] = []

  // 检查当前路径是否匹配
  if (isPathMatch(currentPath, patternPath)) {
    results.push([...currentPath])
  }

  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return results
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      results.push(...collectMatchingPaths(item, patternPath, [...currentPath, index]))
    })
  } else if (isPlainObject(obj)) {
    Object.keys(obj).forEach(key => {
      results.push(...collectMatchingPaths(obj[key], patternPath, [...currentPath, key]))
    })
  }

  return results
}

/**
 * 检查路径是否在通配符模式的匹配范围内
 * @param currentPath 当前路径
 * @param wildcardPattern 通配符模式
 * @returns 是否在匹配范围内
 */
export function isPathUnderWildcardPattern(
  currentPath: (string | number)[],
  wildcardPattern: (string | number | null)[]
): boolean {
  // 如果模式中没有 **，则不匹配
  if (!wildcardPattern.includes('**')) {
    return false
  }

  // 使用 isPathMatch 来检查是否匹配
  return isPathMatch(currentPath, wildcardPattern)
}
