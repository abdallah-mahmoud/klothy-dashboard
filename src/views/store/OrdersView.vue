<template>
  <div>
    <h1 class="text-h4 font-weight-bold mb-6 text-secondary">سجل الطلبات</h1>

    <!-- Search & Filters -->
    <v-card class="mb-4" elevation="0" border>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="بحث برقم الطلب أو اسم العميل"
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
              label="حالة الطلب"
              variant="outlined"
              density="compact"
              hide-details
              prepend-inner-icon="mdi-filter-variant"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Orders Table -->
    <v-card class="modern-card" elevation="0" border>
      <v-data-table
        :headers="headers"
        :items="filteredOrders"
        :search="searchQuery"
        hover
        class="rounded-lg"
      >
        <!-- Status Column -->
        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            variant="flat"
            class="font-weight-medium"
          >
            {{ getStatusText(item.status) }}
          </v-chip>
        </template>

        <!-- Total Column -->
        <template #item.total="{ item }">
          <span class="font-weight-bold">{{ item.total }} ر.س</span>
        </template>

        <!-- Empty State -->
        <template #no-data>
          <div class="py-8 text-center">
            <v-icon size="48" color="grey-lighten-2" class="mb-2">mdi-file-search-outline</v-icon>
            <div class="text-grey">لا توجد طلبات تطابق بحثك</div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Search & Filter State
const searchQuery = ref('')
const statusFilter = ref('all')

const statusOptions = [
  { title: 'الكل', value: 'all' },
  { title: 'جاهز', value: 'ready' },
  { title: 'مكتمل', value: 'completed' },
  { title: 'جاري الغسيل', value: 'processing' },
]

const headers = [
  { title: 'رقم الطلب', key: 'orderNumber', align: 'start' as const },
  { title: 'العميل', key: 'customer', align: 'start' as const },
  { title: 'عدد الأصناف', key: 'items', align: 'center' as const },
  { title: 'التاريخ', key: 'date', align: 'start' as const },
  { title: 'الإجمالي', key: 'total', align: 'end' as const },
  { title: 'الحالة', key: 'status', align: 'center' as const },
]

const orders = ref([
  {
    id: 1,
    orderNumber: '#ORD-1234',
    customer: 'أحمد محمد',
    items: 4,
    date: '2026-02-01',
    total: '45.00',
    status: 'completed',
    details: [
      { id: 1, name: 'ثوب', service: 'غسيل وكوي', qty: 4, price: '11.00', total: '44.00' }
    ]
  },
  {
    id: 2,
    orderNumber: '#ORD-1235',
    customer: 'سارة خالد',
    items: 2,
    date: '2026-02-01',
    total: '28.00',
    status: 'ready'
  },
  {
    id: 3,
    orderNumber: '#ORD-1236',
    customer: 'فيصل عبدالله',
    items: 6,
    date: '2026-01-31',
    total: '85.00',
    status: 'processing'
  },
  {
    id: 4,
    orderNumber: '#ORD-1230',
    customer: 'نورة السعيد',
    items: 3,
    date: '2026-01-30',
    total: '32.00',
    status: 'completed'
  },
   {
    id: 5,
    orderNumber: '#ORD-1229',
    customer: 'محمد العمري',
    items: 12,
    date: '2026-01-29',
    total: '150.00',
    status: 'completed'
  },
])

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    if (statusFilter.value !== 'all' && order.status !== statusFilter.value) return false
    return true
  })
})

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    completed: 'grey',
    ready: 'success',
    processing: 'blue',
    incoming: 'orange'
  }
  return colors[status] || 'grey'
}

function getStatusText(status: string) {
  const texts: Record<string, string> = {
    completed: 'مكتمل',
    ready: 'جاهز',
    processing: 'جاري العمل',
    incoming: 'جديد'
  }
  return texts[status] || status
}
</script>
