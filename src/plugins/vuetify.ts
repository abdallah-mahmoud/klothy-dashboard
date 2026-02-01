// src/plugins/vuetify.ts
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { ar } from 'vuetify/locale'

// Klothy Design Tokens (from specification)
const klothyTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#1F2E45',    // Moodboard Navy
    secondary: '#00C2FF',  // Moodboard Cyan
    background: '#F5F7FA', // Surface Grey
    surface: '#FFFFFF',    // White
    error: '#EF5350',
    success: '#66BB6A',
    warning: '#FFA500',    // Accent Orange
    info: '#42A5F5',
  },
}

export default createVuetify({
  components,
  directives,

  // RTL Support


  // Arabic Locale
  locale: {
    locale: 'ar',
    messages: { ar },
    rtl: { ar: true },
  },

  theme: {
    defaultTheme: 'klothyTheme',
    themes: {
      klothyTheme,
    },
  },

  // Default component props for better RTL experience
  defaults: {
    VBtn: {
      style: 'text-transform: none;', // Preserve Arabic text casing
      height: 48, // Touch-friendly button height from specs
    },
    VCard: {
      elevation: 2,
    },
  },
})
