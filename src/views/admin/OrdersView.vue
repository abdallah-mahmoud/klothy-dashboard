<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2" style="color: #1A237E">
          إدارة الطلبات
        </h1>
        <p class="text-grey-darken-1">إدارة ومتابعة جميع الطلبات</p>
      </div>
      <div class="d-flex gap-2">
        <!-- Filter Presets -->
        <FilterPresetManager
          :saved-presets="savedPresets"
          @apply-preset="handleApplyPreset"
          @delete-preset="handleDeletePreset"
          @save-current="showSavePresetDialog = true"
        />

        <!-- Advanced Filters -->
        <v-btn
          color="primary"
          prepend-icon="mdi-filter-variant"
          variant="outlined"
          @click="showFilters = true"
        >
          فلاتر
          <v-badge
            v-if="activeFiltersCount > 0"
            :content="activeFiltersCount"
            color="error"
            inline
            class="mr-2"
          />
        </v-btn>

        <!-- Export -->
        <v-btn
          color="secondary"
          prepend-icon="mdi-download"
          variant="outlined"
          aria-label="تصدير قائمة الطلبات"
          @click="showExportDialog = true"
        >
          تصدير
        </v-btn>
      </div>
    </div>

    <!-- Active Filters Chips -->
    <v-chip-group v-if="activeFiltersCount > 0" class="mb-4">
      <v-chip
        v-for="filter in activeFiltersList"
        :key="filter.key"
        closable
        color="primary"
        variant="outlined"
        @click:close="removeFilter(filter.key)"
      >
        {{ filter.label }}: {{ filter.value }}
      </v-chip>
    </v-chip-group>

    <!-- Filter Tabs and Search -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <v-row align="center">
          <!-- Filter Tabs -->
          <v-col cols="12" md="8">
            <v-chip-group v-model="selectedStatus" mandatory>
              <v-chip
                v-for="status in statusFilters"
                :key="status.value"
                :value="status.value"
                :color="selectedStatus === status.value ? 'primary' : 'default'"
                filter
              >
                {{ status.label }}
                <v-badge
                  v-if="status.count"
                  :content="status.count"
                  inline
                  color="secondary"
                  class="mr-2"
                ></v-badge>
              </v-chip>
            </v-chip-group>
          </v-col>

          <!-- Search -->
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              placeholder="البحث برقم الطلب أو اسم العميل"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Orders Table -->
    <v-card elevation="2">
      <!-- Bulk Actions Toolbar -->
      <v-toolbar
        v-if="selectedOrders.length > 0"
        color="primary"
        dark
        density="comfortable"
      >
        <v-toolbar-title>
          {{ selectedOrders.length }} طلب محدد
        </v-toolbar-title>
        <v-spacer />
        
        <v-btn
          icon="mdi-printer"
          @click="bulkPrint"
          aria-label="طباعة الطلبات المحددة"
        />
        <v-btn
          icon="mdi-download"
          @click="bulkExport"
          aria-label="تصدير الطلبات المحددة"
        />
        <v-btn
          icon="mdi-close-circle"
          @click="bulkCancel"
          aria-label="إلغاء الطلبات المحددة"
        />
        <v-btn
          icon="mdi-close"
          @click="selectedOrders = []"
          aria-label="إلغاء التحديد"
        />
      </v-toolbar>

      <!-- Loading State -->
      <div v-if="loading" class="pa-4">
        <SkeletonLoader type="table" :rows="10" :columns="7" />
      </div>

      <!-- Error State -->
      <ErrorState
        v-else-if="error"
        type="network"
        :retryable="true"
        @retry="loadOrders"
      />

      <!-- Empty State (No Results) -->
      <EmptyState
        v-else-if="filteredOrders.length === 0 && searchQuery"
        icon="mdi-magnify-close"
        title="لا توجد نتائج"
        :message="`لا توجد طلبات تطابق البحث عن '${searchQuery}'`"
      />

      <!-- Empty State (No Orders) -->
      <EmptyState
        v-else-if="filteredOrders.length === 0"
        icon="mdi-clipboard-text-off"
        title="لا توجد طلبات"
        message="لم يتم إنشاء أي طلبات بعد. ابدأ بإضافة طلب جديد"
        action-text="إضافة طلب جديد"
        action-icon="mdi-plus"
        @action="addNewOrder"
      />

      <!-- Data Table -->
      <v-data-table
        v-else
        v-model="selectedOrders"
        :headers="headers"
        :items="filteredOrders"
        :search="searchQuery"
        :items-per-page="20"
        :loading="loading"
        show-select
        item-value="id"
        class="elevation-0"
      >
        <!-- Order Number -->
        <template #item.orderNumber="{ item }">
          <router-link
            :to="`/admin/orders/${item.id}`"
            class="text-decoration-none font-weight-bold"
            style="color: #00E5FF"
          >
            {{ item.orderNumber }}
          </router-link>
        </template>

        <!-- Customer -->
        <template #item.client="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" color="primary" class="ml-3">
              <span class="text-white text-caption">
                {{ item.client[0] }}
              </span>
            </v-avatar>
            <span>{{ item.client }}</span>
          </div>
        </template>

        <!-- Driver -->
        <template #item.driver="{ item }">
          <span v-if="item.driver" class="text-grey-darken-2">
            {{ item.driver }}
          </span>
          <v-chip v-else color="error" size="small" variant="outlined">
            غير معين
          </v-chip>
        </template>

        <!-- Amount -->
        <template #item.amount="{ item }">
          <span class="font-weight-bold">{{ item.amount }} ر.س</span>
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" size="small">
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Date -->
        <template #item.createdAt="{ item }">
          <div class="text-caption">
            {{ formatDate(item.createdAt) }}
          </div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" size="small" aria-label="قائمة إجراءات الطلب"></v-btn>
            </template>
            <v-list>
              <v-list-item :to="`/admin/orders/${item.id}`" prepend-icon="mdi-eye">
                <v-list-item-title>عرض التفاصيل</v-list-item-title>
              </v-list-item>
              <v-list-item prepend-icon="mdi-printer" @click="printInvoice(item)">
                <v-list-item-title>طباعة الفاتورة</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                prepend-icon="mdi-cancel"
                class="text-error"
                @click="cancelOrder(item)"
              >
                <v-list-item-title>إلغاء الطلب</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <!-- No data -->
        <template #no-data>
          <div class="text-center pa-8">
            <v-icon size="64" color="grey-lighten-2">mdi-clipboard-text-off</v-icon>
            <p class="text-h6 text-grey mt-4">لا توجد طلبات</p>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Filter Panel -->
    <FilterPanel
      v-model="showFilters"
      @apply="applyFilters"
      @clear="clearFilters"
    >
      <!-- Date Range -->
      <div class="mb-4">
        <label class="text-subtitle-2 font-weight-bold mb-2 d-block">التاريخ</label>
        <v-text-field
          v-model="filters.dateFrom"
          label="من تاريخ"
          type="date"
          variant="outlined"
          density="compact"
          hide-details
          class="mb-2"
        />
        <v-text-field
          v-model="filters.dateTo"
          label="إلى تاريخ"
          type="date"
          variant="outlined"
          density="compact"
          hide-details
        />
      </div>

      <!-- Price Range -->
      <div class="mb-4">
        <label class="text-subtitle-2 font-weight-bold mb-2 d-block">
          نطاق السعر ({{ filters.priceRange[0] }} - {{ filters.priceRange[1] }} ر.س)
        </label>
        <v-range-slider
          v-model="filters.priceRange"
          :min="0"
          :max="1000"
          :step="50"
          color="primary"
          hide-details
        />
      </div>

      <!-- Amount Filter -->
      <div class="mb-4">
        <label class="text-subtitle-2 font-weight-bold mb-2 d-block">المبلغ الأدنى</label>
        <v-text-field
          v-model.number="filters.minAmount"
          type="number"
          variant="outlined"
          density="compact"
          suffix="ر.س"
          hide-details
        />
      </div>
    </FilterPanel>

    <!-- Save Filter Preset Dialog -->
    <SaveFilterPresetDialog
      v-model="showSavePresetDialog"
      :filter-count="activeFiltersCount"
      @save="handleSavePreset"
    />

    <!-- Export Dialog -->
    <ExportDialog
      v-model="showExportDialog"
      :data="orders"
      filename="orders"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotification } from '@/composables/useNotification'
