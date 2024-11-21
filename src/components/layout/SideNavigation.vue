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
</script>

<template>
  <v-navigation-drawer class="bg-white" theme="dark" :width="400" elevation="16">
    <v-list color="transparent">
      <v-list-item
        class="pa-4"
        prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
        title="John Leider"
      ></v-list-item>

      <v-divider class="my-5"></v-divider>

      <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard"></v-list-item>
      <v-list-item prepend-icon="mdi-account-box" title="Account"></v-list-item>
      <v-list-item prepend-icon="mdi-gavel" title="Admin"></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block @click="onLogout"> Sign out </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>
