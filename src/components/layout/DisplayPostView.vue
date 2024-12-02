<script>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import ShowItemDetails from './ShowItemDetails.vue'

export default {
  components: {
    ShowItemDetails
  },
  setup() {
    const posts = ref([]) // Array to store posts
    const selectedPost = ref(null) // Selected post for details
    const posterNames = ref({}) // Map for storing poster names

    // Fetch all posts
    const fetchPosts = async () => {
      try {
        const { data: postsData, error } = await supabase.from('posts').select()
        if (error) {
          console.error('Error fetching posts:', error.message)
          return
        }
        posts.value = postsData || [] // Store fetched posts
        await fetchPosterNames(postsData) // Fetch poster names
      } catch (error) {
        console.error('Unexpected error:', error.message)
      }
    }

    // Fetch poster names from Supabase
    const fetchPosterNames = async (postsData) => {
      const names = {}

      // palihog fix ani unya
      for (const post of postsData) {
        try {
          const { data: userData, error } = await supabase
            .from('users')
            .select('firstname, lastname')
            .eq('id', post.user_id)
            .single()
          if (userData) {
            names[post.id] = `${userData.firstname} ${userData.lastname}`
          }
        } catch (error) {
          console.error(`Error fetching name for user ${post.user_id}:`, error.message)
        }
      }
      posterNames.value = names // Store all names in the reactive map
    }

    // Handle displaying post details
    const showDetails = (post) => {
      selectedPost.value = post // Set the selected post for details view
    }

    onMounted(fetchPosts) // Fetch posts on component mount

    return {
      posts,
      selectedPost,
      showDetails,
      posterNames
    }
  }
}
</script>

<template>
  <v-container>
    <v-row dense>
      <v-col cols="12" sm="8" md="6" v-for="post in posts" :key="post.id">
        <!-- Post Card -->
        <v-card
          class="mb-4 rounded-xl"
          max-width="4000"
          outlined
          elevation="10"
          link
          @click="showDetails(post)"
        >
          <!-- Poster Details -->
          <v-list-item>
            <v-avatar
              size="40"
              :color="post.posted_by_image ? '' : 'grey-darken-3'"
              :image="
                post.posted_by_image ||
                'https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light'
              "
            />
            <v-list-item-content>
              <v-list-item-title>{{ posterNames[post.id] || 'Unknown User' }}</v-list-item-title>
              <v-list-item-subtitle>User</v-list-item-subtitle>
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
          <v-card-title>{{ post.item_name }}</v-card-title>
          <v-card-subtitle>{{ post.description }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="blue" prepend-icon="mdi-bookmark-outline">Save</v-btn>
            <!-- alisdan save button and fb button -->
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Details Dialog -->
    <v-dialog v-model="selectedPost" max-width="600">
      <template v-slot:default>
        <ShowItemDetails :post="selectedPost" />
      </template>
    </v-dialog>
  </v-container>
</template>

<style>
/* Additional optional styles */
.v-card {
  border-radius: 12px;
}
.v-avatar {
  object-fit: cover;
}
</style>
