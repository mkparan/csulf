<script>
export default {
  data: () => ({
    loaded: false,
    loading: false
  }),

  methods: {
    onClick() {
      this.loading = true

      setTimeout(() => {
        this.loading = false
        this.loaded = true
      }, 2000)
    }
  }
}
</script>

<template>
  <v-app>
    <br />
    <br />
    <v-row justify="center">
      <v-col cols="12" sm="8" md="8">
        <v-card class="rounded-xl mb-4" max-width="1000" elevation="4">
          <p class="text-center ma-3 text-h5 text-light-green-darken-3">Looking for Something?</p>
          <v-card-text class="ma-3">
            <v-text-field
              :loading="loading"
              append-inner-icon="mdi-magnify"
              density="compact"
              label="Search it Here!"
              variant="outlined"
              rounded
              color="light-green-darken-3"
              hide-details
              single-line
              @click:append-inner="onClick"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>
