<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import SaveLayout from '@/components/layout/save/SaveLayout.vue'

const savedPosts = ref([])
const profileUrl = 'https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/images/'

// Fetching saved posts
const fetchSavedPosts = async () => {
  try {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('User not logged in or error fetching user:', userError?.message)
      return
    }

    // Call the custom PostgreSQL function to get saved posts without filtering by user_id
    const { data, error } = await supabase.rpc('get_saved_posts') // Calls the function

    if (error) {
      console.error('Error fetching saved posts:', error.message)
    } else {
      savedPosts.value = data.map((savedPost) => ({
        post_id: savedPost.post_id,
        item_name: savedPost.item_name,
        description: savedPost.description,
        image: savedPost.image,
        post_owner: {
          first_name: savedPost.post_owner_firstname,
          last_name: savedPost.post_owner_lastname,
          profile_pic: savedPost.post_owner_profile_pic,
          facebook_link: savedPost.post_owner_facebook_link
        },
        saved_by: {
          first_name: savedPost.saved_by_firstname,
          last_name: savedPost.saved_by_lastname,
          profile_pic: savedPost.saved_by_profile_pic,
          facebook_link: savedPost.saved_by_facebook_link
        }
      }))
    }
  } catch (err) {
    console.error('Unexpected error fetching saved posts:', err.message)
  }
}

// Fetch data on component mount
onMounted(fetchSavedPosts)
</script>

<template>
  <DashboardLayout>
    <template #content>
      <v-container>
        <SaveLayout :posts="savedPosts" />
        <v-row dense>
          <v-col cols="12" sm="8" md="6" v-for="post in savedPosts" :key="post.post_id">
            <v-card class="mb-0 rounded-xl" max-width="4000" outlined elevation="10">
              <v-list-item>
                <!-- Post Owner Image -->
                <v-avatar size="50" class="mx-auto" color="black">
                  <v-img
                    :src="`${profileUrl}${post.post_owner.profile_pic}`"
                    alt="Post Owner Picture"
                    class="mx-auto"
                    height="200"
                    width="200"
                  />
                </v-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-light-green-darken-3 font-weight-bold pa-1">
                    Posted by: {{ post.post_owner.first_name }} {{ post.post_owner.last_name }}
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
              <v-card-subtitle>{{ post.description }}</v-card-subtitle>
              <v-card-actions>
                <v-btn color="primary" class="text-center">Remove from Saved</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </DashboardLayout>
</template>
