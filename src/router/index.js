import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import SplashScreen from '@/views/auth/SplashScreen.vue'
import DashboardView from '@/views/system/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/splash' // Set the root to redirect to splash screen
    },
    {
      path: '/splash',
      name: 'splash',
      component: SplashScreen
    },
    {
      path: '/home',
      name: 'home',
      redirect: '/login' // Redirecting to login or another view
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView
    },

    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    }
  ]
})

export default router
