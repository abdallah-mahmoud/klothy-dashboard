<template>
  <v-tooltip :text="text" :location="location">
    <template #activator="{ props }">
      <v-icon
        v-bind="props"
        :icon="icon"
        :size="size"
        :color="color"
        class="help-tooltip-icon"
        :aria-label="`مساعدة: ${text}`"
      />
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
interface Props {
  text: string
  icon?: string
  size?: string | number
  color?: string
  location?: 'top' | 'bottom' | 'left' | 'right' | 'start' | 'end'
}

withDefaults(defineProps<Props>(), {
  icon: 'mdi-help-circle-outline',
  size: 'small',
  color: 'grey',
  location: 'top'
})
</script>

<style scoped>
.help-tooltip-icon {
  cursor: help;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.help-tooltip-icon:hover {
  opacity: 1;
}
</style>
