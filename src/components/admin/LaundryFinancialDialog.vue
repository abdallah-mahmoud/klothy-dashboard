<template>
  <v-dialog v-model="dialogVisible" max-width="900" scrollable>
    <v-card v-if="laundry">
      <!-- Header with IBAN -->
      <v-toolbar color="primary" theme="dark" class="px-4">
        <v-toolbar-title class="font-weight-bold">
          <div class="text-h6">{{ laundry.name }}</div>
          <div class="text-caption" dir="ltr">IBAN: {{ laundry.iban || 'SA84 8000 0000 6080 1010 1234' }}</div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" @click="dialogVisible = false"></v-btn>
      </v-toolbar>

      <v-card-text class="pa-0">
        <v-container class="pa-4">
          <!-- Date Range Filter -->
          <v-card elevation="0" border class="mb-4">
            <v-card-text>
              <v-row align="center">
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="dateRange.start"
                    type="date"
                    label="من تاريخ"
                    variant="outlined"
                    density="compact"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="dateRange.end"
                    type="date"
                    label="إلى تاريخ"
                    variant="outlined"
                    density="compact"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-btn color="primary" block @click="applyFilter">عرض</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- KPI Cards -->
          <v-row class="mb-4">
            <v-col cols="12" sm="6" md="3">
              <v-card elevation="2" class="text-center pa-4" color="blue-lighten-5">
                <v-icon color="blue" size="32" class="mb-2">mdi-clipboard-list</v-icon>
                <div class="text-caption text-grey mb-1">عدد الطلبات</div>
                <div class="text-h5 font-weight-bold text-blue">{{ metrics.ordersCount }}</div>
                <div class="text-caption">طلب</div>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card elevation="2" class="text-center pa-4" color="green-lighten-5">
                <v-icon color="green" size="32" class="mb-2">mdi-cash-multiple</v-icon>
                <div class="text-caption text-grey mb-1">إجمالي الإيرادات</div>
                <div class="text-h5 font-weight-bold text-green">{{ metrics.totalRevenue }}</div>
                <div class="text-caption">ريال سعودي</div>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card elevation="2" class="text-center pa-4" color="cyan-lighten-5">
                <v-icon color="cyan" size="32" class="mb-2">mdi-percent</v-icon>
                <div class="text-caption text-grey mb-1">عمولة كلوثي</div>
                <div class="text-h5 font-weight-bold text-cyan">{{ commissionAmount }}</div>
                <div class="text-caption">{{ (metrics.commissionRate * 100).toFixed(0) }}٪ ({{ commissionAmount }} ر.س)</div>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card elevation="2" class="text-center pa-4" color="purple-lighten-5">
                <v-icon color="purple" size="32" class="mb-2">mdi-bank-transfer</v-icon>
                <div class="text-caption text-grey mb-1">المستحق للمغسلة</div>
                <div class="text-h5 font-weight-bold text-purple">{{ netAmount }}</div>
                <div class="text-caption">ريال سعودي</div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Settlement History Table -->
          <v-card elevation="0" border>
            <v-card-title class="bg-grey-lighten-4 border-b font-weight-bold">
              <v-icon class="ml-2">mdi-history</v-icon>
              سجل التحويلات
            </v-card-title>
            <v-data-table
              :headers="settlementHeaders"
              :items="settlements"
              :items-per-page="5"
              class="elevation-0"
            >
              <!-- Date Column -->
              <template #item.date="{ item }">
                <div class="font-weight-bold">{{ formatDate(item.date) }}</div>
              </template>

              <!-- Revenue Column -->
              <template #item.revenue="{ item }">
                <span class="font-weight-bold text-green">{{ item.revenue.toLocaleString() }} ر.س</span>
              </template>

              <!-- Commission Column -->
              <template #item.commission="{ item }">
                <div>
                  <div class="font-weight-bold text-cyan">{{ item.commission.toLocaleString() }} ر.س</div>
                  <div class="text-caption text-grey">{{ (item.commission / item.revenue * 100).toFixed(0) }}٪</div>
                </div>
              </template>

              <!-- Net Amount Column -->
              <template #item.netAmount="{ item }">
                <span class="font-weight-bold text-purple">{{ item.netAmount.toLocaleString() }} ر.س</span>
              </template>

              <!-- Status Column -->
              <template #item.status="{ item }">
                <v-chip
                  :color="item.status === 'paid' ? 'success' : 'warning'"
                  size="small"
                  variant="flat"
                >
                  <v-icon start size="small">
                    {{ item.status === 'paid' ? 'mdi-check-circle' : 'mdi-clock-outline' }}
                  </v-icon>
                  {{ item.status === 'paid' ? 'تم السداد' : 'معلق' }}
                </v-chip>
              </template>

              <!-- Actions Column -->
              <template #item.actions="{ item }">
                <v-btn
                  v-if="item.status === 'pending'"
                  color="success"
                  size="small"
                  variant="flat"
                  @click="markAsPaid(item)"
                >
                  تعيين كمدفوع
                </v-btn>
                <v-chip v-else color="success" size="small" variant="tonal">
                  <v-icon start size="small">mdi-check</v-icon>
                  مدفوع
                </v-chip>
              </template>
            </v-data-table>
          </v-card>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="outlined" @click="dialogVisible = false">إغلاق</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  laundry: any
}>()

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const dateRange = ref({
  start: '2026-01-01',
  end: '2026-01-31'
})

const metrics = ref({
  ordersCount: 45,
  totalRevenue: 2000,
  commissionRate: 0.20
})

const commissionAmount = computed(() => {
  return (metrics.value.totalRevenue * metrics.value.commissionRate).toLocaleString()
})

const netAmount = computed(() => {
  return (metrics.value.totalRevenue - (metrics.value.totalRevenue * metrics.value.commissionRate)).toLocaleString()
})

const settlementHeaders = [
  { title: 'التاريخ', key: 'date', align: 'start' as const },
  { title: 'الإيرادات', key: 'revenue', align: 'center' as const },
  { title: 'العمولة', key: 'commission', align: 'center' as const },
  { title: 'الصافي', key: 'netAmount', align: 'center' as const },
  { title: 'الحالة', key: 'status', align: 'center' as const },
  { title: 'الإجراءات', key: 'actions', align: 'center' as const, sortable: false },
]

const settlements = ref([
  {
    id: 1,
    date: '2026-01-28',
    revenue: 2000,
    commission: 400,
    netAmount: 1600,
    status: 'paid'
  },
  {
    id: 2,
    date: '2026-01-21',
    revenue: 1800,
    commission: 360,
    netAmount: 1440,
    status: 'paid'
  },
  {
    id: 3,
    date: '2026-01-14',
    revenue: 2200,
    commission: 440,
    netAmount: 1760,
    status: 'pending'
  },
])

function applyFilter() {
  // In real app, fetch data based on dateRange
  console.log('Filtering from', dateRange.value.start, 'to', dateRange.value.end)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function markAsPaid(settlement: any) {
  settlement.status = 'paid'
}
</script>
