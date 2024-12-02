<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import ProfileLayout from '@/components/layout/profile/ProfileLayout.vue'

export default {
  components: {
    DashboardLayout,
    ProfileLayout
  },
  setup() {
    const formAction = ref({ formProcess: false })
    const router = useRouter()

    const onLogout = async () => {
      formAction.value.formProcess = true
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error(error)
      } else {
        formAction.value.formProcess = false
        router.replace('/login')
      }
    }

    return {
      formAction,
      onLogout
    }
  }
}
</script>

<template>
  <DashboardLayout>
    <template #content>
      <v-container>
        <!-- To display the components from Profile -->
        <ProfileLayout></ProfileLayout>
      </v-container>
    </template>
  </DashboardLayout>
</template>
