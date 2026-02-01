<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-2" style="color: #1A237E">
        لوحة المعلومات الرئيسية
      </h1>
      <p class="text-grey-darken-1">نظرة عامة على أداء المنصة</p>
    </div>

    <!-- KPI Cards Row -->
    <v-row class="mb-6">
      <!-- Loading State -->
      <template v-if="loadingKPIs">
        <v-col v-for="i in 4" :key="i" cols="12" sm="6" lg="3">
          <SkeletonLoader type="kpi" />
        </v-col>
      </template>
      
      <!-- KPI Cards -->
      <template v-else>
        <v-col v-for="kpi in kpiCards" :key="kpi.title" cols="12" sm="6" lg="3">
          <v-card class="dashboard-card pa-4" elevation="2">
            <div class="d-flex align-center mb-2">
              <v-avatar :color="kpi.color" size="48" class="ml-3">
                <v-icon :icon="kpi.icon" color="white" size="28"></v-icon>
              </v-avatar>
              <div>
                <div class="d-flex align-center gap-1">
                  <div class="text-h4 font-weight-bold kpi-value">
                    {{ kpi.value }}
                  </div>
                  <HelpTooltip v-if="kpi.helpText" :text="kpi.helpText" size="x-small" />
                </div>
                <div class="text-subtitle-2 text-grey kpi-label">
                  {{ kpi.title }}
                </div>
              </div>
            </div>
            <div class="kpi-change" :class="kpi.change >= 0 ? 'positive' : 'negative'">
              <v-icon :icon="kpi.change >= 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'" size="16"></v-icon>
              <span>{{ Math.abs(kpi.change) }}% من أمس</span>
            </div>
          </v-card>
        </v-col>
      </template>
    </v-row>

    <!-- Charts Row -->
    <v-row class="mb-6">
      <!-- Revenue Chart -->
      <v-col cols="12" lg="8">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="px-0">الإيرادات - آخر 7 أيام</v-card-title>
          <div style="height: 300px" class="d-flex align-center justify-center">
            <apexchart
              v-if="chartLoaded"
              type="area"
              height="300"
              :options="revenueChartOptions"
              :series="revenueChartSeries"
            ></apexchart>
            <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>
          </div>
        </v-card>
      </v-col>

      <!-- Orders Breakdown Chart -->
      <v-col cols="12" lg="4">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="px-0">توزيع الطلبات</v-card-title>
          <div style="height: 300px" class="d-flex align-center justify-center">
            <apexchart
              v-if="chartLoaded"
              type="donut"
              height="300"
              :options="ordersChartOptions"
              :series="ordersChartSeries"
            ></apexchart>
            <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Analytics Widgets Row -->
    <v-row class="mb-6">
      <!-- Trend Comparison Widget -->
      <v-col cols="12" lg="8">
        <TrendComparisonWidget />
      </v-col>

      <!-- Performance Metrics Widget -->
      <v-col cols="12" lg="4">
        <PerformanceMetricsWidget />
      </v-col>
    </v-row>

    <!-- Recent Orders Table -->
    <v-card elevation="2">
      <v-card-title class="d-flex align-center">
        <span>أحدث الطلبات</span>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" to="/admin/orders">
          عرض الكل
          <v-icon end>mdi-arrow-left</v-icon>
        </v-btn>
      </v-card-title>
      <v-table>
        <thead>
          <tr>
            <th>رقم الطلب</th>
            <th>العميل</th>
            <th>المغسلة</th>
            <th>القيمة</th>
            <th>الحالة</th>
            <th>التاريخ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in recentOrders" :key="order.id">
            <td>
              <router-link :to="`/admin/orders/${order.id}`" class="text-decoration-none">
                <strong>{{ order.orderNumber }}</strong>
              </router-link>
            </td>
            <td>{{ order.client }}</td>
            <td>{{ order.laundry }}</td>
            <td>{{ order.amount }} ر.س</td>
            <td>
              <v-chip :color="getStatusColor(order.status)" size="small">
                {{ order.status }}
              </v-chip>
            </td>
            <td>{{ order.date }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import HelpTooltip from '@/components/shared/HelpTooltip.vue'
import SkeletonLoader from '@/components/shared/SkeletonLoader.vue'
import TrendComparisonWidget from '@/components/dashboard/TrendComparisonWidget.vue'
import PerformanceMetricsWidget from '@/components/dashboard/PerformanceMetricsWidget.vue'

const chartLoaded = ref(false)
const loadingKPIs = ref(true)

// KPI Cards Data
const kpiCards = ref([
  {
    title: 'الطلبات النشطة',
    value: '127',
    change: 12.5,
    color: 'orange',
    icon: 'mdi-clipboard-list-outline',
    helpText: 'عدد الطلبات قيد التنفيذ حالياً (جاري الاستلام، قيد الغسيل، جاري التوصيل)'
  },
  {
    title: 'مبيعات اليوم',
    value: '15,420',
    change: 8.2,
    color: 'green',
    icon: 'mdi-currency-usd',
    helpText: 'إجمالي الإيرادات من جميع الطلبات المكتملة اليوم'
  },
  {
    title: 'المناديب المتصلين',
    value: '34',
    change: -3.1,
    color: 'blue',
    icon: 'mdi-car',
    helpText: 'عدد المناديب النشطين والمتصلين بالنظام حالياً'
  },
  {
    title: 'المغاسل المفتوحة',
    value: '12',
    change: 0,
    color: 'purple',
    icon: 'mdi-iron',
    helpText: 'عدد المغاسل المفتوحة والمستعدة لاستقبال الطلبات حالياً'
  },
])

// Revenue Chart
const revenueChartSeries = ref([
  {
    name: 'الإيرادات',
    data: [12000, 15000, 13500, 16800, 14200, 17500, 15420],
  },
])

const revenueChartOptions = ref({
  chart: {
    fontFamily: 'Tajawal, sans-serif',
    toolbar: { show: false },
    rtl: true,
  },
  colors: ['#00C2FF'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
      stops: [0, 90, 100],
    },
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  xaxis: {
    categories: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
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

// Orders Breakdown Chart
const ordersChartSeries = ref([45, 62, 890, 15])

const ordersChartOptions = ref({
  chart: {
    fontFamily: 'Tajawal, sans-serif',
    rtl: true,
  },
  labels: ['جديد', 'جاري', 'مكتمل', 'ملغي'],
  colors: ['#FFA500', '#00C2FF', '#4CAF50', '#EF5350'],
  legend: {
    position: 'bottom',
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => Math.round(val) + '%',
  },
})

// Recent Orders Data
const recentOrders = ref([
  {
    id: '1',
    orderNumber: '#ORD-1234',
    client: 'أحمد محمد',
    laundry: 'مغسلة النظافة',
    amount: '245.00',
    status: 'جاري الغسيل',
    date: '2026-01-29',
  },
  {
    id: '2',
    orderNumber: '#ORD-1233',
    client: 'فاطمة علي',
    laundry: 'مغسلة الأناقة',
    amount: '180.50',
    status: 'جديد',
    date: '2026-01-29',
  },
  {
    id: '3',
    orderNumber: '#ORD-1232',
    client: 'خالد سعيد',
    laundry: 'مغسلة الفخامة',
    amount: '320.00',
    status: 'مكتمل',
    date: '2026-01-28',
  },
  {
    id: '4',
    orderNumber: '#ORD-1231',
    client: 'نورة عبدالله',
    laundry: 'مغسلة السرعة',
    amount: '150.00',
    status: 'جاري التوصيل',
    date: '2026-01-28',
  },
  {
    id: '5',
    orderNumber: '#ORD-1230',
    client: 'سعد حسن',
    laundry: 'مغسلة النظافة',
    amount: '295.75',
    status: 'جاري الغسيل',
    date: '2026-01-28',
  },
])

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

onMounted(() => {
  // Simulate KPI loading
  setTimeout(() => {
    loadingKPIs.value = false
  }, 800)
  
  // Simulate chart loading
  setTimeout(() => {
    chartLoaded.value = true
  }, 500)
})
</script>

<style scoped>
/* Modern Dashboard Cards */
:deep(.dashboard-card) {
  border-radius: 20px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.dashboard-card:hover) {
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15) !important;
}

/* KPI Styling */
.kpi-value {
  color: #1F2E45;
  font-weight: 800;
}

.kpi-label {
  color: #7A869A;
  font-weight: 600;
}

.kpi-change {
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
}

.kpi-change.positive {
  color: #4CAF50;
}

.kpi-change.negative {
  color: #EF5350;
}

/* Table Enhancement */
:deep(.v-table) {
  border-radius: 0 0 20px 20px;
}

:deep(.v-table tbody tr:hover) {
  background-color: rgba(0, 194, 255, 0.05);
}

:deep(.v-table th) {
  font-weight: 700;
  color: #1F2E45;
}

/* Gap utility */
.gap-1 {
  gap: 4px;
}
</style>
