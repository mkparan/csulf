<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'

const userCount = ref(0)
const activityLogs = ref([])

// Fetch user count (existing logic)
const fetchUserCount = async () => {
  const { data, error } = await supabase.rpc('count_users') // Use the rpc method to call the function

  if (error) {
    console.error('Error fetching user count:', error)
  } else {
    userCount.value = data // Set the result to the userCount ref
  }
}

// Fetch activity logs with user information using eq for filtering
const fetchActivityLogs = async () => {
  // Get the current logged-in user
  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError) {
    console.error('Error fetching user:', userError)
    return
  }

  if (!user || !user.user) {
    console.error('No user is logged in')
    return
  }

  // Use Supabase query to filter activity logs by user_id
  const { data, error } = await supabase
    .from('logs') // Query the `logs` table
    .select('id, action, table_name, created_at, user_id') // Adjust fields as needed
    .eq('user_id', user.user.id) // Filter activity logs by user_id

  if (error) {
    console.error('Error fetching activity logs:', error)
  } else {
    activityLogs.value = data.map((log) => ({
      id: log.id,
      activity: log.action, // Display the action (activity)
      tableName: log.table_name, // Display the table name
      date: new Date(log.created_at).toLocaleString(), // Format the date
      user: 'Current User', // Placeholder since we already filter by current user
    }))
  }
}

onMounted(() => {
  fetchUserCount()
  fetchActivityLogs() // Fetch activity logs on mount
})
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
                <th class="text-left">User</th>
                <th class="text-left">Activity</th>
                <th class="text-left">Table Name</th>
                <th class="text-left">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(log, index) in activityLogs" :key="log.id">
                <td>{{ index + 1 }}</td>
                <td>{{ log.user }}</td> <!-- Current User Placeholder -->
                <td>{{ log.activity }}</td>
                <td>{{ log.tableName }}</td>
                <td>{{ log.date }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>
