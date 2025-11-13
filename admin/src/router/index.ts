import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue')
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('@/views/Users.vue')
    },
    {
      path: '/activities',
      name: 'Activities',
      component: () => import('@/views/Activities.vue')
    },
    {
      path: '/tasks',
      name: 'Tasks',
      component: () => import('@/views/Tasks.vue')
    },
    {
      path: '/content',
      name: 'Content',
      component: () => import('@/views/Content.vue')
    },
    {
      path: '/messages',
      name: 'Messages',
      component: () => import('@/views/Messages.vue')
    }
  ]
})

export default router