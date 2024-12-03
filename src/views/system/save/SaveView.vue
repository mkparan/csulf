<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'

const savedPosts = ref([])

const fetchSavedPosts = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error('User not logged in.')
      return
    }

    const { data, error } = await supabase
      .from('saved_posts')
      .select(`
        post_id,
        posts (item_name, description, image)
      `)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching saved posts:', error.message)
    } else {
      savedPosts.value = data.map(savedPost => ({
        post_id: savedPost.post_id,
        item_name: savedPost.posts.item_name,
        description: savedPost.posts.description,
        image: savedPost.posts.image,
      }))
    }
  } catch (err) {
    console.error('Unexpected error fetching saved posts:', err.message)
  }
}

onMounted(fetchSavedPosts)
</script>

<template>
  <v-container>
    <v-row dense>
      <v-col cols="12" sm="8" md="6" v-for="post in savedPosts" :key="post.post_id">
        <v-card class="mb-4 rounded-xl" max-width="4000" outlined elevation="10">
          <v-img
            v-if="post.image"
            height="200"
            :src="`https://your-supabase-storage-url/${post.image}`"
            cover
            :alt="post.item_name || 'Post Image'"
          />
          <v-card-title>{{ post.item_name }}</v-card-title>
          <v-card-subtitle>{{ post.description }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
