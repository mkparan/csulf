<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

const userCount = ref(0)
const activityLogs = ref([])
const router = useRouter()

const navigateTo = (routeName) => {
  router.push({ name: routeName })
}

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
    // Fetch user details (if not already stored in logs table)
    const users = await Promise.all(
      data.map(async (log) => {
        const { data: userData } = await supabase
          .from('users') // Assuming you have a 'users' table
          .select('name') // Adjust the field if necessary
          .eq('id', log.user_id)
          .single()

        return {
          ...log,
          user: userData ? userData.name : 'Current User'
        }
      })
    )

    // Sort the logs by `created_at` in descending order
    users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    // Now format and assign the sorted logs
    activityLogs.value = users.map((log) => {
      const date = new Date(log.created_at) // Convert string to Date object
      // Manila is UTC +8, so add 8 hours to the UTC time
      const manilaDate = new Date(date.getTime() + 8 * 60 * 60 * 1000) // Adjust to Manila time

      return {
        id: log.id,
        activity: log.action,
        tableName: log.table_name,
        date: manilaDate.toLocaleString('en-PH'), // Format the Manila date
        user: log.user // Use the fetched user name
      }
    })
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
        <br />
        <br />
        <!-- Activity Log Table -->
        <v-card class="rounded-xl mb-4" max-width="1000" elevation="4">
          <v-btn
            class="ma-2"
            icon="mdi-arrow-left"
            color="light-green-darken-3"
            @click="navigateTo('profile')"
          ></v-btn>

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
                <td>{{ log.user }}</td>
                <!-- Current User Placeholder -->
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
