<template>
  <v-layout>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      color="#1F2E45"
      theme="dark"
      width="280"
    >
      <!-- Logo Area -->
      <div class="d-flex align-center justify-center mb-6" :class="rail ? 'pa-4' : 'pa-6'">
        <div class="text-center">
          <v-avatar color="white" :size="rail ? 40 : 64" class="mb-3 elevation-2">
            <v-img src="/src/assets/logo.png" alt="Klothy"></v-img>
          </v-avatar>
          <div v-if="!rail" class="text-h6 font-weight-bold">لوحة الشركاء</div>
          <div v-if="!rail" class="text-caption text-grey-lighten-1">Klothy Partner</div>
        </div>
      </div>

      <!-- Navigation List -->
      <v-list nav class="px-2">
        <v-list-item
          prepend-icon="mdi-view-dashboard-variant"
          title="الرئيسية"
          to="/store/kanban"
          rounded="xl"
          class="mb-1"
          active-class="bg-primary"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-clipboard-list"
          title="سجل الطلبات"
          to="/store/orders"
          rounded="xl"
          class="mb-1"
          active-class="bg-primary"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-tshirt-crew"
          title="الخدمات"
          to="/store/services"
          rounded="xl"
          class="mb-1"
          active-class="bg-primary"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-cash-multiple"
          title="المالية"
          to="/store/financials"
          rounded="xl"
          class="mb-1"
          active-class="bg-primary"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-cog"
          title="الإعدادات"
          to="/store/settings"
          rounded="xl"
          class="mb-1"
          active-class="bg-primary"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div :class="rail ? 'd-flex justify-center pa-2' : 'pa-4'">
          <v-btn
            v-if="!rail"
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
    <v-app-bar flat border color="white" height="72">
      <v-app-bar-nav-icon @click="rail = !rail"></v-app-bar-nav-icon>
      
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
            class="ml-4 rounded-pill px-4"
            prepend-icon="mdi-circle-medium"
          >
            مفتوح لاستقبال الطلبات
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

      <!-- Notifications -->
      <v-btn icon class="ml-2">
        <v-badge content="3" color="error">
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>

      <!-- User Profile -->
      <v-avatar color="primary" class="ml-4 cursor-pointer">
        <span class="text-h6 text-white">M</span>
      </v-avatar>
    </v-app-bar>

    <!-- Main Content -->
    <v-main style="background-color: #F4F7FE; height: 100vh; overflow-y: auto">
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const drawer = ref(true)
const rail = ref(false)

const pageTitle = computed(() => {
  switch (route.name) {
    case 'StoreKanban': return 'لوحة تحكم - المتجر'
    case 'StoreOrders': return 'سجل الطلبات'
    case 'StoreServices': return 'الخدمات'
    case 'StoreFinancials': return 'التقارير المالية'
    case 'StoreSettings': return 'إعدادات المتجر'
    default: return 'لوحة تحكم - المتجر'
  }
})

function logout() {
  localStorage.removeItem('authToken')
  router.push('/login')
}
</script>

<style scoped>
.v-list-item--nav .v-list-item-title {
  font-size: 0.95rem;
  font-weight: 500;
}
</style>
