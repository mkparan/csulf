<template>
  <v-app>
    <!-- Sidebar -->
    <v-navigation-drawer app width="300" class="sidebar">
      <!-- Profile Section -->
      <div class="profile-section">
        <v-avatar size="100" class="mx-auto">
          <v-img
            src="https://scontent.fcgy2-2.fna.fbcdn.net/v/t39.30808-6/415088245_3509080339421197_435914246344423626_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGuQ97xLeyLu_79p1zb-ql4B9p_WwYYxz4H2n9bBhjHPke4Nh__sQE866JlPfR-JC5Ikj3-m8KTYKYV6H8WBTlQ&_nc_ohc=yltZepfm-7AQ7kNvgE0KMuQ&_nc_zt=23&_nc_ht=scontent.fcgy2-2.fna&_nc_gid=AIGdcIKsJAne8xj3i8gnE0P&oh=00_AYCtbyYQsDy8yuVb7af2bYbmfitwWRwGtSBlrznlw9ADwQ&oe=674E613E"
            alt="User Avatar"
          />
        </v-avatar>
        <p class="text-center font-weight-bold mt-2">
          {{ firstName }} {{ lastName }}
        </p>
      </div>

      <!-- Navigation Links -->
      <v-list dense>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          @click="navigateTo(item.route)"
          class="menu-item"
        >
          <v-icon>{{ item.icon }}</v-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>

        
        <v-list-item @click="onLogout" class="logout-button">
          <v-icon>mdi-logout</v-icon>
          <v-list-item-title>SIGN OUT</v-list-item-title>
        </v-list-item>
     
      </v-list>

      <!-- Footer Section -->
     
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/utils/supabase"; // Ensure supabase.js is correctly configured
import { useAuthStore } from "@/stores/authUser"; // Ensure Pinia store is configured

export default {
  setup() {
    const router = useRouter();
    const firstName = ref("Firstname");
    const lastName = ref("Lastname");

    const menuItems = [
      { title: "Home", icon: "mdi-home", route: "home" },
      { title: "Saved", icon: "mdi-content-save", route: "saved" },
      { title: "Profile", icon: "mdi-account", route: "profile" },
      { title: "Appearance", icon: "mdi-format-paint", route: "appearance" },
      { title: "About Us", icon: "mdi-information", route: "about-us" },
    ];

    const fetchUserDetails = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user details:", error);
        return;
      }
      firstName.value = user?.user_metadata?.firstname || "Firstname";
      lastName.value = user?.user_metadata?.lastname || "Lastname";
    };

    const navigateTo = (route) => {
      router.push(`/${route}`);
    };

    const onLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during logout:", error);
        return;
      }
      const authStore = useAuthStore();
      authStore.logout();
      router.replace("/login");
    };

    onMounted(() => {
      fetchUserDetails();
    });

    return {
      firstName,
      lastName,
      menuItems,
      navigateTo,
      onLogout,
    };
  },
};
</script>

<style scoped>
.sidebar {
  background: linear-gradient(
    to bottom,
    #065e09,
    #508d0a
  );
  color: #ffffff;
  height: 100%;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Profile Section */
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 90px 10px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 40px;
}

.profile-section img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
}

/* Navigation Links */
.menu-item {
  display: flex;
  align-items: center;
  padding: 19px 30px;
  color: #e4e6eb;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: #ff0000;
}

.menu-item .v-icon {
  margin-right: 10px;
  font-size: 1.4rem;
}

.footer-section {
  padding: 10px 20px;
}

.logout-button {
  display: flex;
  align-items: center;
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
  padding: 10px 20px;
  transition: background-color 0.3s;
  justify-content: flex-start;
  width: 100%;
  text-align: left;
}

.logout-button:hover {
  background-color: #ff0000;
}

.logout-button .v-icon {
  margin-right: 10px;
  font-size: 1.4rem;
}
</style>
