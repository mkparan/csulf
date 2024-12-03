<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import SaveLayout from '@/components/layout/save/SaveLayout.vue'

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

</script>

<template>
  <DashboardLayout>
    <template #content>
      <v-container>
        <!-- To display the components from Save -->
        <SaveLayout></SaveLayout>
      </v-container>
    </template>
  </DashboardLayout>
</template>
