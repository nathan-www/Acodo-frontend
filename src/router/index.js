import {
  createRouter,
  createWebHistory
} from 'vue-router'

const routes = [{
    path: '/library',
    name: 'Library',
    component: () => import('../views/Library.vue')
  },
  {
    path: '/my-courses',
    name: 'MyCourses',
    component: () => import('../views/MyCourses.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue')
  },
  {
    path: '/leaderboards',
    name: 'Leaderboards',
    component: () => import('../views/Leaderboards.vue')
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
  },
  {
    path: '/courses/:course_slug',
    alias: '/courses/:course_slug/:chapter_slug',
    name: 'Course',
    component: () => import('../views/Course.vue')
  },
  {
    path: '/@/:username',
    name: 'Profile',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/:path(.*)*',
    name: 'NotFound',
    component: () => import('../views/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
