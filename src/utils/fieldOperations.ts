import type { ParsedPath, PlainObject } from './types'
import { isPlainObject, deepClone, isEqual } from './utils'
import { parsePath, isPathMatch, collectMatchingPaths } from './pathUtils'

/**
 * 递归裁剪对象，只保留指定字段路径的数据，支持 ** 通配符
 */
function pickFieldsDeep(input: any, paths: ParsedPath[], depth = 0): any {
  if (input === null || input === undefined) return input

  // 首先处理包含 ** 通配符的路径
  const wildcardPaths = paths.filter(path => path.includes('**'))
  const normalPaths = paths.filter(path => !path.includes('**'))

  // 如果有通配符路径，收集所有匹配的具体路径
  let expandedPaths: ParsedPath[] = [...normalPaths]

  wildcardPaths.forEach(wildcardPath => {
    const matchingPaths = collectMatchingPaths(input, wildcardPath)
    expandedPaths.push(...matchingPaths)
  })

  if (Array.isArray(input)) {
    const arrayPaths = expandedPaths
      .map(p => p[depth])
      .filter(p => p === null || typeof p === 'number')
    if (arrayPaths.length === 0) return []

    const results: any[] = []

    input.forEach((item, idx) => {
      const matchedPaths = expandedPaths.filter(p => {
        const key = p[depth]
        return key === null || key === idx
      })
      const picked = pickFieldsDeep(item, matchedPaths, depth + 1)
      if (
        picked !== undefined &&
        (typeof picked !== 'object' || Object.keys(picked).length > 0 || Array.isArray(picked))
      ) {
        results.push(picked)
      }
    })

    return results
  }

  if (isPlainObject(input)) {
    const result: PlainObject = {}

    const keysAtThisDepth = new Set<string>()
    expandedPaths.forEach(p => {
      const key = p[depth]
      if (typeof key === 'string') keysAtThisDepth.add(key)
    })

    keysAtThisDepth.forEach(key => {
      const childPaths = expandedPaths
        .filter(p => p[depth] === key)
        .map(p => p.slice(depth + 1))
        .filter(p => p.length > 0)

      if (childPaths.length === 0) {
        if (key in input) result[key] = input[key]
      } else {
        if (key in input) {
          const pickedChild = pickFieldsDeep(input[key], childPaths, 0)
          if (
            pickedChild !== undefined &&
            (typeof pickedChild !== 'object' ||
              Object.keys(pickedChild).length > 0 ||
              Array.isArray(pickedChild))
          ) {
            result[key] = pickedChild
          }
        }
      }
    })

    return result
  }

  return undefined
}

/**
 * 递归剔除对象中指定字段路径的数据，支持 ** 通配符
 */
function omitFieldsDeep(input: any, paths: ParsedPath[], depth = 0): any {
  if (input === null || input === undefined) return input

  // 处理通配符路径
  const wildcardPaths = paths.filter(path => path.includes('**'))
  const normalPaths = paths.filter(path => !path.includes('**'))

  let expandedPaths: ParsedPath[] = [...normalPaths]

  wildcardPaths.forEach(wildcardPath => {
    const matchingPaths = collectMatchingPaths(input, wildcardPath)
    expandedPaths.push(...matchingPaths)
  })

  if (Array.isArray(input)) {
    const arrayPaths = expandedPaths
      .map(p => p[depth])
      .filter(p => p === null || typeof p === 'number')
    if (arrayPaths.length === 0) return deepClone(input)

    const results: any[] = []

    input.forEach((item, idx) => {
      const matchedPaths = expandedPaths.filter(p => {
        const key = p[depth]
        return key === null || key === idx
      })
      results.push(omitFieldsDeep(item, matchedPaths, depth + 1))
    })

    return results
  }

  if (isPlainObject(input)) {
    const result: PlainObject = {}

    for (const key in input) {
      const matchedPaths = expandedPaths.filter(p => p[depth] === key)

      if (matchedPaths.length === 0) {
        result[key] = input[key]
      } else {
        const childPaths = matchedPaths.map(p => p.slice(depth + 1))
        if (childPaths.some(p => p.length === 0)) {
          continue
        } else {
          result[key] = omitFieldsDeep(input[key], childPaths, 0)
        }
      }
    }

    return result
  }

  return input
}

/**
 * 裁剪对象字段的统一接口，支持保留或剔除指定字段路径
 * @param input 输入对象或数组
 * @param pathStrings 字段路径字符串数组
 * @param exclude: boolean 是否剔除指定字段，true为剔除，false或未传为保留
 * @returns 新对象，根据exclude决定保留或剔除pathStrings指定的字段
 */
export function pickFieldsSuper(input: any, pathStrings: string[], exclude?: boolean): any {
  if (!input || typeof input !== 'object') return input
  const parsedPaths = pathStrings.map(parsePath)
  if (exclude) {
    return omitFieldsDeep(input, parsedPaths, 0)
  } else {
    return pickFieldsDeep(input, parsedPaths, 0)
  }
}

