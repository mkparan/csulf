<template>
  <v-app>
    <v-container fluid class="d-flex align-center justify-center splash-screen">
      <v-row>
        <v-col class="text-center">
          <v-img
            src="/images/splashcsulf.png"
            max-width="400"
            class="mx-auto"
            alt="Logo"
            elevation="16"
            transition="fade-transition"
          />
          <!-- splash loading -->
          <v-progress-circular
            :size="70"
            :width="7"
            color="amber"
            indeterminate
            transition="fade-transition"
            max-width="400"
          ></v-progress-circular>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'SplashScreen',
  mounted() {
    // Redirect to login after 5 seconds (adjust timing as needed)
    setTimeout(() => {
      this.$router.push({ name: 'login' })
    }, 5000)
  }
}
</script>

<style scoped>
.splash-screen {
  height: 100vh;
  background: #144517; /* Replace with your desired background color or image */
  color: white;
}
</style>
