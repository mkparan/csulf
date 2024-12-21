<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/utils/supabase.js' // Ensure supabase is correctly initialized

const profileUrl = 'https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/images/'
// Define the postId prop to receive it from the parent
const props = defineProps({
  postId: {
    type: Number,
    required: true
  }
})

const post = ref(null)
const loading = ref(true) // Add a loading state

// Watch for changes to the postId prop and fetch post details accordingly
watch(
  () => props.postId,
  async (newPostId) => {
    if (newPostId) {
      await fetchPostDetails(newPostId)
    } else {
      console.error('Post ID is undefined or invalid')
    }
  }
)

// Fetch post details based on the passed postId
const fetchPostDetails = async (postId) => {
  loading.value = true // Start loading
  const { data, error } = await supabase
    .from('show_item_details_view') // Query the view directly
    .select()
    .eq('post_id', postId) // Use the postId prop to filter the data

  if (error) {
    console.error('Error fetching post details:', error)
  } else {
    post.value = data[0] // Store the fetched post details (assuming it's an array with 1 item)
    console.log('Fetched post:', post.value)
  }
  loading.value = false // Stop loading
}

onMounted(() => {
  // Initial fetch if postId is already set
  if (props.postId) {
    fetchPostDetails(props.postId)
  } else {
    console.error('Post ID is undefined or invalid')
  }
})
</script>

<template>
  <v-col cols="12" sm="12" md="12">
    <!-- Show loading spinner while fetching data -->
    <v-container class="d-flex justify-center align-center" fluid>
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="light-green-darken-3"
        size="64"
        width="6"
        class="text-center"
      ></v-progress-circular>
    </v-container>

    <!-- Show the post details once the data is loaded -->
    <v-card v-show="!loading && post" class="mx-auto text-white rounded-xl">
      <v-card-actions>
        <v-list-item class="pb-3 w-100">
          <v-row class="w-100" align="center" no-gutters>
            <v-col cols="auto">
              <v-avatar size="50" class="mx-2" color="black">
                <v-img
                  v-if="post?.profile_pic && post.profile_pic !== ''"
                  :src="
                    post.profile_pic.startsWith('http')
                      ? post.profile_pic
                      : profileUrl + post.profile_pic
                  "
                  alt="User Avatar"
                  class="mx-auto"
                  height="200"
                  width="200"
                />
                <v-img
                  v-else
                  :src="post?.avatar_url || 'default-avatar-url.png'"
                  alt="default avatar"
                  class="mx-auto"
                  height="200"
                  width="200"
                />
              </v-avatar>
            </v-col>

            <v-col class="d-flex align-center">
              <v-list-item-content>
                <h2 class="text-light-green-darken-3 font-weight-bold pa-1">
                  {{
                    post?.firstname && post?.lastname
                      ? post.firstname + ' ' + post.lastname
                      : post?.full_name
                  }}
                </h2>
              </v-list-item-content>
            </v-col>
          </v-row>
        </v-list-item>
      </v-card-actions>

      <v-card-title class="text-h5 font-weight-bold text-light-green-darken-3">
        {{ post?.item_name }}
      </v-card-title>

      <v-img
        v-if="post?.image"
        class="rounded-lg mb-3"
        height="auto"
        width="auto"
        :src="`https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/items/${post.image}`"
        cover
      ></v-img>

      <v-card-text
        v-if="post?.description"
        class="text-body-1 py-2 text-light-green-darken-3"
        style="max-height: 150px; overflow-y: auto"
      >
        {{ post.description }}
      </v-card-text>
    </v-card>
  </v-col>
</template>

<style scoped>
.v-card {
  margin-top: 20px;
  padding: 16px;
}

.v-card-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.v-img {
  border-radius: 10px;
}

.v-card-subtitle {
  display: flex;
  align-items: center;
}
</style>
