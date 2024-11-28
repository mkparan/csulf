<template>
  <v-app>
    <!-- Sidebar -->
    <v-navigation-drawer app width="300" class="sidebar white-background pt-3">
      <!-- Profile Section -->
      <div class="profile-section">
        <v-avatar size="100" class="mx-auto">
          <v-img 
            src="https://scontent.fcgy2-2.fna.fbcdn.net/v/t39.30808-6/415088245_3509080339421197_435914246344423626_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGuQ97xLeyLu_79p1zb-ql4B9p_WwYYxz4H2n9bBhjHPke4Nh__sQE866JlPfR-JC5Ikj3-m8KTYKYV6H8WBTlQ&_nc_ohc=yltZepfm-7AQ7kNvgE0KMuQ&_nc_zt=23&_nc_ht=scontent.fcgy2-2.fna&_nc_gid=AIGdcIKsJAne8xj3i8gnE0P&oh=00_AYCtbyYQsDy8yuVb7af2bYbmfitwWRwGtSBlrznlw9ADwQ&oe=674E613E" 
            alt="User Avatar" />
        </v-avatar>
        <p class="text-center font-weight-bold mt-2">
          {{ firstName }} {{ lastName }}
        </p>
      </div>

      
      <!-- Navigation Links -->
    <v-list dense class="navigation-links">
      <v-list-item @click="navigateTo('home')" class="menu-item">
        <v-icon left>mdi-home</v-icon>
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('saved')" class="menu-item">
        <v-icon left>mdi-content-save</v-icon>
        <v-list-item-title>Saved</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('profile')" class="menu-item">
        <v-icon left>mdi-account</v-icon>
        <v-list-item-title>Profile</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('appearance')" class="menu-item">
        <v-icon left>mdi-format-paint</v-icon>
        <v-list-item-title>Appearance</v-list-item-title>
      </v-list-item>

      <v-list-item @click="navigateTo('about-us')" class="menu-item">
        <v-icon left>mdi-information</v-icon>
        <v-list-item-title>About Us</v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- Footer Section -->
    <div class="footer-section">
      <v-divider></v-divider>
      <v-list-item @click="onLogout" class="logout-button">
        <v-icon>mdi-logout</v-icon>
        <v-list-item-title>SIGN OUT</v-list-item-title>
      </v-list-item>
    </div>
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
import { supabase } from "../../utils/supabase.js";
import { useAuthStore } from "@/stores/authUser";

export default {
  setup() {
    const router = useRouter();
    const formAction = ref({ formProcess: false });
    const firstName = ref("");
    const lastName = ref("");



    const navigateTo = (route) => {
      console.log(`Navigating to ${route}`);
      // Add your navigation logic here
    };

    const fetchUserDetails = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user details:", error);
        return;
      }
      firstName.value = user?.user_metadata?.firstname || "Firstname";
      lastName.value = user?.user_metadata?.lastname || "Lastname";
    };

    const onLogout = async () => {
      formAction.value = { formProcess: true };
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during logout:", error);
        formAction.value.formProcess = false;
        return;
      }
      const authStore = useAuthStore();
      authStore.logout();
      formAction.value.formProcess = false;
      router.replace("/login");
    };

    onMounted(() => {
      fetchUserDetails();
    });

    return {
      formAction,
      firstName,
      lastName,
      onLogout,
    };
  },
};
</script>

<style scoped>
/* Sidebar styling */
.sidebar {
  background: linear-gradient(
    to bottom,
    #065e09, /* Dominant Green */
    #508d0a, /* Light Green */
    #ffc107, /* Yellow */
    #a1887f, /* Brown */
    #ffffff /* White */
  );
  color: #ffffff; /* Text color for contrast with green */
  height: 100%;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Profile section */
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 10px;
  border-bottom: 1px solid #e0e0e0;
  margin-top: 30px; /* Adjust margin to space it from the top */
}

/* Profile image */
.profile-section img {
  width: 150px; /* Adjusted size */
  height: 150px; /* Matching width and height */
  object-fit: cover; /* Ensures the image is cropped evenly if aspect ratio differs */
  border-radius: 50%; /* Makes the image circular */
  display: block; /* Ensures no unexpected inline spacing around the image */
  border: 2px solid #e0e0e0; /* Optional border for styling */
  margin: auto; /* Center the image horizontally */
}

.profile-section p {
  font-size: 1.1rem;
  margin-top: 10px;
}

/* Navigation links */
.navigation-links {
  flex-grow: 1;
  padding: 10px 0;
}

.v-list-item {
  display: flex;
  align-items: center;
  padding-left: 15px;
  color: #424242;
}

/* Logout button */
.footer-section {
  padding: 10px 15px;
}

.logout-button {
  color: #ff5252;
  font-weight: bold;
}

.v-list-item-title {
  margin-left: 10px;
  font-size: 1rem;
}


/* Navigation Section */

/* Adjust navigation links */
.navigation-links {
  padding: 0; /* Remove extra padding */
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: #e4e6eb;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: #3a3b3c; /* Hover effect */
}

.menu-item .v-icon {
  font-size: 1.4rem;
  color: #e4e6eb; /* Icon color */
  margin-right: 10px;
}

.menu-item .v-list-item-title {
  font-size: 1rem;
  font-weight: 500;
}

/* Logout button */
.footer-section {
  padding: 10px 20px;
}

.logout-button {
  display: flex;
  align-items: center;
  color: #ff5252;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #3a3b3c;
}

.logout-button .v-icon {
  margin-right: 10px;
  font-size: 1.4rem;
}

</style>
