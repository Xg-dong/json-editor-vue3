/**
 * JsonUtils模块的类型定义
 */

/** 纯对象类型，排除数组和null */
export type PlainObject = Record<string, any>

/** 路径元素类型：字符串（字段名）、数字（数组索引）、null（数组通配符）或"**"（深度通配符） */
export type PathElement = string | number | null

/** 解析后的路径数组 */
export type ParsedPath = PathElement[]

/** 范围接口 */
export interface Range {
  start: number
  end: number
}

/** 只读字段范围类型 */
export type ReadonlyRange =
  | { type: 'property'; start: number; end: number }
  | { type: 'key' | 'value'; start: number; end: number }

/** 查找只读字段范围的选项 */
export interface FindReadonlyFieldRangesOptions {
  includeComma?: boolean
  splitKeyValue?: boolean
}

/** 路径比较结果接口 */
export interface PathDiffResult {
  /** 交集：两个对象都有的路径 */
  intersection: string[]
  /** 差集：只在 a 中存在的路径 */
  differenceA: string[]
  /** 差集：只在 b 中存在的路径 */
  differenceB: string[]
  /** 并集：两个对象所有的路径 */
  union: string[]
}

/** 值差异结果接口 */
export interface ValueDiffResult {
  /** 有差异的路径列表 */
  changedPaths: string[]
  /** 差异的完整对象（包含所有有差异的字段） */
  changedObject: any
  /** 只有新增的路径（B 中有但 A 中没有） */
  addedPaths: string[]
  /** 只有删除的路径（A 中有但 B 中没有） */
  removedPaths: string[]
  /** 值发生变化的路径（A 和 B 中都有但值不同） */
  modifiedPaths: string[]
}

/** 值差异比较选项 */
export interface ValueDiffOptions {
  /** 是否包含新增的字段 */
  includeAdded?: boolean
  /** 是否包含删除的字段 */
  includeRemoved?: boolean
  /** 是否包含修改的字段 */
  includeModified?: boolean
}
