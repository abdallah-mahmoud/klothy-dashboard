<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-secondary mb-1">إدارة الخدمات</h1>
        <p class="text-grey">التحكم في قائمة الخدمات والأسعار</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog(null)">إضافة خدمة جديدة</v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card class="modern-card pa-4" elevation="0" border>
          <div class="d-flex align-center">
            <v-avatar color="blue-lighten-5" size="48" class="ml-3">
              <v-icon color="blue" size="24">mdi-tshirt-crew</v-icon>
            </v-avatar>
            <div>
              <div class="text-caption text-grey">إجمالي الخدمات</div>
              <div class="text-h5 font-weight-bold">{{ services.length }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="modern-card pa-4" elevation="0" border>
          <div class="d-flex align-center">
            <v-avatar color="green-lighten-5" size="48" class="ml-3">
              <v-icon color="green" size="24">mdi-check-circle</v-icon>
            </v-avatar>
            <div>
              <div class="text-caption text-grey">الخدمات النشطة</div>
              <div class="text-h5 font-weight-bold">{{ activeServices }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="modern-card pa-4" elevation="0" border>
          <div class="d-flex align-center">
            <v-avatar color="orange-lighten-5" size="48" class="ml-3">
              <v-icon color="orange" size="24">mdi-tag-outline</v-icon>
            </v-avatar>
            <div>
              <div class="text-caption text-grey">الفئات</div>
              <div class="text-h5 font-weight-bold">4</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Services Table -->
    <v-card class="modern-card" elevation="0" border>
      <v-card-title class="px-4 pt-4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="بحث عن خدمة..."
          single-line
          hide-details
          variant="outlined"
          density="compact"
          class="mb-4"
          style="max-width: 400px"
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="services"
        :search="search"
        hover
      >
        <!-- Service Name & Category -->
        <template #item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar rounded="lg" color="grey-lighten-4" size="40" class="ml-3">
              <v-icon :color="getCategoryColor(item.category)">{{ getCategoryIcon(item.category) }}</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-bold">{{ item.name }}</div>
              <div class="text-caption text-grey">{{ item.category }}</div>
            </div>
          </div>
        </template>

        <!-- Price -->
        <template #item.price="{ item }">
          <span class="font-weight-bold text-primary">{{ item.price }} ر.س</span>
        </template>

        <!-- Status Toggle -->
        <template #item.active="{ item }">
          <v-switch
            v-model="item.active"
            color="success"
            hide-details
            density="compact"
            inset
            @change="handleStatusChange(item)"
          ></v-switch>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <v-btn icon size="small" variant="text" color="grey" @click="editService(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Service Dialog -->
    <StoreServiceDialog
      v-model="showDialog"
      :item="editedItem"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StoreServiceDialog from '@/components/store/StoreServiceDialog.vue'

const search = ref('')
const showDialog = ref(false)
const editedItem = ref<any>(null)

const headers = [
  { title: 'الخدمة', key: 'name', align: 'start' as const },
  { title: 'السعر الأساسي', key: 'price', align: 'start' as const },
  { title: 'مدة الخدمة', key: 'duration', align: 'start' as const },
  { title: 'الحالة (متاح/غير متاح)', key: 'active', align: 'center' as const },
  { title: '', key: 'actions', align: 'end' as const, sortable: false },
]

const services = ref([
  { id: 1, name: 'ثوب', category: 'ملابس رجالية', price: 8, duration: '24 ساعة', active: true },
  { id: 2, name: 'شماغ', category: 'ملابس رجالية', price: 5, duration: '24 ساعة', active: true },
  { id: 3, name: 'فستان ناعم', category: 'ملابس نسائية', price: 25, duration: '48 ساعة', active: true },
  { id: 4, name: 'عباية', category: 'ملابس نسائية', price: 15, duration: '24 ساعة', active: true },
  { id: 5, name: 'بدلة رسمية', category: 'غسيل جاف', price: 35, duration: '48 ساعة', active: false },
  { id: 6, name: 'قميص', category: 'ملابس رجالية', price: 7, duration: '24 ساعة', active: true },
  { id: 7, name: 'بنطلون', category: 'ملابس رجالية', price: 9, duration: '24 ساعة', active: true },
  { id: 8, name: 'بطانية (مفرد)', category: 'مفروشات', price: 40, duration: '72 ساعة', active: true },
  { id: 9, name: 'بطانية (مزدوج)', category: 'مفروشات', price: 60, duration: '72 ساعة', active: false },
])

const activeServices = computed(() => services.value.filter(s => s.active).length)

function getCategoryColor(category: string) {
  if (category.includes('رجالية')) return 'blue'
  if (category.includes('نسائية')) return 'pink'
  if (category.includes('مفروشات')) return 'purple'
  return 'grey'
}

function getCategoryIcon(category: string) {
  if (category.includes('رجالية')) return 'mdi-tshirt-crew'
  if (category.includes('نسائية')) return 'mdi-human-female'
  if (category.includes('مفروشات')) return 'mdi-bed'
  return 'mdi-hanger'
}

function handleStatusChange(item: any) {
  // In real app, API call here
  console.log('Status changed:', item.name, item.active)
}

function openDialog(item: any = null) {
  editedItem.value = item
  showDialog.value = true
}

function handleSave(item: any) {
  if (item.id) {
    // Edit Mode
    const index = services.value.findIndex(s => s.id === item.id)
    if (index !== -1) {
      services.value[index] = item
    }
  } else {
    // Add Mode
    const newId = Math.max(...services.value.map(s => s.id)) + 1
    services.value.unshift({ ...item, id: newId })
  }
}

function editService(item: any) {
  openDialog(item)
}
</script>
