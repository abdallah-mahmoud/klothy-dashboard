<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2" style="color: #1F2E45">
          التقارير المالية
        </h1>
        <p class="text-secondary">متابعة الإيرادات والتحويلات</p>
      </div>
      <v-btn color="primary" variant="outlined" prepend-icon="mdi-download" aria-label="تصدير التقرير المالي بصيغة PDF">
        تصدير التقرير
      </v-btn>
    </div>

    <!-- Date Range Filter -->
    <v-card class="mb-4" elevation="1">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="dateRange"
              :items="dateRangeOptions"
              label="الفترة الزمنية"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="startDate"
              label="من تاريخ"
              type="date"
              variant="outlined"
              density="compact"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="endDate"
              label="إلى تاريخ"
              type="date"
              variant="outlined"
              density="compact"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Financial Summary Cards -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" class="modern-card kpi-card pa-4">
          <div class="d-flex align-center">
            <div class="kpi-icon-wrapper green ml-3">
              <v-icon color="white" size="28">mdi-cash-multiple</v-icon>
            </div>
            <div>
              <div class="kpi-label">إجمالي الإيرادات</div>
              <div class="kpi-value">{{ stats.totalRevenue }} ر.س</div>
              <div class="kpi-change positive">+12.5% من الشهر الماضي</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" class="modern-card kpi-card pa-4">
          <div class="d-flex align-center">
            <div class="kpi-icon-wrapper cyan ml-3">
              <v-icon color="white" size="28">mdi-clipboard-check</v-icon>
            </div>
            <div>
              <div class="kpi-label">الطلبات المكتملة</div>
              <div class="kpi-value">{{ stats.completedOrders }}</div>
              <div class="kpi-change positive">+8.2% من الشهر الماضي</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" class="modern-card kpi-card pa-4">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <div class="kpi-icon-wrapper orange ml-3">
                <v-icon color="white" size="28">mdi-clock-outline</v-icon>
              </div>
              <div>
                <div class="kpi-label">رصيد قابل للسحب</div>
                <div class="kpi-value">{{ stats.pending }} ر.س</div>
              </div>
            </div>
            <v-btn icon="mdi-hand-coin" variant="tonal" color="orange" size="small" @click="showWithdrawDialog = true"></v-btn>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" class="modern-card kpi-card pa-4">
          <div class="d-flex align-center">
            <div class="kpi-icon-wrapper navy ml-3">
              <v-icon color="white" size="28">mdi-chart-line</v-icon>
            </div>
            <div>
              <div class="kpi-label">متوسط قيمة الطلب</div>
              <div class="kpi-value">{{ stats.avgOrderValue }} ر.س</div>
              <div class="kpi-change positive">+5.1% من الشهر الماضي</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Revenue Chart -->
    <v-card elevation="0" class="modern-card mb-4">
      <v-card-title class="text-h6 font-weight-bold">الإيرادات - آخر 30 يوم</v-card-title>
      <v-card-text>
        <div style="height: 300px" class="d-flex align-center justify-center">
          <apexchart
            v-if="chartLoaded"
            type="line"
            height="300"
            :options="revenueChartOptions"
            :series="revenueChartSeries"
          ></apexchart>
          <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>
        </div>
      </v-card-text>
    </v-card>

    <!-- Transfers History -->
    <v-card elevation="0" class="modern-card">
      <v-card-title class="text-h6 font-weight-bold">سجل التحويلات</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="transferHeaders"
          :items="transfers"
          :items-per-page="10"
          class="elevation-0"
          hover
          @click:row="openTransferDetails"
        >
          <!-- Transfer Date -->
          <template #item.date="{ item }">
            <div>
              <div class="font-weight-bold">{{ formatDate(item.date) }}</div>
              <div class="text-caption text-grey">{{ item.time }}</div>
            </div>
          </template>

          <!-- Amount -->
          <template #item.amount="{ item }">
            <span class="text-h6 font-weight-bold text-success">
              +{{ item.amount.toLocaleString() }} ر.س
            </span>
          </template>

          <!-- Status -->
          <template #item.status="{ item }">
            <v-chip :color="getTransferStatusColor(item.status)" size="small">
              {{ item.statusText }}
            </v-chip>
          </template>

          <!-- Reference -->
          <template #item.reference="{ item }">
            <span class="text-caption font-mono">{{ item.reference }}</span>
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <v-btn
              icon="mdi-download"
              size="small"
              variant="text"
              color="primary"
              aria-label="تحميل إيصال التحويل"
              @click.stop="downloadReceipt(item)"
            ></v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Withdrawal Dialog -->
    <v-dialog v-model="showWithdrawDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold pa-4 bg-grey-lighten-5">طلب سداد</v-card-title>
        <v-card-text class="pa-4">
          <div class="text-center mb-6">
            <div class="text-h4 font-weight-bold text-primary mb-1">{{ stats.pending }} ر.س</div>
            <div class="text-caption text-grey">المبلغ المتاح للسحب</div>
          </div>
          
          <v-alert type="info" variant="tonal" class="mb-4 text-caption">
            سيتم تحويل المبلغ إلى الحساب البنكي المسجل خلال 24 ساعة عمل.
          </v-alert>

          <div class="font-weight-bold mb-2">الحساب البنكي:</div>
          <v-card border flat class="d-flex align-center pa-3 mb-4">
            <v-icon color="blue" size="32" class="ml-3">mdi-bank</v-icon>
            <div>
              <div class="font-weight-bold">مصرف الراجحي</div>
              <div class="text-caption font-mono">SA84 8000 0000 6080 1010 1234</div>
            </div>
          </v-card>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showWithdrawDialog = false">إلغاء</v-btn>
          <v-btn color="primary" variant="flat" :loading="withdrawLoading" @click="requestWithdrawal">تأكيد الطلب</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Transfer Details Dialog -->
    <v-dialog v-model="showTransferDetails" max-width="600">
      <v-card v-if="selectedTransfer">
        <v-toolbar color="white" border="b" class="px-4">
          <v-toolbar-title class="font-weight-bold text-subtitle-1">تفاصيل التحويل #{{ selectedTransfer.id }}</v-toolbar-title>
          <v-btn icon="mdi-close" variant="text" size="small" @click="showTransferDetails = false"></v-btn>
        </v-toolbar>
        <v-card-text class="pa-4">
          <v-row class="mb-4">
            <v-col cols="6">
              <div class="text-caption text-grey">المبلغ</div>
              <div class="text-h6 font-weight-bold text-success">{{ selectedTransfer.amount.toLocaleString() }} ر.س</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption text-grey">التاريخ</div>
              <div class="font-weight-bold">{{ formatDate(selectedTransfer.date) }}</div>
            </v-col>
            <v-col cols="12">
              <div class="text-caption text-grey">الرقم المرجعي</div>
              <div class="font-mono bg-grey-lighten-4 pa-2 rounded">{{ selectedTransfer.reference }}</div>
            </v-col>
          </v-row>
          
          <v-divider class="mb-4"></v-divider>
          
          <div class="font-weight-bold mb-3">الطلبات المشمولة ({{ selectedTransfer.ordersCount }})</div>
          <v-list density="compact" class="bg-grey-lighten-5 rounded">
            <v-list-item v-for="i in 3" :key="i" border="b">
              <template #prepend>
                <div class="font-weight-bold text-caption ml-2">#ORD-12{{ 80 + i }}</div>
              </template>
              <v-list-item-title class="text-body-2">غسيل وكوي (4 قطع)</v-list-item-title>
              <template #append>
                <div class="font-weight-bold text-caption">45.00 ر.س</div>
              </template>
            </v-list-item>
             <v-list-item class="text-center">
                <v-btn variant="text" size="x-small" color="primary">عرض المزيد...</v-btn>
             </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const chartLoaded = ref(false)
