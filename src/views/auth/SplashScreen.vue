<script>
export default {
  name: 'SplashScreen',
  data() {
    return {
      isLoaded: false
    }
  },
  mounted() {
    // Check if the splash image has loaded
    const img = new Image()
    img.src = '/images/splashcsulf.png'
    img.onload = () => {
      this.isLoaded = true
    }

    // Redirect to login after 5 seconds or when image is loaded
    setTimeout(() => {
      this.$router.push({ name: 'login' })
    }, 5000)
  }
}
</script>

<template>
  <v-app>
    <v-container fluid class="d-flex align-center justify-center splash-screen">
      <v-row>
        <v-col class="text-center">
          <!-- Show image once it's loaded -->
          <v-img
            v-if="isLoaded"
            src="/images/splashcsulf.png"
            max-width="400"
            class="mx-auto"
            alt="Logo"
            elevation="16"
            transition="fade-transition"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style scoped>
.splash-screen {
  height: 100vh;
  background: #144517; /* Replace with your desired background color or image */
  color: white;
}
</style>
