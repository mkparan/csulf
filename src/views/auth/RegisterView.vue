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
                class="mx-auto bg-surface-light"
                width="400"
                elevation="24"
              >

            <v-card-title class="">
                <v-row class="">
                      <v-col cols="">
                        <v-img 
                          src="/images/csulf-logo.png"  
                          max-width="70"
                          class="mr-3"
                        />
                      </v-col>        
                      <!-- Column for the text -->
                      <v-col>
                        <div>
                          <h3 class="">Register Here!!!</h3>
                          <v-card-subtitle class="">CSULF</v-card-subtitle>
                        </div>
                      </v-col>
                </v-row>
          </v-card-title>

                <!-- <template v-slot:title>
                  <span class="font-weight-black">Register Here!!!</span>
                </template> -->

                 <template v-slot:prepend>
                  <v-icon size="x-large"></v-icon>
                </template>
              

                <v-card-text class="bg-surface-light pt-0">
                      <RegisterForm></RegisterForm>
                     
                  <h4 class="text-center">
                       Already have an Account? <RouterLink class="text-danger fw-bold" to="/login">Click Here to Login</RouterLink>
                  </h4>   
                </v-card-text>
              </v-card>
           </v-col>
          </v-row>
            </template>
    </AppLayout>
</template> 