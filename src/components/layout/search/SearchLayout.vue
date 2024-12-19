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
    .rpc('get_posts_with_user_info') // Access the function
    .select('*') // Select all columns from the function table

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
        <v-list-item class="pb-3">
          <v-row class="w-100" align="center" no-gutters>
            <!-- Post Owner Image -->
            <v-col cols="auto">
              <v-avatar size="50" class="mx-2" color="black">
                <!-- Check if profile_pic exists and is not null or empty -->
                <v-img
                  v-if="post.profile_pic && post.profile_pic !== ''"
                  :src="
                    post.profile_pic.startsWith('http')
                      ? post.profile_pic
                      : profileUrl + post.profile_pic
                  "
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
                  {{
                    post.firstname && post.lastname
                      ? post.firstname + ' ' + post.lastname
                      : post.full_name
                  }}
                </h3>
              </v-list-item-content>
            </v-col>
          </v-row>
        </v-list-item>
        <v-img
          v-if="post.image"
          height="200"
          :src="`https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/items/${post.image}`"
          cover
          :alt="post.item_name || 'Post Image'"
        />
        <v-card-title class="text-light-green-darken-3">{{ post.item_name }}</v-card-title>
        <v-card-text class="text-light-green-darken-3">{{ post.description }}</v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            class="text-center"
            :href="post.facebook_link"
            target="_blank"
            rel="noopener"
            >Send Message</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
