<template>
  <v-container fluid class="pa-0 fill-height">
    <v-row no-gutters class="fill-height">
      <!-- Left Side - Login Form -->
      <v-col cols="12" md="6" class="d-flex align-center justify-center pa-8">
        <div style="max-width: 450px; width: 100%">
          <!-- Logo and Title -->
          <div class="text-center mb-8">
            <img src="/logo.png" alt="Klothy" style="max-width: 200px; margin-bottom: 16px" class="logo-bounce" />
            <p class="text-grey-darken-1 text-h6 font-weight-bold">لوحة التحكم</p>
          </div>

          <!-- Login Form -->
          <v-form @submit.prevent="handleLogin">
            <v-card elevation="0" class="pa-8 glass-card modern-login-card">
              <v-card-title class="text-h5 font-weight-bold mb-4 px-0" style="color: #1F2E45">
                تسجيل الدخول
              </v-card-title>

              <v-card-text class="px-0">
                <!-- Error Message -->
                <v-alert
                  v-if="errorMessage"
                  type="error"
                  variant="tonal"
                  closable
                  class="mb-4"
                  @click:close="errorMessage = ''"
                >
                  {{ errorMessage }}
                </v-alert>

                <!-- Email Field -->
                <v-text-field
                  v-model="email"
                  label="البريد الإلكتروني"
                  placeholder="admin@klothy.com"
                  type="email"
                  variant="outlined"
                  prepend-inner-icon="mdi-email-outline"
                  :rules="loginSchema.email"
                  class="mb-4"
                  dir="ltr"
                ></v-text-field>

                <!-- Password Field -->
                <v-text-field
                  v-model="password"
                  label="كلمة المرور"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  :rules="loginSchema.password"
                  class="mb-2"
                ></v-text-field>

                <!-- Forgot Password Link -->
                <div class="text-left mb-6">
                  <a href="#" class="text-decoration-none modern-link">
                    نسيت كلمة المرور؟
                  </a>
                </div>

                <!-- Login Button -->
                <v-btn
                  type="submit"
                  color="primary"
                  size="x-large"
                  block
                  :loading="loading"
                  class="mb-4 btn-modern"
                  elevation="2"
                >
                  تسجيل الدخول
                </v-btn>

                <!-- Demo Credentials Info -->
                <v-divider class="my-4"></v-divider>
                <div class="text-center text-caption text-grey">
                  <p class="mb-1"><strong>بيانات تجريبية:</strong></p>
                  <p class="mb-0">مدير: admin@klothy.com / demo123</p>
                  <p>مغسلة: store@klothy.com / demo123</p>
                </div>
              </v-card-text>
            </v-card>
          </v-form>
        </div>
      </v-col>

      <!-- Right Side - Decorative Image -->
      <v-col
        cols="12"
        md="6"
        class="d-none d-md-flex align-center justify-center"
        style="background: linear-gradient(135deg, #1F2E45 0%, #2A3F5F 100%)"
      >
        <div class="text-center pa-8">
          <img 
            src="/logo.png" 
            alt="Klothy" 
            style="max-width: 280px; margin-bottom: 32px" 
            class="decorative-logo"
          />
          <h2 class="text-h3 font-weight-bold text-white mb-4">
            منصة كلوثي
          </h2>
          <p class="text-h6 text-white" style="opacity: 0.9">
            إدارة ذكية لخدمات المغاسل
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { loginSchema } from '@/utils/validationSchemas'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''
  loading.value = true

  try {
    const result = await authStore.login(email.value, password.value)
    
    if (result.success) {
      // Redirect based on role
      if (result.user.role === 'admin') {
        await router.push('/admin/dashboard')
      } else if (result.user.role === 'store_manager') {
        await router.push('/store/kanban')
      }
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'حدث خطأ أثناء تسجيل الدخول'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Modern Login Card */
.modern-login-card {
  border: 1px solid rgba(31, 46, 69, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08) !important;
}

/* Logo Animation */
.logo-bounce {
  animation: gentle-bounce 2s ease-in-out infinite;
}

@keyframes gentle-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* Decorative Logo */
.decorative-logo {
  transition: transform 0.3s ease;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
}

.decorative-logo:hover {
  transform: scale(1.05);
}

/* Modern Link */
.modern-link {
  color: #00C2FF;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modern-link:hover {
  color: #1F2E45;
  text-decoration: underline !important;
}

/* Input Fields Enhancement */
:deep(.v-text-field .v-field) {
  border-radius: 12px;
}

:deep(.v-text-field .v-field--focused) {
  box-shadow: 0 0 0 2px rgba(0, 194, 255, 0.2);
}

/* Button Enhancement */
.btn-modern {
  font-weight: 700;
  letter-spacing: 0.5px;
}
</style>