import { useConfirm } from '@/composables/useConfirm'
import { useFilterPresets } from '@/composables/useFilterPresets'
import SkeletonLoader from '@/components/shared/SkeletonLoader.vue'
import ErrorState from '@/components/shared/ErrorState.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import FilterPanel from '@/components/shared/FilterPanel.vue'
import FilterPresetManager from '@/components/shared/FilterPresetManager.vue'
import SaveFilterPresetDialog from '@/components/shared/SaveFilterPresetDialog.vue'
import ExportDialog from '@/components/shared/ExportDialog.vue'

const { showSuccess, showError, showInfo } = useNotification()
const { confirm } = useConfirm()

// Loading and error states
const loading = ref(true)
const error = ref(false)

// Search and filters
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedOrders = ref<any[]>([])
const showFilters = ref(false)
const showSavePresetDialog = ref(false)
const showExportDialog = ref(false)

// Filter presets
const { savedPresets, addPreset, deletePreset, applyPreset } = useFilterPresets('orders')

// Filter state
const filters = ref<{
  dateFrom: string
  dateTo: string
  priceRange: [number, number]
  minAmount: number
}>({
  dateFrom: '',
  dateTo: '',
  priceRange: [0, 1000],
  minAmount: 0
})

// Status Filters with counts
const statusFilters = ref([
  { label: 'الكل', value: 'all', count: 1012 },
  { label: 'جديد', value: 'new', count: 45 },
  { label: 'جاري التوصيل', value: 'in_delivery', count: 23 },
  { label: 'في المغسلة', value: 'at_store', count: 62 },
  { label: 'مكتمل', value: 'completed', count: 890 },
  { label: 'ملغي', value: 'cancelled', count: 15 },
])

