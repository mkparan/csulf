<template>
  <v-app>
    <v-container fluid class="d-flex align-center justify-center splash-screen">
      <v-row>
        <v-col class="text-center">
          <v-img
            src="/images/csulf-logo.png"
            max-width="200"
            class="mx-auto"
            alt="Logo"
          />
          <h1 class="my-4">Welcome to Lost and Found</h1>
          <v-progress-linear
            indeterminate
            color="blue"
            class="my-2"
          ></v-progress-linear>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "SplashScreen",
  mounted() {
    // Redirect to login after 5 seconds (adjust timing as needed)
    setTimeout(() => {
      this.$router.push({ name: "home" });
    }, 7000);
  },
};
</script>

<style scoped>
.splash-screen {
  height: 100vh;
  background: #1e88e5; /* Replace with your desired background color or image */
  color: white;
}
</style>
