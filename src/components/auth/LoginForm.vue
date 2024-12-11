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

 //google login
     const onGoogleSignIn = async () => {
  const authStore = useAuthStore();
  formAction.value = { ...formActionDefault }; // Reset form states
  formAction.value.formProcess = true;

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/system/dashboard`, // Redirect URI
      },
    });

    if (error) {
      console.error('Google Login Error:', error.message);
      formAction.value.formErrorMessage = error.message;
      formAction.value.formStatus = error.status;
    } else if (data) {
      console.log('Google Login Success:', data);
      const userMetaData = data.user?.user_metadata;

      // Extract and log user info for verification
      const userinfo = {
        email: userMetaData?.email || '',
        first_name: userMetaData?.given_name || '', // Same as PHP
        last_name: userMetaData?.family_name || '', // Same as PHP
        full_name: userMetaData?.name || '', // Full name
        picture: userMetaData?.picture || '', // Profile picture URL
        verifiedEmail: userMetaData?.email_verified || false, // Verified email
      };

      console.log('Extracted Google User Info:', userinfo);

      // Save this data into your Supabase database table
      const { error: dbError } = await supabase.from('auth.users').upsert({
        email: userinfo.email,
        firstname: userinfo.first_name,
        lastname: userinfo.last_name,
        profile_pic: userinfo.picture,
      });

      if (dbError) {
        console.error('Database Error:', dbError.message);
      } else {
        console.log('User info stored successfully in the database!');
      }

      formAction.value.formSuccessMessage = 'Successfully Logged in with Google';

      // Update auth store and navigate
      authStore.login(data.user, data.session.access_token);
      router.replace('/system/dashboard');
    }
  } catch (err) {
    console.error('Unexpected Error:', err);
  } finally {
    formAction.value.formProcess = false;
  }
};



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
     <v-divider class="my-5"><h4 class="text-white">or</h4></v-divider>
    <v-btn
      rounded
      class="mt-2 font-weight-medium text-capitalize google-btn"
      size="x-large"
      block
      color="grey-lighten-4"
      @click="onGoogleSignIn"
      :loading="formAction.formProcess"
    >
      <img
        src="/images/google.png"
        alt="Google logo"
        style="height: 24px; width: 24px"
        class="me-2"
      />
      <p class="py-1 font-weight-medium">Continue with Google</p>
    </v-btn> 

    <v-divider class="my-5"></v-divider>
  </v-form>
</template>
