<script setup>
const props = defineProps(['formSuccessMessage', 'formErrorMessage'])
</script>

<template>
  <v-alert
    v-if="props.formSuccessMessage"
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

  <v-alert
    v-if="props.formErrorMessage"
    :text="props.formErrorMessage"
    title="Oppss Error!"
    type="error"
    variant="tonal"
    density="compact"
    border="start"
    closable
    color="deep-orange-accent-4"
  >
  </v-alert>
</template>
