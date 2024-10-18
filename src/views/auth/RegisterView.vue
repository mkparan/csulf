<script setup>
import AppLayout from '@/components/layout/AppLayout.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';
  import { useDisplay } from 'vuetify'

  const { mobile } = useDisplay()
</script>

<template>
    <AppLayout>
        <template #content>
              <v-row class="d-flex justify-center">
            <v-col cols="12" md="6">
              <v-card
                class="mx-auto text-white text-center"
                color="#6A1B9A"
                max-width="400"
                prepend-icon="mdi-dog"
                title="Register"
                image="/images/Walls.jpg"
              >
                <template v-slot:prepend>
                  <v-icon size="x-large"></v-icon>
                </template>
                <!-- :width="mobile ? '75%' : '25%'" -->

                <v-card-text class="text-h5 py-2">
                  <RegisterForm></RegisterForm>

                <v-divider class="my-5"></v-divider>
                  <h6>
                           Already have an Account? <RouterLink class="text-danger" to="/login">Click Here to Login</RouterLink>
                    </h6>

                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>
    </AppLayout>
</template>
