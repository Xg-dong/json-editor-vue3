// 导出所有核心功能
export {
  // 字段提取和合并
  pickFieldsSuper,
  mergeFieldsSuper,

  // 路径和值比较
  diffPaths,
  diffValues,
  generateJsonFromPathDiff,
  generateValueDiffJson,

  // 只读字段处理
  findReadonlyFieldRanges,
  isReadonlyValueChanged,

  // 路径工具
  parsePath,
  isPathMatch,

  // 通用工具
  isEqual,
  deepClone,

  // 类型定义
  type PathDiffResult,
  type ValueDiffResult,
  type ReadonlyRange,
  type FindReadonlyFieldRangesOptions,
} from './utils'

// 导出类型
export type { JsonItem } from './type'

// Vue 组件需要单独导出，因为可能没有 Vue 环境
// export { default as JsonEditor } from './JsonEditor.vue'
