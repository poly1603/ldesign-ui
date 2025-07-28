/**
 * @ldesign/ui 类型定义
 */

import type { App, Component, VNode } from 'vue'

/**
 * 组件尺寸
 */
export type ComponentSize = 'small' | 'medium' | 'large'

/**
 * 组件类型
 */
export type ComponentType = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'

/**
 * 组件变体
 */
export type ComponentVariant = 'filled' | 'outlined' | 'text' | 'ghost'

/**
 * 颜色方案
 */
export type ColorScheme = 'light' | 'dark' | 'auto'

/**
 * 主题配置
 */
export interface ThemeConfig {
  colorScheme?: ColorScheme
  primaryColor?: string
  borderRadius?: {
    small?: string
    medium?: string
    large?: string
  }
  spacing?: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
  }
  typography?: {
    fontFamily?: string
    fontSize?: {
      xs?: string
      sm?: string
      md?: string
      lg?: string
      xl?: string
    }
  }
}

/**
 * UI配置
 */
export interface UIConfig {
  theme?: ThemeConfig
  locale?: string
  size?: ComponentSize
  zIndex?: {
    modal?: number
    drawer?: number
    tooltip?: number
    notification?: number
  }
  animation?: {
    duration?: number
    easing?: string
  }
}

/**
 * 表单规则
 */
export interface FormRule {
  required?: boolean
  message?: string
  validator?: (value: any) => boolean | string | Promise<boolean | string>
  trigger?: 'blur' | 'change' | 'input'
}

export type FormRules = Record<string, FormRule | FormRule[]>

/**
 * 表格列定义
 */
export interface TableColumn {
  key: string
  title: string
  dataIndex?: string
  width?: number | string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  filterable?: boolean
  fixed?: 'left' | 'right'
  render?: (value: any, record: any, index: number) => VNode | string
}

export type TableData = Record<string, any>[]

/**
 * 模态框选项
 */
export interface ModalOptions {
  title?: string
  content?: string | VNode
  width?: number | string
  closable?: boolean
  maskClosable?: boolean
  keyboard?: boolean
  centered?: boolean
  zIndex?: number
  onOk?: () => void | Promise<void>
  onCancel?: () => void
}

/**
 * 通知选项
 */
export interface NotificationOptions {
  title?: string
  message: string
  type?: ComponentType
  duration?: number
  closable?: boolean
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  onClose?: () => void
}

/**
 * 工具提示选项
 */
export interface TooltipOptions {
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'click' | 'focus'
  delay?: number
  arrow?: boolean
}

/**
 * 断点配置
 */
export interface BreakpointConfig {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  xxl?: number
}

/**
 * 组件实例
 */
export interface ComponentInstance {
  $el: HTMLElement
  $props: Record<string, any>
  $emit: (event: string, ...args: any[]) => void
}

/**
 * 插件选项
 */
export interface UIPluginOptions {
  config?: UIConfig
  components?: Component[]
  directives?: Record<string, any>
}

/**
 * 安装函数类型
 */
export type InstallFunction = (app: App, options?: UIPluginOptions) => void

/**
 * 组件导出类型
 */
export interface ComponentExport {
  name: string
  component: Component
  install: InstallFunction
}

/**
 * 事件处理器
 */
export type EventHandler<T = any> = (event: T) => void

/**
 * 验证状态
 */
export type ValidateStatus = 'success' | 'warning' | 'error' | 'validating'

/**
 * 加载状态
 */
export interface LoadingState {
  loading: boolean
  text?: string
}

/**
 * 分页配置
 */
export interface PaginationConfig {
  current?: number
  pageSize?: number
  total?: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: boolean | ((total: number, range: [number, number]) => string)
  onChange?: (page: number, pageSize: number) => void
  onShowSizeChange?: (current: number, size: number) => void
}

/**
 * 树节点数据
 */
export interface TreeNode {
  key: string | number
  title: string
  children?: TreeNode[]
  disabled?: boolean
  selectable?: boolean
  checkable?: boolean
  icon?: VNode | string
  [key: string]: any
}

/**
 * 菜单项数据
 */
export interface MenuItem {
  key: string
  label: string
  icon?: VNode | string
  disabled?: boolean
  children?: MenuItem[]
  [key: string]: any
}

/**
 * 步骤数据
 */
export interface StepItem {
  title: string
  description?: string
  icon?: VNode | string
  status?: 'wait' | 'process' | 'finish' | 'error'
}

/**
 * 上传文件信息
 */
export interface UploadFile {
  uid: string
  name: string
  status: 'uploading' | 'done' | 'error' | 'removed'
  url?: string
  response?: any
  error?: any
  percent?: number
  originFileObj?: File
}

/**
 * 上传配置
 */
export interface UploadConfig {
  action?: string
  method?: string
  headers?: Record<string, string>
  data?: Record<string, any> | ((file: UploadFile) => Record<string, any>)
  accept?: string
  multiple?: boolean
  maxCount?: number
  maxSize?: number
  beforeUpload?: (file: File) => boolean | Promise<boolean>
  onChange?: (info: { file: UploadFile; fileList: UploadFile[] }) => void
  onProgress?: (percent: number, file: UploadFile) => void
  onSuccess?: (response: any, file: UploadFile) => void
  onError?: (error: any, file: UploadFile) => void
}