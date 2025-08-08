import BasicExample from '../views/BasicExample.vue'
import AdvancedExample from '../views/AdvancedExample.vue'
import UtilsExample from '../views/UtilsExample.vue'
import ComparisonExample from '../views/ComparisonExample.vue'
import FieldOperationsExample from '../views/FieldOperationsExample.vue'

export default [
  {
    path: '/',
    redirect: '/basic',
  },
  {
    path: '/basic',
    name: 'Basic',
    component: BasicExample,
    meta: { title: '基础功能' },
  },
  {
    path: '/advanced',
    name: 'Advanced',
    component: AdvancedExample,
    meta: { title: '高级功能' },
  },
  {
    path: '/utils',
    name: 'Utils',
    component: UtilsExample,
    meta: { title: '工具函数' },
  },
  {
    path: '/comparison',
    name: 'Comparison',
    component: ComparisonExample,
    meta: { title: 'JSON 比较' },
  },
  {
    path: '/field-operations',
    name: 'FieldOperations',
    component: FieldOperationsExample,
    meta: { title: '字段操作' },
  },
]
