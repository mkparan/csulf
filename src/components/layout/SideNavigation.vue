<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../utils/supabase.js'
import { useAuthStore } from '@/stores/authUser'  // Import the auth store

export default {
  setup() {
    const router = useRouter()  // Router for redirection
    const formAction = ref({ formProcess: false })  // Handle form process (loading indicator)

    // User details
    const firstName = ref('')
    const lastName = ref('')

    // Fetch user details (e.g., first and last name)
    const fetchUserDetails = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user details:', error)
        return
      }

      // Set user details if available
      firstName.value = user?.user_metadata?.firstname || 'Firstname'
      lastName.value = user?.user_metadata?.lastname || 'Lastname'
    }

    // Handle logout process
    const onLogout = async () => {
      formAction.value = { formProcess: true }  // Show loading indicator

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error during logout:', error)
        formAction.value.formProcess = false
        return
      }

      // Clear the authentication data from the store
      const authStore = useAuthStore()  // Access the auth store
      authStore.logout()  // Call the logout method to clear user and token

      // Stop loading indicator
      formAction.value.formProcess = false

      // Redirect to login page after logout
      router.replace('/login')
    }

    // Fetch user details on component mount
    onMounted(() => {
      fetchUserDetails()
    })

    return {
      formAction,
      firstName,
      lastName,
      onLogout  // Make onLogout available to the template
    }
  }
}
</script>

<template>
  <v-navigation-drawer class="bg-white" theme="dark" :width="300" elevation="16">
    <v-list color="transparent">
      <v-list-item
        class="pa-4"
        prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
        :title="`${firstName} ${lastName}`"
      ></v-list-item>

      <v-divider class="my-5"></v-divider>

      <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard"></v-list-item>
      <v-list-item prepend-icon="mdi-account-box" title="Account"></v-list-item>
      <v-list-item prepend-icon="mdi-gavel" title="Admin"></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block @click="onLogout"> Sign out </v-btn> <!-- Logout button -->
      </div>
    </template>
  </v-navigation-drawer>
</template>
