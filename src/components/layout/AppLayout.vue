<script setup>
import { ref } from 'vue'
import { isAuthenticated } from '@/utils/supabase'

const theme = ref(localStorage.getItem('theme') ?? 'light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}

// //utilized predefined vue functions
// const { xs, sm, mobile } = useDisplay()

// // Load Variables
// const isLoggedIn = ref(false)

// //  Toggle Theme
// const onToggleTheme = () => {
//   theme.value = theme.value === 'light' ? 'dark' : 'light'
//   localStorage.setItem('theme', theme.value)
// }

// Get Authentication status from supabase
const getLoggedStatus = async () => {
  isLoggedIn.value = await isAuthenticated()
}

//di makita login haysst
// Load Functions during component rendering
// onMounted(() => {
//   getLoggedStatus()
// })

</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar class="px-3 bg-opacity" :color="theme === 'light' ? 'grey-lighten-3' : 'grey-darken-4'">
        <v-spacer></v-spacer>

        <v-btn
        class="bg-opacity"
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="elevated"
          slim
          @click="onClick"
        >
          {{ theme === 'light' ? 'Light Mode' : 'Dark Mode' }}
        </v-btn>
      </v-app-bar>
      <br />
      <v-main class="app-container">
        <v-container>
          <slot name="content"></slot>
        </v-container>
      </v-main>

      <v-footer class="d-flex flex-column bg-opacity" app>
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


<style scoped>
.app-container {
  min-height: 100vh;
  background-image: url('/images/bg-csu.jpg'); 
  background-size: cover;
}

.bg-opacity {
  background-color: rgba(255, 255, 255, 0.3); /* Light, semi-transparent white */
}
</style>
