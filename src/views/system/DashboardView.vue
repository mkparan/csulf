<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import PostItemView from '@/components/layout/PostItemView.vue'
import DisplayPostView from '@/components/layout/DisplayPostView.vue'

export default {
  components: {
    DashboardLayout,
    PostItemView,
    DisplayPostView
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
  <meta name="google-site-verification" content="uL_1ADd0NeWFNDOHJ84bD57sXg94Cdj92NnnSmbiZwo" />
  <DashboardLayout>
    <template #content>
      <v-layout>
        <!-- Main Layout -->
        <v-container fluid>
          <v-row>
            <!-- Main Content -->
            <br />
            <br />
            <br />
            <PostItemView />
            <DisplayPostView />
          </v-row>
        </v-container>
      </v-layout>
    </template>
  </DashboardLayout>
</template>
