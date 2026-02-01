<template>
  <v-layout style="height: 100vh">
    <!-- Sidebar - Right side for RTL - Collapsible -->
    <v-navigation-drawer
      v-model="sidebarOpen"
      :rail="sidebarCollapsed"
      :width="sidebarWidth"
      color="primary"
      theme="dark"
      class="modern-sidebar"
      location="right"
      permanent
    >
      <!-- Logo Section - Better Display -->
      <div :class="sidebarCollapsed ? 'pa-2 text-center' : 'pa-4 text-center'" class="logo-section">
        <img 
          v-if="!sidebarCollapsed"
          src="/logo.png" 
          alt="Klothy" 
          :style="`max-width: ${sidebarWidth * 0.65}px`" 
          class="logo-img" 
        />
        <div v-else class="d-flex justify-center align-center" style="height: 56px;">
          <v-avatar color="white" size="40">
            <span style="color: #1A237E; font-weight: bold; font-size: 22px;">K</span>
          </v-avatar>
        </div>
      </div>

      <!-- Collapse Toggle Button -->
      <div class="text-center mb-2">
        <v-btn
          icon
          size="small"
          variant="text"
          @click="sidebarCollapsed = !sidebarCollapsed"
          :title="sidebarCollapsed ? 'توسيع القائمة' : 'طي القائمة'"
        >
          <v-icon>{{ sidebarCollapsed ? 'mdi-chevron-left' : 'mdi-chevron-right' }}</v-icon>
        </v-btn>
      </div>

      <!-- Navigation Menu -->
      <v-list nav density="compact" class="nav-menu">
        <v-list-item
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          :prepend-icon="item.icon"
          :title="item.title"
          active-class="active-nav-item"
          rounded="lg"
          class="mx-2 my-1 nav-item"
        >
          <template #title>
            <span class="nav-text">{{ item.title }}</span>
          </template>
        </v-list-item>
      </v-list>

      <template #append>
        <div class="pa-3 text-center">
          <v-btn
            v-if="!sidebarCollapsed"
            block
            color="error"
            variant="outlined"
            prepend-icon="mdi-logout"
            aria-label="تسجيل الخروج من النظام"
            @click="handleLogout"
          >
            تسجيل الخروج
          </v-btn>
          <v-btn
            v-else
            icon="mdi-logout"
            color="error"
            variant="text"
            size="large"
            aria-label="تسجيل الخروج"
            @click="handleLogout"
          />
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Top App Bar (Outside v-main for fixed positioning) -->
    <v-app-bar elevation="0" color="white" class="modern-appbar">
      <!-- Page Title / Breadcrumbs -->
      <v-app-bar-title>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0">
          <template #divider>
            <v-icon>mdi-chevron-left</v-icon>
          </template>
        </v-breadcrumbs>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Notifications -->
      <v-btn icon variant="text">
        <v-badge color="error" content="3" offset-x="12" offset-y="12">
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>

      <!-- Admin Profile Menu -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn variant="text" v-bind="props" class="mr-2">
            <v-avatar size="36" color="secondary" class="ml-2">
              <span class="text-white font-weight-bold">
                {{ userInitials }}
              </span>
            </v-avatar>
            <span class="mr-2">{{ authStore.user?.name }}</span>
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item prepend-icon="mdi-account-outline" title="الملف الشخصي"></v-list-item>
          <v-list-item 
            prepend-icon="mdi-cog-outline" 
            title="الإعدادات"
            @click="showSettings = true"
          ></v-list-item>
          <v-divider></v-divider>
          <v-list-item
            prepend-icon="mdi-logout"
            title="تسجيل الخروج"
            @click="handleLogout"
          ></v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main Content Area - Now properly scrollable -->
    <v-main class="main-content">
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
    </v-main>

    <!-- Global Search (Ctrl+K) -->
    <GlobalSearch v-model="isSearchOpen" />

    <!-- Keyboard Shortcuts Help Dialog -->
    <KeyboardShortcutsHelp v-model="isShortcutsHelpOpen" />

    <!-- Undo Snackbar -->
    <UndoSnackbar
      :model-value="showUndoSnackbar"
      :message="pendingUndo?.message || ''"
      :timeout="pendingUndo?.timeout || 5000"
      @undo="undo"
    />

    <!-- Settings Dialog -->
    <SettingsDialog v-model="showSettings" />
  </v-layout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePreferencesStore } from '@/stores/preferences'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import { useUndo } from '@/composables/useUndo'
import KeyboardShortcutsHelp from '@/components/shared/KeyboardShortcutsHelp.vue'
import GlobalSearch from '@/components/shared/GlobalSearch.vue'
import UndoSnackbar from '@/components/shared/UndoSnackbar.vue'
import SettingsDialog from '@/components/shared/SettingsDialog.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const preferencesStore = usePreferencesStore()

// Keyboard shortcuts
const { isSearchOpen, isShortcutsHelpOpen, registerShortcuts, unregisterShortcuts } = useKeyboardShortcuts()

