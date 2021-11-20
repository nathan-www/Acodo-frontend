import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/library',
    name: 'Library',
    component: () => import('../views/Library.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
