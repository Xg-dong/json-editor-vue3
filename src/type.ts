/**
 * ------------------------------------
 * JSON 编辑器类型定义
 * ------------------------------------
 */

export interface JsonItem {
  modelValue?: string | Record<string, any> // JSON 数据，支持 v-model
  readonly?: boolean // 是否只读模式
  visiblePaths?: string[] // 可见字段路径列表
  visiblePathsExclude?: boolean // 路径过滤模式：false包含，true排除
  readonlyPaths?: string[] // 只读字段路径列表
  height?: string | number // 编辑器高度
  theme?: 'light' | 'dark' // 编辑器主题
  placeholder?: string // 空数据时的占位符
  showFormatButton?: boolean // 是否显示格式化按钮
  showFullscreenButton?: boolean // 是否显示全屏按钮
  autoFormat?: boolean // 是否自动格式化
  elFormItem?: any // Element Plus 表单项实例

  // 兼容旧版本的属性
  backgroundColor?: string // 编辑器背景色
  strict?: boolean // 是否严格模式，禁止添加未定义的字段
  width?: string // 编辑器宽度
}

/**
 * JsonEditor 组件暴露的方法接口
 */
export interface JsonEditorMethods {
  format(): void // 格式化 JSON
  focus(): void // 聚焦编辑器
  blur(): void // 失焦编辑器
  toggleFullscreen(): void // 切换全屏模式
  validate(): boolean // 验证 JSON 格式
  getValue(): object | string // 获取当前值
  setValue(value: object | string): void // 设置编辑器值
}

/**
 * JsonEditor 组件事件类型
 */
export interface JsonEditorEvents {
  'update:modelValue': [value: object | string] // 数据更新事件
  'update:error': [error: string | null] // 错误状态更新
  focus: [] // 编辑器获得焦点
  blur: [] // 编辑器失去焦点
  format: [] // 格式化操作完成
  fullscreen: [isFullscreen: boolean] // 全屏状态切换
}
