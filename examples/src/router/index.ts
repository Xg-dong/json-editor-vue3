import { createRouter, createWebHistory } from 'vue-router'
import BasicExample from '@/views/BasicExample.vue'
import AdvancedExample from '@/views/AdvancedExample.vue'
import UtilsExample from '@/views/UtilsExample.vue'
import ComparisonExample from '@/views/ComparisonExample.vue'
import FieldOperationsExample from '@/views/FieldOperationsExample.vue'
import FormExample from '@/views/FormExample.vue'
import HeightControlExample from '@/views/HeightControlExample.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/basic',
    },
    {
      path: '/basic',
      name: 'basic',
      component: BasicExample,
    },
    {
      path: '/advanced',
      name: 'advanced',
      component: AdvancedExample,
    },
    {
      path: '/utils',
      name: 'utils',
      component: UtilsExample,
    },
    {
      path: '/comparison',
      name: 'comparison',
      component: ComparisonExample,
    },
    {
      path: '/field-operations',
      name: 'field-operations',
      component: FieldOperationsExample,
    },
    {
      path: '/form',
      name: 'form',
      component: FormExample,
    },
    {
      path: '/height-control',
      name: 'height-control',
      component: HeightControlExample,
    },
  ],
})

export default router
