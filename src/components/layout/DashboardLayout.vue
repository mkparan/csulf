<script>
import SideNavigation from '@/components/layout/SideNavigation.vue'
import SideNews from '@/components/layout/SideNews.vue'
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'

export default {
  components: {
    SideNavigation,
    SideNews
  },
  setup() {
    const { mdAndUp } = useDisplay() // Vuetify breakpoint utility
    const isLargeScreen = computed(() => mdAndUp.value) // True if the screen size is medium or larger

    // Separate drawer states for SideNavigation and SideNews
    const navigationDrawer = ref(isLargeScreen.value) // SideNavigation drawer state
    const newsDrawer = ref(isLargeScreen.value) // SideNews drawer state

    return { navigationDrawer, newsDrawer, isLargeScreen }
  }
}
</script>

<template>
  <v-layout>
    <!-- App Bar -->
    <v-app-bar app flat height="64" class="transparent-bar text-center" color="transparent">
      <!-- Toggle Button for SideNavigation -->
      <v-btn
        icon
        color="light-green-darken-3"
        @click="navigationDrawer = !navigationDrawer"
        class="pa-4"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-img src="/images/logo.png" class="pa-6 mx-auto" max-width="120" contain />

      <!-- Toggle Button for SideNews -->
      <v-btn icon color="light-green-darken-3" @click="newsDrawer = !newsDrawer" class="pa-4">
        <v-icon>mdi-newspaper-variant-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container fluid>
      <v-row>
        <!-- Side Navigation -->
        <v-col cols="12" sm="3" md="3" class="pa-2">
          <SideNavigation
            :model-value="navigationDrawer"
            :permanent="isLargeScreen"
            @update:model-value="navigationDrawer = $event"
          />
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" sm="6" md="6" class="pa-2">
          <v-container>
            <slot name="content"></slot>
          </v-container>
        </v-col>

        <!-- Side News -->
        <v-col cols="12" sm="3" md="3" class="pa-2">
          <SideNews
            :model-value="newsDrawer"
            :permanent="isLargeScreen"
            @update:model-value="newsDrawer = $event"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
