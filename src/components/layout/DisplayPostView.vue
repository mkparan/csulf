<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import ShowItemDetails from './ShowItemDetails.vue'

const postsWithUsers = ref([])
const selectedPost = ref(null)
const userId = ref(null) // Current user's ID
const showSuccessModal = ref(false) // Controls success modal

//url of the image
const profileUrl = 'https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/images/'

// Fetch current user ID
const fetchUserId = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user ID:', error.message)
  } else {
    userId.value = data.user?.id
  }
}

// Fetch posts with user info
const fetchPostsWithUsers = async () => {
  try {
    const { data, error } = await supabase.rpc('get_posts_with_user_info')
    if (error) {
      console.error('Error fetching posts with user info:', error.message)
      return
    }

    // Ensure the structure of the data matches what the frontend expects
    postsWithUsers.value = data.map((post) => ({
      post_id: post.post_id,
      item_name: post.item_name,
      description: post.description,
      image: post.image,
      firstname: post.firstname,
      lastname: post.lastname,
      facebook_link: post.facebook_link,
      profile_pic: post.profile_pic
    }))
    console.log(postsWithUsers.value)
  } catch (err) {
    console.error('Unexpected error fetching posts with user info:', err.message)
  }
}

// Handle saving a post
const savePost = async (postId) => {
  if (!userId.value) {
    toast.error('You must be logged in to save a post.')
    return
  }

  const { error } = await supabase
    .from('saved_posts')
    .insert([{ post_id: postId, user_id: userId.value }])

  if (error) {
    toast.error('Error saving post. Please try again.')
    console.error('Error saving post:', error.message)
  } else {
    showSuccessModal.value = true // Show the success modal
    toast.success('Post saved successfully!')
  }
}

// Show item details in a modal
const showDetails = (post) => {
  selectedPost.value = post
}

// Fetch data on component mount
onMounted(async () => {
  await fetchUserId()
  await fetchPostsWithUsers()
})
</script>

<template>
  <v-container>
    <!-- Post List -->
    <v-row dense>
      <v-col cols="12" sm="8" md="6" v-for="post in postsWithUsers" :key="post.post_id">
        <v-card
          class="mb-4 rounded-xl"
          max-width="4000"
          outlined
          elevation="10"
          link
          @click="showDetails(post)"
        >
          <v-list-item>
            <!-- Poster Image-->
            <v-avatar size="50" class="mx-auto" color="black">
              <v-img
                :src="`${profileUrl}${post.profile_pic}`"
                alt="User Picture"
                class="mx-auto"
                height="200"
                width="200"
              />
            </v-avatar>

            <v-list-item-content>
              <v-list-item-title class="text-light-green-darken-3 font-weight-bold pa-1"
                >{{ post.firstname }} {{ post.lastname }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>

          <!-- Post Image -->
          <v-img
            v-if="post.image"
            height="200"
            :src="`https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/items/${post.image}`"
            cover
            :alt="post.item_name || 'Post Image'"
          />
          <v-card-title class="text-light-green-darken-3">{{ post.item_name }}</v-card-title>
          <v-card-subtitle class="text-light-green-darken-3">{{
            post.description
          }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="blue" prepend-icon="mdi-bookmark-outline" @click="savePost(post.post_id)">
              Save
            </v-btn>
            <v-btn color="primary" class="text-center" :href="post.facebook_link" target="_blank" rel="noopener"
              >Send Message</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Modal -->
    <v-dialog v-model="showSuccessModal" persistent max-width="400">
      <v-card>
        <v-card-title class="headline text-light-green-darken-3">Success</v-card-title>
        <v-card-text class="text-light-green-darken-3"
          >Your post has been saved successfully!</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="showSuccessModal = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Details Modal -->
    <v-dialog v-model="selectedPost" max-width="600">
      <template v-slot:default>
        <ShowItemDetails :post="selectedPost" />
      </template>
    </v-dialog>
  </v-container>
</template>

<style scoped>
/* Add any custom styles here */
</style>
