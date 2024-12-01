<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../utils/supabase.js'
import SideNavigation from '@/components/layout/SideNavigation.vue'
import PostItemView from '@/components/layout/PostItemView.vue'
import DisplayPostView from '@/components/layout/DisplayPostView.vue'
import SideNews from '@/components/layout/SideNews.vue'

export default {
  components: {
    SideNavigation, // Register the component here
    PostItemView,
    SideNews,
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
      <!-- Left Navigation Icon -->
      <v-app-bar-nav-icon color="light-green-darken-3" prepend-icon="mdi-view-headline" />

      <!-- Logo -->
      <v-img src="/images/logo.png" class="pa-6 mx-auto" max-width="120" contain />

      <!-- Right Icon -->
      <v-app-bar-nav-icon
        location="right"
        color="light-green-darken-3"
        prepend-icon="mdi-newspaper-variant"
      />
    </v-app-bar>

    <!-- Main Layout -->
    <v-container fluid>
      <v-row>
        <!-- Left Sidebar: SideNavigation -->
        <v-col cols="12" sm="3" md="3" class="pa-2">
          <SideNavigation />
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" sm="6" md="6" class="pa-2">
          <v-container>
            <br />
            <br />
            <PostItemView />
            <DisplayPostView />
          </v-container>
        </v-col>

        <!-- Right Sidebar: SideNews -->
        <v-col cols="12" sm="3" md="3" class="pa-2">
          <SideNews />
        </v-col>
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
