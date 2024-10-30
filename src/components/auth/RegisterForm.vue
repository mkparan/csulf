<script setup>
import { requiredValidator, emailValidator, passwordValidator, confirmedValidator } from '@/utils/validators';
import { ref } from 'vue'
    
const visible = ref(false)
const isVisible = ref(false)
const refVForm = ref()

const FormDataDefault = {
  firstname: '',
  lastname: '',
  facebookLink: '',
  email: '',
  password: '',
  passwordConfirmation: ''
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
        <v-text-field rounded="xl" v-model="formData.firstname" label="Firstname" prepend-inner-icon="mdi-account-outline" variant="outlined" :rules="[requiredValidator]"></v-text-field>
        <v-text-field rounded="xl" v-model="formData.lastname" label="Lastname" prepend-inner-icon="mdi-account-outline" variant="outlined" :rules="[requiredValidator]"></v-text-field>
        <v-text-field rounded="xl" v-model="formData.facebookLink" label="Facebook Link" prepend-inner-icon="mdi-link-variant-plus"  variant="outlined" :rules="[requiredValidator]"></v-text-field>
        <v-text-field rounded="xl" v-model="formData.email" label="Email" prepend-inner-icon="mdi-email-outline" :rules="[requiredValidator, emailValidator]" variant="outlined"></v-text-field>
         <v-text-field 
              rounded="xl"
              v-model="formData.password"
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              label="Password"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              @click:append-inner="visible = !visible"
              :rules="[requiredValidator, passwordValidator]"
        ></v-text-field>
         <v-text-field 
              rounded="xl"
              v-model="formData.passwordConfirmation"
              :append-inner-icon="isVisible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="isVisible ? 'text' : 'password'"
              label="Password Confirmation"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              @click:append-inner="isVisible = !isVisible"
              :rules="[requiredValidator, confirmedValidator(formData.passwordConfirmation, formData.password)]"
        ></v-text-field>
         <v-btn rounded="xl" class="mt-2 mb-8" type="submit" block color="green-darken-2" prepend-icon="mdi-account-plus">Register</v-btn>
    </v-form>
</template>