// Undo functionality
const { pendingUndo, undo } = useUndo()

// Settings dialog
const showSettings = ref(false)

// Computed for UndoSnackbar v-model
const showUndoSnackbar = computed(() => !!pendingUndo.value)

// Sidebar state
const sidebarOpen = ref(true)
const sidebarCollapsed = ref(false)
const sidebarWidth = ref(300)

// Update sidebar width based on screen size
const updateSidebarWidth = () => {
  if (window.innerWidth < 1280) {
    sidebarWidth.value = 280
  } else if (window.innerWidth < 1600) {
    sidebarWidth.value = 300
  } else {
    sidebarWidth.value = 320
  }
}

onMounted(() => {
  updateSidebarWidth()
  window.addEventListener('resize', updateSidebarWidth)
  registerShortcuts()  // Register keyboard shortcuts
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSidebarWidth)
  unregisterShortcuts()  // Cleanup keyboard shortcuts
})

const menuItems = [
  { title: 'الرئيسية', icon: 'mdi-view-dashboard', path: '/admin/dashboard' },
  { title: 'الخريطة الحية', icon: 'mdi-map-marker', path: '/admin/live-map' },
  { title: 'الطلبات', icon: 'mdi-format-list-bulleted', path: '/admin/orders' },
  { title: 'المناديب', icon: 'mdi-car', path: '/admin/drivers' },
  { title: 'إسناد المناديب', icon: 'mdi-swap-horizontal', path: '/admin/laundry-drivers' },
  { title: 'المغاسل', icon: 'mdi-store', path: '/admin/laundries' },
  { title: 'الأسعار', icon: 'mdi-currency-usd', path: '/admin/pricing' },
]

const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  return paths.map((path, index) => ({
    title: getPageTitle(path),
    disabled: false,
    href: '/' + paths.slice(0, index + 1).join('/'),
  }))
})

const userInitials = computed(() => {
  if (!authStore.user?.name) return 'A'
  const names = authStore.user.name.split(' ').filter(n => n.length > 0)
  if (names.length === 0) return 'A'
  return names.length > 1 
    ? (names[0]?.[0] || '') + (names[1]?.[0] || '') 
    : names[0]?.[0] || 'A'
})

function getPageTitle(path: string): string {
  const titles: Record<string, string> = {
    admin: 'لوحة التحكم',
    dashboard: 'الرئيسية',
    orders: 'الطلبات',
    drivers: 'المناديب',
    laundries: 'المغاسل',
    pricing: 'الأسعار',
    'live-map': 'الخريطة الحية',
  }
  return titles[path] || path
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Modern Sidebar Styling */
.modern-sidebar {
  background: linear-gradient(180deg, #1F2E45 0%, #2A3F5F 100%) !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
  height: 100vh;
  overflow-y: hidden !important; /* Prevent scroll */
  display: flex;
  flex-direction: column;
}

.logo-section {
  border-bottom: none;
  padding: 20px 16px 16px 16px !important;
  flex-shrink: 0;
}

.logo-img {
  transition: transform 0.3s ease;
  width: 100%;
  height: auto;
  max-height: 90px;
  object-fit: contain;
}

.logo-img:hover {
  transform: scale(1.05);
}

/* Main Content Area - Critical for scrolling */
.main-content {
  background-color: var(--surface-grey) !important;
  height: 100vh;
  overflow-y: auto !important;
}

/* Ensure proper layout */
:deep(.v-layout) {
  height: 100vh;
  overflow: hidden;
}

:deep(.v-main__wrap) {
  height: 100%;
  overflow-y: auto;
}

/* Navigation Menu - Optimized for no-scroll */
.nav-menu {
  padding: 6px 0 !important;
  flex-grow: 1;
  overflow: visible !important;
}

.nav-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  margin-bottom: 2px !important;
  padding: 9px 12px !important;
  min-height: 46px !important;
  text-decoration: none !important;
}

/* Larger nav text */
.nav-text {
  font-size: 1.0625rem !important;  /* 17px */
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1.3;
  text-decoration: none !important;
}

/* Optimized icon size */
:deep(.nav-item .v-icon) {
  font-size: 22px !important;
  margin-left: 10px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  transform: translateX(-3px);
}

.active-nav-item {
  background: #00C2FF !important;
  box-shadow: 0 4px 12px rgba(0, 194, 255, 0.4);
}

/* Logout Button - Compact */
:deep(.modern-sidebar .v-btn) {
  font-size: 0.9375rem !important;  /* 15px */
  padding: 10px 16px !important;
  height: 44px !important;
}

/* Modern App Bar */
.modern-appbar {
  border-bottom: 1px solid #F5F7FA;
  backdrop-filter: blur(10px);
}

/* Breadcrumbs Enhancement */
:deep(.v-breadcrumbs) {
  padding: 0;
}

:deep(.v-breadcrumbs-item) {
  font-weight: 600;
  font-size: 1rem;
}

:deep(.v-breadcrumbs .v-icon) {
  font-size: 20px;
}
</style>
