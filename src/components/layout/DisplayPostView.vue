<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../utils/supabase.js'
import ShowItemDetails from './ShowItemDetails.vue'

const posts = ref([]) // Array to store posts
const selectedPost = ref(null) // Selected post for details

// Fetch posts with user details
    const fetchPostsWithUserDetails = async () => {
  try {
    // Fetch all posts and join with user data from auth.users
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select(`
        id,
        item_name,
        description,
        image,
        user_id,
        user:auth.users (
          raw_user_meta_data->>firstname as firstname,
          raw_user_meta_data->>lastname as lastname
        )
      `); // Access firstname and lastname from raw_user_meta_data

    if (postsError) {
      console.error('Error fetching posts:', postsError.message);
      return;
    }

    // Update the posts data with user details directly
    posts.value = postsData.map((post) => ({
      ...post,
      firstname: post.user?.firstname || 'Unknown',
      lastname: post.user?.lastname || 'User',
    }));
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
};


// Fetch posts when the component is mounted
onMounted(fetchPostsWithUserDetails)
</script>

<template>
  <v-main>
    <v-row>
      <v-col v-for="(post, index) in posts" :key="index" cols="12" sm="6" md="4">
        <v-card class="mb-4">
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar size="40" :image="post.posted_by_image || 'default-avatar-url'"></v-avatar>
            </template>
            <v-list-item-content>
              <v-list-item-title>{{ post.firstname }} {{ post.lastname }}</v-list-item-title>
              <v-list-item-subtitle>{{ post.role || 'User' }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-card-title>{{ post.item_name }}</v-card-title>
          <v-card-subtitle>{{ post.description }}</v-card-subtitle>
          <v-img
            :src="`https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/items/${post.image}`"
            height="300px"
            cover
          ></v-img>
          <v-card-actions>
            <v-btn @click="showDetails(post)">Show Details</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Post Details Dialog -->
    <v-dialog v-model="selectedPost" max-width="600">
      <template v-slot:default>
        <ShowItemDetails :post="selectedPost" />
      </template>
    </v-dialog>
  </v-main>
</template>
