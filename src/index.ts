/**
 * @ldesign/ui - 现代化Vue3 UI组件库
 *
 * 特性：
 * - 丰富的组件库（50+组件）
 * - 完整的主题系统和设计令牌
 * - 无障碍支持（ARIA、键盘导航）
 * - 响应式设计和移动端适配
 * - Vue 3 组合式API和组件支持
 * - TypeScript 完整类型支持
 * - Engine插件集成
 * - 自定义主题和样式
 */

// 样式导入
import './styles/index.scss'

// 基础组件
export { default as LButton } from './components/basic/LButton.vue'
export { default as LIcon } from './components/basic/LIcon.vue'
export { default as LImage } from './components/basic/LImage.vue'
export { default as LLink } from './components/basic/LLink.vue'
export { default as LText } from './components/basic/LText.vue'
export { default as LDivider } from './components/basic/LDivider.vue'

// 布局组件
export { default as LContainer } from './components/layout/LContainer.vue'
export { default as LRow } from './components/layout/LRow.vue'
export { default as LCol } from './components/layout/LCol.vue'
export { default as LSpace } from './components/layout/LSpace.vue'
export { default as LGrid } from './components/layout/LGrid.vue'
export { default as LFlex } from './components/layout/LFlex.vue'

// 表单组件
export { default as LForm } from './components/form/LForm.vue'
export { default as LFormItem } from './components/form/LFormItem.vue'
export { default as LInput } from './components/form/LInput.vue'
export { default as LTextarea } from './components/form/LTextarea.vue'
export { default as LSelect } from './components/form/LSelect.vue'
export { default as LOption } from './components/form/LOption.vue'
export { default as LCheckbox } from './components/form/LCheckbox.vue'
export { default as LCheckboxGroup } from './components/form/LCheckboxGroup.vue'
export { default as LRadio } from './components/form/LRadio.vue'
export { default as LRadioGroup } from './components/form/LRadioGroup.vue'
export { default as LSwitch } from './components/form/LSwitch.vue'
export { default as LSlider } from './components/form/LSlider.vue'
export { default as LRate } from './components/form/LRate.vue'
export { default as LUpload } from './components/form/LUpload.vue'
export { default as LDatePicker } from './components/form/LDatePicker.vue'
export { default as LTimePicker } from './components/form/LTimePicker.vue'
export { default as LColorPicker } from './components/form/LColorPicker.vue'

// 数据展示组件
export { default as LTable } from './components/data/LTable.vue'
export { default as LList } from './components/data/LList.vue'
export { default as LListItem } from './components/data/LListItem.vue'
export { default as LCard } from './components/data/LCard.vue'
export { default as LAvatar } from './components/data/LAvatar.vue'
export { default as LBadge } from './components/data/LBadge.vue'
export { default as LTag } from './components/data/LTag.vue'
export { default as LProgress } from './components/data/LProgress.vue'
export { default as LTree } from './components/data/LTree.vue'
export { default as LTimeline } from './components/data/LTimeline.vue'
export { default as LCalendar } from './components/data/LCalendar.vue'
export { default as LCarousel } from './components/data/LCarousel.vue'
export { default as LCollapse } from './components/data/LCollapse.vue'
export { default as LCollapsePanel } from './components/data/LCollapsePanel.vue'

// 反馈组件
export { default as LAlert } from './components/feedback/LAlert.vue'
export { default as LMessage } from './components/feedback/LMessage.vue'
export { default as LNotification } from './components/feedback/LNotification.vue'
export { default as LModal } from './components/feedback/LModal.vue'
export { default as LDrawer } from './components/feedback/LDrawer.vue'
export { default as LPopconfirm } from './components/feedback/LPopconfirm.vue'
export { default as LTooltip } from './components/feedback/LTooltip.vue'
export { default as LPopover } from './components/feedback/LPopover.vue'
export { default as LLoading } from './components/feedback/LLoading.vue'
export { default as LSkeleton } from './components/feedback/LSkeleton.vue'
export { default as LEmpty } from './components/feedback/LEmpty.vue'
export { default as LResult } from './components/feedback/LResult.vue'

// 导航组件
export { default as LMenu } from './components/navigation/LMenu.vue'
export { default as LMenuItem } from './components/navigation/LMenuItem.vue'
export { default as LSubmenu } from './components/navigation/LSubmenu.vue'
export { default as LBreadcrumb } from './components/navigation/LBreadcrumb.vue'
export { default as LBreadcrumbItem } from './components/navigation/LBreadcrumbItem.vue'
export { default as LTabs } from './components/navigation/LTabs.vue'
export { default as LTabPane } from './components/navigation/LTabPane.vue'
export { default as LSteps } from './components/navigation/LSteps.vue'
export { default as LStep } from './components/navigation/LStep.vue'
export { default as LPagination } from './components/navigation/LPagination.vue'
export { default as LAffix } from './components/navigation/LAffix.vue'
export { default as LAnchor } from './components/navigation/LAnchor.vue'
export { default as LBackTop } from './components/navigation/LBackTop.vue'