const dateRange = ref('last_30_days')
const startDate = ref('2026-01-01')
const endDate = ref('2026-01-30')

// Dialog States
const showWithdrawDialog = ref(false)
const showTransferDetails = ref(false)
const selectedTransfer = ref<any>(null)
const withdrawLoading = ref(false)

const dateRangeOptions = [
  { title: 'آخر 7 أيام', value: 'last_7_days' },
  { title: 'آخر 30 يوم', value: 'last_30_days' },
  { title: 'هذا الشهر', value: 'this_month' },
  { title: 'الشهر الماضي', value: 'last_month' },
  { title: 'مخصص', value: 'custom' },
]

const stats = ref({
  totalRevenue: '45,280',
  completedOrders: 312,
  pending: '8,450',
  avgOrderValue: '145',
})

// Revenue Chart
const revenueChartSeries = ref([
  {
    name: 'الإيرادات',
    data: [1200, 1500, 1300, 1800, 1600, 2100, 1900, 2300, 2000, 2500],
  },
])

const revenueChartOptions = ref({
  chart: {
    fontFamily: 'Tajawal, sans-serif',
    toolbar: { show: false },
    rtl: true,
  },
  colors: ['#00C2FF'],
  stroke: { curve: 'smooth', width: 3 },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['1 يناير', '5 يناير', '10 يناير', '15 يناير', '20 يناير', '25 يناير', '30 يناير'],
  },
  yaxis: {
    labels: {
      formatter: (val: number) => val.toLocaleString('ar-SA') + ' ر.س',
    },
  },
  tooltip: {
    y: {
      formatter: (val: number) => val.toLocaleString('ar-SA') + ' ر.س',
    },
  },
})

