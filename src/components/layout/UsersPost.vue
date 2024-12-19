<script setup>
import { ref, onMounted } from 'vue'
import ShowItemDetails from './ShowItemDetails.vue'
import AlertNotification from '../common/AlertNotification.vue'
import { supabase } from '@/utils/supabase.js'

const posts = ref([]) // Array to store posts
const firstName = ref('') // First name of the user
const lastName = ref('') // Last name of the user
const profilePic = ref('') // Profile picture of the user
const selectedPostDetails = ref(null)
const isModalVisible = ref(false)
const full_name = ref('')
const avatar_url = ref('')

// URL for fetching the image
const profileUrl = 'https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/images/'

// Show details of a specific post
const showDetails = (post) => {
  selectedPostDetails.value = post // Set the selected post details
  isModalVisible.value = true // Open the modal
}

// Manage form action states
const formActionDefault = {
  formSuccessMessage: '',
  formErrorMessage: '',
  formProcess: false
}

const formAction = ref({ ...formActionDefault })

// Fetch user's details and posts only on component mount
const fetchUserData = async () => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('Error fetching user details:', authError)
    return
  }

  // Fetch the profile data (first name, last name, profile picture)
  firstName.value = user.user_metadata?.firstname
  lastName.value = user.user_metadata?.lastname
  profilePic.value = user.user_metadata?.profile_pic
  full_name.value = user?.user_metadata?.full_name
  avatar_url.value = user?.user_metadata?.avatar_url

  // Fetch the user's posts
  const { data: postsData, error: fetchError } = await supabase
    .from('posts')
    .select()
    .eq('user_id', user.id) // Filter posts by the logged-in user

  if (fetchError) {
    console.error('Error fetching user posts:', fetchError)
  } else {
    posts.value = postsData // Store user's posts
    console.log('User posts fetched:', posts.value)
  }
}

const deletePost = async (post) => {
  // Confirm deletion
  const confirmed = confirm('Are you sure you want to delete this post?');
  if (!confirmed) return;

  // Attempt to delete the post from the database
  const { error } = await supabase.from('posts').delete().eq('id', post.id);

  if (error) {
    console.error('Error deleting post:', error);
    formAction.formErrorMessage = 'Post not deleted';
  } else {
    // Remove the post from the `posts` array to update the UI
    posts.value = posts.value.filter((p) => p.id !== post.id);
    console.log('Post deleted successfully');
    formAction.value.formSuccessMessage = 'Successfully Deleted';
  }
};


onMounted(fetchUserData) // Fetch user data and posts when the component is mounted

///edit the post
const editPostData = ref(null) // Holds the post data to edit
const isEditModalVisible = ref(false) // Controls the visibility of the edit modal

const editPost = (post) => {
  editPostData.value = { ...post } // Load the post data into the form
  isEditModalVisible.value = true // Show the modal
}

