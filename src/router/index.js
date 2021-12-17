import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/library',
    name: 'Library',
    component: () => import('../views/Library.vue')
  },
  {
    path: '/account/:path(login|register|forgot-password|verify-email|verify|reset-password)',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/courses/:course_slug/:chapter_slug/:level_slug',
    name: 'Level',
    component: () => import('../views/Level.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router