<template>
  <v-dialog v-model="isOpen" max-width="500" persistent>
    <v-card>
      <v-card-title class="text-h6 font-weight-bold d-flex align-center">
        <v-icon :color="iconColor" class="ml-2" size="28">{{ icon }}</v-icon>
        {{ title }}
      </v-card-title>
      
      <v-card-text class="text-body-1 py-4">
        {{ message }}
      </v-card-text>
      
      <v-card-actions class="px-4 pb-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="handleCancel"
          :disabled="loading"
        >
          إلغاء
        </v-btn>
        <v-btn
          :color="confirmColor"
          variant="flat"
          @click="handleConfirm"
          :loading="loading"
          :prepend-icon="confirmIcon"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  message: string
  confirmText?: string
  confirmColor?: string
  confirmIcon?: string
  type?: 'danger' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  title: 'تأكيد الإجراء',
  confirmText: 'تأكيد',
  confirmColor: 'error',
  confirmIcon: 'mdi-check',
  type: 'danger'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const loading = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const icon = computed(() => {
  switch (props.type) {
    case 'danger': return 'mdi-alert-circle'
    case 'warning': return 'mdi-alert'
    default: return 'mdi-information'
  }
})

const iconColor = computed(() => {
  switch (props.type) {
    case 'danger': return 'error'
    case 'warning': return 'warning'
    default: return 'info'
  }
})

const handleConfirm = () => {
  loading.value = true
  emit('confirm')
  // Dialog will be closed by parent after action completes
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
</script>
