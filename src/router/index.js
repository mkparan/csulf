import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import SplashScreen from '@/views/auth/SplashScreen.vue'
import DashboardView from '@/views/system/DashboardView.vue'
import NotFoundView from '@/views/errors/NotFoundView.vue'
import { useAuthStore } from '@/stores/authUser' // Correct the import here
import Practice from '@/views/system/Practice.vue'

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
      path: '/system/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/system/practice',
      name: 'practice',
      component: Practice
    },
    // Errors Pages
    {
      path: '/not-found',
      name: 'not-found',
      component: NotFoundView
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore() // Correct store initialization
  const isLoggedIn = await authStore.checkAuth() // Ensure you're using the store's method

  console.log('Route Guard Debug:', { isLoggedIn, routeName: to.name })

  // If user is logged in, prevent accessing login or register pages
  if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    return next({ name: 'dashboard' }) // Redirect logged-in users to dashboard
  }

  // If the user is not logged in and tries to access a protected route (like dashboard)
  if (!isLoggedIn && to.path.startsWith('/system')) {
    return next({ name: 'login' }) // Redirect unauthenticated users to login
  }

  // Handle unknown routes
  if (router.resolve(to).matched.length === 0) {
    return next({ name: 'not-found' }) // Redirect unknown routes to not-found
  }

  next() // Allow the route to proceed
})

export default router
