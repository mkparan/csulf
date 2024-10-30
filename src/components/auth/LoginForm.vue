<script setup>
import { ref } from 'vue'
    
  const visible = ref(false)
</script>


<template>
     <v-form fast-fail @submit.prevent>
        <v-text-field label="Email"  prepend-inner-icon="mdi-email-outline" variant="outlined"></v-text-field>
        <v-text-field 
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              label="Password"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              @click:append-inner="visible = !visible"
        ></v-text-field>
        <v-btn rounded="xl" class="mt-2 mb-5" type="submit" block color="green-darken-2" prepend-icon="mdi-login">Login</v-btn>
         <h4 class="text-center">OR</h4>  
          <v-divider class=""></v-divider>    
        <v-btn rounded="xl" class="mt-2 mb-8" type="submit" block color="deep-orange-darken-1" prepend-icon="mdi mdi-google-plus">Continue with Google</v-btn>
    </v-form>
</template>
