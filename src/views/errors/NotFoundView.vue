
<script>
export default {
  name: 'NotFoundView',
};
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row
          class="error-404"
          align="center"
          justify="center"
          style="min-height: 100vh; text-align: center;"
        >
          <v-col cols="12">
            <h1 class="text-blue-darken-4">404</h1>
          <h2 class="text-blue-darken-4">
            The page you are looking for doesn't exist.
          </h2>
          </v-col>
          <v-col cols="12">
             <v-img class="mx-auto" src="/images/not-found.svg" width="800"></v-img>
          </v-col>
          <v-col cols="12">
            <div class="credits">
              Designed by Emmanuel, Andrie , Mark
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>


<style scoped>
.error-404 h1 {
  font-size: 6rem;
  font-weight: bold;
}
.error-404 h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}
.credits {
  margin-top: 20px;
  font-size: 0.9rem;
  color: gray;
}
</style>
