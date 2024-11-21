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
    }

    // // Errors Pages
    // {
    //   path: '/forbidden',
    //   name: 'forbidden',
    //   component: ForbiddenView
    //   // meta: { isDefault: true }
    // },
    // {
    //   path: '/not-found',
    //   name: 'not-found',
    //   component: NotFoundView
    //   // meta: { isDefault: true }
    // }
  ]
})

// router.beforeEach(async (to) => {
//   // Check if the user is logged in
//   const isLoggedIn = await authStore.isAuthenticated()

//   // Redirect logged-in users away from login or register pages
//   if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
//     return { name: 'dashboard' } // Redirect to dashboard
//   }

//   // Prevent unauthenticated users from accessing system pages
//   if (!isLoggedIn && to.path.startsWith('/system')) {
//     return { name: 'login' } // Redirect to login
//   }

//   // Redirect unknown routes to the not-found page
//   if (router.resolve(to).matched.length === 0) {
//     return { name: 'not-found' }
//   }
// })

export default router
