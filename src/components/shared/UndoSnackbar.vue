<template>
  <v-snackbar
    v-model="isVisible"
    :timeout="timeout"
    color="success"
    location="bottom"
    class="undo-snackbar"
  >
    <div class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-icon icon="mdi-check-circle" class="ml-2" />
        <span>{{ message }}</span>
      </div>
      
      <v-btn
        variant="text"
        size="small"
        prepend-icon="mdi-undo"
        @click="handleUndo"
      >
        تراجع
      </v-btn>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  message: string
  timeout?: number
}

const props = withDefaults(defineProps<Props>(), {
  timeout: 5000
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'undo'): void
}>()

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleUndo = () => {
  emit('undo')
  isVisible.value = false
}
</script>

<style scoped>
.undo-snackbar {
  font-weight: 500;
}
</style>
