<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { useAuthStore } from '@/stores/authUser'


//profile url in supabase
const profileUrl = 'https://bvflfwricxabodytryee.supabase.co/storage/v1/object/public/images/'

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

const emit = defineEmits(['update:modelValue'])

// Router and navigation logic
const router = useRouter()
const currentRoute = ref(router.currentRoute.value.name)

const navigateTo = (routeName) => {
  router.push({ name: routeName })
  currentRoute.value = routeName
}

const onLogout = async () => {
  await supabase.auth.signOut()
  const authStore = useAuthStore()
  authStore.logout()
  router.replace('/login')
}

// Fetch user details from user_profiles_view
const full_name = ref('')
const avatar_url = ref('')
const firstName = ref('')
const lastName = ref('')
const profile_pic = ref('')

const fetchUserDetails = async () => {
  // Step 1: Get the current authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    console.error(authError);
    return;
  }

  // Step 2: Use the user_id from the authenticated user to fetch profile data
  const { data, error: dbError } = await supabase
    .from('user_profiles_view') //user_profiles_view
    .select('full_name, avatar_url, firstname, lastname, profile_pic')
    .eq('user_id', user.id)  // Use the user ID from the auth data
    .single();  // Ensure only one row is returned

  if (dbError) {
    console.error(dbError);
  } else {
    full_name.value = data?.full_name;
    avatar_url.value = data?.avatar_url;
    firstName.value = data?.firstname;
    lastName.value = data?.lastname;
    profile_pic.value = data?.profile_pic;
  }
};


onMounted(fetchUserDetails)
</script>

<template>
  <v-navigation-drawer
    class="bg-light-green-darken-3 rounded-e-xl pa-6"
    :width="350"
    elevation="16"
    :model-value="modelValue"
    :permanent="permanent"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <v-list color="transparent">
      <v-list class="text-center">
        <div class="profile-section">
          <v-avatar size="150" class="mx-auto" color="white">
            <!-- If profile_pic exists and is not null or empty, or if it's a file name -->
            <v-img
               v-if="profile_pic && typeof profile_pic === 'string' && profile_pic !== '' && profile_pic !== null"
                      :src="profile_pic.startsWith('http') ? profile_pic : profileUrl + profile_pic"
                      alt="User Avatar"
                      class="mx-auto"
                      height="200"
                      width="200"
                />
            <!-- Fallback image if profile_pic is not provided or is invalid -->
            <v-img
              v-else
              :src="avatar_url"
              alt="User Avatar"
              class="mx-auto"
              height="200"
              width="200"
            />
          </v-avatar>
          <p class="text-center font-weight-bold mt-2">{{ firstName && lastName ? firstName + ' ' + lastName : full_name }}</p>
        </div>
      </v-list>

      <v-list-item @click="navigateTo('search')">
        <v-btn class="rounded-pill text-light-green-darken-3" append-icon="mdi-magnify" block>
          Search
        </v-btn>
      </v-list-item>
      <v-list-item
        @click="navigateTo('dashboard')"
        :class="{ 'active-item': currentRoute === 'dashboard' }"
      >
        <v-list-item-title class="text-center">Home</v-list-item-title>
      </v-list-item>
      <v-list-item @click="navigateTo('save')" :class="{ 'active-item': currentRoute === 'save' }">
        <v-list-item-title class="text-center">Saved</v-list-item-title>
      </v-list-item>
      <v-list-item
        @click="navigateTo('profile')"
        :class="{ 'active-item': currentRoute === 'profile' }"
      >
        <v-list-item-title class="text-center">Profile</v-list-item-title>
      </v-list-item>
      <v-list-item
        @click="navigateTo('about')"
        :class="{ 'active-item': currentRoute === 'about' }"
      >
        <v-list-item-title class="text-center">About CSULF</v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn
          class="rounded-pill text-light-green-darken-3 font-weight-black"
          block
          @click="onLogout"
        >
          Sign out
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.active-item {
  background-color: rgba(255, 255, 255, 0.196);
  padding: 0.5rem 1rem;
  transition: background-color 0.3s ease;
}

.active-item:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
