import type { PathDiffResult, ValueDiffResult, ValueDiffOptions } from './types'
import { collectAllPaths, deepClone, getValueByPath, isEqual } from './utils'
import { pickFieldsSuper } from './fieldOperations'
import { mergeFieldsSuper } from './fieldOperations'

/**
 * 比较两个对象的路径差异
 * @param objA 对象 A
 * @param objB 对象 B
 * @returns 路径比较结果
 */
export function diffPaths(objA: any, objB: any): PathDiffResult {
  const pathsA = new Set(collectAllPaths(objA))
  const pathsB = new Set(collectAllPaths(objB))

  const intersection: string[] = []
  const differenceA: string[] = []
  const differenceB: string[] = []
  const union = new Set<string>()

  // 处理 A 中的路径
  pathsA.forEach(path => {
    union.add(path)
    if (pathsB.has(path)) {
      intersection.push(path)
    } else {
      differenceA.push(path)
    }
  })

  // 处理 B 中的路径
  pathsB.forEach(path => {
    union.add(path)
    if (!pathsA.has(path)) {
      differenceB.push(path)
    }
  })

  return {
    intersection: intersection.sort(),
    differenceA: differenceA.sort(),
    differenceB: differenceB.sort(),
    union: Array.from(union).sort(),
  }
}

/**
 * 根据路径差异结果生成新的 JSON 对象
 * @param objA 对象 A
 * @param objB 对象 B
 * @param pathType 路径类型：'intersection' | 'differenceA' | 'differenceB' | 'union'
 * @param sourceObj 数据源对象：'A' | 'B' | 'both'，当为 'both' 时，B 的值会覆盖 A 的值
 * @returns 根据指定路径类型生成的新对象
 */
export function generateJsonFromPathDiff(
  objA: any,
  objB: any,
  pathType: 'intersection' | 'differenceA' | 'differenceB' | 'union',
  sourceObj: 'A' | 'B' | 'both' = 'both'
): any {
  const pathDiff = diffPaths(objA, objB)
  const targetPaths = pathDiff[pathType]

  if (targetPaths.length === 0) {
    return {}
  }

  let sourceData: any
  if (sourceObj === 'A') {
    sourceData = objA
  } else if (sourceObj === 'B') {
    sourceData = objB
  } else {
    // 'both' - 合并两个对象，B 覆盖 A
    sourceData = deepClone(objA)
    // 使用 mergeFieldsSuper 合并所有字段
    const allPaths = Array.from(new Set([...collectAllPaths(objA), ...collectAllPaths(objB)]))
    sourceData = mergeFieldsSuper(sourceData, objB, allPaths)
  }

  return pickFieldsSuper(sourceData, targetPaths)
}

/**
 * 比较两个对象的值差异
 * @param objA 对象 A（基准对象）
 * @param objB 对象 B（比较对象）
 * @param options 配置选项
 * @returns 值差异结果
 */
export function diffValues(objA: any, objB: any, options: ValueDiffOptions = {}): ValueDiffResult {
  const { includeAdded = true, includeRemoved = true, includeModified = true } = options

  const pathsA = new Set(collectAllPaths(objA))
  const pathsB = new Set(collectAllPaths(objB))

  const addedPaths: string[] = []
  const removedPaths: string[] = []
  const modifiedPaths: string[] = []
  const changedPaths: string[] = []

  // 检查新增的路径（B 中有但 A 中没有）
  if (includeAdded) {
    pathsB.forEach(path => {
      if (!pathsA.has(path)) {
        addedPaths.push(path)
        changedPaths.push(path)
      }
    })
  }

  // 检查删除的路径（A 中有但 B 中没有）
  if (includeRemoved) {
    pathsA.forEach(path => {
      if (!pathsB.has(path)) {
        removedPaths.push(path)
        changedPaths.push(path)
      }
    })
  }

  // 检查修改的路径（A 和 B 中都有但值不同）
  if (includeModified) {
    pathsA.forEach(path => {
      if (pathsB.has(path)) {
        const valueA = getValueByPath(objA, path)
        const valueB = getValueByPath(objB, path)

        if (!isEqual(valueA, valueB)) {
          modifiedPaths.push(path)
          changedPaths.push(path)
        }
      }
    })
  }

  // 生成包含所有差异字段的对象
  const changedObject = changedPaths.length > 0 ? pickFieldsSuper(objB, changedPaths) : {}

  return {
    changedPaths: changedPaths.sort(),
    changedObject,
    addedPaths: addedPaths.sort(),
    removedPaths: removedPaths.sort(),
    modifiedPaths: modifiedPaths.sort(),
  }
}

/**
 * 生成值差异的 JSON 对象
 * @param objA 对象 A（基准对象）
 * @param objB 对象 B（比较对象）
 * @param outputType 输出类型：'paths' | 'object'
 * @param options 配置选项
 * @returns 根据配置生成的差异结果
 */
export function generateValueDiffJson(
  objA: any,
  objB: any,
  outputType: 'paths' | 'object' = 'object',
  options: ValueDiffOptions = {}
): string[] | any {
  const diffResult = diffValues(objA, objB, options)

  if (outputType === 'paths') {
    return diffResult.changedPaths
  } else {
    return diffResult.changedObject
  }
}
