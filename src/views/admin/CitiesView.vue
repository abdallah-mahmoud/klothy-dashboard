<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-secondary mb-1">إدارة المدن</h1>
        <p class="text-grey">إضافة وتعديل المدن المتاحة في المنصة</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog(null)">إضافة مدينة</v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="4">
        <v-card elevation="0" border class="modern-card">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey mb-1">إجمالي المدن</div>
                <div class="text-h4 font-weight-bold text-primary">{{ cities.length }}</div>
              </div>
              <v-avatar color="primary" variant="tonal" size="56">
                <v-icon size="28">mdi-city</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card elevation="0" border class="modern-card">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey mb-1">المدن النشطة</div>
                <div class="text-h4 font-weight-bold text-success">{{ activeCities }}</div>
              </div>
              <v-avatar color="success" variant="tonal" size="56">
                <v-icon size="28">mdi-check-circle</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card elevation="0" border class="modern-card">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey mb-1">إجمالي المغاسل</div>
                <div class="text-h4 font-weight-bold text-secondary">{{ totalLaundries }}</div>
              </div>
              <v-avatar color="blue" variant="tonal" size="56">
                <v-icon size="28">mdi-store</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Cities Table -->
    <v-card elevation="0" border class="modern-card">
      <v-card-title class="d-flex align-center pa-4 border-b">
        <v-icon class="ml-2">mdi-city-variant</v-icon>
        <span class="font-weight-bold">قائمة المدن</span>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          placeholder="بحث في المدن..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width: 300px"
          clearable
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="cities"
        :search="search"
        class="elevation-0"
        :items-per-page="10"
      >
        <!-- City Name Column -->
        <template #item.name="{ item }">
          <div class="py-2">
            <div class="font-weight-bold">{{ item.nameAr }}</div>
            <div class="text-caption text-grey" dir="ltr">{{ item.nameEn }}</div>
          </div>
        </template>

        <!-- Active Laundries Column -->
        <template #item.activeLaundries="{ item }">
          <v-chip size="small" color="primary" variant="tonal">
            {{ item.activeLaundries }} مغسلة
          </v-chip>
        </template>

        <!-- Total Laundries Column -->
        <template #item.totalLaundries="{ item }">
          <span class="font-weight-bold">{{ item.totalLaundries }}</span>
        </template>

        <!-- Status Column -->
        <template #item.status="{ item }">
          <v-chip
            :color="item.status === 'active' ? 'success' : 'error'"
            size="small"
            variant="flat"
          >
            <v-icon start size="small">
              {{ item.status === 'active' ? 'mdi-check-circle' : 'mdi-circle-off-outline' }}
            </v-icon>
            {{ item.status === 'active' ? 'نشطة' : 'معطلة' }}
          </v-chip>
        </template>

        <!-- Actions Column -->
        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            color="primary"
            size="small"
            @click="openDialog(item)"
          ></v-btn>
        </template>

        <!-- Empty State -->
        <template #no-data>
          <div class="py-8 text-center">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-city</v-icon>
            <div class="text-h6 text-grey mb-2">لا توجد مدن</div>
            <div class="text-caption text-grey">ابدأ بإضافة مدينة جديدة</div>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit City Dialog -->
    <CityDialog
      v-model="showDialog"
      :item="editedItem"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CityDialog from '@/components/admin/CityDialog.vue'

const search = ref('')
const showDialog = ref(false)
const editedItem = ref<any>(null)

const headers = [
  { title: 'المدينة', key: 'name', align: 'start' as const },
  { title: 'المغاسل النشطة', key: 'activeLaundries', align: 'center' as const },
  { title: 'إجمالي المغاسل', key: 'totalLaundries', align: 'center' as const },
  { title: 'الحالة', key: 'status', align: 'center' as const },
  { title: 'الإجراءات', key: 'actions', align: 'center' as const, sortable: false },
]

const cities = ref([
  { id: 1, nameAr: 'الرياض', nameEn: 'Riyadh', activeLaundries: 12, totalLaundries: 15, status: 'active' },
  { id: 2, nameAr: 'جدة', nameEn: 'Jeddah', activeLaundries: 8, totalLaundries: 10, status: 'active' },
  { id: 3, nameAr: 'الدمام', nameEn: 'Dammam', activeLaundries: 5, totalLaundries: 7, status: 'active' },
  { id: 4, nameAr: 'الخبر', nameEn: 'Khobar', activeLaundries: 4, totalLaundries: 5, status: 'active' },
  { id: 5, nameAr: 'مكة المكرمة', nameEn: 'Makkah', activeLaundries: 6, totalLaundries: 8, status: 'active' },
  { id: 6, nameAr: 'المدينة المنورة', nameEn: 'Madinah', activeLaundries: 0, totalLaundries: 2, status: 'inactive' },
])

const activeCities = computed(() => cities.value.filter(c => c.status === 'active').length)
const totalLaundries = computed(() => cities.value.reduce((sum, c) => sum + c.totalLaundries, 0))

function openDialog(item: any = null) {
  editedItem.value = item
  showDialog.value = true
}

function handleSave(item: any) {
  if (item.id) {
    // Edit Mode
    const index = cities.value.findIndex(c => c.id === item.id)
    if (index !== -1) {
      cities.value[index] = { ...cities.value[index], ...item }
    }
  } else {
    // Add Mode
    const newId = Math.max(...cities.value.map(c => c.id)) + 1
    cities.value.unshift({
      ...item,
      id: newId,
      activeLaundries: 0,
      totalLaundries: 0
    })
  }
}
</script>
