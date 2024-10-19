<template>
     <v-form fast-fail @submit.prevent>
        <v-text-field label="Email" variant="outlined"></v-text-field>
        <v-text-field label="Password" type="password" variant="outlined"></v-text-field>
        <v-btn class="mt-2 mb-5" type="submit" block color="green-darken-2" prepend-icon="mdi-login">Login</v-btn>
         <h4 class="text-center">OR</h4>  
          <v-divider class=""></v-divider>    
        <v-btn class="mt-2 mb-8" type="submit" block color="deep-orange-darken-1" prepend-icon="mdi mdi-google-plus">Continue with Google</v-btn>
    </v-form>
</template>