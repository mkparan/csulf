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

////google login
const onGoogleSignIn = async () => {
  try {
    // Step 1: Google Login (OAuth)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/system/dashboard` // Redirect URI
      }
    })

    if (error) {
      console.error('Google Login Error:', error.message)
      return
    }

    // Step 2: Wait for session data
    const sessionData = await sessionWait()

    if (!sessionData?.session?.user) {
      console.error('Session not received from Google login.')
      return
    }

    const user = sessionData.session.user
    const {
      given_name: firstname,
      family_name: lastname,
      picture,
      full_name,
      email
    } = user.user_metadata || {}

    // Ensure required user data is available
    if (!email) {
      console.error('Email is required but not available.')
      return
    }

    // Step 3: Prepare data for insertion into the database
    const updateData = {
      user_id: user.id,
      firstname: full_name || 'Unknown',
      lastname: lastname || 'Unknown',
      profile_pic: picture || 'default-profile-pic.jpg',
      verifiedEmail: !!user.email_confirmed_at,
      token: user.id // This might not be a token, consider renaming
    }

    // Step 4: Check if user already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from('auth.users') // Adjust the schema and table name here if needed
      .select('id') // Only select the ID to minimize payload
      .eq('email', email)
      .single() // Expect a single result

    if (existingUserError && existingUserError.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Error checking existing user:', existingUserError.message)
      return
    }

    // Step 5: Insert or Update user data
    if (existingUser && existingUser.length > 0) {
      // Step 5: Update the existing user's `raw_user_meta_data`
      const { error: updateError } = await supabase
        .from('auth.users') // Target the correct schema and table
        .update({
          raw_user_meta_data: {
            firstname: full_name || 'Unknown',
            lastname: lastname || 'Unknown',
            profile_pic: picture || 'default-profile-pic.jpg',
            verifiedEmail: user.email_confirmed_at ? true : false,
            token: user.id
          }
        })
        .eq('email', email) // Update based on the user's email

      if (updateError) {
        console.error('Error updating user:', updateError.message)
        return
      }
    } else {
      // Step 6: Insert new user with `raw_user_meta_data`
      const { error: insertError } = await supabase
        .from('auth.users') // Target the correct schema and table
        .insert([
          {
            email, // Ensure required fields like `email` are included
            raw_user_meta_data: {
              firstname: full_name || 'Unknown',
              lastname: lastname || 'Unknown',
              profile_pic: picture || 'default-profile-pic.jpg'
            }
          }
        ])

      if (insertError) {
        console.error('Error inserting new user:', insertError.message)
        return
      }
    }

    console.log('User data successfully inserted or updated.')
  } catch (err) {
    console.error('Unexpected Error:', err)
  }
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
    <v-divider class="my-5"><h4 class="text-white">or</h4></v-divider>
    <v-btn
      rounded
      class="mt-2 font-weight-medium text-capitalize google-btn"
      size="x-large"
      block
      color="grey-lighten-4"
      @click="onGoogleSignIn"
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
