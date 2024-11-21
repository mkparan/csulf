<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row class="d-flex align-center justify-center">
        <v-col cols="12" lg="8" v-if="!mobile">
          <v-img class="mx-auto" src="/images/login.svg" width="800"></v-img>
        </v-col>

        <v-col cols="12" lg="4" :class="mobile ? '' : 'pt-16'">
          <v-card class="blur-card mx-auto" elevation="16">
            <v-card-title class="text-center">
              <v-img class="mx-auto" src="/images/logo.png" :width="mobile ? '60%' : '30%'"></v-img>
              <h3 class="text-orange-lighten-5 font-weight-black">WELCOME</h3>
            </v-card-title>

            <v-card-text>
              <v-divider class="my-5"></v-divider>

              <!-- Call LoginForm -->
              <LoginForm class="ma-4"></LoginForm>

              <h5 class="text-white text-center">
                Don't have an account?
                <RouterLink class="text-orange-lighten-3" to="register">
                  Register Here!
                </RouterLink>
              </h5>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style scoped>
.blur-card {
  backdrop-filter: blur(1px);
  background-color: rgba(145, 179, 136, 0.555);
  border-radius: 16px;
  overflow: hidden;
}
</style>
