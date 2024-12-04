<script setup>
import { ref } from 'vue'

//url of the image
const profileUrl = 'https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/images/'

// Props
defineProps({
  post: {
    type: Object,
    required: true
  }
})

// Reactive state
const visible = ref(true)

// Methods
const closeCard = () => {
  visible.value = false // Hides the card immediately without any effect
}
</script>

<template>
  <v-col cols="12" sm="12" md="12">
    <v-card v-show="visible" class="mx-auto text-white rounded-xl">
      <!-- Close Button -->
      <v-btn
        icon
        @click="closeCard"
        class="close-btn"
        style="position: absolute; top: 16px; right: 16px; z-index: 1"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <!-- Card Actions -->
      <v-card-actions>
        <v-list-item class="w-100">
          <!-- Poster Image-->
          <v-avatar size="50" class="mx-auto" color="black">
            <v-img
              :src="`${profileUrl}${post.profile_pic}`"
              alt="User Picture"
              class="mx-auto"
              height="200"
              width="200"
            />
          </v-avatar>

          <!-- Poster Name and Role -->
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold text-light-green-darken-3">
              {{ post.firstname }} {{ post.lastname }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card-actions>

      <!-- Card Title -->
      <v-card-title class="text-h5 font-weight-bold text-center text-light-green-darken-3">
        {{ post.item_name }}
      </v-card-title>

      <!-- Item Image -->
      <v-img
        class="rounded-lg mb-3"
        height="auto"
        width="auto"
        :src="`https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/items/${post.image}`"
        cover
      ></v-img>

      <!-- Description -->
      <v-card-text
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
  position: relative; /* Allow positioning of the close button */
}

.v-card-title {
  margin-bottom: 10px;
  font-size: 1.5rem;
  text-transform: capitalize;
}

.v-img {
  border-radius: 10px;
}

.v-card-actions .v-list-item {
  padding: 0;
}

.v-avatar {
  border: 2px solid #ffffff;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
}

.v-card-text {
  max-height: 150px;
  overflow-y: auto;
}
</style>
