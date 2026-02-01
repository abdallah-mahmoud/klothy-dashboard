<template>
  <div class="empty-state">
    <v-icon :icon="icon" color="grey-lighten-2" size="120" class="mb-4" />
    
    <h3 class="text-h5 font-weight-bold mb-2">{{ title }}</h3>
    <p class="text-body-1 text-grey mb-6" style="max-width: 400px">{{ message }}</p>
    
    <v-btn
      v-if="actionText"
      color="primary"
      size="large"
      :prepend-icon="actionIcon"
      @click="$emit('action')"
    >
      {{ actionText }}
    </v-btn>

<slot name="custom-action" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  title: string
  message?: string
  actionText?: string
  actionIcon?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'mdi-inbox',
  actionIcon: 'mdi-plus'
})

defineEmits<{
  (e: 'action'): void
}>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 24px;
  min-height: 400px;
}

/* Animation */
.empty-state {
  animation: fadeInScale 0.4s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Icon pulse effect */
.empty-state .v-icon {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.3;
  }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .empty-state,
  .empty-state .v-icon {
    animation: none;
  }
}
</style>
