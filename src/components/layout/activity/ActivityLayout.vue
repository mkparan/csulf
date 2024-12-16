<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'

const userCount = ref(0)

// Fetch user count (existing logic)
const fetchUserCount = async () => {
  const { data, error } = await supabase.rpc('count_users') // Use the rpc method to call the function

  if (error) {
    console.error('Error fetching user count:', error)
  } else {
    userCount.value = data // Set the result to the userCount ref
  }
}

// Dummy activity log data (can be replaced with actual API later)
const activityLogs = ref([
  { id: 1, activity: 'Created a post', date: '2024-04-25 10:00 AM' },
  { id: 2, activity: 'Deleted a post', date: '2024-04-25 11:15 AM' },
  { id: 3, activity: 'Created a post', date: '2024-04-26 01:00 PM' },
  { id: 4, activity: 'Deleted a post', date: '2024-04-26 03:45 PM' },
  { id: 5, activity: 'Created a post', date: '2024-04-27 09:30 AM' }
])

onMounted(fetchUserCount)
</script>

<template>
  <v-app>
    <br />
    <v-row justify="center">
      <v-col cols="12" sm="12" md="8">
        <!-- User Count Card -->
        <v-card class="rounded-xl mb-4" max-width="1000" elevation="4">
          <v-list class="text-center pt-5">
            <div>
              <p class="text-light-green-darken-3 font-weight-bold text-h5">System User</p>
            </div>
            <div>
              <p class="text-light-green-darken-3 ma-6">
                The total number of users currently in the system is:
                <span class="font-weight-bold">{{ userCount }}</span>
              </p>
            </div>
          </v-list>
        </v-card>

        <!-- Activity Log Table -->
        <v-card class="rounded-xl mb-4" max-width="1000" elevation="4">
          <v-card-title class="text-center font-weight-bold text-light-green-darken-3 text-h5">
            Activity Logs
          </v-card-title>
          <v-divider></v-divider>
          <v-table density="comfortable">
            <thead>
              <tr>
                <th class="text-left">#</th>
                <th class="text-left">Activity</th>
                <th class="text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(log, index) in activityLogs" :key="log.id">
                <td>{{ index + 1 }}</td>
                <td>{{ log.activity }}</td>
                <td>{{ log.date }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>

<style scoped>
.v-card-title {
  padding: 16px;
}
.v-table {
  font-size: 1rem;
}
th {
  background-color: #e8f5e9; /* Light green background for headers */
  color: #388e3c; /* Dark green text */
}
</style>
