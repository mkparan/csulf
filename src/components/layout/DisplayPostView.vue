<script>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import ShowItemDetails from './ShowItemDetails.vue'

export default {
  components: {
    ShowItemDetails
  },
  setup() {
    const postsWithUsers = ref([]) // Store combined data of posts and user info
    const selectedPost = ref(null) // Selected post for details

    // Fetch posts with user info using RPC
    const fetchPostsWithUsers = async () => {
  try {
    // Call the RPC function to get posts with user info
    const { data, error } = await supabase.rpc('get_posts_with_user_info');

    if (error) {
      console.error('Error fetching posts with user info:', error.message);
      return;
    }

    // Ensure the structure of the data matches what the frontend expects
    postsWithUsers.value = data.map(post => ({
      post_id: post.post_id,
      item_name: post.item_name,
      description: post.description,
      image: post.image,
      firstname: post.firstname,
      lastname: post.lastname,
    }));
  } catch (err) {
    console.error('Unexpected error fetching posts with user info:', err.message);
  }
};

    // Handle displaying post details
    const showDetails = (post) => {
      selectedPost.value = post // Set the selected post for details view
    }

    onMounted(fetchPostsWithUsers) // Fetch data on component mount

    return {
      postsWithUsers,
      selectedPost,
      showDetails
    }
  }
}
</script>

<template>
  <v-container>
    <v-row dense>
      <v-col cols="12" sm="8" md="6" v-for="post in postsWithUsers" :key="post.post_id">
  <!-- Post Card -->
  <v-card
    class="mb-4 rounded-xl"
    max-width="4000"
    outlined
    elevation="10"
    link
    @click="showDetails(post)"
  >
    <!-- Poster Details -->
    <v-list-item>
      <v-avatar
        size="40"
        :color="post.image ? '' : 'grey-darken-3'"
        :image="post.image || 'https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light'"
      />
      <v-list-item-content>
        <v-list-item-title>{{ post.firstname }} {{ post.lastname }}</v-list-item-title>
        <v-list-item-subtitle>User</v-list-item-subtitle>
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
      <v-btn color="blue" prepend-icon="mdi-bookmark-outline">Save</v-btn>
    </v-card-actions>
  </v-card>
</v-col>

    </v-row>

    <!-- Details Dialog -->
    <v-dialog v-model="selectedPost" max-width="600">
      <template v-slot:default>
        <ShowItemDetails :post="selectedPost" />
      </template>
    </v-dialog>
  </v-container>
</template>
