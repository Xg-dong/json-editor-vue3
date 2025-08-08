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

// 导出 Vue 组件 - 同时提供默认导出和命名导出
import JsonEditorComponent from './JsonEditor.vue'
export { JsonEditorComponent as JsonEditor }
export default JsonEditorComponent
