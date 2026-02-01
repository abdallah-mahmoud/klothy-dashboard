import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast, { type PluginOptions, POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { useAuthStore } from './stores/auth'
import { usePreferencesStore } from './stores/preferences'
import VueApexCharts from 'vue3-apexcharts'

// Toast options
const toastOptions: PluginOptions = {
    position: POSITION.TOP_LEFT,
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: true,
    transition: 'Vue-Toastification__fade',
    maxToasts: 5,
    newestOnTop: true
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(VueApexCharts)
app.use(Toast, toastOptions)  // Add toast notification system

// Initialize auth from localStorage
const authStore = useAuthStore()
authStore.initializeAuth()

// Initialize user preferences from localStorage
const preferencesStore = usePreferencesStore()
preferencesStore.initialize()

app.mount('#app')

