<template>
  <div>
    <h1 class="text-h4 font-weight-bold mb-6 text-secondary">{{ $t('customers.title') }}</h1>

    <!-- Search Bar -->
    <v-card class="mb-4" elevation="0" border>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              :label="$t('customers.searchPlaceholder')"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              @input="filterCustomers"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Customers Table -->
    <v-card class="modern-card" elevation="0" border>
      <div style="overflow-x: auto;">
        <v-data-table
          :headers="headers"
          :items="filteredCustomers"
          :loading="loading"
          :mobile-breakpoint="0"
          hover
          class="rounded-lg"
        >
          <!-- Phone Column -->
          <template #item.phone="{ item }">
            <div class="d-flex align-center">
              <v-icon size="small" color="grey" class="ml-2">mdi-phone</v-icon>
              <span class="font-weight-medium">{{ item.phone }}</span>
            </div>
          </template>

          <!-- Wallet Column -->
          <template #item.walletBalance="{ item }">
            <v-chip
              :color="item.walletBalance > 0 ? 'success' : 'grey'"
              size="small"
              variant="flat"
              class="font-weight-medium"
            >
              {{ item.walletBalance }} {{ $t('orders.amount') }}
            </v-chip>
          </template>

          <!-- Total Orders Column -->
          <template #item.totalOrders="{ item }">
            <v-chip
              color="primary"
              size="small"
              variant="tonal"
              class="font-weight-medium"
            >
              {{ item.totalOrders }}
            </v-chip>
          </template>

          <!-- Last Order Column -->
          <template #item.lastOrder="{ item }">
            <span class="text-grey">{{ formatDate(item.lastOrder) }}</span>
          </template>

          <!-- Actions Column -->
          <template #item.actions="{ item }">
            <v-btn
              color="primary"
              variant="text"
              size="small"
              @click="openCustomerDetails(item)"
            >
              {{ $t('customers.viewDetails') }}
            </v-btn>
          </template>

          <!-- Empty State -->
          <template #no-data>
            <div class="py-8 text-center">
              <v-icon size="48" color="grey-lighten-2" class="mb-2">mdi-account-search-outline</v-icon>
              <div class="text-grey">{{ $t('customers.noCustomers') }}</div>
            </div>
          </template>

          <!-- Loading State -->
          <template #loading>
            <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
          </template>
        </v-data-table>
      </div>
    </v-card>

    <!-- Customer Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="900" scrollable>
      <v-card v-if="selectedCustomer">
        <v-card-title class="d-flex align-center bg-primary text-white pa-4">
          <v-icon size="large" class="ml-2">mdi-account-circle</v-icon>
          <span class="text-h5">{{ $t('customers.customerDetails') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="detailsDialog = false" color="white" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <!-- Personal Info Section -->
          <div class="mb-6">
            <h3 class="text-h6 font-weight-bold mb-4 text-primary">
              <v-icon class="ml-1">mdi-account</v-icon>
              {{ $t('customers.personalInfo') }}
            </h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon color="primary">mdi-account</v-icon>
                  </template>
                  <v-list-item-title class="text-grey-darken-1">{{ $t('customers.customerName') }}</v-list-item-title>
                  <v-list-item-subtitle class="text-h6 font-weight-medium text-black mt-1">
                    {{ selectedCustomer.name }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>
              <v-col cols="12" md="6">
                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon color="primary">mdi-phone</v-icon>
                  </template>
                  <v-list-item-title class="text-grey-darken-1">{{ $t('customers.phone') }}</v-list-item-title>
                  <v-list-item-subtitle class="text-h6 font-weight-medium text-black mt-1">
                    {{ selectedCustomer.phone }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>
              <v-col cols="12" md="6">
                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon color="primary">mdi-email</v-icon>
                  </template>
                  <v-list-item-title class="text-grey-darken-1">{{ $t('customers.email') }}</v-list-item-title>
                  <v-list-item-subtitle class="text-h6 font-weight-medium text-black mt-1">
                    {{ selectedCustomer.email || '-' }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>
              <v-col cols="12" md="6">
                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon color="primary">mdi-calendar</v-icon>
                  </template>
                  <v-list-item-title class="text-grey-darken-1">{{ $t('customers.joinDate') }}</v-list-item-title>
                  <v-list-item-subtitle class="text-h6 font-weight-medium text-black mt-1">
                    {{ formatDate(selectedCustomer.joinDate) }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>
              <v-col cols="12">
                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon color="primary">mdi-map-marker</v-icon>
                  </template>
                  <v-list-item-title class="text-grey-darken-1">{{ $t('customers.address') }}</v-list-item-title>
                  <v-list-item-subtitle class="text-h6 font-weight-medium text-black mt-1">
                    {{ selectedCustomer.address || '-' }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-4"></v-divider>

          <!-- Wallet Section -->
          <div class="mb-6">
            <h3 class="text-h6 font-weight-bold mb-4 text-primary">
              <v-icon class="ml-1">mdi-wallet</v-icon>
              {{ $t('customers.walletBalance') }}
            </h3>
            <v-card color="success" variant="tonal" class="pa-4">
              <div class="text-h4 font-weight-bold">
                {{ selectedCustomer.walletBalance }} ر.س
              </div>
              <div class="text-caption text-grey-darken-1 mt-1">{{ $t('customers.wallet') }}</div>
            </v-card>
          </div>

          <v-divider class="my-4"></v-divider>

          <!-- Orders History Section -->
          <div class="mb-4">
            <h3 class="text-h6 font-weight-bold mb-4 text-primary">
              <v-icon class="ml-1">mdi-clipboard-list</v-icon>
              {{ $t('customers.ordersHistory') }}
            </h3>
            <v-table v-if="selectedCustomer.orders && selectedCustomer.orders.length > 0" density="comfortable">
              <thead>
                <tr>
                  <th class="text-start">{{ $t('orders.orderNumber') }}</th>
                  <th class="text-start">{{ $t('customers.orderDate') }}</th>
                  <th class="text-end">{{ $t('orders.amount') }}</th>
                  <th class="text-center">{{ $t('customers.orderStatus') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in selectedCustomer.orders" :key="order.id">
                  <td class="font-weight-medium">{{ order.orderNumber }}</td>
                  <td class="text-grey">{{ formatDate(order.date) }}</td>
                  <td class="text-end font-weight-bold">{{ order.total }} ر.س</td>
                  <td class="text-center">
                    <v-chip
                      :color="getOrderStatusColor(order.status)"
                      size="small"
                      variant="flat"
                    >
                      {{ getOrderStatusText(order.status) }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
            <div v-else class="text-center py-8 text-grey">
              <v-icon size="48" color="grey-lighten-2" class="mb-2">mdi-package-variant</v-icon>
              <div>{{ $t('customers.noOrders') }}</div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="flat" @click="detailsDialog = false">
            {{ $t('common.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// State
const searchQuery = ref('')
const loading = ref(false)
const detailsDialog = ref(false)
const selectedCustomer = ref<any>(null)

// Headers for the table
const headers = computed(() => [
  { title: t('customers.customerName'), key: 'name', align: 'start' as const },
  { title: t('customers.phone'), key: 'phone', align: 'start' as const },
  { title: t('customers.totalOrders'), key: 'totalOrders', align: 'center' as const },
  { title: t('customers.wallet'), key: 'walletBalance', align: 'center' as const },
  { title: t('customers.lastOrder'), key: 'lastOrder', align: 'start' as const },
  { title: t('common.actions'), key: 'actions', align: 'center' as const, sortable: false },
])

// Mock data - will be replaced with API call
const customers = ref([
  {
    id: 1,
    name: 'أحمد محمد السعيد',
    phone: '0501234567',
    email: 'ahmed@example.com',
    totalOrders: 15,
    walletBalance: 125.50,
    lastOrder: '2026-02-05',
    joinDate: '2025-11-15',
    address: 'الرياض، حي النخيل، شارع الملك فهد',
    orders: [
      { id: 1, orderNumber: '#ORD-1234', date: '2026-02-05', total: '45.00', status: 'completed' },
      { id: 2, orderNumber: '#ORD-1189', date: '2026-01-28', total: '32.00', status: 'completed' },
      { id: 3, orderNumber: '#ORD-1145', date: '2026-01-20', total: '58.50', status: 'completed' },
    ]
  },
  {
    id: 2,
    name: 'سارة خالد العمري',
    phone: '0559876543',
    email: 'sara@example.com',
    totalOrders: 8,
    walletBalance: 50.00,
    lastOrder: '2026-02-03',
    joinDate: '2025-12-01',
    address: 'جدة، حي الزهراء',
    orders: [
      { id: 4, orderNumber: '#ORD-1235', date: '2026-02-03', total: '28.00', status: 'ready' },
      { id: 5, orderNumber: '#ORD-1201', date: '2026-01-25', total: '42.00', status: 'completed' },
    ]
  },
  {
    id: 3,
    name: 'فيصل عبدالله الدوسري',
    phone: '0543216789',
    email: null,
    totalOrders: 22,
    walletBalance: 0,
    lastOrder: '2026-02-01',
    joinDate: '2025-10-10',
    address: 'الدمام، حي الفيصلية',
    orders: [
      { id: 6, orderNumber: '#ORD-1236', date: '2026-02-01', total: '85.00', status: 'processing' },
      { id: 7, orderNumber: '#ORD-1220', date: '2026-01-30', total: '65.00', status: 'completed' },
    ]
  },
  {
    id: 4,
    name: 'نورة إبراهيم القحطاني',
    phone: '0567894321',
    email: 'noura@example.com',
    totalOrders: 5,
    walletBalance: 75.25,
    lastOrder: '2026-01-30',
    joinDate: '2026-01-05',
    address: 'الخبر، حي الثقبة',
    orders: [
      { id: 8, orderNumber: '#ORD-1230', date: '2026-01-30', total: '32.00', status: 'completed' },
    ]
  },
  {
    id: 5,
    name: 'محمد علي الشهراني',
    phone: '0512345678',
    email: 'mohammed@example.com',
    totalOrders: 30,
    walletBalance: 200.00,
    lastOrder: '2026-01-29',
    joinDate: '2025-09-01',
    address: 'الرياض، حي العليا',
    orders: [
      { id: 9, orderNumber: '#ORD-1229', date: '2026-01-29', total: '150.00', status: 'completed' },
      { id: 10, orderNumber: '#ORD-1215', date: '2026-01-22', total: '95.00', status: 'completed' },
    ]
  },
])

// Filtered customers based on search
const filteredCustomers = computed(() => {
  if (!searchQuery.value) return customers.value
  
  const query = searchQuery.value.toLowerCase().trim()
  return customers.value.filter(customer => 
    customer.phone.includes(query) ||
    customer.name.toLowerCase().includes(query)
  )
})

// Functions
function filterCustomers() {
  // This is called when user types in search box
  // The computed property handles the actual filtering
}

function openCustomerDetails(customer: any) {
  selectedCustomer.value = customer
  detailsDialog.value = true
}

function formatDate(dateString: string): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    completed: 'grey',
    ready: 'success',
    processing: 'blue',
    incoming: 'orange',
    cancelled: 'error'
  }
  return colors[status] || 'grey'
}

function getOrderStatusText(status: string): string {
  const texts: Record<string, string> = {
    completed: 'مكتمل',
    ready: 'جاهز',
    processing: 'جاري العمل',
    incoming: 'جديد',
    cancelled: 'ملغي'
  }
  return texts[status] || status
}
</script>

<style scoped>
.modern-card {
  border-radius: 12px;
}

.v-table {
  border-radius: 8px;
}
</style>