// Transfers Table
const transferHeaders = [
  { title: 'التاريخ', key: 'date', align: 'start' as const },
  { title: 'المبلغ', key: 'amount', align: 'start' as const },
  { title: 'الحالة', key: 'status', align: 'start' as const },
  { title: 'الرقم المرجعي', key: 'reference', align: 'start' as const },
  { title: 'الطلبات', key: 'ordersCount', align: 'start' as const },
  { title: 'الإجراءات', key: 'actions', sortable: false, align: 'center' as const },
]

const transfers = ref([
  {
    id: 1,
    date: '2026-01-28',
    time: '10:30 ص',
    amount: 12450,
    status: 'completed',
    statusText: 'مكتمل',
    reference: 'TXN-2026-0128-001',
    ordersCount: 45,
  },
  {
    id: 2,
    date: '2026-01-21',
    time: '11:15 ص',
    amount: 10280,
    status: 'completed',
    statusText: 'مكتمل',
    reference: 'TXN-2026-0121-001',
    ordersCount: 38,
  },
  {
    id: 3,
    date: '2026-01-14',
    time: '09:45 ص',
    amount: 14890,
    status: 'completed',
    statusText: 'مكتمل',
    reference: 'TXN-2026-0114-001',
    ordersCount: 52,
  },
  {
    id: 4,
    date: '2026-01-07',
    time: '10:00 ص',
    amount: 11320,
    status: 'completed',
    statusText: 'مكتمل',
    reference: 'TXN-2026-0107-001',
    ordersCount: 41,
  },
])

function getTransferStatusColor(status: string): string {
  const colors: Record<string, string> = {
    completed: 'green',
    pending: 'orange',
    failed: 'red',
  }
  return colors[status] || 'grey'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function downloadReceipt(transfer: any) {
  console.log('Download receipt:', transfer.reference)
}

function openTransferDetails(event: Event, { item }: any) {
  selectedTransfer.value = item
  showTransferDetails.value = true
}

function requestWithdrawal() {
  withdrawLoading.value = true
  setTimeout(() => {
    withdrawLoading.value = false
    showWithdrawDialog.value = false
    alert('تم إرسال طلب السداد بنجاح')
  }, 1500)
}

onMounted(() => {
  setTimeout(() => {
    chartLoaded.value = true
  }, 500)
})
</script>

<style scoped>
.font-mono {
  font-family: monospace;
}

/* KPI Card Styling */
.kpi-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover) !important;
}

.kpi-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-icon-wrapper.green {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.kpi-icon-wrapper.cyan {
  background: linear-gradient(135deg, #00C2FF 0%, #33D1FF 100%);
  box-shadow: 0 4px 12px rgba(0, 194, 255, 0.3);
}

.kpi-icon-wrapper.orange {
  background: linear-gradient(135deg, #FFA500 0%, #FFB733 100%);
  box-shadow: 0 4px 12px rgba(255, 165, 0, 0.3);
}

.kpi-icon-wrapper.navy {
  background: linear-gradient(135deg, #1F2E45 0%, #2A3F5F 100%);
  box-shadow: 0 4px 12px rgba(31, 46, 69, 0.3);
}

.kpi-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.kpi-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
  margin-bottom: 4px;
}

.kpi-change {
  font-size: 0.75rem;
  font-weight: 600;
}

.kpi-change.positive {
  color: #4CAF50;
}

.kpi-change.negative {
  color: #EF5350;
}

.kpi-change.neutral {
  color: var(--text-tertiary);
}
</style>
