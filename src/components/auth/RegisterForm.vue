<script setup>
import { ref } from 'vue'
    
  const visible = ref(false)
  const isVisible = ref(false)
</script>

<template>
    <v-form fast-fail @submit.prevent>
        <v-text-field label="Firstname" prepend-inner-icon="mdi-account-outline" variant="outlined"></v-text-field>
        <v-text-field label="Lastname" prepend-inner-icon="mdi-account-outline" variant="outlined"></v-text-field>
        <v-text-field label="Facebook Link" prepend-inner-icon="mdi-link-variant-plus"  variant="outlined"></v-text-field>
        <v-text-field label="Email" prepend-inner-icon="mdi-email-outline" variant="outlined"></v-text-field>
         <v-text-field 
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              label="Password"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              @click:append-inner="visible = !visible"
        ></v-text-field>
         <v-text-field 
              :append-inner-icon="isVisible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="isVisible ? 'text' : 'password'"
              label="Password Confirmation"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              @click:append-inner="isVisible = !isVisible"
        ></v-text-field>
         <v-btn rounded="xl" class="mt-2 mb-8" type="submit" block color="green-darken-2" prepend-icon="mdi-account-plus">Register</v-btn>
    </v-form>
</template>



