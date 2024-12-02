<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'

const firstName = ref('')
const lastName = ref('')

const fetchUserDetails = async () => {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()
  if (error) {
    console.error(error)
  } else {
    firstName.value = user?.user_metadata?.firstname || 'Firstname'
    lastName.value = user?.user_metadata?.lastname || 'Lastname'
  }
}

onMounted(() => {
  fetchUserDetails()
})
</script>

<template>
  <v-app>
    <br />
    <v-row justify="center">
      <v-col cols="12" sm="12" md="8">
        <v-card class="rounded-xl mb-4" max-width="1000" elevation="4">
          <v-list class="text-center pt-5">
            <div class="profile-section">
              <v-avatar size="150" class="mx-auto">
                <v-img
                  src="https://scontent.fcgy2-2.fna.fbcdn.net/v/t39.30808-6/415088245_3509080339421197_435914246344423626_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGuQ97xLeyLu_79p1zb-ql4B9p_WwYYxz4H2n9bBhjHPke4Nh__sQE866JlPfR-JC5Ikj3-m8KTYKYV6H8WBTlQ&_nc_ohc=yltZepfm-7AQ7kNvgE0KMuQ&_nc_zt=23&_nc_ht=scontent.fcgy2-2.fna&_nc_gid=AIGdcIKsJAne8xj3i8gnE0P&oh=00_AYCtbyYQsDy8yuVb7af2bYbmfitwWRwGtSBlrznlw9ADwQ&oe=674E613E"
                  alt="User Avatar"
                />
              </v-avatar>
              <p class="text-center font-weight-bold mt-2">{{ firstName }} {{ lastName }}</p>
            </div>
          </v-list>

          <!-- Center the Facebook button -->
          <v-card-actions class="text-center justify-center">
            <v-btn class="rounded-pill bg-light-green-darken-3" icon="mdi-facebook"></v-btn>
          </v-card-actions>

          <!-- Other buttons, already centered -->
          <v-card-actions class="mx-auto">
            <v-btn class="rounded-pill bg-light-green-darken-3" block> Edit Profile </v-btn>
          </v-card-actions>
          <v-card-actions class="mx-auto">
            <v-btn class="rounded-pill bg-light-green-darken-3" block> Post Now! </v-btn>
          </v-card-actions>
        </v-card>

        <v-divider>You Have No Posts Yet</v-divider>
      </v-col>
    </v-row>
  </v-app>
</template>
