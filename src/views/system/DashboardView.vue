<<<<<<< HEAD
<script setup>
import SideNavigation from '@/components/layout/SideNavigation.vue'
=======
<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../utils/supabase.js'

export default {
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
>>>>>>> 880f1ad511250b0bdf3b301e4605e0da671819fc
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar color="green-darken-4 pa-1" class="text-center">
      <v-img class="pa-6" src="/images/logo.png"></v-img>
    </v-app-bar>

    <SideNavigation></SideNavigation>

    <v-navigation-drawer location="right">
      <v-list>
        <v-list-item title="Drawer right"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center" style="min-height: 300px">
      Main Content
    </v-main>
  </v-layout>
</template>

<style scoped>
h1 {
  margin-top: 20px;
}
</style>
