<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/utils/supabase';

export default {
  setup() {
    const posts = ref([]); // Array to store posts

    // Fetch all posts
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from('posts').select();
        if (error) {
          console.error('Error fetching posts:', error.message);
          return;
        }

        // Add a `show` property to each post for toggling details
        posts.value = data.map(post => ({ ...post, show: false }));
        console.log('Fetched posts:', posts.value);
      } catch (error) {
        console.error('Unexpected error:', error.message);
      }
    };

    onMounted(fetchPosts); // Fetch posts on mount

    return {
      posts,
    };
  },
};
</script>

<template>
  <v-main>
    <!-- Display All Posts -->
    <v-row>
      <v-col
        v-for="(post, index) in posts"
        :key="index"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="mx-auto" max-width="344">
          <!-- Post Image -->
          <v-img
            height="200px"
            :src="`https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/items/${post.image}`"
            cover
          ></v-img>

          <!-- Post Title -->
          <v-card-title>{{ post.item_name }}</v-card-title>

          <!-- Post Description (Short) -->
          <v-card-subtitle>{{ post.description }}</v-card-subtitle>

          <!-- Actions -->
          <v-card-actions>
            <v-btn color="orange-lighten-2" text>Explore</v-btn>

            <v-spacer></v-spacer>

            <v-btn
              :icon="post.show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              @click="post.show = !post.show"
            ></v-btn>
          </v-card-actions>

          <!-- Expandable Section -->
          <v-expand-transition>
            <div v-show="post.show">
              <v-divider></v-divider>
              <v-card-text>{{ post.description }}</v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

