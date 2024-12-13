import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase' // Ensure this points to your Supabase instance

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: (() => {
      try {
        const storedUser = localStorage.getItem('user')
        return storedUser ? JSON.parse(storedUser) : null // Parse if valid, fallback to null
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error)
        localStorage.removeItem('user') // Remove invalid data
        return null // Return null to prevent crashes
      }
    })(),
    token: localStorage.getItem('token') || null // Safely retrieve token
  }),
  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token // Check authentication
  },
  actions: {
    login(userData, authToken) {
      this.user = userData
      this.token = authToken

      // Save valid data to localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', authToken)
    },
    logout() {
      this.user = null
      this.token = null

      // Clear data from localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    async checkAuth() {
      try {
        const { data: sessionData, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error fetching session:', error.message)
          this.logout() // Clear stored data if the session is invalid
          return false
        }

        if (sessionData.session) {
          this.user = sessionData.session.user // Update user with fresh data
          this.token = sessionData.session.access_token // Update token

          // Save valid data back to localStorage
          localStorage.setItem('user', JSON.stringify(this.user))
          localStorage.setItem('token', this.token)

          return true // Session is valid
        }

        this.logout() // Logout if no valid session
        return false
      } catch (err) {
        console.error('Unexpected error during session validation:', err)
        this.logout() // Clear invalid data
        return false
      }
    }
  }
})
