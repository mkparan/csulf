<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import SaveLayout from '@/components/layout/save/SaveLayout.vue'
import ShowItemDetails from '../../../components/layout/ShowItemDetails.vue'

const selectedPostDetails = ref(null)
const isModalVisible = ref(false)
const savedPosts = ref([])
const profileUrl = 'https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/images/'

// Show details of a specific post
const showDetails = (post) => {
  selectedPostDetails.value = post // Set the selected post details
  isModalVisible.value = true // Open the modal
}

// Fetching saved posts from the materialized view
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

    // Call the materialized view query with the logged-in user's ID
    const { data, error } = await supabase
      .from('saved_posts_mv') // Query the materialized view
      .select('*')
      .eq('saved_by_user_id', user.id) // Filter by user ID

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
          facebook_link: savedPost.post_owner_facebook_link,
          full_name: savedPost.post_owner_full_name,
          avatar_url: savedPost.post_owner_avatar_url
        },
        saved_by: {
          first_name: savedPost.saved_by_firstname,
          last_name: savedPost.saved_by_lastname,
          profile_pic: savedPost.saved_by_profile_pic,
          facebook_link: savedPost.saved_by_facebook_link,
          full_name: savedPost.saved_by_full_name,
          avatar_url: savedPost.saved_by_avatar_url
        }
      }))
    }
  } catch (err) {
    console.error('Unexpected error fetching saved posts:', err.message)
  }
}

// Method to remove a post from saved
const removeFromSaved = async (postId) => {
  try {
    // Delete the post from saved_posts table
    const { error } = await supabase.from('saved_posts').delete().eq('post_id', postId)

    if (error) {
      console.error('Error removing post from saved:', error.message)
    } else {
      // Update the local list of saved posts to reflect the removal
      savedPosts.value = savedPosts.value.filter((post) => post.post_id !== postId)
      console.log(`Post with ID ${postId} removed from saved posts.`)
    }
  } catch (err) {
    console.error('Unexpected error while removing post from saved:', err.message)
  }
}

// Fetch data on component mount
onMounted(fetchSavedPosts)
</script>

<template>
  <DashboardLayout>
    <template #content>
      <v-container>
        <SaveLayout />
        <!-- Display message when there are no saved posts and have -->
        <v-row justify="center">
          <v-col cols="12" sm="12" md="8" class=""
            ><v-img
              v-if="savedPosts.length === 0"
              class=""
              src="/images/empty.svg"
              width="800"
            ></v-img>
            <!-- <v-divider v-else>Saved Posts</v-divider> -->
            <v-divider>{{ savedPosts.length === 0 ? 'No Saved Posts' : 'Saved Posts' }}</v-divider>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" sm="8" md="6" v-for="post in savedPosts" :key="post.post_id">
            <v-card
              class="mb-4 rounded-xl"
              max-width="4000"
              outlined
              elevation="10"
              @click="showDetails(post)"
            >
              <v-list-item class="pb-2">
                <v-row class="w-100" align="center" no-gutters>
                  <!-- Post Owner Image -->
                  <v-col cols="auto">
                    <v-avatar size="50" class="mx-2" color="black">
                      <v-img
                        v-if="post.post_owner.profile_pic && post.post_owner.profile_pic !== ''"
                        :src="
                          post.post_owner.profile_pic.startsWith('http')
                            ? post.post_owner.profile_pic
                            : profileUrl + post.post_owner.profile_pic
                        "
                        alt="Post Owner Picture"
                        class="mx-auto"
                        height="200"
                        width="200"
                      />
                      <v-img
                        v-else
                        :src="post.post_owner.avatar_url || '/images/profile-default.png'"
                        alt="Default Avatar"
                        class="mx-auto"
                        height="200"
                        width="200"
                      />
                    </v-avatar>
                  </v-col>

                  <!-- Post Owner Name -->
                  <v-col class="d-flex align-center">
                    <v-list-item-content>
                      <h3 class="text-light-green-darken-3 font-weight-bold">
                        {{
                          post.post_owner.first_name && post.post_owner.last_name
                            ? post.post_owner.first_name + ' ' + post.post_owner.last_name
                            : post.post_owner.full_name
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
              <v-card-title>{{ post.item_name }}</v-card-title>
              <v-card-subtitle>{{ post.description }}</v-card-subtitle>

              <v-card-actions>
                <v-row class="w-100" justify="space-between">
                  <!-- "Remove" button -->
                  <v-col cols="auto">
                    <v-btn
                      color="primary"
                      @click="removeFromSaved(post.post_id)"
                      class="text-center"
                    >
                      Remove
                    </v-btn>
                  </v-col>

                  <!-- "Message" button -->
                  <v-col cols="auto">
                    <v-btn
                      color="primary"
                      :href="post.post_owner.facebook_link"
                      target="_blank"
                      rel="noopener"
                      class="text-center"
                    >
                      Message
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Modal for Post Details to resolve the undefined post-id -->
        <v-dialog v-model="isModalVisible" max-width="600">
          <template v-slot:default>
            <!-- Pass postId from selectedPostDetails to ShowItemDetails -->
            <ShowItemDetails :postId="selectedPostDetails?.post_id" />
          </template>
        </v-dialog>
      </v-container>
    </template>
  </DashboardLayout>
</template>
