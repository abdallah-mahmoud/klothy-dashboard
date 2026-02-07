<template>
  <v-layout>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail && mdAndUp"
      :permanent="mdAndUp"
      :temporary="mobile"
      color="#1F2E45"
      theme="dark"
      width="280"
    >
      <!-- Logo Area -->
      <div class="d-flex align-center justify-center mb-6" :class="rail && mdAndUp ? 'pa-4' : 'pa-6'">
        <div class="text-center">
          <v-avatar color="white" :size="rail && mdAndUp ? 40 : 64" class="mb-3 elevation-2">
            <v-img src="/src/assets/logo.png" alt="Klothy"></v-img>
          </v-avatar>
          <div v-if="!rail || mobile" class="text-h6 font-weight-bold">{{ $t('store.title') }}</div>
          <div v-if="!rail || mobile" class="text-caption text-grey-lighten-1">{{ $t('store.subtitle') }}</div>
        </div>
      </div>

      <!-- Navigation List -->
      <v-list nav class="px-2">
        <v-list-item
          prepend-icon="mdi-view-dashboard-variant"
          :title="$t('store.kanban')"
          to="/store/kanban"
          rounded="xl"
          class="mb-1"
          active-class="bg-primary"
          :min-height="48"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-clipboard-list"
          :title="$t('store.orders')"
          to="/store/orders"
          rounded="xl"
          class="mb-1"
          active-class="bg-primary"
          :min-height="48"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account-group"
          :title="$t('customers.title')"
          to="/store/customers"
          rounded="xl"
          class="mb-1"
          active-class="bg-primary"
          :min-height="48"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-cash-multiple"
          :title="$t('financials.title')"
          to="/store/financials"
          rounded="xl"
          class="mb-1"
          active-class="bg-primary"
          :min-height="48"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-cog"
          :title="$t('store.settings')"
          to="/store/settings"
          rounded="xl"
          class="mb-1"
          active-class="bg-primary"
          :min-height="48"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div :class="rail && mdAndUp ? 'd-flex justify-center pa-2' : 'pa-4'">
          <v-btn
            v-if="!rail || mobile"
            block
            variant="outlined"
            color="white"
            class="mb-2"
            prepend-icon="mdi-logout"
            @click="logout"
          >
            تسجيل الخروج
          </v-btn>
          <v-btn
            v-else
            icon
            variant="outlined"
            color="white"
            class="mb-2"
            @click="logout"
          >
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Top Bar -->
    <v-app-bar flat border color="white" :height="mobile ? 56 : 72">
      <v-app-bar-nav-icon @click="toggleNav"></v-app-bar-nav-icon>
      
      <v-toolbar-title class="font-weight-bold text-secondary">
        {{ pageTitle }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Status Toggle (Mock) -->
      <v-menu location="bottom end">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            color="success"
            variant="flat"
            :class="mobile ? 'rounded-circle ml-2' : 'rounded-pill px-4 ml-4'"
            :icon="mobile"
            :prepend-icon="mobile ? undefined : 'mdi-circle-medium'"
          >
            <v-icon v-if="mobile">mdi-circle-medium</v-icon>
            <span v-else>مفتوح لاستقبال الطلبات</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item value="open" color="success">
            <template #prepend><v-icon color="success" size="small">mdi-circle</v-icon></template>
            <v-list-item-title>مفتوح</v-list-item-title>
          </v-list-item>
          <v-list-item value="busy" color="warning">
            <template #prepend><v-icon color="warning" size="small">mdi-circle</v-icon></template>
            <v-list-item-title>مشغول</v-list-item-title>
          </v-list-item>
          <v-list-item value="closed" color="error">
            <template #prepend><v-icon color="error" size="small">mdi-circle</v-icon></template>
            <v-list-item-title>مغلق</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Notifications - hide on mobile -->
      <v-btn v-if="!mobile" icon class="ml-2">
        <v-badge content="3" color="error">
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>

      <!-- Language Switcher -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon v-bind="props" class="ml-2">
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item @click="setLanguage('ar')" :active="locale === 'ar'">
            <template #prepend>
              <v-icon v-if="locale === 'ar'">mdi-check</v-icon>
            </template>
            <v-list-item-title>العربية</v-list-item-title>
          </v-list-item>
          <v-list-item @click="setLanguage('en')" :active="locale === 'en'">
            <template #prepend>
              <v-icon v-if="locale === 'en'">mdi-check</v-icon>
            </template>
            <v-list-item-title>English</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- User Profile -->
      <v-avatar color="primary" :class="mobile ? 'ml-2' : 'ml-4'" class="cursor-pointer">
        <span class="text-h6 text-white">M</span>
      </v-avatar>
    </v-app-bar>

    <!-- Main Content -->
    <v-main style="background-color: #F4F7FE; height: 100vh; overflow-y: auto">
      <v-container fluid :class="mobile ? 'pa-3' : 'pa-6'">
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useLanguage } from '@/composables/useLanguage'

const router = useRouter()
const route = useRoute()
const { mobile, mdAndUp } = useDisplay()
const { locale, setLanguage } = useLanguage()

const drawer = ref(true)
const rail = ref(false)

const pageTitle = computed(() => {
  switch (route.name) {
    case 'StoreKanban': return 'لوحة تحكم - المتجر'
    case 'StoreOrders': return 'سجل الطلبات'
    case 'StoreCustomers': return 'إدارة العملاء'
    case 'StoreServices': return 'الخدمات'
    case 'StoreFinancials': return 'التقارير المالية'
    case 'StoreSettings': return 'إعدادات المتجر'
    default: return 'لوحة تحكم - المتجر'
  }
})

function toggleNav() {
  if (mobile.value) {
    drawer.value = !drawer.value
  } else {
    rail.value = !rail.value
  }
}

function logout() {
  localStorage.removeItem('authToken')
  router.push('/login')
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

/* Remove underline from navigation links */
.v-list-item {
  text-decoration: none !important;
}

.v-list-item :deep(.v-list-item__content) {
  text-decoration: none !important;
}

.v-list-item :deep(.v-list-item-title) {
  text-decoration: none !important;
}

.v-list-item--nav .v-list-item-title {
  font-size: 0.95rem;
  font-weight: 500;
}
</style>
