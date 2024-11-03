<script setup>
import { requiredValidator, emailValidator } from '@/utils/validators';
import { ref } from 'vue'
    
const visible = ref(false)
const refVForm = ref()

const FormDataDefault = {
  email: '',
  password: '',
}

const formData = ref({
   ...FormDataDefault
})

const onSubmit = () => {
  alert(formData.value.email)
  alert(formData.value.password)
  console.log('Login Successful')
}

const onFormSubmit = () => {
    refVForm.value?.validate().then(({ valid }) => {
      if (valid) onSubmit()
  })
}

</script>


<template>
     <v-form ref="refVForm" fast-fail @submit.prevent="onFormSubmit">
        <v-text-field
          rounded="xl"
          v-model="formData.email" label="Email"  prepend-inner-icon="mdi-email-outline" :rules="[requiredValidator, emailValidator]" variant="outlined"
          ></v-text-field>
           
        <v-text-field 
               v-model="formData.password"
               rounded="xl"
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              label="Password"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              @click:append-inner="visible = !visible"
              :rules="[requiredValidator]"
        ></v-text-field>
        <v-btn rounded="xl" class="mt-2 mb-5" type="submit" block color="green-darken-2" prepend-icon="mdi-login">Login</v-btn>
         <h4 class="text-center">OR</h4>  
          <v-divider class=""></v-divider>    
        <v-btn rounded="xl" class="mt-2 mb-8" type="submit" block color="deep-orange-darken-1" prepend-icon="mdi mdi-google-plus">Continue with Google</v-btn>
    </v-form>
</template>
