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
          .eq('id', user_id) // Assuming 'posted_by' is the user ID
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
    <!-- Display All Posts -->
    <v-row>
      <v-col v-for="(post, index) in posts" :key="index" cols="12" sm="6" md="4">
        <v-card class="" max-width="500px">
          <v-list-item class="w-100">
            <!-- Poster Avatar -->
            <template v-slot:prepend>
              <v-avatar
                size="40"
                color="grey-darken-3"
                :image="
                  post.posted_by_image ||
                  'https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light'
                "
              ></v-avatar>
            </template>

            <!-- Poster Name and Role -->
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                {{ posterNames[post.id] || 'Unknown User' }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ post.role || 'User' }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <!-- Post Image -->
          <v-img
            height="300px"
            :src="`https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/items/${post.image}`"
            cover
          ></v-img>

          <!-- Post Title -->
          <v-card-title>{{ post.item_name }}</v-card-title>

          <!-- Post Description (Short) -->
          <v-card-subtitle>{{ post.description }}</v-card-subtitle>

          <!-- Actions -->
          <v-card-actions>
            <v-btn color="orange-lighten-2" text @click="showDetails(post)"> Show Details </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Show Item Details (If Selected) -->
    <v-dialog v-model="selectedPost" max-width="600">
      <template v-slot:default>
        <ShowItemDetails :post="selectedPost" />
      </template>
    </v-dialog>
  </v-main>
</template>

<style scoped>
.v-dialog {
  margin-top: 20px;
}
</style>
