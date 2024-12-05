<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import UsersPost from '@/components/layout/UsersPost.vue' // Adjust the path as necessary

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
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('User is not authenticated or error fetching user:', userError)
    return
  }

  console.log('Updating profile...')

  let uploadedFileName = profile_pic.value

  // Handle image upload if the profile_pic is a file
  if (profile_pic.value instanceof File) {
    // Use the file name as the file name in storage
    uploadedFileName = `public/${profile_pic.value.name}`

    // Upload the image to Supabase storage
    const { data, error: uploadError } = await supabase.storage
      .from('images')
      .upload(uploadedFileName, profile_pic.value)

    if (uploadError) {
      console.error('Error uploading image:', uploadError.message || uploadError)
      return
    }

    // After uploading, you can get the public URL (if needed for display purposes)
    console.log('Uploaded File Name:', uploadedFileName)
  }

  // Construct new user metadata with the uploaded image file name
  const updatedMetadata = {
    firstname: firstName.value,
    lastname: lastName.value,
    profile_pic: uploadedFileName, // Store just the file name here
    facebook_link: facebook_link.value
  }

  // Update user_metadata in auth.users
  const { error: updateUserError } = await supabase.auth.updateUser({
    data: updatedMetadata
  })

  if (updateUserError) {
    console.error('Error updating user metadata in auth.users:', updateUserError.message)
    return
  }

  console.log('Profile updated successfully in auth.users')

  // Update the 'raw_user_meta_data' column in auth.users directly
  const { error: updateRawMetadataError } = await supabase
    .from('auth.users')
    .update({
      raw_user_meta_data: {
        firstname: firstName.value,
        lastname: lastName.value,
        profile_pic: uploadedFileName, // Use the file name here
        facebook_link: facebook_link.value
      }
    })
    .eq('id', user.id)

  if (updateRawMetadataError) {
    console.error(
      'Error updating raw_user_meta_data in auth.users:',
      updateRawMetadataError.message || updateRawMetadataError
    )
    return
  }

  console.log('raw_user_meta_data column updated successfully')

  // Optionally update the posts table or other tables
  const { error: updatePostsError } = await supabase
    .from('posts')
    .update({
      profile_pic: uploadedFileName, // Use the file name here
      firstname: firstName.value,
      lastname: lastName.value,
      facebook_link: facebook_link.value
    })
    .eq('user_id', user.id)

  if (updatePostsError) {
    console.error('Error updating posts table:', updatePostsError.message || updatePostsError)
  } else {
    console.log('Posts table updated successfully')
  }

  // Re-fetch user details to update UI
  fetchUserDetails()
  showEditModal.value = false
}

// Generate the full URL for the profile picture (if needed for display purposes)
const getProfilePicUrl = () => {
  if (profile_pic.value && !profile_pic.value.startsWith('http')) {
    return supabase.storage.from('images').getPublicUrl(profile_pic.value).publicURL
  }
  return profile_pic.value
}

onMounted(() => {
  fetchUserDetails()
})
</script>

<template>
  <v-app>
    <br />
    <br />
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

        <v-divider>You Have No Posts Yet</v-divider>
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
  </v-app>
</template>