/**
 * 深度合并对象，只合并指定路径的字段,目标对像没有的会合并
 */
export function mergeFieldsDeep(
  origin: any,
  patch: any,
  includePaths: ParsedPath[],
  currentPath: (string | number)[] = []
): any {
  // 检查当前路径是否应该被处理
  const shouldProcessCurrentPath = (path: (string | number)[]) => {
    return includePaths.some(includePath => {
      // 对于通配符路径，使用 isPathMatch 检查
      if (includePath.includes('**')) {
        return isPathMatch(path, includePath)
      }
      // 对于普通路径，检查是否是前缀匹配
      return (
        includePath.length >= path.length &&
        path.every(
          (seg, i) =>
            includePath[i] === null ||
            includePath[i] === seg ||
            (includePath[i] === null && typeof seg === 'number')
        )
      )
    })
  }

  // 检查是否需要继续深入处理
  const shouldProcessDeeper = (path: (string | number)[]) => {
    return includePaths.some(includePath => {
      // 对于通配符路径，如果当前路径可能匹配，就继续深入
      if (includePath.includes('**')) {
        // 如果路径中有 **，我们需要继续深入查找可能的匹配
        return true
      }
      // 对于普通路径，检查是否需要继续深入
      return (
        includePath.length > path.length &&
        path.every(
          (seg, i) =>
            includePath[i] === null ||
            includePath[i] === seg ||
            (includePath[i] === null && typeof seg === 'number')
        )
      )
    })
  }

  // 1. 基础类型处理
  if (origin === null || origin === undefined || typeof origin !== 'object') {
    const isIncluded = shouldProcessCurrentPath(currentPath)

    if (isIncluded) {
      return patch !== undefined ? patch : origin
    }

    // 非包含路径但有修改：发出警告并保留原始值
    if (patch !== undefined && !isEqual(origin, patch)) {
      const pathStr = currentPath.join('.') || '<root>'
      console.warn(`Warning: Field "${pathStr}" is not included but modified. Original value kept.`)
      return origin
    }
    return patch !== undefined ? patch : origin
  }

  // 2. 数组处理
  if (Array.isArray(origin)) {
    const result = origin.slice()

    // 处理每个数组元素
    for (let i = 0; i < result.length; i++) {
      const elementPath = [...currentPath, i]

      if (shouldProcessDeeper(elementPath) || shouldProcessCurrentPath(elementPath)) {
        const patchElement = Array.isArray(patch) ? patch[i] : undefined
        result[i] = mergeFieldsDeep(result[i], patchElement, includePaths, elementPath)
      } else if (Array.isArray(patch) && i < patch.length && !isEqual(result[i], patch[i])) {
        const pathStr = elementPath.join('.')
        console.warn(
          `Warning: Field "${pathStr}" is not included but modified. Original value kept.`
        )
      }
    }

    // 处理新增数组元素
    if (Array.isArray(patch) && patch.length > origin.length) {
      for (let i = origin.length; i < patch.length; i++) {
        result.push(patch[i])
      }
    }

    return result
  }

  // 3. 普通对象处理
  if (isPlainObject(origin)) {
    const result: Record<string, any> = { ...origin }

    // 处理原始对象中的每个键
    for (const key in origin) {
      const keyPath = [...currentPath, key]

      if (shouldProcessDeeper(keyPath) || shouldProcessCurrentPath(keyPath)) {
        result[key] = mergeFieldsDeep(origin[key], patch?.[key], includePaths, keyPath)
      } else if (patch && key in patch && !isEqual(origin[key], patch[key])) {
        const pathStr = keyPath.join('.')
        console.warn(
          `Warning: Field "${pathStr}" is not included but modified. Original value kept.`
        )
      }
    }

    // 处理新增键
    if (isPlainObject(patch)) {
      for (const key in patch) {
        if (!(key in origin)) {
          result[key] = patch[key]
        }
      }
    }

    return result
  }

  return origin
}

/**
 * 深度合并对象，但排除指定路径的字段（内部实现）, 目标对象中没有的字段会合并
 * 当遇到原始对象中存在、被排除且值不同的字段时，会发出警告
 * @param origin 原始对象
 * @param patch 补丁对象
 * @param paths 解析后的忽略路径数组
 * @param depth 当前递归深度
 * @param currentPath 当前路径（用于警告信息）
 * @returns 合并后的新对象
 */
