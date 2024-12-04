<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/utils/supabase.js';

const posts = ref([]); // Array to store posts
const firstName = ref(''); // First name of the user
const lastName = ref(''); // Last name of the user
const profilePic = ref(''); // Profile picture of the user

// URL for fetching the image
const profileUrl = 'https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/images/';

// Fetch user's details and posts only on component mount
const fetchUserData = async () => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Error fetching user details:', authError);
    return;
  }

  // Fetch the profile data (first name, last name, profile picture)
  firstName.value = user.user_metadata?.firstname || 'First Name';
  lastName.value = user.user_metadata?.lastname || 'Last Name';
  profilePic.value = user.user_metadata?.profile_pic || '/images/profile-default.png';

  // Fetch the user's posts
  const { data: postsData, error: fetchError } = await supabase
    .from('posts')
    .select()
    .eq('user_id', user.id); // Filter posts by the logged-in user

  if (fetchError) {
    console.error('Error fetching user posts:', fetchError);
  } else {
    posts.value = postsData; // Store user's posts
    console.log('User posts fetched:', posts.value);
  }
};

onMounted(fetchUserData); // Fetch user data and posts when the component is mounted
</script>

<template>
  <v-container>
    <v-row dense>
      <v-col cols="12" sm="8" md="6" v-for="post in posts" :key="post.id">
        <v-card class="mb-4 rounded-xl" max-width="4000" outlined elevation="10">
          <v-list-item>
             <!-- Poster Image-->
            <v-avatar size="50" class="mx-auto" color="black">
               <v-img :src="profileUrl + profilePic" alt="User Avatar" class="mx-auto" height="200" width="200" />
            </v-avatar>   

            <v-list-item-content>
              <v-list-item-title
                >{{ firstName }} {{ lastName }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>

          <!-- Post Image -->
          <v-img
            v-if="post.image"
            height="200"
            :src="`https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/items/${post.image}`"
            cover
            :alt="post.item_name || 'Post Image'"
          />
          <v-card-title>{{ post.item_name }}</v-card-title>
          <v-card-subtitle>{{ post.description }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="primary" @click="showDetails(post)"> View Details</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
