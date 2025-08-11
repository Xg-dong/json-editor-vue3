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
          // 删除 JSDoc 注释 /** */
          file.code = file.code.replace(/\/\*\*[\s\S]*?\*\//g, '')
          // 删除 HTML 风格注释 <!-- -->
          file.code = file.code.replace(/<!--[\s\S]*?-->/g, '')
          // 删除多余的空行
          file.code = file.code.replace(/\n\s*\n\s*\n/g, '\n\n')
          file.code = file.code.replace(/\n\s*\n/g, '\n')
          // 删除行首行尾空格，但保持必要的缩进
          file.code = file.code.replace(/^\s+$/gm, '')
          file.code = file.code.replace(/[ \t]+$/gm, '')
        }
        // 处理 CSS 文件
        if (
          file.type === 'asset' &&
          (fileName.endsWith('.css') || fileName.endsWith('.scss') || fileName.endsWith('.less'))
        ) {
          if (typeof file.source === 'string') {
            let source = file.source
            // 删除 CSS 注释
            source = source.replace(/\/\*[\s\S]*?\*\//g, '')
            // 删除多余的空行
            source = source.replace(/\n\s*\n/g, '\n')
            file.source = source
          }
        }
      }
    },
    // 在写入文件后进一步处理 TypeScript 声明文件
    async writeBundle() {
      // 动态导入 Node.js 模块
      const fs = await import('fs')
      const path = await import('path')

      const processFile = (filePath: string) => {
        try {
          if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf-8')
            // 删除所有注释
            content = content.replace(/\/\/.*$/gm, '')
            content = content.replace(/\/\*[\s\S]*?\*\//g, '')
            content = content.replace(/\/\*\*[\s\S]*?\*\//g, '')
            // 删除多余的空行
            content = content.replace(/\n\s*\n\s*\n/g, '\n\n')
            content = content.replace(/\n\s*\n/g, '\n')
            content = content.replace(/^\s+$/gm, '')
            content = content.replace(/[ \t]+$/gm, '')
            fs.writeFileSync(filePath, content)
          }
        } catch (error) {
          console.warn(`Warning: Could not process file ${filePath}:`, error)
        }
      }

      // 递归处理 dist 目录
      const processDirectory = (dir: string) => {
        try {
          if (fs.existsSync(dir)) {
            const items = fs.readdirSync(dir)
            items.forEach(item => {
              const fullPath = path.join(dir, item)
              const stat = fs.statSync(fullPath)
              if (stat.isDirectory()) {
                processDirectory(fullPath)
              } else if (item.endsWith('.d.ts') || item.endsWith('.js') || item.endsWith('.css')) {
                processFile(fullPath)
              }
            })
          }
        } catch (error) {
          console.warn(`Warning: Could not process directory ${dir}:`, error)
        }
      }

      // 处理整个 dist 目录
      processDirectory('dist')
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
      // 排除测试文件
      exclude: ['test/**/*', '**/*.spec.ts', '**/*.test.ts'],
      // 强制删除类型定义文件中的注释
      compilerOptions: {
        removeComments: true,
      },
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
          // 强制删除所有注释
          banner: '',
          footer: '',
          intro: '',
          outro: '',
          // 确保输出时不包含任何注释
          generatedCode: {
            constBindings: true,
          },
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
          // 强制删除所有注释
          banner: '',
          footer: '',
          intro: '',
          outro: '',
          // 确保输出时不包含任何注释
          generatedCode: {
            constBindings: true,
          },
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
            root.walkComments(comment => {
              comment.remove()
            })
          },
        },
      ],
    },
  },
})
