import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/profile'
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/profile/index.vue'),
      meta: {
        title: '个人中心'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/login.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/register.vue'),
      meta: {
        title: '注册'
      }
    },
    {
      path: '/courses',
      name: 'Courses',
      component: () => import('@/views/courses/index.vue'),
      meta: {
        title: '我的课程'
      }
    },
    {
      path: '/courses/:id',
      name: 'CourseDetail',
      component: () => import('@/views/courses/detail.vue'),
      meta: {
        title: '课程详情'
      }
    },
    {
      path: '/courses/:id/learn',
      name: 'CourseLearn',
      component: () => import('@/views/courses/learn.vue'),
      meta: {
        title: '课程学习'
      }
    }
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 智能学习平台`
  }

  // 检查认证状态
  const token = localStorage.getItem('token')
  const publicRoutes = ['/login', '/register']

  if (!token && !publicRoutes.includes(to.path)) {
    next('/login')
  } else {
    next()
  }
})

export default router