// 其他组件
export { default as LDropdown } from './components/other/LDropdown.vue'
export { default as LDropdownItem } from './components/other/LDropdownItem.vue'
export { default as LWatermark } from './components/other/LWatermark.vue'
export { default as LQRCode } from './components/other/LQRCode.vue'
export { default as LTour } from './components/other/LTour.vue'
export { default as LFloatButton } from './components/other/LFloatButton.vue'

// 主题和配置
export { ThemeProvider, useTheme, ThemeContextKey, builtinThemes, createThemePreset } from './theme/ThemeProvider'
export { ConfigProvider, useConfig, useBreakpoints, t, builtinLocales, builtinConfigs, createConfigPreset } from './config/ConfigProvider'

// 工具函数和组合式函数
export * from './composables/useForm'
export * from './composables/useBreakpoint'
// TODO: 实现其他组合式函数
// export * from './composables/useTable'
// export * from './composables/useModal'
// export * from './composables/useNotification'
// export * from './composables/useClickOutside'
// export * from './composables/useFocus'
// export * from './composables/useKeyboard'

// 指令
export { vLoading } from './directives/loading'
export { vTooltip } from './directives/tooltip'
export { vClickOutside } from './directives/clickOutside'
export { vFocus } from './directives/focus'
export { vRipple } from './directives/ripple'

// Engine插件导出
export { createUIPlugin, uiPlugin, withUIPlugin, createThemeManager, createI18nManager } from './engine/uiPlugin'

// 类型定义导出
export type {
  UIConfig,
  ThemeConfig,
  ComponentSize,
  ComponentType,
  ComponentVariant,
  FormRules,
  TableColumn,
  TableData,
  ModalOptions,
  NotificationOptions,
  TooltipOptions,
  BreakpointConfig,
  ColorScheme,
} from './types'

/**
 * 预设主题
 */
export const presetThemes = {
  // 默认主题
  default: {
    name: 'default',
    colors: {
      primary: '#1890ff',
      success: '#52c41a',
      warning: '#faad14',
      error: '#f5222d',
      info: '#1890ff',
    },
    sizes: {
      small: '24px',
      medium: '32px',
      large: '40px',
    },
    borderRadius: {
      small: '2px',
      medium: '6px',
      large: '8px',
    },
  },

  // 暗色主题
  dark: {
    name: 'dark',
    colors: {
      primary: '#177ddc',
      success: '#49aa19',
      warning: '#d89614',
      error: '#d32029',
      info: '#177ddc',
    },
    background: {
      primary: '#141414',
      secondary: '#1f1f1f',
      tertiary: '#262626',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a6a6a6',
      tertiary: '#737373',
    },
  },

  // 紧凑主题
  compact: {
    name: 'compact',
    sizes: {
      small: '20px',
      medium: '28px',
      large: '36px',
    },
    spacing: {
      small: '4px',
      medium: '8px',
      large: '12px',
    },
  },
}

/**
 * 预设配置
 */
export const presetConfigs = {
  /**
   * 默认配置
   */
  default: {
    size: 'medium',
    theme: 'default',
    locale: 'zh-CN',
    rtl: false,
    accessibility: true,
  } as import('./types').UIConfig,

  /**
   * 紧凑配置
   */
  compact: {
    size: 'small',
    theme: 'compact',
    locale: 'zh-CN',
    rtl: false,
    accessibility: true,
    dense: true,
  } as import('./types').UIConfig,

  /**
   * 移动端配置
   */
  mobile: {
    size: 'large',
    theme: 'default',
    locale: 'zh-CN',
    rtl: false,
    accessibility: true,
    touchOptimized: true,
  } as import('./types').UIConfig,
}

/**
 * Vue插件安装函数
 */
export function install(app: any, options: import('./types').UIConfig = {}) {
  const config = { ...presetConfigs.default, ...options }

  // 提供全局配置
  app.provide('ui-config', config)

  // 注册全局组件（可选）
  if (config.globalComponents) {
    // 注册所有组件为全局组件
  }

  // 注册指令
  app.directive('loading', vLoading)
  app.directive('tooltip', vTooltip)
  app.directive('click-outside', vClickOutside)
  app.directive('focus', vFocus)
  app.directive('ripple', vRipple)

  // 设置全局属性
  app.config.globalProperties.$ui = {
    config,
    themes: presetThemes,
  }
}

// 默认导出
export default {
  install,
  presetThemes,
  presetConfigs,
}
