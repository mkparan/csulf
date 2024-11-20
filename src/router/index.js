import { createRouter, createWebHistory } from 'vue-router'
import SplashScreen from '@/views/auth/SplashScreen.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/splash', // Set the root to redirect to splash screen
    },
    {
      path: '/splash',
      name: 'splash',
      component: SplashScreen,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
  ],
})

export default router
