<script setup>
import AppLayout from '@/components/layout/AppLayout.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
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
                title="Login"
                image="/images/Walls.jpg"
                elevation="15"
              >
                <template v-slot:prepend>
                  <v-icon size="x-large"></v-icon>
                </template>
                
                <v-card-text class="text-h5 py-2">
                   <LoginForm></LoginForm>
                  <v-divider class="my-5"></v-divider>
                  <h6>
                         Don't have an Account? <RouterLink class="text-danger" to="/register">Click Here to Register</RouterLink>
                  </h6>

                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>

    </AppLayout>
        
</template>