// Table headers
const headers = [
  { title: 'رقم الطلب', key: 'orderNumber', align: 'start' as const },
  { title: 'العميل', key: 'client', align: 'start' as const },
  { title: 'المغسلة', key: 'laundry', align: 'start' as const },
  { title: 'المندوب', key: 'driver', align: 'start' as const },
  { title: 'تاريخ الطلب', key: 'createdAt', align: 'start' as const },
  { title: 'القيمة', key: 'amount', align: 'start' as const },
  { title: 'الحالة', key: 'status', align: 'start' as const },
  { title: 'الإجراءات', key: 'actions', sortable: false, align: 'center' as const },
]

// Mock orders data
const orders = ref([
  {
    id: '1',
    orderNumber: '#ORD-1234',
    client: 'أحمد محمد',
    laundry: 'مغسلة النظافة',
    driver: 'خالد السائق',
    amount: '245.00',
    status: 'جاري الغسيل',
    statusValue: 'at_store',
    createdAt: '2026-01-29T10:30:00',
  },
  {
    id: '2',
    orderNumber: '#ORD-1233',
    client: 'فاطمة علي',
    laundry: 'مغسلة الأناقة',
    driver: null,
    amount: '180.50',
    status: 'جديد',
    statusValue: 'new',
    createdAt: '2026-01-29T11:15:00',
  },
  {
    id: '3',
    orderNumber: '#ORD-1232',
    client: 'خالد سعيد',
    laundry: 'مغسلة الفخامة',
    driver: 'محمد السائق',
    amount: '320.00',
    status: 'مكتمل',
    statusValue: 'completed',
    createdAt: '2026-01-28T14:20:00',
  },
  {
    id: '4',
    orderNumber: '#ORD-1231',
    client: 'نورة عبدالله',
    laundry: 'مغسلة السرعة',
    driver: 'سعد السائق',
    amount: '150.00',
    status: 'جاري التوصيل',
    statusValue: 'in_delivery',
    createdAt: '2026-01-28T09:45:00',
  },
  {
    id: '5',
    orderNumber: '#ORD-1230',
    client: 'سعد حسن',
    laundry: 'مغسلة النظافة',
    driver: 'خالد السائق',
    amount: '295.75',
    status: 'جاري الغسيل',
    statusValue: 'at_store',
    createdAt: '2026-01-28T08:30:00',
  },
  {
    id: '6',
    orderNumber: '#ORD-1229',
    client: 'مريم أحمد',
    laundry: 'مغسلة الجودة',
    driver: null,
    amount: '420.00',
    status: 'جديد',
    statusValue: 'new',
    createdAt: '2026-01-27T16:00:00',
  },
  {
    id: '7',
    orderNumber: '#ORD-1228',
    client: 'عبدالله يوسف',
    laundry: 'مغسلة الأناقة',
    driver: 'محمد السائق',
    amount: '275.50',
    status: 'مكتمل',
    statusValue: 'completed',
    createdAt: '2026-01-27T13:20:00',
  },
  {
    id: '8',
    orderNumber: '#ORD-1227',
    client: 'هند سالم',
    laundry: 'مغسلة النظافة',
    driver: 'سعد السائق',
    amount: '190.00',
    status: 'ملغي',
    statusValue: 'cancelled',
    createdAt: '2026-01-27T11:00:00',
  },
])

// Filtered orders based on status
const filteredOrders = computed(() => {
  if (selectedStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter((order) => order.statusValue === selectedStatus.value)
})

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'جديد': 'orange',
    'جاري الغسيل': 'blue',
    'جاري التوصيل': 'cyan',
    'مكتمل': 'green',
    'ملغي': 'red',
  }
  return colors[status] || 'grey'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return 'اليوم ' + date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
  } else if (days === 1) {
    return 'أمس ' + date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
}

function printInvoice(order: any) {
  console.log('Print invoice for:', order.orderNumber)
  showInfo(`جاري طباعة فاتورة الطلب ${order.orderNumber}...`)
  // TODO: Implement print functionality
}

