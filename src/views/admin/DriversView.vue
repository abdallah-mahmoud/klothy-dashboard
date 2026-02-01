<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2" style="color: #1A237E">
          إدارة المناديب
        </h1>
        <p class="text-grey-darken-1">إدارة ومتابعة سائقي التوصيل</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus">
        إضافة مندوب جديد
      </v-btn>
    </div>

    <!-- Status Tabs -->
    <v-tabs v-model="activeTab" color="primary" class="mb-6">
      <v-tab value="active">
        <v-icon start>mdi-check-circle</v-icon>
        نشط
        <v-chip size="small" color="green" class="mr-2">{{ activeDrivers.length }}</v-chip>
      </v-tab>
      <v-tab value="pending">
        <v-icon start>mdi-clock-outline</v-icon>
        قيد المراجعة
        <v-chip size="small" color="orange" class="mr-2">{{ pendingDrivers.length }}</v-chip>
      </v-tab>
      <v-tab value="banned">
        <v-icon start>mdi-cancel</v-icon>
        محظور
        <v-chip size="small" color="red" class="mr-2">{{ bannedDrivers.length }}</v-chip>
      </v-tab>
    </v-tabs>

    <!-- Search Bar -->
    <v-card class="mb-4" elevation="1">
      <v-card-text>
        <v-text-field
          v-model="searchQuery"
          placeholder="البحث باسم المندوب أو رقم الهاتف"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
        ></v-text-field>
      </v-card-text>
    </v-card>

    <!-- Drivers Grid -->
    <v-window v-model="activeTab">
      <!-- Active Drivers -->
      <v-window-item value="active">
        <v-row>
          <v-col
            v-for="driver in filteredActiveDrivers"
            :key="driver.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card elevation="2" class="driver-card">
              <v-card-text>
                <!-- Driver Avatar & Name -->
                <div class="text-center mb-3">
                  <v-avatar size="80" color="primary" class="mb-3">
                    <v-icon size="40" color="white">mdi-account</v-icon>
                  </v-avatar>
                  <div class="text-h6 font-weight-bold">{{ driver.name }}</div>
                  <div class="text-caption text-grey">{{ driver.phone }}</div>
                </div>

                <!-- Status Badge -->
                <div class="text-center mb-3">
                  <v-chip
                    :color="driver.isOnline ? 'green' : 'grey'"
                    size="small"
                  >
                    <v-icon start size="12">mdi-circle</v-icon>
                    {{ driver.isOnline ? 'متصل' : 'غير متصل' }}
                  </v-chip>
                </div>

                <!-- Stats -->
                <v-divider class="my-3"></v-divider>
                <div class="d-flex justify-space-between text-caption mb-2">
                  <span class="text-grey">الطلبات المنجزة</span>
                  <span class="font-weight-bold">{{ driver.completedOrders }}</span>
                </div>
                <div class="d-flex justify-space-between text-caption mb-2">
                  <span class="text-grey">التقييم</span>
                  <div>
                    <v-icon size="14" color="amber">mdi-star</v-icon>
                    <span class="font-weight-bold">{{ driver.rating }}</span>
                  </div>
                </div>
                <div class="d-flex justify-space-between text-caption">
                  <span class="text-grey">نسبة القبول</span>
                  <span class="font-weight-bold">{{ driver.acceptanceRate }}%</span>
                </div>

                <!-- Actions -->
                <v-divider class="my-3"></v-divider>
                <div class="d-flex gap-2">
                  <v-btn
                    color="primary"
                    variant="tonal"
                    size="small"
                    block
                    prepend-icon="mdi-eye"
                    @click="viewDriver(driver)"
                  >
                    التفاصيل
                  </v-btn>
                  <v-btn
                    color="green"
                    variant="tonal"
                    size="small"
                    icon="mdi-phone"
                  ></v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Pending Drivers -->
      <v-window-item value="pending">
        <v-row>
          <v-col
            v-for="driver in filteredPendingDrivers"
            :key="driver.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card elevation="2" class="driver-card">
              <v-card-text>
                <div class="text-center mb-3">
                  <v-avatar size="80" color="orange" class="mb-3">
                    <v-icon size="40" color="white">mdi-account-clock</v-icon>
                  </v-avatar>
                  <div class="text-h6 font-weight-bold">{{ driver.name }}</div>
                  <div class="text-caption text-grey">{{ driver.phone }}</div>
                </div>

                <v-chip color="orange" size="small" block class="mb-3">
                  قيد المراجعة
                </v-chip>

                <div class="text-caption text-grey mb-3">
                  تقدم بطلب التسجيل: {{ driver.appliedDate }}
                </div>

                <v-divider class="my-3"></v-divider>
                <div class="d-flex gap-2">
                  <v-btn
                    color="primary"
                    variant="flat"
                    size="small"
                    block
                    prepend-icon="mdi-file-document"
                    :to="`/admin/drivers/${driver.id}/review`"
                  >
                    مراجعة الوثائق
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Banned Drivers -->
      <v-window-item value="banned">
        <v-row>
          <v-col
            v-for="driver in filteredBannedDrivers"
            :key="driver.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card elevation="2" class="driver-card">
              <v-card-text>
                <div class="text-center mb-3">
                  <v-avatar size="80" color="red" class="mb-3">
                    <v-icon size="40" color="white">mdi-account-cancel</v-icon>
                  </v-avatar>
                  <div class="text-h6 font-weight-bold">{{ driver.name }}</div>
                  <div class="text-caption text-grey">{{ driver.phone }}</div>
                </div>

                <v-chip color="red" size="small" block class="mb-3">
                  محظور
                </v-chip>

                <div class="text-caption mb-2">
                  <strong>السبب:</strong> {{ driver.banReason }}
                </div>
                <div class="text-caption text-grey mb-3">
                  تاريخ الحظر: {{ driver.bannedDate }}
                </div>

                <v-divider class="my-3"></v-divider>
                <v-btn
                  color="success"
                  variant="outlined"
                  size="small"
                  block
                  prepend-icon="mdi-account-reactivate"
                  @click="unbanDriver(driver)"
                >
                  رفع الحظر
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref('active')
const searchQuery = ref('')

