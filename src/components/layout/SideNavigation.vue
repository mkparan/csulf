<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../utils/supabase.js'
import { useAuthStore } from '@/stores/authUser' // Import the auth store

export default {
  setup() {
    const router = useRouter() // Router for redirection
    const formAction = ref({ formProcess: false }) // Handle form process (loading indicator)

    // User details
    const firstName = ref('')
    const lastName = ref('')

    // Fetch user details (e.g., first and last name)
    const fetchUserDetails = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()
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
      formAction.value = { formProcess: true } // Show loading indicator

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error during logout:', error)
        formAction.value.formProcess = false
        return
      }

      // Clear the authentication data from the store
      const authStore = useAuthStore() // Access the auth store
      authStore.logout() // Call the logout method to clear user and token

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
      onLogout // Make onLogout available to the template
    }
  }
}
</script>

<template>
  <v-navigation-drawer
    class="bg-light-green-darken-3 rounded-e-xl pa-6"
    :width="350"
    elevation="16"
  >
    <v-list color="transparent">
      <v-list class="text-center">
        <div class="profile-section">
          <v-avatar size="150" class="mx-auto">
            <v-img
              src="https://scontent.fcgy2-2.fna.fbcdn.net/v/t39.30808-6/415088245_3509080339421197_435914246344423626_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGuQ97xLeyLu_79p1zb-ql4B9p_WwYYxz4H2n9bBhjHPke4Nh__sQE866JlPfR-JC5Ikj3-m8KTYKYV6H8WBTlQ&_nc_ohc=yltZepfm-7AQ7kNvgE0KMuQ&_nc_zt=23&_nc_ht=scontent.fcgy2-2.fna&_nc_gid=AIGdcIKsJAne8xj3i8gnE0P&oh=00_AYCtbyYQsDy8yuVb7af2bYbmfitwWRwGtSBlrznlw9ADwQ&oe=674E613E"
              alt="User Avatar"
            />
          </v-avatar>
          <p class="text-center font-weight-bold mt-2">{{ firstName }} {{ lastName }}</p>
        </div>
      </v-list>

      <v-divider class="my-5"></v-divider>

      <v-list-item @click="navigateTo('home')" class="menu-item bg-white rounded-pill text-center">
        <v-list-item title="Home"></v-list-item>
      </v-list-item>
      <v-list-item @click="navigateTo('saved')" class="menu-item text-center">
        <v-list-item title="Saved"></v-list-item>
      </v-list-item>
      <v-list-item @click="navigateTo('profile')" class="menu-item text-center">
        <v-list-item title="Profile"></v-list-item>
      </v-list-item>
      <v-list-item @click="navigateTo('about')" class="menu-item text-center">
        <v-list-item title="About CSULF"></v-list-item>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn
          class="rounded-pill text-light-green-darken-3 font-weight-black"
          block
          @click="onLogout"
        >
          Sign out
        </v-btn>
        <!-- Logout button -->
      </div>
    </template>
  </v-navigation-drawer>
</template>
