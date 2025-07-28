/**
 * @ldesign/ui Engine插件
 */

import type { App } from 'vue'
import type { Plugin } from '@ldesign/engine'
import type { UIConfig, UIPluginOptions } from '../types'

/**
 * UI插件配置
 */
interface UIPluginConfig extends UIConfig {
  // 扩展配置
  autoInstallComponents?: boolean
  globalProperties?: Record<string, any>
}

/**
 * 创建UI插件
 */
export function createUIPlugin(options: UIPluginOptions = {}): Plugin {
  return {
    name: 'ui',
    priority: 100,
    dependencies: ['color'],
    
    async install(engine, pluginOptions: UIPluginConfig = {}) {
      const config = {
        autoInstallComponents: true,
        ...options.config,
        ...pluginOptions
      }
      
      // 注册配置到引擎
      engine.config.set('ui', config)
      
      // 注册UI服务
      engine.di.provide('ui:config', config)
      engine.di.provide('ui:theme', config.theme || {})
      
      // 监听主题变化
      engine.events.on('theme:change', (theme) => {
        engine.config.set('ui.theme', theme)
        engine.events.emit('ui:theme:change', theme)
      })
      
      // 监听语言变化
      engine.events.on('locale:change', (locale) => {
        engine.config.set('ui.locale', locale)
        engine.events.emit('ui:locale:change', locale)
      })
      
      // Vue应用安装
      const vueApp = engine.di.inject<App>('vue:app')
      if (vueApp) {
        // 安装组件
        if (config.autoInstallComponents && options.components) {
          options.components.forEach(component => {
            if (component.name) {
              vueApp.component(component.name, component)
            }
          })
        }
        
        // 安装指令
        if (options.directives) {
          Object.entries(options.directives).forEach(([name, directive]) => {
            vueApp.directive(name, directive)
          })
        }
        
        // 添加全局属性
        if (config.globalProperties) {
          Object.entries(config.globalProperties).forEach(([key, value]) => {
            vueApp.config.globalProperties[key] = value
          })
        }
      }
      
      // 注册中间件
      engine.middleware.add('beforeMount', async (context, next) => {
        // 初始化主题
        const theme = engine.config.get('ui.theme')
        if (theme) {
          engine.events.emit('ui:theme:init', theme)
        }
        
        await next()
      })
      
      engine.middleware.add('mounted', async (context, next) => {
        // UI组件初始化完成
        engine.events.emit('ui:ready')
        await next()
      })
      
      // 开发模式下的调试信息
      if (engine.config.get('debug')) {
        console.log('[LDesign UI] Plugin installed', {
          config,
          components: options.components?.length || 0,
          directives: Object.keys(options.directives || {}).length
        })
      }
    },
    
    async uninstall(engine) {
      // 清理事件监听器
      engine.events.off('theme:change')
      engine.events.off('locale:change')
      
      // 清理依赖注入
      engine.di.remove('ui:config')
      engine.di.remove('ui:theme')
      
      // 清理中间件
      engine.middleware.clear('beforeMount')
      engine.middleware.clear('mounted')
      
      if (engine.config.get('debug')) {
        console.log('[LDesign UI] Plugin uninstalled')
      }
    }
  }
}

/**
 * 默认UI插件实例
 */
export const uiPlugin = createUIPlugin()

/**
 * 插件工厂函数
 */
export function withUIPlugin(options: UIPluginOptions) {
  return createUIPlugin(options)
}

/**
 * 主题切换助手
 */
export function createThemeManager(engine: any) {
  return {
    setTheme(theme: any) {
      engine.events.emit('theme:change', theme)
    },
    
    getTheme() {
      return engine.config.get('ui.theme')
    },
    
    toggleDarkMode() {
      const currentTheme = this.getTheme()
      const newColorScheme = currentTheme?.colorScheme === 'dark' ? 'light' : 'dark'
      this.setTheme({
        ...currentTheme,
        colorScheme: newColorScheme
      })
    }
  }
}

/**
 * 国际化助手
 */
export function createI18nManager(engine: any) {
  return {
    setLocale(locale: string) {
      engine.events.emit('locale:change', locale)
    },
    
    getLocale() {
      return engine.config.get('ui.locale') || 'zh-CN'
    }
  }
}