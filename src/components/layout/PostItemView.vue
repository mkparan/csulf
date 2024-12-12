<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase' // Ensure this points to your Supabase instance
import AlertNotification from '../common/AlertNotification.vue'
import { requiredValidator } from '../../utils/validators' // Assuming this is defined correctly

// Reactive references for form and modal
const showModal = ref(false) // Modal visibility
const item_name = ref('') // Item name input
const image = ref(null) // Image file input
const description = ref('') // Description input
const posts = ref([]) // Array to store posts
const firstName = ref('') // User's first name
const lastName = ref('') // User's last name
const full_name = ref('')
const avatar_url = ref('')

// Manage form action states
const formActionDefault = {
  formSuccessMessage: '',
  formErrorMessage: '',
  formProcess: false
}
const formAction = ref({ ...formActionDefault })

// Reset form fields
const resetForm = () => {
  item_name.value = ''
  image.value = null
  description.value = ''
}

// Handle Post Submission
const handlePost = async () => {
  // Reset messages
  formAction.value = { ...formActionDefault }

  // Validate required fields
  if (!item_name.value || !image.value || !description.value) {
    formAction.value.formErrorMessage = 'All fields are required.'
    console.error('Validation error: Some fields are empty.')
    return
  }

  formAction.value.formProcess = true // Indicate process start

  let imageUrl = ''
  if (image.value) {
    try {
      // Attempt to upload or overwrite the file if it already exists
      const { data, error } = await supabase.storage
        .from('items')
        .upload(`public/${image.value.name}`, image.value, {
          upsert: true // Pass upsert as an option here
        })

      if (error) {
        console.error('Image upload error:', error)
        formAction.value.formErrorMessage = 'Failed to upload the image.'
        return
      }
      imageUrl = data?.path
      console.log('Image uploaded successfully:', imageUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      formAction.value.formErrorMessage = 'Unexpected error during image upload.'
      return
    }
  }

  try {
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError) {
      console.error('Auth error:', authError)
      formAction.value.formErrorMessage = 'Failed to retrieve user information.'
      return
    }

    const userId = user?.id

    const { error: insertError } = await supabase.from('posts').insert([
      {
        item_name: item_name.value,
        image: imageUrl,
        description: description.value,
        user_id: userId
      }
    ])

    if (insertError) {
      console.error('Insert error:', insertError)
      formAction.value.formErrorMessage = 'Failed to create the post.'
      return
    }

    formAction.value.formSuccessMessage = 'Post created successfully!'

    // Fetch the new list of posts, filtering by userId for UsersPost.vue
    const { data: postsData, error: fetchError } = await supabase
      .from('posts')
      .select()
      .eq('user_id', userId) // Fetch only the logged-in user's posts

    if (fetchError) {
      console.error('Fetch error:', fetchError)
      formAction.value.formErrorMessage = 'Failed to fetch updated posts.'
      return
    }

    posts.value = postsData // Update posts with user's posts
    console.log('Posts fetched:', posts.value)

    resetForm() // Clear the form fields
    showModal.value = false // Close the modal
  } catch (error) {
    console.error('Error during post creation:', error)
    formAction.value.formErrorMessage = 'Unexpected error during post creation.'
  } finally {
    formAction.value.formProcess = false // Indicate process end
  }
}

const handleCancel = () => {
  resetForm()
  formAction.value = { ...formActionDefault } // Reset form action state
  showModal.value = false // Close the modal
}

// Fetch user details on component mount
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
    full_name.value = user?.user_metadata?.full_name
    avatar_url.value = user?.user_metadata?.avatar_url
  }
}

onMounted(() => {
  fetchUserDetails()
})
</script>

<template>
  <v-container>
    <br />
    <br />
    <v-row justify="center">
      <v-col cols="12" sm="8" md="8">
        <v-card
          class="rounded-xl mb-4 text-light-green-darken-3"
          max-width="1000"
          elevation="4"
          :title="`Hello ${firstName && lastName ? firstName + ' ' + lastName : full_name || 'Guest'}!`"
          subtitle="Found Something?"
        >
          <v-card-actions class="mx-auto">
            <v-btn class="rounded-pill bg-light-green-darken-3" block @click="showModal = true">
              Post Now!
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

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
  </v-container>

  <!-- Alert Notification -->
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>
</template>
