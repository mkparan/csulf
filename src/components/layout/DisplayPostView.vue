<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/utils/supabase'; // Correct import path for supabase.js in utils folder

export default {
  setup() {
    const posts = ref([]); // Array to store posts

    // Fetch all posts when the component is mounted
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from('posts').select();
        if (error) {
          console.error('Fetch error:', error);
          return;
        }
        posts.value = data;
        console.log('Fetched posts:', posts.value);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    onMounted(() => {
      fetchPosts(); // Call the function to fetch posts when the component is mounted
    });

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
        cols="12" sm="6" md="4"
      >
        <v-card>
          <v-card-title>{{ post.item_name }}</v-card-title>         
          <!-- Image of the post -->
          <v-img :src="`https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/items/${post.image}`" alt="Post Image"></v-img>

          <!-- Description of the post -->
          <v-card-subtitle>{{ post.description }}</v-card-subtitle>

          <!-- Post actions (if any) -->
          <v-card-actions>
             <v-btn 
                    rounded=""
                     class="mt-2 font-weight-black"
                    size="small"
                    color="red-darken-4"
                    
                    >View Details
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>


<style scoped>
/* Add any custom styles here */
</style>
