<template>
  <v-navigation-drawer
    v-model="isOpen"
    location="left"
    temporary
    width="350"
    class="filter-panel"
  >
    <v-card flat height="100%" class="d-flex flex-column">
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between px-4 py-3">
        <div class="d-flex align-center">
          <v-icon icon="mdi-filter-variant" class="ml-2" />
          <span>الفلاتر المتقدمة</span>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="close"
        />
      </v-card-title>

      <v-divider />

      <!-- Filter Content (Scrollable) -->
      <v-card-text class="flex-1-1 overflow-y-auto pa-4">
        <slot />
      </v-card-text>

      <!-- Actions -->
      <v-divider />
      <v-card-actions class="pa-4">
        <v-btn
          block
          variant="outlined"
          prepend-icon="mdi-refresh"
          @click="$emit('clear')"
        >
          مسح الفلاتر
        </v-btn>
        <v-btn
          block
          color="primary"
          prepend-icon="mdi-check"
          @click="apply"
        >
          تطبيق الفلاتر
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'apply'): void
  (e: 'clear'): void
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const close = () => {
  isOpen.value = false
}

const apply = () => {
  emit('apply')
  close()
}
</script>

<style scoped>
.filter-panel {
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}
</style>
