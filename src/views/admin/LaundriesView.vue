<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2" style="color: #1A237E">
          إدارة المغاسل
        </h1>
        <p class="text-grey-darken-1">إدارة المغاسل المسجلة في المنصة</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus">
        إضافة مغسلة جديدة
      </v-btn>
    </div>

    <!-- Search and Filters -->
    <v-card class="mb-4" elevation="1">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              placeholder="البحث باسم المغسلة أو الموقع"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="حالة المغسلة"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="cityFilter"
              :items="cityOptions"
              label="المدينة"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Laundries Data Table -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="filteredLaundries"
        :search="searchQuery"
        :items-per-page="15"
        class="elevation-0"
      >
        <!-- Laundry Name -->
        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="40" color="primary" class="ml-3">
              <v-icon color="white">mdi-store</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-bold">{{ item.name }}</div>
              <div class="text-caption text-grey">ID: {{ item.id }}</div>
            </div>
          </div>
        </template>

        <!-- Location -->
        <template #item.location="{ item }">
          <div>
            <div class="text-body-2">{{ item.city }}</div>
            <div class="text-caption text-grey">{{ item.district }}</div>
          </div>
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <v-chip
            :color="item.isOpen ? 'green' : 'grey'"
            size="small"
          >
            <v-icon start size="12">mdi-circle</v-icon>
            {{ item.isOpen ? 'مفتوح' : 'مغلق' }}
          </v-chip>
        </template>

        <!-- Rating -->
        <template #item.rating="{ item }">
          <div class="d-flex align-center">
            <v-icon color="amber" size="16" class="ml-1">mdi-star</v-icon>
            <span class="font-weight-bold">{{ item.rating }}</span>
            <span class="text-caption text-grey mr-1">({{ item.reviewCount }})</span>
          </div>
        </template>

        <!-- Stats -->
        <template #item.stats="{ item }">
          <div class="text-caption">
            <div>طلبات نشطة: <strong>{{ item.activeOrders }}</strong></div>
            <div class="text-grey">مكتمل: {{ item.completedOrders }}</div>
          </div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" size="small"></v-btn>
            </template>
            <v-list>
              <v-list-item prepend-icon="mdi-eye" @click="viewLaundry(item)">
                <v-list-item-title>عرض التفاصيل</v-list-item-title>
              </v-list-item>
              <v-list-item prepend-icon="mdi-pencil" @click="editLaundry(item)">
                <v-list-item-title>تعديل</v-list-item-title>
              </v-list-item>
              <v-list-item prepend-icon="mdi-map-marker" @click="viewOnMap(item)">
                <v-list-item-title>عرض على الخريطة</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                prepend-icon="mdi-block-helper"
                class="text-error"
                @click="suspendLaundry(item)"
              >
                <v-list-item-title>إيقاف مؤقت</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const statusFilter = ref('all')
const cityFilter = ref('all')

const statusOptions = [
  { title: 'الكل', value: 'all' },
  { title: 'مفتوح', value: 'open' },
  { title: 'مغلق', value: 'closed' },
]

const cityOptions = [
  { title: 'جميع المدن', value: 'all' },
  { title: 'الرياض', value: 'riyadh' },
  { title: 'جدة', value: 'jeddah' },
  { title: 'الدمام', value: 'dammam' },
]

const headers = [
  { title: 'المغسلة', key: 'name', align: 'start' as const },
  { title: 'الموقع', key: 'location', align: 'start' as const },
  { title: 'رقم الهاتف', key: 'phone', align: 'start' as const },
  { title: 'الحالة', key: 'status', align: 'start' as const },
  { title: 'التقييم', key: 'rating', align: 'start' as const },
  { title: 'الإحصائيات', key: 'stats', align: 'start' as const },
  { title: 'الإجراءات', key: 'actions', sortable: false, align: 'center' as const },
]

const laundries = ref([
  {
    id: 'L001',
    name: 'مغسلة النظافة',
    city: 'الرياض',
    district: 'حي النخيل',
    phone: '+966 11 234 5678',
    isOpen: true,
    rating: 4.8,
    reviewCount: 145,
    activeOrders: 12,
    completedOrders: 234,
  },
  {
    id: 'L002',
    name: 'مغسلة الأناقة',
    city: 'الرياض',
    district: 'حي العليا',
    phone: '+966 11 345 6789',
    isOpen: true,
    rating: 4.9,
    reviewCount: 198,
    activeOrders: 8,
    completedOrders: 312,
  },
  {
    id: 'L003',
    name: 'مغسلة الفخامة',
    city: 'الرياض',
    district: 'حي الملز',
    phone: '+966 11 456 7890',
    isOpen: false,
    rating: 4.7,
    reviewCount: 123,
    activeOrders: 0,
    completedOrders: 189,
  },
  {
    id: 'L004',
    name: 'مغسلة السرعة',
    city: 'جدة',
    district: 'حي الروضة',
    phone: '+966 12 567 8901',
    isOpen: true,
    rating: 4.6,
    reviewCount: 87,
    activeOrders: 15,
    completedOrders: 156,
  },
  {
    id: 'L005',
    name: 'مغسلة الجودة',
    city: 'جدة',
    district: 'حي الزهراء',
    phone: '+966 12 678 9012',
    isOpen: true,
    rating: 4.9,
    reviewCount: 210,
    activeOrders: 10,
    completedOrders: 378,
  },
])

const filteredLaundries = computed(() => {
  let result = laundries.value

  // Filter by status
  if (statusFilter.value === 'open') {
    result = result.filter((l) => l.isOpen)
  } else if (statusFilter.value === 'closed') {
    result = result.filter((l) => !l.isOpen)
  }

  // Filter by city
  if (cityFilter.value !== 'all') {
    result = result.filter(
      (l) => l.city.toLowerCase() === cityFilter.value.toLowerCase()
    )
  }

  return result
})

function viewLaundry(laundry: any) {
  console.log('View laundry:', laundry.name)
  // TODO: Open laundry detail dialog
}

function editLaundry(laundry: any) {
  console.log('Edit laundry:', laundry.name)
  // TODO: Open edit dialog
}

function viewOnMap(laundry: any) {
  console.log('View on map:', laundry.name)
  // TODO: Navigate to live map with laundry focused
}

function suspendLaundry(laundry: any) {
  console.log('Suspend laundry:', laundry.name)
  // TODO: Show confirmation dialog
}
</script>
