<script>
import { ref, onMounted } from 'vue'
import { supabase } from '../../utils/supabase.js'
import ShowItemDetails from './ShowItemDetails.vue'

export default {
  components: {
    ShowItemDetails
  },
  setup() {
    const posts = ref([]) // Array to store posts
    const selectedPost = ref(null) // Selected post for details
    const posterNames = ref({}) // To store poster names

    // Fetch all posts
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from('posts').select()
        if (error) {
          console.error('Error fetching posts:', error.message)
          return
        }
        posts.value = data // Store fetched posts
        await fetchPosterNames(data) // Fetch poster names after posts are fetched
      } catch (error) {
        console.error('Unexpected error:', error.message)
      }
    }

    // Fetch Poster Name from Supabase
    const fetchPosterNames = async (postsData) => {
      for (const post of postsData) {
        const { data, error } = await supabase
          .from('users') // Assuming 'users' table holds user data
          .select('firstname, lastname')
          .eq('id', post.user_id) // Assuming 'user_id' is the column
          .single()

        if (error) {
          console.error('Error fetching poster name:', error.message)
        } else {
          posterNames.value[post.id] = `${data.firstname} ${data.lastname}`
        }
      }
    }

    // Handle Show Details
    const showDetails = (post) => {
      selectedPost.value = post
    }

    onMounted(fetchPosts) // Fetch posts on mount

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
  <v-main>
    <!-- Scrollable Post Feed -->
    <v-container>
      <v-row dense>
        <v-col cols="12" v-for="(post, index) in posts" :key="index">
          <v-card class="mb-4" max-width="600px" outlined>
            <!-- Poster Details -->
            <v-list-item>
              <v-avatar
                size="40"
                color="grey-darken-3"
                :image="
                  post.posted_by_image ||
                  'https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light'
                "
              ></v-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">
                  {{ posterNames[post.id] || 'Unknown User' }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ post.role || 'User' }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <!-- Post Image -->
            <v-img
              height="400px"
              :src="`https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/items/${post.image}`"
              cover
            ></v-img>

            <!-- Post Content -->
            <v-card-title>{{ post.item_name }}</v-card-title>
            <v-card-subtitle>{{ post.description }}</v-card-subtitle>

            <!-- Actions -->
            <v-card-actions>
              <v-btn color="blue" text @click="showDetails(post)">Show Details</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Show Item Details (If Selected) -->
    <v-dialog v-model="selectedPost" max-width="600">
      <template v-slot:default>
        <ShowItemDetails :post="selectedPost" />
      </template>
    </v-dialog>
  </v-main>
</template>
