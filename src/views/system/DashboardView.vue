<script setup>
import SideNavigation from '@/components/layout/SideNavigation.vue'
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar color="green-darken-4 pa-1" class="text-center">
      <v-img class="pa-6" src="/images/logo.png"></v-img>
    </v-app-bar>

    <SideNavigation></SideNavigation>

    <v-navigation-drawer location="right">
      <v-list>
        <v-list-item title="Drawer right"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center" style="min-height: 300px">
      Main Content
    </v-main>
  </v-layout>
</template>

<style scoped>
h1 {
  margin-top: 20px;
}
</style>
