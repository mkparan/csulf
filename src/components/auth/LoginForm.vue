<template>
  <v-form fast-fail @submit.prevent>
    <v-text-field
      rounded
      label="Email"
      variant="solo-filled"
      color="green-darken-3"
    ></v-text-field>

    <v-text-field
      rounded
      label="Password"
      type="password"
      variant="solo-filled"
      color="green-darken-3"
    ></v-text-field>

    <v-btn rounded class="mt-2" type="submit" block color="green-darken-3">
      Login
    </v-btn>
  </v-form>
</template>
