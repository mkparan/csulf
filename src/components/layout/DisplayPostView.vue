<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import ShowItemDetails from './ShowItemDetails.vue'

const postsWithUsers = ref([])
const savedPosts = ref([]) // Track saved posts
const userId = ref(null) // Current user's ID
const showSuccessModal = ref(false) // Controls success modal
const selectedPostDetails = ref(null)
const isModalVisible = ref(false)

// URL of the image
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
    const { data, error } = await supabase.rpc('get_posts_with_user_info') //functions for get_posts_with_user_info
    if (error) {
      console.error('Error fetching posts with user info:', error.message)
      return
    }

    postsWithUsers.value = data.map((post) => ({
      post_id: post.post_id,
      item_name: post.item_name,
      description: post.description,
      image: post.image,
      firstname: post.firstname,
      lastname: post.lastname,
      facebook_link: post.facebook_link,
      profile_pic: post.profile_pic,
      full_name: post.full_name,
      avatar_url: post.avatar_url
    }))
  } catch (err) {
    console.error('Unexpected error fetching posts with user info:', err.message)
  }
}

// Fetch saved posts
const fetchSavedPosts = async () => {
  if (!userId.value) return

  const { data, error } = await supabase
    .from('saved_posts')
    .select('post_id')
    .eq('user_id', userId.value)

  if (error) {
    console.error('Error fetching saved posts:', error.message)
  } else {
    savedPosts.value = data.map((saved) => saved.post_id)
  }
}

// Check if a post is already saved
const isSaved = (postId) => {
  return savedPosts.value.includes(postId)
}

// Handle saving a post
const savePost = async (postId) => {
  if (!userId.value) {
    toast.error('You must be logged in to save a post.')
    return
  }

  if (isSaved(postId)) {
    toast.info('This post is already saved.')
    return
  }

  const { error } = await supabase
    .from('saved_posts')
    .insert([{ post_id: postId, user_id: userId.value }])

  if (error) {
    toast.error('Error saving post. Please try again.')
    console.error('Error saving post:', error.message)
  } else {
    savedPosts.value.push(postId) // Update saved posts
    showSuccessModal.value = true // Show the success modal
    toast.success('Post saved successfully!')
  }
}

// Show details of a specific post
const showDetails = (post) => {
  selectedPostDetails.value = post // Set the selected post details
  isModalVisible.value = true // Open the modal
}


// Fetch data on component mount
onMounted(async () => {
  await fetchUserId()
  await fetchPostsWithUsers()
  await fetchSavedPosts()
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
              <v-list-item class="pb-3">
                      <v-row class="w-100" align="center" no-gutters>
                        <!-- Post Owner Image -->
                        <v-col cols="auto">
                              <v-avatar size="50" class="mx-2" color="black">
                                  <!-- Check if profile_pic exists and is not null or empty -->
                                  <v-img
                                    v-if="post.profile_pic && post.profile_pic !== ''"
                                    :src="post.profile_pic.startsWith('http') ? post.profile_pic : profileUrl + post.profile_pic"
                                    alt="User Avatar and default profile"
                                    class="mx-auto"
                                    height="200"
                                    width="200"
                                  />
                                  
                                  <!-- Fallback image if profile_pic is not available -->
                                  <v-img
                                    v-else
                                    :src="post.avatar_url || 'default-avatar-url.png'"
                                    alt="google profile"
                                    class="mx-auto"
                                    height="200"
                                    width="200"
                                  />
                             </v-avatar>                        
                        </v-col>

                        <!-- Post Owner Name -->
                        <v-col class="d-flex align-center">
                          <v-list-item-content>
                            <h3 class="text-light-green-darken-3 font-weight-bold pa-1">
                                {{ post.firstname && post.lastname ? post.firstname + ' ' + post.lastname : post.full_name }}
                            </h3>
                          </v-list-item-content>
                        </v-col>
                      </v-row>
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
            <v-btn
              :color="isSaved(post.post_id) ? 'grey' : 'blue'"
              :disabled="isSaved(post.post_id)"
              prepend-icon="mdi-bookmark-outline"
              @click.stop="savePost(post.post_id)"
            >
              {{ isSaved(post.post_id) ? 'Saved' : 'Save' }}
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

            <!-- Modal for Post Details to resolve the undefined post-id -->
        <v-dialog v-model="isModalVisible" max-width="600">
          <template v-slot:default>
            <!-- Pass postId from selectedPostDetails to ShowItemDetails -->
            <ShowItemDetails :postId="selectedPostDetails?.post_id" />
          </template>
        </v-dialog>
  </v-container>
</template>

<style scoped>
/* Add any custom styles here */
</style>
