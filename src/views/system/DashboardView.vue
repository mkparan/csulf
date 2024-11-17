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
  <v-card class="mx-auto" color="surface-light" max-width="600">
    <template v-slot:append>
      <v-btn class="align-self-start" color="primary" @click="onLogout">Logout</v-btn>
    </template>
  </v-card>
</template>
