<script setup>
import { ref } from 'vue'
import { supabase, formActionDefault } from '../../utils/supabase.js'
import { requiredValidator, emailValidator } from '@/utils/validators'
import AlertNotification from '../common/AlertNotification.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authUser' // Correct import

const visible = ref(false)
const refVForm = ref()

//predefined vue functions
const router = useRouter()

//load variables
const FormDataDefault = {
  email: '',
  password: ''
}

const formData = ref({
  ...FormDataDefault
})

const formAction = ref({
  ...formActionDefault
})

const onSubmit = async () => {
  const authStore = useAuthStore()
  formAction.value = { ...formActionDefault } ///reset error message
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password
  })

  if (error) {
    console.error(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    console.log(data)
    formAction.value.formSuccessMessage = 'Successfully Logged Account'

    // Update the auth store
    authStore.login(data.user, data.session.access_token)

    setTimeout(() => {
      router.replace('/system/dashboard')
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
      v-model="formData.email"
      label="Email"
      :rules="[requiredValidator, emailValidator]"
      variant="solo-filled"
    ></v-text-field>

    <v-text-field
      color="green-darken-3"
      bg-color="green-lighten-3"
      v-model="formData.password"
      rounded
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="visible ? 'text' : 'password'"
      label="Password"
      variant="solo-filled"
      @click:append-inner="visible = !visible"
      :rules="[requiredValidator]"
    ></v-text-field>
    <v-btn
      rounded=""
      class="mt-2 font-weight-black"
      size="x-large"
      type="submit"
      block
      color="orange-darken-3"
      :loading="formAction.formProcess"
      >Sign in</v-btn
    >
    <!-- <h4 class="text-center">OR</h4> -->
    <!-- <v-divider class="my-5"><h4 class="text-white">or</h4></v-divider>
    <v-btn
      rounded
      class="mt-2 font-weight-medium text-capitalize google-btn"
      size="x-large"
      block
      color="grey-lighten-4"
    >
      <img
        src="/images/google.png"
        alt="Google logo"
        style="height: 24px; width: 24px"
        class="me-2"
      />
      <p class="py-1 font-weight-medium">Continue with Google</p>
    </v-btn> -->

    <v-divider class="my-5"></v-divider>
  </v-form>
</template>
