/**
 * JsonUtils 模块 - 专门为 JsonEditor 组件设计的字段路径裁剪工具和合并工具
 *
 * 支持字段路径格式：
 * - "a.b.c"
 * - "a[].b[0].c"
 * - "arr[].item[].name"
 * - "**a" - 匹配任意深度的字段 a
 * - "c[0].**a" - 匹配 c[0] 下任意深度的字段 a
 *
 * 功能：
 * 1. 根据字段路径数组，从输入对象中提取对应字段，支持深度嵌套与数组索引，
 *    不会改变原始对象，返回一个新对象，未指定字段被丢弃。
 * 2. 根据字段路径数组，将补丁对象（patch）中指定字段合并回原始对象（origin），
 *    不改变原始对象，返回合并后的新对象。
 * 3. 支持只读字段范围查找和变化检测
 * 4. 支持对象差异分析和比较
 */

// 导出所有类型定义
export type {
  PlainObject,
  PathElement,
  ParsedPath,
  Range,
  ReadonlyRange,
  FindReadonlyFieldRangesOptions,
  PathDiffResult,
  ValueDiffResult,
  ValueDiffOptions,
} from './types'

// 导出通用工具函数
export {
  isPlainObject,
  isEqual,
  deepClone,
  collectAllPaths,
  parseNewPathFormat,
  getValueByPath,
} from './utils'

// 导出路径相关工具
export {
  parsePath,
  isPathMatch,
  collectMatchingPaths,
  isPathUnderWildcardPattern,
} from './pathUtils'

// 导出字段操作功能
export { pickFieldsSuper, mergeFieldsDeep, mergeFieldsSuper } from './fieldOperations'

// 导出只读字段操作
export { findReadonlyFieldRanges, isReadonlyValueChanged } from './readonlyOperations'

// 导出差异分析功能
export {
  diffPaths,
  generateJsonFromPathDiff,
  diffValues,
  generateValueDiffJson,
} from './diffOperations'
