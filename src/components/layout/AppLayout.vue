<template>
  <v-responsive class="border rounded">
    <v-app>
      <!-- Background image container -->
      <div class="background-image">
        <v-main class="d-flex align-center justify-center fill-height" transition="fade-transition">
          <v-container>
            <slot name="content"></slot>
          </v-container>
        </v-main>
      </div>

      <v-footer border app class="footer-container text-center d-flex flex-column">
        <div>© Caraga State University - Lost and Found</div>
        <v-divider></v-divider>
        <div>All Rights Reserved</div>
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.background-image {
  min-height: 100vh;
  background-image: url('/images/background.svg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #144517;
}

.footer-container {
  background-color: #e65100;
  padding: 8px 16px;
  font-size: 0.85rem;
  color: white;
}
</style>
