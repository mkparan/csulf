<script setup>
import { ref } from 'vue'

const theme = ref(localStorage.getItem('theme') ?? 'light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar class="px-3" :color="theme === 'light' ? 'grey-lighten-3' : 'grey-darken-4'">
        <v-spacer></v-spacer>

        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="elevated"
          slim
          @click="onClick"
        >
          {{ theme === 'light' ? 'Light Mode' : 'Dark Mode' }}
        </v-btn>
      </v-app-bar>
      <br /><br /><br /><br />
      <v-main>
        <v-container>
          <slot name="content"></slot>
        </v-container>
      </v-main>

      <v-footer class="d-flex flex-column" app>
        <div
          class="d-flex w-100 align-center px-4"
          :color="theme === 'light' ? 'grey-lighten-3' : 'grey-darken-4'"
        >
          <strong>Get connected with us on social networks!</strong>

          <v-spacer></v-spacer>

          <v-btn
            v-for="icon in icons"
            :key="icon"
            :icon="icon"
            class="mx-4"
            size="small"
            variant="plain"
          ></v-btn>
        </div>

        <div
          class="px-4 py-2 text-center w-100"
          :color="theme === 'light' ? 'grey-lighten-3' : 'grey-darken-4'"
        >
          {{ new Date().getFullYear() }} — <strong>CSULF</strong>
        </div>
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<!--social icons in footer -->
<script>
export default {
  data: () => ({
    icons: ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin', 'mdi-instagram']
  })
}
</script>
