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
import ActivityView from '@/views/system/activity/ActivityView.vue'

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
    {
      path: '/system/activity',
      name: 'activity',
      component: ActivityView
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
  const authStore = useAuthStore() // Correctly initialize auth store
  const isLoggedIn = await authStore.checkAuth() // Check session validity

  console.log('Route Guard Debug:', {
    isLoggedIn,
    from: from.name,
    to: to.name,
    path: to.path
  })

  // Redirect logged-in users away from auth routes
  if (isLoggedIn && ['login', 'register', 'splash'].includes(to.name)) {
    return next({ name: 'dashboard' })
  }

  // Redirect unauthenticated users away from protected routes
  if (!isLoggedIn && to.path.startsWith('/system')) {
    return next({ name: 'login' })
  }

  // Redirect unknown routes to not-found page (handled by Vue Router)
  if (!to.matched.length) {
    return next({ name: 'not-found' })
  }

  next() // Allow the route to proceed
})

export default router
