<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/utils/supabase'; // Correct import path for supabase.js in utils folder

export default {
     data: () => ({
      show: false,
    }),
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
         
            <v-card
                class="mx-auto"
                max-width="344"
            >
                <v-img
                height="200px"
                :src="`https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/items/${post.image}`"
                cover
                ></v-img>

                <v-card-title>
                {{ post.item_name }}
                </v-card-title>

                <v-card-subtitle>
                {{ post.description }}
                </v-card-subtitle>

                <v-card-actions>
                <v-btn
                    color="orange-lighten-2"
                    text="Explore"
                ></v-btn>

                <v-spacer></v-spacer>

                <v-btn
                    :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                    @click="show = !show"
                ></v-btn>
                </v-card-actions>

                <v-expand-transition>
                <div v-show="show">
                    <v-divider></v-divider>

                    <v-card-text>
                    {{ post.description }}
                    </v-card-text>
                </div>
                </v-expand-transition>
            </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>


<style scoped>
/* Add any custom styles here */
</style>
