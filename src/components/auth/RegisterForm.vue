<script setup>
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator
} from '@/utils/validators'
import { ref } from 'vue'
import AlertNotification from '../common/AlertNotification.vue'
import { supabase, formActionDefault } from '../../utils/supabase.js'
import { useRouter } from 'vue-router'

const visible = ref(false)
const isVisible = ref(false)
const refVForm = ref()

//predefined vue functions
const router = useRouter()

const FormDataDefault = {
  firstname: '',
  lastname: '',
  facebook_link: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  profile_pic: 'https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/profile/public/profile-default.png' // Default profile picture
}

const formData = ref({
  ...FormDataDefault
})

const formAction = ref({
  ...formActionDefault
})

const onSubmit = async () => {
  formAction.value = { ...formActionDefault } ///reset error message
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        firstname: formData.value.firstname,     //customs object
        lastname: formData.value.lastname,
        facebook_link: formData.value.facebook_link,
        profile_pic: formData.value.profile_pic
      }
    }
  })

  if (error) {
    console.error(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    console.log(data)
    formAction.value.formSuccessMessage = 'Successfully Registered'
    formAction.value.formSuccessMessage = 'Please Verify your Email to Login'

    // Add a 5-second delay before redirecting to the login page
    setTimeout(() => {
      router.replace('/login')
    }, 5000) // 5000 milliseconds = 5 seconds
  }

  //reset form
  refVForm.value?.reset() //clear the field if successfull login
  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>

  <v-form class="mt-5 ma-4" ref="refVForm" fast-fail @submit.prevent="onFormSubmit">
    <v-text-field
      color="green-darken-3"
      bg-color="green-lighten-3"
      rounded
      v-model="formData.firstname"
      label="Firstname"
      variant="solo-filled"
      :rules="[requiredValidator]"
    ></v-text-field>
    <v-text-field
      color="green-darken-3"
      bg-color="green-lighten-3"
      rounded
      v-model="formData.lastname"
      label="Lastname"
      variant="solo-filled"
      :rules="[requiredValidator]"
    ></v-text-field>
    <v-text-field
      color="green-darken-3"
      bg-color="green-lighten-3"
      rounded
      v-model="formData.facebook_link"
      label="Facebook Link"
      variant="solo-filled"
      :rules="[requiredValidator]"
    ></v-text-field>
    <v-text-field
      color="green-darken-3"
      bg-color="green-lighten-3"
      rounded
      v-model="formData.email"
      label="Email"
      :rules="[requiredValidator, emailValidator]"
      variant="solo-filled"
    ></v-text-field>
    <v-text-field
      color="green-darken-3"
      bg-color="green-lighten-3"
      rounded
      v-model="formData.password"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="visible ? 'text' : 'password'"
      label="Password"
      variant="solo-filled"
      @click:append-inner="visible = !visible"
      :rules="[requiredValidator, passwordValidator]"
    ></v-text-field>
    <v-text-field
      color="green-darken-3"
      bg-color="green-lighten-3"
      rounded
      v-model="formData.passwordConfirmation"
      :append-inner-icon="isVisible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="isVisible ? 'text' : 'password'"
      label="Password Confirmation"
      variant="solo-filled"
      @click:append-inner="isVisible = !isVisible"
      :rules="[
        requiredValidator,
        confirmedValidator(formData.passwordConfirmation, formData.password)
      ]"
    ></v-text-field>
    <v-btn
      rounded
      class="mt-2 font-weight-black"
      size="x-large"
      type="submit"
      block
      color="orange-darken-3"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
      >Sign up</v-btn
    >
  </v-form>
</template>
