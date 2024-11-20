<script setup>
import { ref } from 'vue'

const visible = ref(false)
const passwordField = ref(null)

const toggleVisibility = () => {
  if (passwordField.value) {
    const cursorPosition =
      passwordField.value.$el.querySelector('input').selectionStart
    visible.value = !visible.value
    // Ensure cursor stays at the same position
    setTimeout(() => {
      passwordField.value.$el
        .querySelector('input')
        .setSelectionRange(cursorPosition, cursorPosition)
    })
  }
}
</script>

<template>
  <v-form fast-fail @submit.prevent>
    <v-text-field
      rounded
      label="Firstname"
      variant="solo-filled"
      color="green-darken-3"
      bg-color="green-lighten-3"
    ></v-text-field>

    <v-text-field
      rounded
      label="Lastname"
      variant="solo-filled"
      color="green-darken-3"
      bg-color="green-lighten-3"
    ></v-text-field>

    <v-text-field
      rounded
      label="Email"
      variant="solo-filled"
      color="green-darken-3"
      bg-color="green-lighten-3"
    ></v-text-field>

    <v-text-field
      rounded
      label="Password"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="visible ? 'text' : 'password'"
      variant="solo-filled"
      color="green-darken-3"
      bg-color="green-lighten-3"
      @click:append-inner="toggleVisibility"
      ref="passwordField"
    ></v-text-field>

    <v-text-field
      rounded
      label="Confirm Password"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="visible ? 'text' : 'password'"
      variant="solo-filled"
      color="green-darken-3"
      bg-color="green-lighten-3"
      @click:append-inner="toggleVisibility"
      ref="passwordField"
    ></v-text-field>

    <v-btn
      rounded
      class="mt-2 font-weight-black"
      size="x-large"
      type="submit"
      block
      color="orange-darken-3"
      >Register</v-btn
    >

    <v-divider class="my-5"><p class="text-white">or</p></v-divider>

    <v-btn
      rounded
      class="mt-2 font-weight-medium text-capitalize google-btn"
      size="x-large"
      block
      color="grey-lighten-4"
      prepend-icon="mdi-google"
    >
      Continue with Google
    </v-btn>
  </v-form>
</template>
