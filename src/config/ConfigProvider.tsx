/**
 * 配置提供者组件
 */

import { defineComponent, provide, inject, reactive, type PropType } from 'vue'
import type { UIConfig, ComponentSize, BreakpointConfig } from '../types'

/**
 * 配置上下文键
 */
export const ConfigContextKey = Symbol('config-context')

/**
 * 配置上下文类型
 */
export interface ConfigContext {
  config: UIConfig
  setConfig: (config: Partial<UIConfig>) => void
  getSize: () => ComponentSize
  getLocale: () => string
  getZIndex: (type: string) => number
}

/**
 * 默认配置
 */
const defaultConfig: UIConfig = {
  locale: 'zh-CN',
  size: 'medium',
  zIndex: {
    modal: 1000,
    drawer: 900,
    tooltip: 800,
    notification: 700
  },
  animation: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
}

/**
 * 默认断点配置
 */
const defaultBreakpoints: BreakpointConfig = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600
}

/**
 * 配置提供者组件
 */
export const ConfigProvider = defineComponent({
  name: 'ConfigProvider',
  props: {
    config: {
      type: Object as PropType<Partial<UIConfig>>,
      default: () => ({})
    },
    locale: {
      type: String,
      default: 'zh-CN'
    },
    size: {
      type: String as PropType<ComponentSize>,
      default: 'medium'
    },
    breakpoints: {
      type: Object as PropType<BreakpointConfig>,
      default: () => defaultBreakpoints
    }
  },
  setup(props, { slots }) {
    // 响应式配置状态
    const configState = reactive<UIConfig>({
      ...defaultConfig,
      ...props.config,
      locale: props.locale,
      size: props.size
    })
    
    // 设置配置
    const setConfig = (newConfig: Partial<UIConfig>) => {
      Object.assign(configState, newConfig)
    }
    
    // 获取尺寸
    const getSize = (): ComponentSize => {
      return configState.size || 'medium'
    }
    
    // 获取语言
    const getLocale = (): string => {
      return configState.locale || 'zh-CN'
    }
    
    // 获取层级
    const getZIndex = (type: string): number => {
      return configState.zIndex?.[type] || 1000
    }
    
    // 配置上下文
    const configContext: ConfigContext = {
      config: configState,
      setConfig,
      getSize,
      getLocale,
      getZIndex
    }
    
    // 提供配置上下文
    provide(ConfigContextKey, configContext)
    
    // 提供断点配置
    provide('breakpoints', props.breakpoints)
    
    return () => {
      return (
        <div class="l-config-provider">
          {slots.default?.()}
        </div>
      )
    }
  }
})

/**
 * 使用配置钩子
 */
export function useConfig(): ConfigContext {
  const context = inject<ConfigContext>(ConfigContextKey)
  
  if (!context) {
    // 返回默认配置而不是抛出错误
    return {
      config: defaultConfig,
      setConfig: () => {},
      getSize: () => 'medium',
      getLocale: () => 'zh-CN',
      getZIndex: () => 1000
    }
  }
  
  return context
}

/**
 * 使用断点钩子
 */
export function useBreakpoints(): BreakpointConfig {
  const breakpoints = inject<BreakpointConfig>('breakpoints')
  return breakpoints || defaultBreakpoints
}

/**
 * 语言包类型
 */
export interface LocaleMessages {
  [key: string]: string | LocaleMessages
}

/**
 * 内置语言包
 */
export const builtinLocales: Record<string, LocaleMessages> = {
  'zh-CN': {
    common: {
      ok: '确定',
      cancel: '取消',
      confirm: '确认',
      delete: '删除',
      edit: '编辑',
      save: '保存',
      loading: '加载中...',
      noData: '暂无数据',
      error: '错误',
      success: '成功',
      warning: '警告',
      info: '信息'
    },
    form: {
      required: '此字段为必填项',
      invalid: '输入格式不正确',
      tooShort: '输入内容过短',
      tooLong: '输入内容过长'
    },
    table: {
      empty: '暂无数据',
      total: '共 {total} 条',
      page: '第 {current} 页'
    },
    upload: {
      dragText: '点击或拖拽文件到此区域上传',
      uploadError: '上传失败',
      uploadSuccess: '上传成功'
    }
  },
  
  'en-US': {
    common: {
      ok: 'OK',
      cancel: 'Cancel',
      confirm: 'Confirm',
      delete: 'Delete',
      edit: 'Edit',
      save: 'Save',
      loading: 'Loading...',
      noData: 'No Data',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info'
    },
    form: {
      required: 'This field is required',
      invalid: 'Invalid format',
      tooShort: 'Too short',
      tooLong: 'Too long'
    },
    table: {
      empty: 'No Data',
      total: 'Total {total} items',
      page: 'Page {current}'
    },
    upload: {
      dragText: 'Click or drag file to this area to upload',
      uploadError: 'Upload failed',
      uploadSuccess: 'Upload success'
    }
  }
}

/**
 * 国际化工具函数
 */
export function t(key: string, params?: Record<string, any>): string {
  const config = useConfig()
  const locale = config.getLocale()
  const messages = builtinLocales[locale] || builtinLocales['zh-CN']
  
  const keys = key.split('.')
  let value: any = messages
  
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) break
  }
  
  if (typeof value !== 'string') {
    return key
  }
  
  // 替换参数
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey] || match
    })
  }
  
  return value
}

/**
 * 创建配置预设
 */
export function createConfigPreset(name: string, config: Partial<UIConfig>) {
  return {
    name,
    config: {
      ...defaultConfig,
      ...config
    }
  }
}

/**
 * 内置配置预设
 */
export const builtinConfigs = {
  default: createConfigPreset('default', defaultConfig),
  
  compact: createConfigPreset('compact', {
    size: 'small',
    animation: {
      duration: 200,
      easing: 'ease-out'
    }
  }),
  
  large: createConfigPreset('large', {
    size: 'large',
    animation: {
      duration: 400,
      easing: 'ease-in-out'
    }
  })
}