/**
 * 主题提供者组件
 */

import { type PropType, computed, defineComponent, inject, provide, reactive, watch } from 'vue'
import type { ColorScheme, ThemeConfig } from '../types'

/**
 * 主题上下文键
 */
export const ThemeContextKey = Symbol('theme-context')

/**
 * 主题上下文类型
 */
export interface ThemeContext {
  theme: ThemeConfig
  setTheme: (theme: Partial<ThemeConfig>) => void
  toggleColorScheme: () => void
  isDark: boolean
}

/**
 * 默认主题配置
 */
const defaultTheme: ThemeConfig = {
  colorScheme: 'light',
  primaryColor: '#1890ff',
  borderRadius: {
    small: '2px',
    medium: '6px',
    large: '8px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
    },
  },
}

/**
 * 主题提供者组件
 */
export const ThemeProvider = defineComponent({
  name: 'ThemeProvider',
  props: {
    theme: {
      type: Object as PropType<Partial<ThemeConfig>>,
      default: () => ({}),
    },
    colorScheme: {
      type: String as PropType<ColorScheme>,
      default: 'light',
    },
  },
  setup(props, { slots }) {
    // 响应式主题状态
    const themeState = reactive<ThemeConfig>({
      ...defaultTheme,
      ...props.theme,
      colorScheme: props.colorScheme,
    })

    // 计算属性
    const isDark = computed(() => {
      if (themeState.colorScheme === 'auto') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      return themeState.colorScheme === 'dark'
    })

    // 设置主题
    const setTheme = (newTheme: Partial<ThemeConfig>) => {
      Object.assign(themeState, newTheme)
    }

    // 切换颜色方案
    const toggleColorScheme = () => {
      themeState.colorScheme = isDark.value ? 'light' : 'dark'
    }

    // 主题上下文
    const themeContext: ThemeContext = {
      theme: themeState,
      setTheme,
      toggleColorScheme,
      isDark: isDark.value,
    }

    // 提供主题上下文
    provide(ThemeContextKey, themeContext)

    // 监听系统主题变化
    if (typeof window !== 'undefined' && themeState.colorScheme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        // 触发重新计算
        themeContext.isDark = isDark.value
      }

      mediaQuery.addEventListener('change', handleChange)

      // 组件卸载时清理
      // onUnmounted(() => {
      //   mediaQuery.removeEventListener('change', handleChange)
      // })
    }

    // 监听主题变化，应用CSS变量
    watch(
      () => themeState,
      (newTheme) => {
        applyThemeVariables(newTheme)
      },
      { deep: true, immediate: true },
    )

    return () => {
      return (
        <div class={[
          'l-theme-provider',
          `l-theme-${isDark.value ? 'dark' : 'light'}`,
        ]}
        >
          {slots.default?.()}
        </div>
      )
    }
  },
})

/**
 * 使用主题钩子
 */
export function useTheme(): ThemeContext {
  const context = inject<ThemeContext>(ThemeContextKey)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}

/**
 * 应用主题CSS变量
 */
function applyThemeVariables(theme: ThemeConfig) {
  if (typeof document === 'undefined')
return

  const root = document.documentElement

  // 应用主色
  if (theme.primaryColor) {
    root.style.setProperty('--l-color-primary', theme.primaryColor)
  }

  // 应用边框圆角
  if (theme.borderRadius) {
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--l-border-radius-${key}`, value)
    })
  }

  // 应用间距
  if (theme.spacing) {
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--l-spacing-${key}`, value)
    })
  }

  // 应用字体
  if (theme.typography) {
    if (theme.typography.fontFamily) {
      root.style.setProperty('--l-font-family', theme.typography.fontFamily)
    }

    if (theme.typography.fontSize) {
      Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
        root.style.setProperty(`--l-font-size-${key}`, value)
      })
    }
  }

  // 应用颜色方案类
  root.classList.remove('l-theme-light', 'l-theme-dark')
  const isDark = theme.colorScheme === 'dark'
    || (theme.colorScheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  root.classList.add(`l-theme-${isDark ? 'dark' : 'light'}`)
}

/**
 * 创建主题预设
 */
export function createThemePreset(name: string, config: Partial<ThemeConfig>) {
  return {
    name,
    config: {
      ...defaultTheme,
      ...config,
    },
  }
}

/**
 * 内置主题预设
 */
export const builtinThemes = {
  light: createThemePreset('light', {
    colorScheme: 'light',
    primaryColor: '#1890ff',
  }),

  dark: createThemePreset('dark', {
    colorScheme: 'dark',
    primaryColor: '#177ddc',
  }),

  compact: createThemePreset('compact', {
    spacing: {
      xs: '2px',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    typography: {
      fontSize: {
        xs: '11px',
        sm: '12px',
        md: '14px',
        lg: '16px',
        xl: '18px',
      },
    },
  }),
}
