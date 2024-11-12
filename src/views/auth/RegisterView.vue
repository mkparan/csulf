<script setup>
import { ref } from 'vue'

const theme = ref('light')
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-main>
        <v-container class="fill-height" fluid>
          <v-row class="d-flex align-center justify-center">
            <v-col cols="12" md="6" lg="4" class="mx-auto">
              <v-card
                class="mx-auto"
                prepend-icon="mdi-account-plus"
                subtitle="Register"
              >
                <template v-slot:title>
                  <span class="font-weight-black">Welcome to Vuetify</span>
                </template>

                <v-card-text class="bg-surface-light pt-4">
                  <v-form fast-fail @submit.prevent>
                    <v-text-field
                      rounded
                      label="Firstname"
                      variant="solo-filled"
                    ></v-text-field>

                    <v-text-field
                      rounded
                      label="Lastname"
                      variant="solo-filled"
                    ></v-text-field>

                    <v-text-field
                      rounded
                      label="Email"
                      variant="solo-filled"
                    ></v-text-field>

                    <v-text-field
                      rounded
                      label="Password"
                      type="password"
                      variant="solo-filled"
                    ></v-text-field>

                    <v-text-field
                      rounded
                      label="Confirm Password"
                      type="password"
                      variant="solo-filled"
                    ></v-text-field>

                    <v-btn rounded class="mt-2" type="submit" block
                      >Submit</v-btn
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
          </v-row>
        </v-container>
      </v-main>
      <v-footer
        border
        app
        class="bg-light-green-darken-3 text-center d-flex flex-column"
      >
        <div>
          <v-btn
            v-for="icon in icons"
            :key="icon"
            :icon="icon"
            class="mx-4"
            variant="text"
          ></v-btn>
        </div>

        <div class="pt-0">Caraga State University - Lost and Found</div>

        <v-divider></v-divider>

        <div>
          {{ new Date().getFullYear() }} —
          <strong>AMPATIN - IGNACIO - PARAN</strong>
        </div>
      </v-footer>
    </v-app>
  </v-responsive>
</template>