function omitMergeFieldsDeep(
  origin: any,
  patch: any,
  paths: ParsedPath[],
  depth = 0,
  currentPath: (string | number)[] = []
): any {
  // 处理通配符路径，展开为具体路径
  const wildcardPaths = paths.filter(path => path.includes('**'))
  const normalPaths = paths.filter(path => !path.includes('**'))

  let expandedPaths: ParsedPath[] = [...normalPaths]

  // 展开通配符路径
  wildcardPaths.forEach(wildcardPath => {
    const matchingPaths = collectMatchingPaths(origin, wildcardPath)
    expandedPaths.push(...matchingPaths)
  })

  // 检查是否有完全匹配的排除路径
  const fullMatchPaths = expandedPaths.filter(p => p.length === depth)
  if (fullMatchPaths.length > 0) {
    // 只有当值不同时才发出警告
    if (origin !== undefined && origin !== null && patch !== undefined && !isEqual(origin, patch)) {
      const pathStr = currentPath.join('.')
      console.warn(
        `Warning: Field "${pathStr}" is excluded but present in patch with different value. It will be ignored.`
      )
    }
    return origin // 完全匹配排除路径，直接返回原始值
  }

  // 基础类型或空值处理
  if (origin === null || origin === undefined || typeof origin !== 'object') {
    return patch !== undefined ? patch : origin
  }

  // 数组处理
  if (Array.isArray(origin)) {
    const result = origin.slice() // 创建原始数组的浅拷贝

    // 1. 处理现有元素
    for (let i = 0; i < result.length; i++) {
      // 收集匹配当前索引的路径
      const matchedPaths = expandedPaths.filter(p => {
        if (p.length <= depth) return false
        const key = p[depth]
        return key === null || key === i
      })

      const patchItem = Array.isArray(patch) ? patch[i] : undefined

      if (matchedPaths.length > 0) {
        // 递归处理子路径
        result[i] = omitMergeFieldsDeep(
          result[i],
          patchItem,
          paths, // 使用原始路径，不是展开后的
          depth + 1,
          [...currentPath, i]
        )
      } else if (patchItem !== undefined) {
        // 无忽略路径时直接应用补丁
        result[i] = patchItem
      }
    }

    // 2. 处理新增元素
    if (Array.isArray(patch) && patch.length > origin.length) {
      for (let i = origin.length; i < patch.length; i++) {
        // 收集匹配当前索引的路径
        const matchedPaths = expandedPaths.filter(p => {
          if (p.length <= depth) return false
          const key = p[depth]
          return key === null || key === i
        })

        // 检查是否需要完全忽略该元素
        const hasFullIgnore = matchedPaths.some(p => p.length === depth + 1)
        if (!hasFullIgnore) {
          // 递归处理子路径或直接添加
          result.push(patch[i])
        }
      }
    }

    return result
  }

  // 普通对象处理
  if (isPlainObject(origin)) {
    const result: Record<string, any> = { ...origin }

    // 1. 合并原始对象中存在的键
    for (const key in origin) {
      // 收集匹配当前键的路径
      const matchedPaths = expandedPaths.filter(p => {
        if (p.length <= depth) return false
        return p[depth] === key
      })

      const patchValue = patch?.[key]

      if (matchedPaths.length > 0) {
        // 递归处理子路径
        result[key] = omitMergeFieldsDeep(
          origin[key],
          patchValue,
          paths, // 使用原始路径，不是展开后的
          depth + 1,
          [...currentPath, key]
        )
      } else if (patchValue !== undefined) {
        // 无忽略路径时直接应用补丁
        result[key] = patchValue
      }
    }

    // 2. 处理新增键
    if (isPlainObject(patch)) {
      for (const key in patch) {
        if (!(key in origin)) {
          // 收集匹配当前键的路径
          const matchedPaths = expandedPaths.filter(p => {
            if (p.length <= depth) return false
            return p[depth] === key
          })

          // 检查是否需要完全忽略该键
          const hasFullIgnore = matchedPaths.some(p => p.length === depth + 1)
          if (!hasFullIgnore) {
            // 直接添加新键
            result[key] = patch[key]
          }
        }
      }
    }

    return result
  }

  // 其他对象类型直接返回原始值
  return origin
}

/**
 * 根据路径合并补丁对象指定字段到原始对象的对外接口，目标对象中没有的字段会合并
 * @param origin 原始对象
 * @param patch 补丁对象
 * @param pathStrings 需要合并的字段路径字符串数组
 * @param exclude 是否排除 pathStrings 指定的字段，true 表示合并除这些字段外的所有字段，默认 false
 * @returns 合并后的新对象
 */
export function mergeFieldsSuper(
  origin: any,
  patch: any,
  pathStrings: string[],
  exclude = false
): any {
  if (!origin || typeof origin !== 'object') return origin
  if (!patch || typeof patch !== 'object') return origin
  const parsedPaths = pathStrings.map(parsePath)
  if (exclude) {
    return omitMergeFieldsDeep(origin, patch, parsedPaths)
  }
  return mergeFieldsDeep(origin, patch, parsedPaths)
}
