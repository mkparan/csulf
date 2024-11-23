<template>
  <v-main>
    <!-- Post Icon Button -->
    <v-col cols="auto" class="pb-5 pl-3">
      <v-btn color="primary" size="large" prepend-icon="mdi-post-outline" @click="showModal = true">
        Post An Item
      </v-btn>
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
          <v-btn text color="green" @click="handlePost">Post</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script>
import { ref } from 'vue'
import { supabase } from '@/utils/supabase' // Correct import path for supabase.js in utils folder

export default {
  setup() {
    const showModal = ref(false) // Modal visibility
    const item_name = ref('') // Name input
    const image = ref(null) // Image input
    const description = ref('') // Description input
    const posts = ref([]) // Array to store posts

    // Reset form fields
    const resetForm = () => {
      item_name.value = ''
      image.value = null
      description.value = ''
    }

    // Handle Post Submission
    const handlePost = async () => {
      let imageUrl = ''
      if (image.value) {
        try {
          const { data, error } = await supabase.storage
            .from('items') // Get the image store in the bucket 
            .upload(`public/${image.value.name}`, image.value)

          if (error) {
            console.error('Image upload error:', error)
            return
          }
          imageUrl = data?.path
          console.log('Image uploaded successfully:', imageUrl) // Log image path
        } catch (error) {
          console.error('Error uploading image:', error)
        }
      }

      // Insert the post into the Supabase database
      try {
        const { error: insertError } = await supabase
          .from('posts') // Your Supabase table
          .insert([
            {
              item_name: item_name.value,
              image: imageUrl, // If image is uploaded, store its path
              description: description.value
            }
          ])

        if (insertError) {
          console.error('Insert error:', insertError)
          return
        }

        console.log('Post inserted successfully') // Log success

        // Fetch all posts to update the UI
        const { data: postsData, error: fetchError } = await supabase.from('posts').select()

        if (fetchError) {
          console.error('Fetch error:', fetchError)
          return
        }

        posts.value = postsData
        console.log('Posts fetched:', posts.value) // Log the posts

        // Reset the form and close the modal
        resetForm()
        showModal.value = false
      } catch (error) {
        console.error('Error inserting post:', error)
      }
    }

    // Handle cancel (close modal without submitting)
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
      handlePost,
      handleCancel
    }
  }
}
</script>

<style scoped>
/* You can add any custom styles you like here */
</style>
