import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null, // Retrieve from localStorage if available
    token: localStorage.getItem('token') || null // Retrieve token from localStorage
  }),
  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token
  },
  actions: {
    login(userData, authToken) {
      this.user = userData
      this.token = authToken

      // Persist in localStorage for page reloads
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', authToken)
    },
    logout() {
      this.user = null
      this.token = null

      // Remove from localStorage to clear authentication data
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    async checkAuth() {
      // Check if user and token exist in state and localStorage
      return this.user && this.token
    }
  }
})
