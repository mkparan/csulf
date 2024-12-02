<script>
export default {
  data() {
    return {
      menuItems: [
        { text: "Dashboard", icon: "mdi-view-dashboard" },
        { text: "Tasks", icon: "mdi-check-circle" },
        { text: "Reports", icon: "mdi-file-chart" },
        { text: "Settings", icon: "mdi-cog" },
      ],
    };
  },
};
</script>



<template>
  <v-app>
    <!-- Sidebar -->
    <v-navigation-drawer app permanent class="sidebar">
      <v-list dense>
        <v-list-item>
          <v-avatar>
            <v-icon large class="logo-icon">mdi-view-dashboard</v-icon>
          </v-avatar>
          <span class="ml-3 title">Dlex Designs</span>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item-group>
          <v-list-item v-for="item in menuItems" :key="item.text" link>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ item.text }}</v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <!-- Footer User -->
      <v-divider></v-divider>
      <div class="sidebar-footer">
        <v-avatar size="40">
          <!-- <img src="/path/to/user-avatar.jpg" alt="User Avatar" /> -->
        </v-avatar>
        <div class="ml-3">
          <div class="user-name">Jane Smith</div>
          <div class="user-status">General Team</div>
        </div>
      </div>
    </v-navigation-drawer>
  </v-app>
</template>

<style scoped>
/* General Styling */
.dashboard-title {
  font-size: 24px;
  font-weight: bold;
}

.sidebar {
  background-color: #43A047;
  color: white;
}

.logo-icon {
  color: #FF5722;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  padding: 10px;
  color: white;
}

</style>
