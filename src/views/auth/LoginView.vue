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
                class="mx-auto bg-surface-light"
                width="400" elevation="24"
              >
               <v-img
                  src="/images/csulf-logo.png"
                  :width="200"
                  alt="CSU Logo"
                  class="mx-auto my-2 mt-0"
                ></v-img>

                 <!-- Title -->
                   <h1 class="mb-4 text-center" style="color: #388E3C;">
                          CSU<span style="color: #ff9800;">LF</span>
                   </h1>
              

                <v-card-text class="pt-4">
                      <LoginForm></LoginForm>
                   <h4 class="text-center">
                         Don't have an Account? <RouterLink class="text-danger" to="/register">Click Here to Register</RouterLink>
                  </h4>  
                </v-card-text>
              </v-card>
           </v-col>
          </v-row>
            </template>
    </AppLayout>
</template> 