const uploadImage = async (file) => {
  try {
    const { data, error } = await supabase.storage
      .from('items') // Your Supabase storage bucket
      .upload(`public/${file.name}`, file, {
        cacheControl: '3600',
        upsert: true // Prevent overwriting existing files
      })

    if (error) {
      throw error
    }

    // Return the file path on successful upload
    return data.path
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

  const updatePost = async () => {
  formAction.value = { ...formActionDefault, formProcess: true }

  // Check if a new image is selected
  if (editPostData.value.imageFile) {
    const uploadedImagePath = await uploadImage(editPostData.value.imageFile)

    if (!uploadedImagePath) {
      formAction.value.formErrorMessage = 'Image upload failed'
      formAction.value.formProcess = false
      return
    }

    editPostData.value.image = uploadedImagePath // Use uploaded image path
  }

  const { id, image, item_name, description } = editPostData.value

  const { error } = await supabase
    .from('posts')
    .update({ image, item_name, description })
    .eq('id', id)

  if (error) {
    console.error('Error updating post:', error)
    formAction.formErrorMessage = 'Post Not Updated'
  } else {
    // Update the local data
    const index = posts.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      posts.value[index] = { ...editPostData.value }
    }
    console.log('Post updated successfully')
    formAction.value.formSuccessMessage = 'Post Updated Successfully '
    isEditModalVisible.value = false // Close the modal
  }

  formAction.value.formProcess = false
}

</script>

<template>
  <!-- Alert Notification -->
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>
  <v-container>
    <!-- Display message when there are no posts and have -->
    <v-row justify="center" align="center" class="">
      <v-col cols="8" class="text-center">
        <v-divider class="">
          <p v-if="posts.length === 0">No Posts</p>
          <p v-else>Your Posts</p>
        </v-divider>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" sm="8" md="6" v-for="post in posts" :key="post.id">
        <v-card
          class="mb-4 rounded-xl"
          max-width="4000"
          outlined
          elevation="10"
          link
          @click="showDetails(post)"
        >
          <v-list-item>
            <!-- Poster Image -->
            <v-row align="center" class="mx-1 my-2">
              <!-- Avatar Column -->
              <v-col cols="2" class="d-flex align-center justify-center">
                <v-avatar size="50" class="mx-2" color="black">
                  <!-- Check if profile_pic exists and is not null or empty -->
                  <v-img
                    v-if="profilePic && profilePic !== ''"
                    :src="profilePic.startsWith('http') ? profilePic : profileUrl + profilePic"
                    alt="User Avatar and default profile"
                    class="mx-auto"
                    height="200"
                    width="200"
                  />

                  <!-- Fallback image if profile_pic is not available -->
                  <v-img
                    v-else
                    :src="avatar_url || 'default-avatar-url.png'"
                    alt="google profile"
                    class="mx-auto"
                    height="200"
                    width="200"
                  />
                </v-avatar>
              </v-col>
              <!-- Name Column -->
              <v-col cols="8" class="d-flex align-center text-light-green-darken-3">
                <h3 class="m-0">
                  {{ firstName && lastName ? firstName + ' ' + lastName : full_name }}
                </h3>
              </v-col>
              <!-- Menu Column -->
              <v-col cols="2" class="d-flex align-center justify-end">
                <v-menu offset-y>
                  <template v-slot:activator="{ props }">
                    <v-icon icon="mdi-format-list-bulleted" class="ml-auto" v-bind="props"></v-icon>
                  </template>
                  <v-list>
                    <v-list-item @click="editPost(post)">
                      <v-list-item-title>Edit Post</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deletePost(post)">
                      <v-list-item-title>Delete Post</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-list-item>
          <!-- Post Image -->
          <v-img
            v-if="post.image"
            height="200"
            :src="`https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/items/${post.image}`"
            cover
            :alt="post.item_name || 'Post Image'"
          />
          <v-card-title class="text-light-green-darken-3">{{ post.item_name }}</v-card-title>
          <v-card-subtitle class="text-light-green-darken-3">{{
            post.description
          }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal for Post Details -->
    <v-dialog v-model="isModalVisible" max-width="600">
      <template v-slot:default>
        <!-- Pass postId from selectedPostDetails to ShowItemDetails -->
        <ShowItemDetails :postId="selectedPostDetails?.id" />
      </template>
    </v-dialog>

    <!-- Edit Post Modal -->
    <v-dialog v-model="isEditModalVisible" max-width="600">
      <template v-slot:default>
        <v-card>
          <v-card-title>Edit Post</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="editPostData.item_name"
                label="Item Name"
                outlined
                dense
              ></v-text-field>
              <v-textarea
                v-model="editPostData.description"
                label="Description"
                outlined
                dense
              ></v-textarea>
              <v-file-input
                label="Upload Image"
                v-model="editPostData.imageFile"
                accept="image/*"
                show-size
              ></v-file-input>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="updatePost">Save</v-btn>
            <v-btn color="secondary" @click="isEditModalVisible = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-container>
</template>
