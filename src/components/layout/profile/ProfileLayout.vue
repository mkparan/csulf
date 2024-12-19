<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import UsersPost from '@/components/layout/UsersPost.vue' // Adjust the path as necessary
import AlertNotification from '../../common/AlertNotification.vue'
import { requiredValidator } from '../../../utils/validators' // Assuming this is defined correctly
import { useRouter } from 'vue-router'

const router = useRouter()

// Function to navigate
const navigateTo = (routeName) => {
  router.push({ name: routeName })
}

// Manage form action states
const formActionDefault = {
  formSuccessMessage: '',
  formErrorMessage: '',
  formProcess: false
}

// Define component properties here
const firstName = ref('')
const lastName = ref('')
const profile_pic = ref('') // File name of the profile image
const facebook_link = ref('') // Reactive reference for Facebook link
const showEditModal = ref(false) // Control modal visibility
const showModal = ref(false) // Modal visibility
const item_name = ref('') // Item name input
const image = ref(null) // Image file input
const description = ref('') // Description input
const posts = ref([]) // Array to store posts
const full_name = ref('')
const avatar_url = ref('')

const profileUrl = 'https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/images/'

// Reset form fields
const resetForm = () => {
  item_name.value = ''
  image.value = null
  description.value = ''
}

const formAction = ref({ ...formActionDefault })

const handlePost = async () => {
  formAction.value = { ...formActionDefault }

  if (!item_name.value || !image.value || !description.value) {
    formAction.value.formErrorMessage = 'All fields are required.'
    return
  }

  formAction.value.formProcess = true

  let imageUrl = ''
  if (image.value) {
    const { data, error } = await supabase.storage
      .from('items')
      .upload(`public/${image.value.name}`, image.value, { upsert: true })

    if (error) {
      formAction.value.formErrorMessage = 'Failed to upload the image.'
      return
    }
    imageUrl = data?.path
  }

  try {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    const userId = user?.id
    const { data: newPost, error: insertError } = await supabase
      .from('posts')
      .insert([
        {
          item_name: item_name.value,
          image: imageUrl,
          description: description.value,
          user_id: userId
        }
      ])
      .select()

    if (insertError) {
      formAction.value.formErrorMessage = 'Failed to create the post.'
      return
    }

    posts.value.unshift(newPost[0]) // Add the new post
    posts.value = [...posts.value] // Ensure reactivity triggers
    formAction.value.formSuccessMessage = 'Post created successfully!'
    resetForm()
    showModal.value = false
  } catch (error) {
    formAction.value.formErrorMessage = 'Unexpected error during post creation.'
  } finally {
    formAction.value.formProcess = false
  }
}

const handleCancel = () => {
  resetForm()
  formAction.value = { ...formActionDefault } // Reset form action state
  showModal.value = false // Close the modal
}

// Fetch user details from Supabase
const fetchUserDetails = async () => {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()
  if (error) {
    console.error(error)
  } else {
    firstName.value = user?.user_metadata?.firstname
    lastName.value = user?.user_metadata?.lastname
    profile_pic.value = user?.user_metadata?.profile_pic
    facebook_link.value = user?.user_metadata?.facebook_link || ''
    full_name.value = user?.user_metadata?.full_name
    avatar_url.value = user?.user_metadata?.avatar_url
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

  let uploadedFileName = profile_pic.value

  if (profile_pic.value instanceof File) {
    uploadedFileName = `public/${profile_pic.value.name}`

    // Attempt to upload or overwrite the file if it already exists
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(uploadedFileName, profile_pic.value, {
        upsert: true // Correctly include the upsert option here
      })

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      return
    }

    console.log('Image uploaded successfully!')
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
    console.error('Error updating raw_user_meta_data in auth.users:', updateRawMetadataError)
  }

  const { error: updatePostsError } = await supabase
    .from('posts')
    .update(updatedMetadata)
    .eq('user_id', user.id)

  if (updatePostsError) {
    console.error('Error updating posts table:', updatePostsError)
  }

  fetchUserDetails()
  formAction.value.formSuccessMessage = 'Profile Updated Successfully'
  showEditModal.value = false
}

onMounted(() => {
  fetchUserDetails()
})
</script>

<template>
  <br />
  <br />

  <v-row justify="center">
    <v-col cols="12" sm="12" md="8">
      <v-card class="rounded-xl mb-4" max-width="1000" elevation="4">
        <v-list class="text-center pt-5">
          <div class="profile-section">
            <v-avatar size="150" class="mx-auto" color="black">
              <!-- If profile_pic exists and is not null or empty, or if it's a file name -->
              <v-img
                v-if="profile_pic && profile_pic !== '' && profile_pic !== null"
                :src="profile_pic.startsWith('http') ? profile_pic : profileUrl + profile_pic"
                alt="User Avatar"
                class="mx-auto"
                height="200"
                width="200"
              />

              <!-- Fallback image if profile_pic is not provided or is invalid -->
              <v-img
                v-else
                :src="avatar_url"
                alt="User Avatar"
                class="mx-auto"
                height="200"
                width="200"
              />
            </v-avatar>
            <p class="text-center font-weight-bold mt-2 text-light-green-darken-3">
              {{ firstName && lastName ? firstName + ' ' + lastName : full_name }}
            </p>
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
          <!-- For activity log -->
          <v-btn
            class="rounded-pill bg-light-green-darken-3"
            icon="mdi-history"
            @click="navigateTo('activity')"
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
          <v-btn class="rounded-pill bg-light-green-darken-3" block @click="showModal = true">
            Post Now!
          </v-btn>
        </v-card-actions>
      </v-card>
      <AlertNotification
        :form-success-message="formAction.formSuccessMessage"
        :form-error-message="formAction.formErrorMessage"
      ></AlertNotification>
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

  <!-- Modal for Create Post -->
  <v-dialog v-model="showModal" max-width="500px">
    <v-card class="rounded-xl">
      <v-card-title class="text-center">
        <span class="text-h5 pa-2">Create Post</span>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="item_name"
            label="Item Name"
            variant="solo"
            rounded
            outlined
            :rules="[requiredValidator]"
          />
          <v-file-input
            v-model="image"
            label="Upload Image"
            accept="image/*"
            variant="solo"
            rounded
            outlined
            :rules="[requiredValidator]"
          />
          <v-textarea
            v-model="description"
            label="Description"
            variant="solo"
            rounded
            outlined
            rows="3"
            :rules="[requiredValidator]"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="red" @click="handleCancel">Cancel</v-btn>
        <v-btn :disabled="formAction.formProcess" text color="green" @click="handlePost">
          Post
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Posts section -->
  <UsersPost />
</template>