// Mock data
const activeDrivers = ref([
  {
    id: 1,
    name: 'خالد السائق',
    phone: '+966 50 123 4567',
    isOnline: true,
    completedOrders: 234,
    rating: 4.8,
    acceptanceRate: 95,
  },
  {
    id: 2,
    name: 'محمد السائق',
    phone: '+966 50 234 5678',
    isOnline: true,
    completedOrders: 189,
    rating: 4.9,
    acceptanceRate: 98,
  },
  {
    id: 3,
    name: 'سعد السائق',
    phone: '+966 50 345 6789',
    isOnline: false,
    completedOrders: 156,
    rating: 4.7,
    acceptanceRate: 92,
  },
  {
    id: 4,
    name: 'أحمد السائق',
    phone: '+966 50 456 7890',
    isOnline: true,
    completedOrders: 198,
    rating: 4.6,
    acceptanceRate: 89,
  },
])

const pendingDrivers = ref([
  {
    id: 101,
    name: 'عبدالرحمن أحمد',
    phone: '+966 50 567 8901',
    appliedDate: '2026-01-28',
  },
  {
    id: 102,
    name: 'فهد محمد',
    phone: '+966 50 678 9012',
    appliedDate: '2026-01-27',
  },
])

const bannedDrivers = ref([
  {
    id: 201,
    name: 'يوسف علي',
    phone: '+966 50 789 0123',
    banReason: 'تأخير متكرر في التوصيل',
    bannedDate: '2026-01-15',
  },
])

const filteredActiveDrivers = computed(() => {
  if (!searchQuery.value) return activeDrivers.value
  return activeDrivers.value.filter(
    (d) =>
      d.name.includes(searchQuery.value) || d.phone.includes(searchQuery.value)
  )
})

const filteredPendingDrivers = computed(() => {
  if (!searchQuery.value) return pendingDrivers.value
  return pendingDrivers.value.filter(
    (d) =>
      d.name.includes(searchQuery.value) || d.phone.includes(searchQuery.value)
  )
})

const filteredBannedDrivers = computed(() => {
  if (!searchQuery.value) return bannedDrivers.value
  return bannedDrivers.value.filter(
    (d) =>
      d.name.includes(searchQuery.value) || d.phone.includes(searchQuery.value)
  )
})

function viewDriver(driver: any) {
  console.log('View driver:', driver.name)
  // TODO: Open driver detail dialog
}

function unbanDriver(driver: any) {
  console.log('Unban driver:', driver.name)
  // TODO: Open confirmation dialog
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.driver-card {
  height: 100%;
  transition: transform 0.2s;
}

.driver-card:hover {
  transform: translateY(-4px);
}
</style>
