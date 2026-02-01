<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-2" style="color: #1A237E">
        الخريطة الحية
      </h1>
      <p class="text-grey-darken-1">تتبع المناديب والطلبات في الوقت الفعلي</p>
    </div>

    <!-- Stats Bar -->
    <v-row class="mb-4">
      <v-col cols="12" sm="3">
        <v-card class="pa-4" elevation="1">
          <div class="d-flex align-center">
            <v-icon color="green" size="32" class="ml-3">mdi-car-connected</v-icon>
            <div>
              <div class="text-h5 font-weight-bold">34</div>
              <div class="text-caption text-grey">مناديب متصلين</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="3">
        <v-card class="pa-4" elevation="1">
          <div class="d-flex align-center">
            <v-icon color="blue" size="32" class="ml-3">mdi-truck-delivery</v-icon>
            <div>
              <div class="text-h5 font-weight-bold">23</div>
              <div class="text-caption text-grey">طلبات جارية</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="3">
        <v-card class="pa-4" elevation="1">
          <div class="d-flex align-center">
            <v-icon color="orange" size="32" class="ml-3">mdi-clock-fast</v-icon>
            <div>
              <div class="text-h5 font-weight-bold">12 دقيقة</div>
              <div class="text-caption text-grey">متوسط وقت الوصول</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="3">
        <v-card class="pa-4" elevation="1">
          <div class="d-flex align-center">
            <v-icon color="purple" size="32" class="ml-3">mdi-store</v-icon>
            <div>
              <div class="text-h5 font-weight-bold">12</div>
              <div class="text-caption text-grey">مغاسل مفتوحة</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Map Container -->
    <v-card elevation="2">
      <v-card-text class="pa-0">
        <!-- Map Placeholder -->
        <div class="map-container">
          <div class="map-placeholder">
            <v-icon size="80" color="primary">mdi-map</v-icon>
            <p class="text-h6 mt-4">خريطة Google Maps</p>
            <p class="text-caption text-grey">سيتم دمج خريطة تفاعلية هنا تعرض:</p>
            <v-chip-group class="mt-2">
              <v-chip color="green" size="small">
                <v-icon start>mdi-map-marker</v-icon>
                المناديب المتاحين
              </v-chip>
              <v-chip color="blue" size="small">
                <v-icon start>mdi-map-marker</v-icon>
                المناديب في مهمة
              </v-chip>
              <v-chip color="purple" size="small">
                <v-icon start>mdi-store-marker</v-icon>
                المغاسل
              </v-chip>
              <v-chip color="orange" size="small">
                <v-icon start>mdi-home-marker</v-icon>
                مواقع العملاء
              </v-chip>
            </v-chip-group>
          </div>
        </div>

        <!-- Map Controls Overlay -->
        <div class="map-controls">
          <!-- Filter Button -->
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                color="white"
                elevation="2"
                v-bind="props"
                prepend-icon="mdi-filter-variant"
              >
                فلترة العرض
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-checkbox label="إظهار المناديب" density="compact" hide-details></v-checkbox>
              </v-list-item>
              <v-list-item>
                <v-checkbox label="إظهار المغاسل" density="compact" hide-details></v-checkbox>
              </v-list-item>
              <v-list-item>
                <v-checkbox label="إظهار الطلبات النشطة" density="compact" hide-details></v-checkbox>
              </v-list-item>
              <v-list-item>
                <v-checkbox label="إظهار الازدحام المروري" density="compact" hide-details></v-checkbox>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- Refresh Button -->
          <v-btn color="white" elevation="2" icon="mdi-refresh" class="mr-2"></v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Active Drivers Panel (Side Panel) -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>المناديب النشطين</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="driver in activeDrivers"
                :key="driver.id"
                class="border-b"
              >
                <template #prepend>
                  <v-avatar :color="driver.status === 'available' ? 'green' : 'blue'" class="ml-3">
                    <v-icon color="white">mdi-account</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title>{{ driver.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip
                    :color="driver.status === 'available' ? 'green' : 'blue'"
                    size="x-small"
                    class="ml-2"
                  >
                    {{ driver.statusText }}
                  </v-chip>
                  {{ driver.location }}
                </v-list-item-subtitle>

                <template #append>
                  <div class="text-left">
                    <v-btn
                      icon="mdi-map-marker"
                      size="small"
                      variant="text"
                      color="primary"
                      @click="focusDriver(driver)"
                    ></v-btn>
                    <v-btn
                      icon="mdi-phone"
                      size="small"
                      variant="text"
                      color="green"
                    ></v-btn>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Mock active drivers data
const activeDrivers = ref([
  {
    id: 1,
    name: 'خالد السائق',
    status: 'busy',
    statusText: 'في مهمة',
    location: 'حي النخيل',
    lat: 24.7136,
    lng: 46.6753,
  },
  {
    id: 2,
    name: 'محمد السائق',
    status: 'busy',
    statusText: 'في مهمة',
    location: 'حي العليا',
    lat: 24.7242,
    lng: 46.6838,
  },
  {
    id: 3,
    name: 'سعد السائق',
    status: 'available',
    statusText: 'متاح',
    location: 'حي الملز',
    lat: 24.6748,
    lng: 46.7128,
  },
  {
    id: 4,
    name: 'أحمد السائق',
    status: 'available',
    statusText: 'متاح',
    location: 'حي الربوة',
    lat: 24.7589,
    lng: 46.6542,
  },
  {
    id: 5,
    name: 'عبدالله السائق',
    status: 'busy',
    statusText: 'في مهمة',
    location: 'حي السليمانية',
    lat: 24.6980,
    lng: 46.6814,
  },
])

function focusDriver(driver: any) {
  console.log('Focus on driver:', driver.name)
  // TODO: Pan and zoom map to driver location
}
</script>

<style scoped>
.map-container {
  height: 600px;
  position: relative;
  background-color: #E8EAF6;
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.map-controls {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.border-b {
  border-bottom: 1px solid #E0E0E0;
}
</style>
