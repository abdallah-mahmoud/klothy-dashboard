<template>
  <v-app>
    <SkipNav />
    <router-view id="main-content" role="main" />
  </v-app>
</template>

<script setup lang="ts">
import SkipNav from './components/shared/SkipNav.vue'
// Main app component - just renders router view
</script>
