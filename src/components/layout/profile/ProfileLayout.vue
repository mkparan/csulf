<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'

const firstName = ref('')
const lastName = ref('')
const profileImage = ref('/images/profile-default.png') // Default profile image
const facebookLink = ref('') // Reactive reference for Facebook link
const showEditModal = ref(false) // Control modal visibility

// Fetch user details from Supabase
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
    profileImage.value = user?.user_metadata?.profile_image || '/images/profile-default.png'
    facebookLink.value = user?.user_metadata?.facebook || ''
  }
}

// Update profile information
const updateProfile = async () => {
  const { error } = await supabase.auth.updateUser({
    data: {
      firstname: firstName.value,
      lastname: lastName.value,
      profile_image: profileImage.value,
      facebook: facebookLink.value
    }
  })

  if (error) {
    console.error('Error updating profile:', error)
  } else {
    showEditModal.value = false // Close modal on success
    fetchUserDetails() // Fetch updated user details
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
                <v-img :src="profileImage" alt="User Avatar" />
              </v-avatar>
              <p class="text-center font-weight-bold mt-2">{{ firstName }} {{ lastName }}</p>
            </div>
          </v-list>

          <!-- Center the Facebook button -->
       <v-card-actions class="text-center justify-center">
            <v-btn
              class="rounded-pill bg-light-green-darken-3"
              icon="mdi-facebook"
              :href="facebookLink"
            >
            </v-btn>
        </v-card-actions>


          <!-- Other buttons, already centered -->
          <v-card-actions class="mx-auto">
            <v-btn class="rounded-pill bg-light-green-darken-3" block @click="showEditModal = true">
              Edit Profile
            </v-btn>
          </v-card-actions>
          <v-card-actions class="mx-auto">
            <v-btn class="rounded-pill bg-light-green-darken-3" block> Post Now! </v-btn>
          </v-card-actions>
        </v-card>

        <v-divider>You Have No Posts Yet</v-divider>
      </v-col>
    </v-row>

    <!-- Modal for editing profile -->
    <v-dialog v-model="showEditModal" max-width="500px">
      <v-card class="rounded-xl">
        <v-card-title class="text-center">Edit Profile</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="firstName" label="First Name" variant="solo" rounded outlined />
            <v-text-field v-model="lastName" label="Last Name" variant="solo" rounded outlined />
            <v-file-input
              v-model="profileImage"
              label="Upload Profile Image"
              accept="image/*"
              variant="solo"
              rounded
              outlined
            />
            <v-text-field
              v-model="facebookLink"
              label="Facebook Profile Link"
              variant="solo"
              rounded
              outlined
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="red" @click="showEditModal = false">Cancel</v-btn>
          <v-btn text color="green" @click="updateProfile">Save Changes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
