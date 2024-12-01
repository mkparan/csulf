<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../utils/supabase.js'
import SideNavigation from '@/components/layout/SideNavigation.vue'
import PostItemView from '@/components/layout/PostItemView.vue'
import DisplayPostView from '@/components/layout/DisplayPostView.vue'

export default {
  components: {
    SideNavigation, // Register the component here
    PostItemView,
    DisplayPostView //
  },
  setup() {
    const router = useRouter()
    const formAction = ref({
      formProcess: false
    })

    const onLogout = async () => {
      formAction.value = { formProcess: true }

      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error during logout:', error)
        return
      }

      formAction.value.formProcess = false
      router.replace('/login')
    }

    return {
      formAction,
      onLogout
    }
  }
}
</script>

<template>
  <v-layout>
    <!-- Top App Bar -->
    <v-app-bar app flat height="64" class="transparent-bar text-center">
      <v-app-bar-nav-icon
        color="light-green-darken-3"
        prepend-icon="mdi-view-headline"
      ></v-app-bar-nav-icon>
      <v-img src="/images/logo.png" class="pa-6"></v-img>
    </v-app-bar>

    <!-- Separate Containers for Layout -->
    <v-container>
      <v-row>
        <!-- Left Sidebar -->
        <v-container>
          <v-row>
            <v-col cols="3" sm="3">
              <SideNavigation />
            </v-col>
          </v-row>
        </v-container>

        <!-- Main Content (Posts) -->
        <v-container>
          <v-row>
            <v-col cols="12">
              <PostItemView />
              <DisplayPostView />
            </v-col>
          </v-row>
        </v-container>
      </v-row>
    </v-container>
  </v-layout>
</template>

<style>
/* Transparent Top Bar */
.transparent-bar {
  background-color: transparent !important;
  z-index: 10; /* Keeps it above other content */
  box-shadow: none !important;
}
</style>
