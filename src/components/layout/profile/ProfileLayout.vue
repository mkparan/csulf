<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import UsersPost from '@/components/layout/UsersPost.vue' // Adjust the path as necessary
import AlertNotification from '../../common/AlertNotification.vue'

// Define state for success and error messages
const formAction = ref({
  formSuccessMessage: '',
  formErrorMessage: '',
  formProcess: false
})

// Define component properties here
const firstName = ref('')
const lastName = ref('')
const profile_pic = ref('') // File name of the profile image
const facebook_link = ref('') // Reactive reference for Facebook link
const showEditModal = ref(false) // Control modal visibility

const profileUrl = 'https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/images/'

// Fetch user details from Supabase
const fetchUserDetails = async () => {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()
  if (error) {
    console.error(error)
  } else {
    firstName.value = user?.user_metadata?.firstname || 'Firstname'
    lastName.value = user?.user_metadata?.lastname || 'Lastname'
    profile_pic.value = user?.user_metadata?.profile_pic || '/images/profile-default.png' // Just the file name
    facebook_link.value = user?.user_metadata?.facebook_link || ''
  }
}

   const updateProfile = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('User is not authenticated or error fetching user:', userError)
    return
  }

  let uploadedFileName = profile_pic.value

  if (profile_pic.value instanceof File) {
    uploadedFileName = `public/${profile_pic.value.name}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(uploadedFileName, profile_pic.value)

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      return
    }
  }

  const updatedMetadata = {
    firstname: firstName.value,
    lastname: lastName.value,
    profile_pic: uploadedFileName,
    facebook_link: facebook_link.value
  }

  const { error: updateUserError } = await supabase.auth.updateUser({ data: updatedMetadata })
  if (updateUserError) {
    console.error('Error updating user metadata in auth.users:', updateUserError)
    return
  }

  const { error: updateRawMetadataError } = await supabase
    .from('auth.users')
    .update({
      raw_user_meta_data: updatedMetadata
    })
    .eq('id', user.id)

  if (updateRawMetadataError && Object.keys(updateRawMetadataError).length > 0) {
    console.error(
      'Error updating raw_user_meta_data in auth.users:',
      updateRawMetadataError
    )
  }

  const { error: updatePostsError } = await supabase
    .from('posts')
    .update(updatedMetadata)
    .eq('user_id', user.id)

  if (updatePostsError) {
    console.error('Error updating posts table:', updatePostsError)
  }

     fetchUserDetails()
  formAction.value.formSuccessMessage = 'Post successfully updated'
  showEditModal.value = false
}

onMounted(() => {
  fetchUserDetails()
})
</script>

<template>
    <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="8">
        <v-card class="rounded-xl mb-4" max-width="1000" elevation="4">
          <v-list class="text-center pt-5">
            <div class="profile-section">
              <v-avatar size="150" class="mx-auto" color="black">
                <v-img
                  :src="profileUrl + profile_pic"
                  alt="User Avatar"
                  class="mx-auto"
                  height="200"
                  width="200"
                />
              </v-avatar>
              <p class="text-center font-weight-bold mt-2">{{ firstName }} {{ lastName }}</p>
            </div>
          </v-list>

          <!-- Center the Facebook button -->
          <v-card-actions class="text-center justify-center">
            <v-btn
              class="rounded-pill bg-light-green-darken-3"
              icon="mdi-facebook"
              :href="facebook_link"
              target="_blank"
              rel="noopener"
            >
            </v-btn>
          </v-card-actions>

          <!-- Other buttons, already centered -->
          <v-card-actions class="mx-auto">
            <v-btn class="rounded-pill bg-light-green-darken-3" block @click="showEditModal = true">
              Edit Profile
            </v-btn>
          </v-card-actions>
          <v-card-actions class="mx-auto">
            <v-btn class="rounded-pill bg-light-green-darken-3" block> Post Now! </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal for editing profile -->
    <v-dialog v-model="showEditModal" max-width="500px">
      <v-card class="rounded-xl">
        <v-card-title class="text-center">Edit Profile</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="firstName" label="First Name" variant="solo" rounded outlined />
            <v-text-field v-model="lastName" label="Last Name" variant="solo" rounded outlined />
            <v-file-input
              v-model="profile_pic"
              label="Upload Profile Image"
              accept="image/*"
              variant="solo"
              rounded
              outlined
            />
            <v-text-field
              v-model="facebook_link"
              label="Facebook Profile Link"
              variant="solo"
              rounded
              outlined
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="red" @click="showEditModal = false">Cancel</v-btn>
          <v-btn text color="green" @click="updateProfile">Save Changes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Posts section -->
    <UsersPost />
</template>
