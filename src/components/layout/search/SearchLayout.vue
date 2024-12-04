<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'

// State variables
const searchQuery = ref('') // User's search input
const posts = ref([]) // Data from Supabase
// URL of the image
const profileUrl = 'https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/images/'

const fetchPosts = async () => {
  const { data, error } = await supabase
    .from('posts_with_user_data') // Access the view instead of posts table
    .select('*') // Select all columns from the view

  if (error) {
    console.error('Error fetching posts:', error)
  } else {
    posts.value = data // Store the result in posts
  }
}

// Filter posts based on search query
const filteredPosts = computed(() => {
  const query = searchQuery.value.toLowerCase() // Normalize case
  return posts.value.filter(
    (post) =>
      post.item_name.toLowerCase().includes(query) || post.description.toLowerCase().includes(query)
  )
})

// Fetch posts on component mount
onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <v-app>
    <br />
    <br />
    <v-row justify="center">
      <v-col cols="12" sm="8" md="8">
        <v-card class="rounded-xl mb-4" max-width="1000" elevation="4">
          <p class="text-center ma-3 text-h5 text-light-green-darken-3">Looking for Something?</p>
          <v-card-text class="ma-3">
            <v-text-field
              v-model="searchQuery"
              :loading="loading"
              append-inner-icon="mdi-magnify"
              density="compact"
              label="Search it Here!"
              variant="outlined"
              rounded
              color="light-green-darken-3"
              hide-details
              single-line
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Display Search Results Only if Search Query is Not Empty -->
    <v-row justify="center">
      <v-col
        v-for="post in filteredPosts"
        :key="post.id"
        v-if="searchQuery !== ''"
        cols="12"
        sm="8"
        md="6"
      >
        <v-card class="rounded-xl mb-4" elevation="4">
          <v-list-item>
            <!-- Poster Image-->
            <v-avatar size="50" class="mx-auto" color="black">
              <v-img
                :src="`${profileUrl}${post.profile_pic || 'default-profile-pic.jpg'}`"
                alt="User Picture"
                class="mx-auto"
                height="200"
                width="200"
              />
            </v-avatar>

            <v-list-item-content>
              <v-list-item-title class="text-light-green-darken-3 font-weight-bold pa-1">
                {{ post.firstname }} {{ post.lastname }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-card-title class="text-center">{{ post.item_name }}</v-card-title>
          <v-img
            v-if="post.image"
            height="200"
            :src="`https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/items/${post.image}`"
            cover
            :alt="post.item_name || 'Post Image'"
          />
          <v-card-text>{{ post.description }}</v-card-text>
            <v-card-actions>
            <v-btn color="primary" class="text-center" :href="post.facebook_link" target="_blank" rel="noopener"
              >Send Message</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>
