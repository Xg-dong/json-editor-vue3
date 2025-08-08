import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// 自定义插件：强制删除所有注释
function removeAllCommentsPlugin() {
  return {
    name: 'remove-all-comments',
    generateBundle(options, bundle) {
      // 遍历所有生成的文件
      for (const fileName in bundle) {
        const file = bundle[fileName]
        if (file.type === 'chunk' && file.code) {
          // 删除单行注释 //
          file.code = file.code.replace(/\/\/.*$/gm, '')
          // 删除多行注释 /* */
          file.code = file.code.replace(/\/\*[\s\S]*?\*\//g, '')
          // 删除多余的空行
          file.code = file.code.replace(/\n\s*\n/g, '\n')
          // 压缩空白字符
          file.code = file.code.replace(/\s+/g, ' ')
          // 删除行首空格
          file.code = file.code.replace(/^\s+/gm, '')
        }
      }
    },
  }
}

// 生产环境专用配置
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 生产环境下移除开发时的警告
          comments: false,
        },
      },
    }),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
      cleanVueFileName: true,
      skipDiagnostics: false,
      logDiagnostics: true,
      // 排除测试文件
      exclude: ['test/**/*', '**/*.spec.ts', '**/*.test.ts'],
    }),
    // 添加自定义注释删除插件
    removeAllCommentsPlugin(),
  ],
  define: {
    // 移除开发环境代码
    __DEV__: false,
    'process.env.NODE_ENV': '"production"',
  },
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
    minify: 'terser',
    terserOptions: {
      compress: {
        // 基本压缩选项
        drop_console: true,
        drop_debugger: true,
        dead_code: true,
        unused: true,
        // 减少压缩强度避免语法错误
        passes: 2,
        conditionals: true,
        booleans: true,
        loops: true,
        // 更保守的内联设置
        inline: 1,
        // 安全的变量合并
        join_vars: true,
        // 基本的序列优化
        sequences: true,
      },
      mangle: {
        // 基本的变量名混淆
        toplevel: false,
        keep_classnames: true,
        keep_fnames: true,
        // 移除属性混淆避免问题
        safari10: true,
      },
      format: {
        // 删除注释但保持代码可读性
        comments: false,
        beautify: false,
        ascii_only: false,
      },
    },
    rollupOptions: {
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
          compact: true,
          minifyInternalExports: true,
          exports: 'named',
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
          compact: true,
          minifyInternalExports: true,
          exports: 'named',
          globals: {
            vue: 'Vue',
            'monaco-editor': 'Monaco',
            'element-plus': 'ElementPlus',
            '@element-plus/icons-vue': 'ElementPlusIconsVue',
          },
        },
      ],
    },
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    reportCompressedSize: true,
    cssCodeSplit: true,
    manifest: false,
  },
  optimizeDeps: {
    include: ['lodash', 'jsonc-parser'],
    exclude: ['vue'],
  },
  // CSS 压缩选项
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'remove-comments',
          Once(root) {
            root.walkComments(comment => comment.remove())
          },
        },
      ],
    },
  },
})
