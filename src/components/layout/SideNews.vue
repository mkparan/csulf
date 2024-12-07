<script setup>
import { useDisplay } from 'vuetify'

// Get mobile status from Vuetify's useDisplay
const { mobile } = useDisplay()

// Props
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  permanent: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <v-navigation-drawer
    location="right"
    class="bg-white rounded-s-xl pa-6"
    :width="350"
    elevation="16"
    :model-value="modelValue"
    :permanent="permanent"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center">
          <p class="font-weight-bold text-light-green-darken-3">Follow CCIS Page on Facebook!</p>

          <!-- Show Facebook Embed iframe if not on mobile -->
          <div v-if="!mobile">
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fcciscarsu&tabs=timeline&width=300&height=689&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
              width="320"
              height="750"
              style="border: none; overflow: hidden"
              scrolling="no"
              frameborder="0"
              allowfullscreen="true"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </div>

          <!-- Fallback message when on mobile -->
          <div v-else>
            <img src="/images/ccis.png" alt="" width="280" height="300" />
            <p class="text-center text-light-green-darken-3">
              Embedding is not supported on mobile devices. <br />
              Click below to visit the page directly:
            </p>
            <a
              href="https://www.facebook.com/cciscarsu"
              target="_blank"
              class="text-decoration-none text-light-green-darken-4 font-weight-bold"
            >
              Go to CCIS Page
            </a>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>
