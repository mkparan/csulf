<template>
    <v-form fast-fail @submit.prevent>
        <v-text-field label="Firstname"></v-text-field>
        <v-text-field label="Lastname"></v-text-field>
        <v-text-field label="Email"></v-text-field>
        <v-text-field label="Password" type="password"></v-text-field>
        <v-text-field label="Password Confirmation" type="password"></v-text-field>
         <v-btn class="mt-2 mb-8" type="submit" block color="primary" prepend-icon="mdi-account-plus">Register</v-btn>
    </v-form>
</template>