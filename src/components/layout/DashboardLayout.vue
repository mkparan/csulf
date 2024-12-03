<script>
import SideNavigation from '@/components/layout/SideNavigation.vue'
import SideNews from '@/components/layout/SideNews.vue'

export default {
  components: {
    SideNavigation,
    SideNews
  }
}
</script>

<template>
  <v-layout>
    <!-- Top App Bar -->
    <v-app-bar app flat height="64" class="transparent-bar text-center">
      <v-app-bar-nav-icon color="light-green-darken-3" prepend-icon="mdi-view-headline" />
      <v-img src="/images/logo.png" class="pa-6 mx-auto" max-width="120" contain />
      <v-app-bar-nav-icon
        location="right"
        color="light-green-darken-3"
        prepend-icon="mdi-newspaper-variant"
      />
    </v-app-bar>

    <!-- Main Layout -->
    <v-container fluid>
      <v-row>
        <!-- Left Sidebar: SideNavigation -->
        <v-col cols="12" sm="3" md="3" class="pa-2">
          <SideNavigation />
        </v-col>

        <!-- Main Content Slot -->
        <v-col cols="12" sm="6" md="6" class="pa-2">
          <v-container>
            <slot name="content"></slot>
            <!-- Dynamic Content -->
          </v-container>
        </v-col>

        <!-- Right Sidebar: SideNews -->
        <v-col cols="12" sm="3" md="3" class="pa-2">
          <SideNews />
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<style>
.transparent-bar {
  background-color: transparent !important;
  z-index: 10;
  box-shadow: none !important;
}
</style>
