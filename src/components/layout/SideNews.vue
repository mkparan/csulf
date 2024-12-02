<script>
import { computed } from 'vue'
import { useDisplay } from 'vuetify' // Vuetify's display composable

export default {
  setup() {
    const display = useDisplay()

    // Compute drawer width based on screen size
    const drawerWidth = computed(() => (display.smAndDown ? 350 : 500))

    // Compute iframe width based on drawer width
    const iframeWidth = computed(() => drawerWidth.value)

    return {
      drawerWidth,
      iframeWidth
    }
  }
}
</script>

<template>
  <v-navigation-drawer
    location="right"
    class="bg-white rounded-s-xl pa-6"
    :width="drawerWidth"
    elevation="16"
  >
    <v-list color="transparent">
      <v-list class="text-center">
        <p class="text-center font-weight-bold mt-2 text-light-green-darken-3">
          Follow CCIS page on Facebook!
        </p>
      </v-list>

      <!-- <v-divider class="my-5"></v-divider> -->

      <v-col cols="12" sm="3" md="12" class="pa-2">
        <v-list>
          <!-- Facebook Embed -->
          <div>
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fcciscarsu&tabs=timeline&width=300&height=689&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=true&appId"
              width="300"
              height="689"
              style="border: none; overflow: hidden"
              scrolling="no"
              frameborder="0"
              allowfullscreen="true"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </div>
        </v-list>
      </v-col>
    </v-list>
  </v-navigation-drawer>
</template>
