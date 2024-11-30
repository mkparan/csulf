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
  <v-layout class="rounded rounded-md">
    <!-- Top App Bar -->
    <v-app-bar color="green-darken-4 pa-1" class="text-center">
      <v-img class="pa-6" src="/images/logo.png"></v-img>
    </v-app-bar>

    <!-- Grid Container for 3 Columns -->
    <v-container fluid>
      <v-row>
        <!-- First Column: SideNavigation -->
        <v-col cols="12" md="3">
          <SideNavigation></SideNavigation>
        </v-col>

        <!-- Second Column: DisplayPostView -->
        <v-col cols="12" md="6">
          <!--post item-->
          <PostItemView></PostItemView>
          <DisplayPostView></DisplayPostView>
        </v-col>

        <!-- Third Column: Navigation Drawer -->
        <!-- <v-col cols="12" md="4">
                <v-navigation-drawer permanent left>
                  <v-list>
                    <v-list-item title="Drawer left"></v-list-item>
                  </v-list>
                </v-navigation-drawer>
              </v-col> -->
      </v-row>
    </v-container>
  </v-layout>
</template>
