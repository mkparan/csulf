<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps(['formSuccessMessage', 'formErrorMessage'])

// State to control the visibility of the alert
const showSuccessAlert = ref(false)
const showErrorAlert = ref(false)

// Watch for changes in form success or error messages
watchEffect(() => {
  if (props.formSuccessMessage) {
    showSuccessAlert.value = true
    setTimeout(() => {
      showSuccessAlert.value = false
    }, 5000) // Hide success message after 5 seconds
  }

  if (props.formErrorMessage) {
    showErrorAlert.value = true
    setTimeout(() => {
      showErrorAlert.value = false
    }, 5000) // Hide error message after 5 seconds
  }
})
</script>

<template>
  <!-- Success Alert -->
  <v-alert
    v-if="showSuccessAlert"
    :text="props.formSuccessMessage"
    title="Success!"
    type="success"
    variant="tonal"
    density="compact"
    border="start"
    closable
    color="green-darken-4"
  >
  </v-alert>

  <!-- Error Alert -->
  <v-alert
    v-if="showErrorAlert"
    :text="props.formErrorMessage"
    title="Oops! Error!"
    type="error"
    variant="tonal"
    density="compact"
    border="start"
    closable
    color="deep-orange-accent-4"
  >
  </v-alert>
</template>
