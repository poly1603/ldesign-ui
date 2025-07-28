/**
 * 断点响应式组合函数
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { BreakpointConfig } from '../types'
import { useBreakpoints } from '../config/ConfigProvider'

/**
 * 当前断点类型
 */
export type CurrentBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

/**
 * 断点状态
 */
export interface BreakpointState {
  current: CurrentBreakpoint
  xs: boolean
  sm: boolean
  md: boolean
  lg: boolean
  xl: boolean
  xxl: boolean
  width: number
  height: number
}

/**
 * 使用断点钩子
 */
export function useBreakpoint() {
  const breakpoints = useBreakpoints()
  
  // 响应式状态
  const width = ref(0)
  const height = ref(0)
  
  // 计算当前断点
  const current = computed<CurrentBreakpoint>(() => {
    const w = width.value
    
    if (w >= (breakpoints.xxl || 1600)) return 'xxl'
    if (w >= (breakpoints.xl || 1200)) return 'xl'
    if (w >= (breakpoints.lg || 992)) return 'lg'
    if (w >= (breakpoints.md || 768)) return 'md'
    if (w >= (breakpoints.sm || 576)) return 'sm'
    return 'xs'
  })
  
  // 各断点状态
  const xs = computed(() => width.value >= (breakpoints.xs || 480))
  const sm = computed(() => width.value >= (breakpoints.sm || 576))
  const md = computed(() => width.value >= (breakpoints.md || 768))
  const lg = computed(() => width.value >= (breakpoints.lg || 992))
  const xl = computed(() => width.value >= (breakpoints.xl || 1200))
  const xxl = computed(() => width.value >= (breakpoints.xxl || 1600))
  
  // 断点状态对象
  const state = computed<BreakpointState>(() => ({
    current: current.value,
    xs: xs.value,
    sm: sm.value,
    md: md.value,
    lg: lg.value,
    xl: xl.value,
    xxl: xxl.value,
    width: width.value,
    height: height.value
  }))
  
  // 更新尺寸
  const updateSize = () => {
    if (typeof window !== 'undefined') {
      width.value = window.innerWidth
      height.value = window.innerHeight
    }
  }
  
  // 生命周期
  onMounted(() => {
    updateSize()
    window.addEventListener('resize', updateSize)
  })
  
  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateSize)
    }
  })
  
  return {
    current,
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    width,
    height,
    state
  }
}

/**
 * 使用媒体查询钩子
 */
export function useMediaQuery(query: string) {
  const matches = ref(false)
  let mediaQuery: MediaQueryList | null = null
  
  const updateMatches = () => {
    if (mediaQuery) {
      matches.value = mediaQuery.matches
    }
  }
  
  onMounted(() => {
    if (typeof window !== 'undefined') {
      mediaQuery = window.matchMedia(query)
      updateMatches()
      mediaQuery.addEventListener('change', updateMatches)
    }
  })
  
  onUnmounted(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', updateMatches)
    }
  })
  
  return matches
}

/**
 * 使用响应式值钩子
 */
export function useResponsiveValue<T>(
  values: Partial<Record<CurrentBreakpoint, T>>,
  defaultValue: T
) {
  const { current } = useBreakpoint()
  
  return computed(() => {
    // 按优先级查找值
    const breakpointOrder: CurrentBreakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs']
    const currentIndex = breakpointOrder.indexOf(current.value)
    
    // 从当前断点开始向下查找
    for (let i = currentIndex; i < breakpointOrder.length; i++) {
      const breakpoint = breakpointOrder[i]
      if (values[breakpoint] !== undefined) {
        return values[breakpoint] as T
      }
    }
    
    return defaultValue
  })
}

/**
 * 断点工具函数
 */
export const breakpointUtils = {
  /**
   * 检查是否为移动设备
   */
  isMobile: () => {
    const { current } = useBreakpoint()
    return computed(() => current.value === 'xs' || current.value === 'sm')
  },
  
  /**
   * 检查是否为平板设备
   */
  isTablet: () => {
    const { current } = useBreakpoint()
    return computed(() => current.value === 'md')
  },
  
  /**
   * 检查是否为桌面设备
   */
  isDesktop: () => {
    const { current } = useBreakpoint()
    return computed(() => ['lg', 'xl', 'xxl'].includes(current.value))
  },
  
  /**
   * 获取响应式列数
   */
  getResponsiveCols: (cols: Partial<Record<CurrentBreakpoint, number>>) => {
    return useResponsiveValue(cols, 1)
  },
  
  /**
   * 获取响应式间距
   */
  getResponsiveSpacing: (spacing: Partial<Record<CurrentBreakpoint, string>>) => {
    return useResponsiveValue(spacing, '16px')
  }
}

/**
 * 创建断点媒体查询字符串
 */
export function createMediaQuery(
  breakpoint: CurrentBreakpoint,
  type: 'min' | 'max' = 'min',
  breakpoints?: BreakpointConfig
) {
  const defaultBreakpoints: BreakpointConfig = {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600
  }
  
  const bp = breakpoints || defaultBreakpoints
  const value = bp[breakpoint]
  
  if (!value) {
    throw new Error(`Breakpoint ${breakpoint} not found`)
  }
  
  return `(${type}-width: ${value}px)`
}

/**
 * 预定义的媒体查询
 */
export const mediaQueries = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 991px)',
  desktop: '(min-width: 992px)',
  touch: '(hover: none) and (pointer: coarse)',
  hover: '(hover: hover) and (pointer: fine)',
  darkMode: '(prefers-color-scheme: dark)',
  lightMode: '(prefers-color-scheme: light)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  highContrast: '(prefers-contrast: high)'
}

/**
 * 使用预定义媒体查询
 */
export function usePresetMediaQuery(preset: keyof typeof mediaQueries) {
  return useMediaQuery(mediaQueries[preset])
}