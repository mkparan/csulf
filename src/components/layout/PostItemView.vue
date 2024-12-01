<script>
import { ref } from 'vue'
import { supabase } from '@/utils/supabase' // Ensure this points to your Supabase instance
import AlertNotification from '../common/AlertNotification.vue'

export default {
  components: { AlertNotification },
  setup() {
    const showModal = ref(false) // Modal visibility
    const item_name = ref('') // Item name input
    const image = ref(null) // Image file input
    const description = ref('') // Description input
    const posts = ref([]) // Array to store posts

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
      formAction.value = { ...formActionDefault }
      formAction.value.formProcess = true // Indicate process start

      let imageUrl = ''
      if (image.value) {
        try {
          const { data, error } = await supabase.storage
            .from('items')
            .upload(`public/${image.value.name}`, image.value)

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
        // Get the current user ID
        const {
          data: { user },
          error: authError
        } = await supabase.auth.getUser()

        if (authError) {
          console.error('Auth error:', authError)
          formAction.value.formErrorMessage = 'Failed to retrieve user information.'
          return
        }

        const userId = user?.id // User ID from the auth table

        // Insert the post into the posts table
        const { error: insertError } = await supabase.from('posts').insert([
          {
            item_name: item_name.value,
            image: imageUrl,
            description: description.value,
            user_id: userId // Link the post to the authenticated user
          }
        ])

        if (insertError) {
          console.error('Insert error:', insertError)
          formAction.value.formErrorMessage = 'Failed to create the post.'
          return
        }

        formAction.value.formSuccessMessage = 'Post created successfully!'

        // Fetch updated posts
        const { data: postsData, error: fetchError } = await supabase.from('posts').select()

        if (fetchError) {
          console.error('Fetch error:', fetchError)
          formAction.value.formErrorMessage = 'Failed to fetch updated posts.'
          return
        }

        posts.value = postsData
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

    // Cancel button logic
    const handleCancel = () => {
      resetForm()
      showModal.value = false
    }

    return {
      showModal,
      item_name,
      image,
      description,
      posts,
      formAction,
      handlePost,
      handleCancel
    }
  }
}
</script>

<template>
  <v-main>
    <!-- Post Icon Button -->

    <v-col cols="12" md="6">
      <v-card
        class="rounded-xl"
        max-width="600"
        subtitle="Found Something?"
        title="Mark Kenth Paran"
        elevation="16"
      >
        <template v-slot:actions>
          <v-btn
            class="rounded-pill bg-light-green-darken-3"
            text="Post Now!"
            block
            @click="showModal = true"
          ></v-btn>
        </template>
      </v-card>
    </v-col>

    <!-- Modal for Create Post -->
    <v-dialog v-model="showModal" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h6">Create Post</span>
        </v-card-title>

        <v-card-text>
          <v-form>
            <!-- Name Input -->
            <v-text-field v-model="item_name" label="Item Name" outlined required></v-text-field>

            <!-- File Input for Image -->
            <v-file-input
              v-model="image"
              label="Upload Image"
              accept="image/*"
              outlined
            ></v-file-input>

            <!-- Description Input -->
            <v-textarea v-model="description" label="Description" outlined rows="3"></v-textarea>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- Cancel Button -->
          <v-btn text color="red" @click="handleCancel">Cancel</v-btn>
          <!-- Post Button -->
          <v-btn :disabled="formAction.formProcess" text color="green" @click="handlePost">
            Post
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>

  <!-- Alert Notification -->
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>
</template>
