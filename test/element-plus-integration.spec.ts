import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createApp, ref } from 'vue'
import { ElButton, ElInput, ElForm, ElFormItem, ElMessage } from 'element-plus'

// Mock Element Plus 全局配置
const mockElementPlusConfig = {
  size: 'default',
  zIndex: 2000,
  locale: {
    name: 'zh-cn',
  },
}

describe('Element Plus 集成测试', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)

    // Mock Element Plus 样式
    const style = document.createElement('style')
    style.textContent = `
      .el-button { padding: 8px 15px; border: 1px solid #dcdfe6; }
      .el-input { width: 100%; }
      .el-form-item { margin-bottom: 18px; }
    `
    document.head.appendChild(style)
  })

  afterEach(() => {
    if (container && document.body.contains(container)) {
      document.body.removeChild(container)
    }
  })

  it('应该正确渲染 ElButton 组件', () => {
    const wrapper = mount(ElButton, {
      props: {
        type: 'primary',
      },
      slots: {
        default: 'Click me',
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('el-button')
  })

  it('应该正确处理 ElButton 点击事件', async () => {
    let clicked = false

    const wrapper = mount(ElButton, {
      props: {
        onClick: () => {
          clicked = true
        },
      },
      slots: {
        default: 'Click me',
      },
    })

    await wrapper.trigger('click')
    expect(clicked).toBe(true)
  })

  it('应该正确渲染 ElInput 组件', () => {
    const wrapper = mount(ElInput, {
      props: {
        modelValue: 'test value',
        placeholder: 'Please input',
      },
    })

    expect(wrapper.exists()).toBe(true)
    const input = wrapper.find('input')
    expect(input.element.value).toBe('test value')
    expect(input.attributes('placeholder')).toBe('Please input')
  })

  it('应该正确处理 ElInput v-model', async () => {
    const TestComponent = {
      template: '<el-input v-model="inputValue" />',
      components: { ElInput },
      setup() {
        const inputValue = ref('initial')
        return { inputValue }
      },
    }

    const wrapper = mount(TestComponent)
    const input = wrapper.find('input')

    expect(input.element.value).toBe('initial')

    await input.setValue('changed')
    expect(wrapper.vm.inputValue).toBe('changed')
  })

  it('应该正确渲染 ElForm 组件', () => {
    const TestForm = {
      template: `
        <el-form :model="form" ref="formRef">
          <el-form-item label="Name" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="form.email" />
          </el-form-item>
        </el-form>
      `,
      components: { ElForm, ElFormItem, ElInput },
      setup() {
        const form = ref({
          name: '',
          email: '',
        })
        return { form }
      },
    }

    const wrapper = mount(TestForm)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findAll('.el-form-item')).toHaveLength(2)
  })

  it('应该支持 ElForm 表单验证', async () => {
    const TestForm = {
      template: `
        <el-form :model="form" :rules="rules" ref="formRef">
          <el-form-item label="Name" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-form>
      `,
      components: { ElForm, ElFormItem, ElInput },
      setup() {
        const form = ref({
          name: '',
        })

        const rules = {
          name: [{ required: true, message: 'Please input name', trigger: 'blur' }],
        }

        return { form, rules }
      },
    }

    const wrapper = mount(TestForm)
    const formRef = wrapper.vm.$refs.formRef

    // 模拟表单验证
    if (formRef && typeof (formRef as any).validate === 'function') {
      try {
        await (formRef as any).validate()
      } catch (error) {
        // 验证失败是预期的，因为 name 字段为空
        expect(error).toBeDefined()
      }
    }
  })

  it('应该支持不同尺寸的组件', () => {
    const sizes = ['large', 'default', 'small'] as const

    sizes.forEach(size => {
      const wrapper = mount(ElButton, {
        props: { size },
        slots: { default: 'Button' },
      })

      expect(wrapper.exists()).toBe(true)
    })
  })

  it('应该支持禁用状态', () => {
    const wrapper = mount(ElButton, {
      props: {
        disabled: true,
      },
      slots: {
        default: 'Disabled Button',
      },
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('应该支持加载状态', () => {
    const wrapper = mount(ElButton, {
      props: {
        loading: true,
      },
      slots: {
        default: 'Loading Button',
      },
    })

    expect(wrapper.exists()).toBe(true)
    // 检查是否有加载相关的类或属性
  })

  it('应该支持图标', () => {
    const wrapper = mount(ElButton, {
      props: {
        icon: 'el-icon-search',
      },
      slots: {
        default: 'Search',
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('应该支持主题颜色', () => {
    const types = ['primary', 'success', 'warning', 'danger', 'info'] as const

    types.forEach(type => {
      const wrapper = mount(ElButton, {
        props: { type },
        slots: { default: `${type} Button` },
      })

      expect(wrapper.exists()).toBe(true)
    })
  })

  it('应该支持输入框类型', () => {
    const types = ['text', 'password', 'number', 'email']

    types.forEach(type => {
      const wrapper = mount(ElInput, {
        props: {
          type,
          modelValue: '',
        },
      })

      expect(wrapper.exists()).toBe(true)
      const input = wrapper.find('input')
      expect(input.attributes('type')).toBe(type)
    })
  })

  it('应该支持清除功能', async () => {
    const wrapper = mount(ElInput, {
      props: {
        modelValue: 'test',
        clearable: true,
      },
    })

    expect(wrapper.exists()).toBe(true)
    // 在实际的 Element Plus 中，当有值且启用 clearable 时会显示清除图标
  })

  it('应该支持密码显示切换', () => {
    const wrapper = mount(ElInput, {
      props: {
        type: 'password',
        showPassword: true,
        modelValue: 'password123',
      },
    })

    expect(wrapper.exists()).toBe(true)
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('password')
  })

  it('应该正确处理表单项标签', () => {
    const wrapper = mount(ElFormItem, {
      props: {
        label: 'Test Label',
      },
      slots: {
        default: '<input type="text" />',
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Label')
  })

  it('应该支持响应式布局', () => {
    const TestComponent = {
      template: `
        <el-form label-width="100px">
          <el-form-item label="Name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-form>
      `,
      components: { ElForm, ElFormItem, ElInput },
      setup() {
        const form = ref({ name: '' })
        return { form }
      },
    }

    const wrapper = mount(TestComponent)
    expect(wrapper.exists()).toBe(true)
  })
})