async function cancelOrder(order: any) {
  const confirmed = await confirm({
    title: 'إلغاء الطلب',
    message: `هل أنت متأكد من إلغاء الطلب ${order.orderNumber}؟ لا يمكن التراجع عن هذا الإجراء.`,
    type: 'danger',
    confirmText: 'إلغاء الطلب',
    confirmColor: 'error'
  })
  
  if (confirmed) {
    try {
      // TODO: Call API to cancel order
      // await api.cancelOrder(order.id)
      
      // Update order status locally
      order.status = 'ملغي'
      order.statusValue = 'cancelled'
      
      showSuccess(`تم إلغاء الطلب ${order.orderNumber} بنجاح`)
    } catch (error) {
      showError('فشل إلغاء الطلب. يرجى المحاولة مرة أخرى.', 'خطأ')
    }
  }
}

// Load orders function (for retry)
const loadOrders = () => {
  loading.value = true
  error.value = false
  
  // Simulate API call
  setTimeout(() => {
    loading.value = false
    // If API call fails, set error.value = true
  }, 1200)
}

// Add new order action
const addNewOrder = () => {
  showInfo('ميزة إضافة طلب جديد قريباً')
  // TODO: Navigate to new order form or open dialog
}

// Bulk Operations
const bulkPrint = async () => {
  showInfo(`طباعة ${selectedOrders.value.length} طلب...`)
  // TODO: Implement bulk print
}

const bulkExport = async () => {
  showSuccess(`تم تصدير ${selectedOrders.value.length} طلب بنجاح`)
  // TODO: Implement bulk export
}

const bulkCancel = async () => {
  const confirmed = await confirm({
    title: 'إلغاء طلبات متعددة',
    message: `هل تريد إلغاء ${selectedOrders.value.length} طلب؟ لا يمكن التراجع عن هذا الإجراء.`,
    type: 'danger',
    confirmText: 'إلغاء الطلبات',
    confirmColor: 'error'
  })
  
  if (confirmed) {
    showSuccess(`تم إلغاء ${selectedOrders.value.length} طلب بنجاح`)
    selectedOrders.value = []
    // TODO: Implement bulk cancel API call
  }
}

// Filter Management
const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.dateFrom) count++
  if (filters.value.dateTo) count++
  if (filters.value.priceRange[0] > 0 || filters.value.priceRange[1] < 1000) count++
  if (filters.value.minAmount > 0) count++
  return count
})

const activeFiltersList = computed(() => {
  const list: Array<{ key: string; label: string; value: string }> = []
  
  if (filters.value.dateFrom) {
    list.push({ key: 'dateFrom', label: 'من تاريخ', value: filters.value.dateFrom })
  }
  if (filters.value.dateTo) {
    list.push({ key: 'dateTo', label: 'إلى تاريخ', value: filters.value.dateTo })
  }
  if (filters.value.priceRange[0] > 0 || filters.value.priceRange[1] < 1000) {
    list.push({
      key: 'priceRange',
      label: 'نطاق السعر',
      value: `${filters.value.priceRange[0]} - ${filters.value.priceRange[1]} ر.س`
    })
  }
  if (filters.value.minAmount > 0) {
    list.push({
      key: 'minAmount',
      label: 'المبلغ الأدنى',
      value: `${filters.value.minAmount} ر.س`
    })
  }
  
  return list
})

const applyFilters = () => {
  showSuccess('تم تطبيق الفلاتر')
  // TODO: Apply filters to orders list
}

// Filter Preset Handlers
const handleSavePreset = (data: { name: string; icon: string; color: string }) => {
  addPreset({
    name: data.name,
    icon: data.icon,
    color: data.color,
    filters: { ...filters.value }
  })
}

const handleApplyPreset = (preset: any) => {
  const presetFilters = applyPreset(preset)
  filters.value = {
    ...filters.value,
    ...presetFilters
  }
  showFilters.value = false
}

const handleDeletePreset = (id: string) => {
  deletePreset(id)
}

const clearFilters = () => {
  filters.value = {
    dateFrom: '',
    dateTo: '',
    priceRange: [0, 1000],
    minAmount: 0
  }
  showInfo('تم مسح جميع الفلاتر')
}

const removeFilter = (key: string) => {
  if (key === 'dateFrom') filters.value.dateFrom = ''
  else if (key === 'dateTo') filters.value.dateTo = ''
  else if (key === 'priceRange') filters.value.priceRange = [0, 1000]
  else if (key === 'minAmount') filters.value.minAmount = 0
}

// Load orders on mount
onMounted(() => {
  loadOrders()
})
</script>
