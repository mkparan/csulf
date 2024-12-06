
<script setup>
import { ref } from 'vue';
import { supabase } from '@/utils/supabase.js';

const isModalOpen = ref(false);
const post = ref({
  id: null,
  item_name: '',
  description: '',
  image: '',
  imageFile: null,
});

const openEditModal = (postData) => {
  post.value = { ...postData, imageFile: null }; // Initialize the post data
  isModalOpen.value = true;
};

const savePost = async () => {
  const { imageFile, item_name, description, id } = post.value;

  // Upload the image if a new one is selected
  if (imageFile) {
  const { data, error } = await supabase
    .storage
    .from('items')
    .upload(
      `posts/${Date.now()}-${imageFile.name}`, // File path
      imageFile, // File to upload
      { upsert: true } // Correctly include the upsert option here
    );

  if (error) {
    console.error('Error uploading image:', error);
    return;
  }
    imageUrl = data.Key;
  }

  // Update the post in the database
  const { error: updateError } = await supabase
    .from('posts')
    .update({ item_name, description, image: imageUrl })
    .eq('id', id);

  if (updateError) {
    console.error('Error updating post:', updateError);
    return;
  }

  isModalOpen.value = false; // Close the modal after saving
};

const cancelEdit = () => {
  isModalOpen.value = false;
};

defineProps(['post', 'openEditModal']);
</script>


<template>
  <v-dialog v-model="isModalOpen" max-width="600">
    <template v-slot:default>
      <v-card>
        <v-card-title>Edit Post</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="post.item_name"
              label="Item Name"
              required
            ></v-text-field>
            <v-textarea
              v-model="post.description"
              label="Description"
              required
            ></v-textarea>
            <v-file-input
              v-model="post.imageFile"
              label="Image"
              accept="image/*"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="savePost" color="primary">Save</v-btn>
          <v-btn @click="cancelEdit" color="secondary">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>