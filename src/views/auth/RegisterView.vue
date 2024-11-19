<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row class="d-flex align-center justify-center">
        <v-col cols="12" md="6" class="mx-auto pt-16">
          <v-card class="mx-auto" elevation="16">
            <v-card-title class="text-center">
              <v-img
                class="mx-auto"
                src="/images/logo.png"
                :width="mobile ? '60%' : '40%'"
              ></v-img>
              <h3 class="font-weight-black">WELCOME</h3>
            </v-card-title>

            <v-card-text class="bg-surface-light pt-4">
              <v-divider class="my-5"></v-divider>

              <v-form fast-fail @submit.prevent>
                <v-text-field
                  rounded
                  label="Firstname"
                  variant="solo-filled"
                  color="green-darken-3"
                ></v-text-field>

                <v-text-field
                  rounded
                  label="Lastname"
                  variant="solo-filled"
                  color="green-darken-3"
                ></v-text-field>

                <v-text-field
                  rounded
                  label="Email"
                  variant="solo-filled"
                  color="green-darken-3"
                ></v-text-field>

                <v-text-field
                  rounded
                  label="Password"
                  type="password"
                  variant="solo-filled"
                  color="green-darken-3"
                ></v-text-field>

                <v-text-field
                  rounded
                  label="Confirm Password"
                  type="password"
                  variant="solo-filled"
                  color="green-darken-3"
                ></v-text-field>

                <v-btn
                  rounded
                  class="mt-2"
                  type="submit"
                  block
                  color="green-darken-3"
                  >Register</v-btn
                >
              </v-form>

              <v-divider class="my-5"></v-divider>

              <h5 class="text-center">
                Already have an account?
                <RouterLink class="text-primary" to="/">
                  Login here!</RouterLink
                >
              </h5>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row></template
    >
  </AppLayout>
</template>
