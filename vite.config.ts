import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
      // 优化类型文件输出
      cleanVueFileName: true,
      skipDiagnostics: false,
      logDiagnostics: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'utils/index': resolve(__dirname, 'src/utils/index.ts'),
        JsonEditor: resolve(__dirname, 'src/JsonEditor.vue'),
      },
      formats: ['es', 'cjs'],
    },
    outDir: 'dist',
    // 启用代码压缩
    minify: 'terser',
    // Terser 压缩选项
    terserOptions: {
      compress: {
        // 删除 console
        drop_console: true,
        // 删除 debugger
        drop_debugger: true,
        // 删除未使用的代码
        dead_code: true,
        // 删除未使用的变量
        unused: true,
        // 删除注释
        comments: false,
        // 启用全部压缩优化
        passes: 3,
        // 压缩条件表达式
        conditionals: true,
        // 合并变量声明
        join_vars: true,
        // 压缩循环
        loops: true,
        // 压缩对象属性
        properties: true,
        // 删除无用的表达式
        side_effects: false,
      },
      mangle: {
        // 混淆变量名
        toplevel: true,
        // 保留类名
        keep_classnames: false,
        // 保留函数名
        keep_fnames: false,
      },
      format: {
        // 删除所有注释
        comments: false,
        // 美化输出（设为false以获得最小体积）
        beautify: false,
        // 压缩空格
        indent_level: 0,
      },
    },
    // 优化 Rollup 选项
    rollupOptions: {
      // 启用树摇
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
      external: [
        'vue',
        'monaco-editor',
        'element-plus',
        '@element-plus/icons-vue',
        'jsonc-parser',
        'lodash',
        /^vue\/.*/,
        /^element-plus\/.*/,
        /^@element-plus\/.*/,
        /^monaco-editor\/.*/,
        /^lodash\/.*/,
      ],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].esm.js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          // 压缩输出配置
          compact: true,
          // 删除注释
          comments: false,
          globals: {
            vue: 'Vue',
            'monaco-editor': 'Monaco',
            'element-plus': 'ElementPlus',
            '@element-plus/icons-vue': 'ElementPlusIconsVue',
          },
        },
        {
          format: 'cjs',
          entryFileNames: '[name].cjs.js',
          chunkFileNames: 'chunks/[name]-[hash].cjs',
          // 压缩输出配置
          compact: true,
          // 删除注释
          comments: false,
          globals: {
            vue: 'Vue',
            'monaco-editor': 'Monaco',
            'element-plus': 'ElementPlus',
            '@element-plus/icons-vue': 'ElementPlusIconsVue',
          },
        },
      ],
    },
    // 优化代码分割
    chunkSizeWarningLimit: 1000,
    // 启用源码映射（生产环境可设为false以减小体积）
    sourcemap: false,
    // 报告压缩详情
    reportCompressedSize: true,
    // CSS 代码分离
    cssCodeSplit: true,
    // 生成 manifest
    manifest: false,
  },
  // 优化依赖处理
  optimizeDeps: {
    include: ['lodash', 'jsonc-parser'],
  },
})
