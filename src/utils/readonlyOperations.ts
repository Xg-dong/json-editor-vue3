import { parseTree, findNodeAtLocation } from 'jsonc-parser'
import type { Node as JsonNode } from 'jsonc-parser'
import type { ReadonlyRange, FindReadonlyFieldRangesOptions } from './types'
import { parsePath } from './pathUtils'
import { isEqual } from './utils'

/**
 * 使用 jsonc-parser 解析并查找路径时，展开路径中通配符及 ** 为对应所有节点
 */
function expandPathWithWildcards(node: JsonNode, path: (string | number | null)[]): JsonNode[] {
  if (!node || path.length === 0) return [node].filter(Boolean)

  const [head, ...tail] = path

  if (head === '**') {
    // 处理 ** 通配符
    const results: JsonNode[] = []

    if (tail.length === 0) {
      // ** 在末尾，收集所有子节点
      collectAllNodes(node, results)
      return results
    }

    // 递归查找匹配的节点
    const findInNode = (currentNode: JsonNode, remainingPath: (string | number | null)[]): void => {
      // 尝试在当前节点匹配剩余路径
      const matched = expandPathWithWildcards(currentNode, remainingPath)
      results.push(...matched)

      // 递归搜索子节点
      if (currentNode.children) {
        currentNode.children.forEach(child => {
          findInNode(child, remainingPath)
        })
      }
    }

    findInNode(node, tail)
    return results
  }

  if (head === null) {
    if (node.type === 'array' && node.children) {
      return node.children.flatMap(child => expandPathWithWildcards(child, tail))
    }
    return []
  }

  if (typeof head === 'number') {
    const target = findNodeAtLocation(node, [head])
    if (!target) return []
    return tail.length === 0 ? [target] : expandPathWithWildcards(target, tail)
  }

  const next = findNodeAtLocation(node, [head])
  if (!next) return []
  return tail.length === 0 ? [next] : expandPathWithWildcards(next, tail)
}

/**
 * 收集节点及其所有子节点
 */
function collectAllNodes(node: JsonNode, results: JsonNode[]): void {
  results.push(node)
  if (node.children) {
    node.children.forEach(child => collectAllNodes(child, results))
  }
}

/**
 * 查找指定字段路径对应的只读字段文本范围（包括属性名和属性值）
 * @param jsonText 原始 JSON 字符串
 * @param readonlyPaths 只读字段路径数组
 * @param options 可选项：
 *  - includeComma：是否包含字段后逗号（默认 true）
 *  - splitKeyValue：是否拆分 key 和 value 范围（默认 false）
 * @returns 只读字段在文本中的偏移范围数组
 */
export function findReadonlyFieldRanges(
  jsonText: string,
  readonlyPaths: string[],
  options: FindReadonlyFieldRangesOptions = {}
): ReadonlyRange[] {
  console.debug('findReadonlyFieldRanges', jsonText, readonlyPaths, options)

  const { includeComma = true, splitKeyValue = false } = options
  const root = parseTree(jsonText)
  if (!root) return []

  const ranges: ReadonlyRange[] = []

  for (const rawPath of readonlyPaths) {
    const path = parsePath(rawPath)
    const targetNodes = expandPathWithWildcards(root, path)

    if (!targetNodes.length) {
      console.warn(`Path "${rawPath}" not found in JSON.`)
    }

    for (const node of targetNodes) {
      const propNode = node.parent
      if (propNode?.type === 'property') {
        const keyNode = propNode.children?.[0]
        const valueNode = propNode.children?.[1]

        if (!keyNode || !valueNode) continue

        if (splitKeyValue) {
          ranges.push({ type: 'key', start: keyNode.offset, end: keyNode.offset + keyNode.length })
          ranges.push({
            type: 'value',
            start: valueNode.offset,
            end: valueNode.offset + valueNode.length,
          })
        } else {
          let end = propNode.offset + propNode.length
          if (includeComma) {
            const afterProp = jsonText.slice(end)
            const commaMatch = afterProp.match(/^\s*,/)
            if (commaMatch) {
              end += commaMatch[0].length
            }
          }
          ranges.push({ type: 'property', start: propNode.offset, end })
        }
      }
    }
  }

  return ranges
}

/**
 * 判断两个 JSON 字符串中指定路径的字段值是否发生变化（忽略格式差异）
 * 修改规则：
 * - 前提是路径在 old 中存在，才判断是否变更
 * - 如果 old 和 new 中都没有该路径 → 未变
 * - 如果都存在且值相同 → 未变
 * - 否则属于变更
 * @param prev 上一次合法的 JSON 字符串
 * @param next 当前待检查的 JSON 字符串
 * @param readonlyPaths 只读字段路径（支持通配符）
 * @returns 是否只读字段值发生变化
 */
export function isReadonlyValueChanged(
  prev: string,
  next: string,
  readonlyPaths: string[]
): boolean {
  JSON.parse(next) && JSON.parse(prev)
  const oldRoot = parseTree(prev)
  const newRoot = parseTree(next)
  if (!oldRoot || !newRoot) return false

  for (const rawPath of readonlyPaths) {
    const path = parsePath(rawPath)
    const oldNodes = expandPathWithWildcards(oldRoot, path)
    const newNodes = expandPathWithWildcards(newRoot, path)

    for (let i = 0; i < oldNodes.length; i++) {
      const oldVal = oldNodes[i]?.value

      // 规则前提：如果 old 中存在该路径才判断
      if (oldVal === undefined) continue

      const newVal = newNodes[i]?.value

      const bothMissing = oldVal === undefined && newVal === undefined
      const bothEqual = isEqual(oldVal, newVal)
      console.debug(
        `Checking path "${rawPath}": old value = ${oldVal}, new value = ${newVal}, bothMissing = ${bothMissing}, bothEqual = ${bothEqual}, i = ${i}, newNodes = ${newNodes}`
      )

      if (!bothMissing && !bothEqual) {
        return true
      }
    }
  }

  return false
}
