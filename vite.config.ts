import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      cleanVueFileName: true,
      skipDiagnostics: false,
      logDiagnostics: true,
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LDesignUI',
      formats: ['es', 'umd'],
      fileName: (format) => `ldesign-ui.${format}.js`
    },
    rollupOptions: {
      external: [
        'vue',
        '@ldesign/engine',
        '@ldesign/color',
        '@floating-ui/vue',
        '@vueuse/core',
        'lucide-vue-next'
      ],
      output: {
        globals: {
          vue: 'Vue',
          '@ldesign/engine': 'LDesignEngine',
          '@ldesign/color': 'LDesignColor',
          '@floating-ui/vue': 'FloatingUIVue',
          '@vueuse/core': 'VueUse',
          'lucide-vue-next': 'LucideVueNext'
        }
      }
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@ldesign/engine': resolve(__dirname, '../engine/src'),
      '@ldesign/color': resolve(__dirname, '../color/src'),
      '@ldesign/utils': resolve(__dirname, '../utils/src')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts']
  }
})