import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import SplashScreen from '@/views/auth/SplashScreen.vue'
import DashboardView from '@/views/system/DashboardView.vue'
import NotFoundView from '@/views/errors/NotFoundView.vue'
import { useAuthStore } from '@/stores/authUser' // Correct the import here
import ProfileView from '@/views/system/profile/ProfileView.vue'
import SaveView from '@/views/system/save/SaveView.vue'
import AboutView from '@/views/system/about/AboutView.vue'
import SearchView from '@/views/system/search/SearchView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/splash' // Redirect root to splash screen
    },
    {
      path: '/splash',
      name: 'splash',
      component: SplashScreen,
      meta: { requiresAuth: false }
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
      path: '/system/save',
      name: 'save',
      component: SaveView
    },
    {
      path: '/system/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/system/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/system/search',
      name: 'search',
      component: SearchView
    },
    // Errors Pages
    {
      path: '/not-found',
      name: 'not-found',
      component: NotFoundView
    }
  ]
})

// Add a flag to check if the splash screen was shown in this session
let splashShown = false

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore() // Correct store initialization
  const isLoggedIn = await authStore.checkAuth() // Ensure you're using the store's method

  console.log('Route Guard Debug:', { isLoggedIn, routeName: to.name })

  // If the splash screen has already been shown, proceed to the next route
  if (splashShown) {
    // If user is logged in, redirect them to the dashboard (skip login/register)
    if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
      return next({ name: 'dashboard' })
    }

    // If the user is not logged in and tries to access a protected route (like dashboard)
    if (!isLoggedIn && to.path.startsWith('/system')) {
      return next({ name: 'login' }) // Redirect unauthenticated users to login
    }

    next() // Allow the route to proceed
  } else {
    // If the splash screen has not been shown yet, show it first
    splashShown = true
    next({ name: 'splash' }) // Redirect to splash screen
  }

  // Handle unknown routes
  if (router.resolve(to).matched.length === 0) {
    return next({ name: 'not-found' }) // Redirect unknown routes to not-found
  }
})

export default router
