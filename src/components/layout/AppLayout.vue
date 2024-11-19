<script setup>
import { ref } from 'vue'

const theme = ref('light')
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-main class="d-flex align-center justify-center fill-height">
        <v-container>
          <slot name="content"></slot>
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
          <strong>All Rights Reserved</strong>
        </div>
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.fill-height {
  min-height: 100vh; /* Ensures container takes the full viewport height */
}
</style>
