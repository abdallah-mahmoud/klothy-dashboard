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
        :loading="loading"
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
            <div class="text-caption text-grey">{{ item.location }}</div>
          </div>
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <v-chip
            color="success"
            size="small"
          >
            <v-icon start size="12">mdi-circle</v-icon>
            مفتوح
          </v-chip>
        </template>

        <!-- Stats -->
        <template #item.stats="{ item }">
          <div class="text-caption">
            <div>طلبات: <strong>{{ item.totalOrders }}</strong></div>
            <div class="text-grey">نشط: {{ item.activeDrivers }}</div>
          </div>
        </template>

        <!-- Financials -->
        <template #item.financials="{ item }">
          <div class="text-caption">
            <div class="d-flex align-center justify-space-between mb-1">
              <span class="text-primary font-weight-bold">
                {{ formatCurrency(item.laundryRevenue) }}
              </span>
              <v-btn
                v-if="item.laundryRevenue > 0"
                size="x-small"
                color="primary"
                variant="text"
                class="px-1"
                @click="handleSettleLaundry(item)"
              >
                سداد
              </v-btn>
              <v-icon
                v-else
                color="success"
                size="small"
                icon="mdi-check-circle"
              ></v-icon>
            </div>
            <div class="d-flex align-center justify-space-between">
              <span class="text-secondary font-weight-bold">
                {{ formatCurrency(item.driverRevenue) }}
              </span>
              <v-btn
                v-if="item.driverRevenue > 0"
                size="x-small"
                color="secondary"
                variant="text"
                class="px-1"
                @click="handleSettleDrivers(item)"
              >
                سداد
              </v-btn>
              <v-icon
                v-else
                color="success"
                size="small"
                icon="mdi-check-circle"
              ></v-icon>
            </div>
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
import { useLaundryFacilities } from '@/composables/useLaundryFacilities'
import { useConfirm } from '@/composables/useConfirm'
import { useNotification } from '@/composables/useNotification'

const { laundries, loading, settleLaundryRevenue, settleDriverRevenue } = useLaundryFacilities()
const { confirm } = useConfirm()
const { showSuccess } = useNotification()

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
  { title: 'الحالة', key: 'status', align: 'start' as const },
  { title: 'الإحصائيات', key: 'stats', align: 'start' as const },
  { title: 'المستحقات المالية', key: 'financials', align: 'start' as const, width: '200px' },
  { title: 'الإجراءات', key: 'actions', sortable: false, align: 'center' as const },
]

const filteredLaundries = computed(() => {
  let result = laundries.value

  // Filter by status (mock implementation since store doesn't have open/close status yet)
  if (statusFilter.value === 'closed') {
    return []
  }

  // Filter by city
  if (cityFilter.value !== 'all') {
    result = result.filter(
      (l) => l.city.toLowerCase() === cityFilter.value.toLowerCase()
    )
  }

  return result
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0
  }).format(amount)
}

const handleSettleLaundry = async (laundry: any) => {
  const confirmed = await confirm({
    title: 'سداد مستحقات المغسلة',
    message: `هل أنت متأكد من سداد مبلغ ${formatCurrency(laundry.laundryRevenue)} لـ ${laundry.name}؟`,
    confirmText: 'تأكيد السداد',
    confirmColor: 'primary'
  })

  if (confirmed) {
    const success = await settleLaundryRevenue(laundry.id)
    if (success) {
      showSuccess('تم تسجيل السداد بنجاح')
    }
  }
}

const handleSettleDrivers = async (laundry: any) => {
  const confirmed = await confirm({
    title: 'سداد مستحقات المناديب',
    message: `هل أنت متأكد من سداد مبلغ ${formatCurrency(laundry.driverRevenue)} لمناديب ${laundry.name}؟`,
    confirmText: 'تأكيد السداد',
    confirmColor: 'secondary'
  })

  if (confirmed) {
    const success = await settleDriverRevenue(laundry.id)
    if (success) {
      showSuccess('تم تسجيل السداد بنجاح')
    }
  }
}

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
