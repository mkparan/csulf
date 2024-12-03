<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import ShowItemDetails from './ShowItemDetails.vue'

//toastification
import { useToast } from 'vue-toastification'
const toast = useToast()

const postsWithUsers = ref([]) 
const selectedPost = ref(null)
const userId = ref(null) // Current user's ID
const showSuccessModal = ref(false) // Controls success modal


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
      profile_pic: post.profile_pic // Assuming profile_pic is a valid URL
    }))
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
        >
          <!-- User Avatar and Name -->
          <v-list-item>
            <v-avatar
              size="40"

              color="grey-darken-3"
              :image="
                post.profile_pic ||
                'https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light'
              "
            ></v-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ post.firstname }} {{ post.lastname }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- Post Image -->
          <v-img
            v-if="post.image"
            height="200"
            :src="`https://your-supabase-storage-url/${post.image}`"
            cover
            :alt="post.item_name || 'Post Image'"
          />
          <v-card-title>{{ post.item_name }}</v-card-title>
          <v-card-subtitle>{{ post.description }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="blue" prepend-icon="mdi-bookmark-outline" @click="savePost(post.post_id)">
              Save
            </v-btn>
            <v-btn color="primary" @click="showDetails(post)">Details</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Modal -->
    <v-dialog v-model="showSuccessModal" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Success</v-card-title>
        <v-card-text>Your post has been saved successfully!</v-card-text>
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
