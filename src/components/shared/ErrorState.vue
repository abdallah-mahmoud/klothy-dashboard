<template>
  <div class="error-state" :class="`error-${type}`">
    <v-icon :icon="icon" :color="iconColor" size="80" class="mb-4" />
    
    <h3 class="text-h5 font-weight-bold mb-2">{{ title }}</h3>
    <p class="text-body-1 text-grey mb-6" style="max-width: 400px">{{ message }}</p>
    
    <div class="d-flex flex-wrap gap-2 justify-center">
      <v-btn
        v-if="retryable"
        color="primary"
        prepend-icon="mdi-refresh"
        @click="$emit('retry')"
      >
        المحاولة مرة أخرى
      </v-btn>
      
      <v-btn
        v-if="contactSupport"
        variant="outlined"
        prepend-icon="mdi-help-circle"
        @click="$emit('contact-support')"
      >
        الدعم الفني
      </v-btn>
      
      <v-btn
        v-if="goHome"
        variant="text"
        prepend-icon="mdi-home"
        to="/admin/dashboard"
      >
        العودة للرئيسية
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'network' | 'permission' | 'not-found' | 'server' | 'generic'
  title?: string
  message?: string
  icon?: string
  retryable?: boolean
  contactSupport?: boolean
  goHome?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'generic',
  retryable: true,
  contactSupport: false,
  goHome: false
})

defineEmits<{
  (e: 'retry'): void
  (e: 'contact-support'): void
}>()

const iconColor = computed(() => {
  switch (props.type) {
    case 'network':
      return 'warning'
    case 'permission':
      return 'error'
    case 'not-found':
      return 'info'
    case 'server':
      return 'error'
    default:
      return 'grey'
  }
})

const defaultTitle = computed(() => {
  switch (props.type) {
    case 'network':
      return 'مشكلة في الاتصال'
    case 'permission':
      return 'غير مصرح لك'
    case 'not-found':
      return 'غير موجود'
    case 'server':
      return 'خطأ في الخادم'
    default:
      return 'حدث خطأ'
  }
})

const defaultMessage = computed(() => {
  switch (props.type) {
    case 'network':
      return 'تحقق من اتصالك بالإنترنت وحاول مرة أخرى'
    case 'permission':
      return 'ليس لديك صلاحية للوصول إلى هذه الصفحة أو العملية'
    case 'not-found':
      return 'العنصر الذي تبحث عنه غير موجود أو تم حذفه'
    case 'server':
      return 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً أو التواصل مع الدعم الفني'
    default:
      return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى'
  }
})

const defaultIcon = computed(() => {
  switch (props.type) {
    case 'network':
      return 'mdi-wifi-off'
    case 'permission':
      return 'mdi-lock'
    case 'not-found':
      return 'mdi-file-remove'
    case 'server':
      return 'mdi-server-network-off'
    default:
      return 'mdi-alert-circle'
  }
})

const icon = computed(() => props.icon || defaultIcon.value)
const title = computed(() => props.title || defaultTitle.value)
const message = computed(() => props.message || defaultMessage.value)
</script>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 24px;
  min-height: 300px;
}

.gap-2 {
  gap: 8px;
}

/* Animation */
.error-state {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
