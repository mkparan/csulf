<template>
    <v-form fast-fail @submit.prevent>
        <v-text-field label="Firstname" variant="outlined"></v-text-field>
        <v-text-field label="Lastname" variant="outlined"></v-text-field>
        <v-text-field label="Facebook Link" variant="outlined"></v-text-field>
        <v-text-field label="Email" variant="outlined"></v-text-field>
        <v-text-field label="Password" variant="outlined" type="password"></v-text-field>
        <v-text-field label="Password Confirmation" variant="outlined" type="password"></v-text-field>
         <v-btn class="mt-2 mb-8" type="submit" block color="green-darken-2" prepend-icon="mdi-account-plus">Register</v-btn>
    </v-form>
</template>


