<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-chart-bar" class="ml-2" />
      مؤشرات الأداء
    </v-card-title>

    <v-divider />

    <v-card-text>
      <v-row>
        <!-- Average Delivery Time -->
        <v-col cols="12" md="6">
          <div class="performance-metric">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-subtitle-2 text-grey-darken-1">متوسط وقت التوصيل</span>
              <v-chip size="small" :color="deliveryTimeColor" variant="flat">
                <v-icon icon="mdi-clock-outline" start size="14" />
                {{ avgDeliveryTime }} دقيقة
              </v-chip>
            </div>
            <v-progress-linear
              :model-value="deliveryTimeProgress"
              :color="deliveryTimeColor"
              height="8"
              rounded
            />
            <div class="text-caption text-grey mt-1">
              الهدف: 30 دقيقة
            </div>
          </div>
        </v-col>

        <!-- Driver Efficiency -->
        <v-col cols="12" md="6">
          <div class="performance-metric">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-subtitle-2 text-grey-darken-1">كفاءة السائقين</span>
              <v-chip size="small" color="success" variant="flat">
                <v-icon icon="mdi-account-check" start size="14" />
                {{ driverEfficiency }}%
              </v-chip>
            </div>
            <v-progress-linear
              :model-value="driverEfficiency"
              color="success"
              height="8"
              rounded
            />
            <div class="text-caption text-grey mt-1">
              معدل إكمال الطلبات في الوقت
            </div>
          </div>
        </v-col>

        <!-- Customer Satisfaction -->
        <v-col cols="12" md="6">
          <div class="performance-metric">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-subtitle-2 text-grey-darken-1">رضا العملاء</span>
              <div class="d-flex align-center">
                <v-rating
                  :model-value="customerSatisfaction"
                  readonly
                  size="small"
                  density="compact"
                  color="warning"
                  half-increments
                />
                <span class="text-subtitle-2 mr-1">{{ customerSatisfaction.toFixed(1) }}</span>
              </div>
            </div>
            <v-progress-linear
              :model-value="(customerSatisfaction / 5) * 100"
              color="warning"
              height="8"
              rounded
            />
            <div class="text-caption text-grey mt-1">
              بناءً على {{ totalReviews }} تقييم
            </div>
          </div>
        </v-col>

        <!-- Revenue per Driver -->
        <v-col cols="12" md="6">
          <div class="performance-metric">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-subtitle-2 text-grey-darken-1">الإيرادات لكل سائق</span>
              <v-chip size="small" color="primary" variant="flat">
                <v-icon icon="mdi-currency-usd" start size="14" />
                {{ revenuePerDriver.toLocaleString() }} ر.س
              </v-chip>
            </div>
            <v-progress-linear
              :model-value="revenuePerDriverProgress"
              color="primary"
              height="8"
              rounded
            />
            <div class="text-caption text-grey mt-1">
              الهدف: 5000 ر.س
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Top Performers -->
      <div class="mt-6">
        <h4 class="text-subtitle-1 font-weight-bold mb-3">أفضل السائقين هذا الأسبوع</h4>
        <v-list density="compact" class="top-performers-list">
          <v-list-item
            v-for="(driver, index) in topDrivers"
            :key="driver.id"
            class="px-0"
          >
            <template #prepend>
              <v-avatar :color="getMedalColor(index)" size="32" class="ml-2">
                <span class="text-white font-weight-bold">{{ index + 1 }}</span>
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-medium">
              {{ driver.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ driver.orders }} طلبات • {{ driver.revenue.toLocaleString() }} ر.س
            </v-list-item-subtitle>

            <template #append>
              <v-chip size="small" :color="driver.trendColor" variant="flat">
                <v-icon :icon="driver.trendIcon" start size="14" />
                {{ driver.trend }}%
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Mock performance data
const avgDeliveryTime = ref(28)
const driverEfficiency = ref(87)
const customerSatisfaction = ref(4.6)
const totalReviews = ref(342)
const revenuePerDriver = ref(4250)

// Computed progress values
const deliveryTimeProgress = computed(() => {
  const target = 30
  return Math.min((target / avgDeliveryTime.value) * 100, 100)
})

const deliveryTimeColor = computed(() => {
  if (avgDeliveryTime.value <= 25) return 'success'
  if (avgDeliveryTime.value <= 30) return 'warning'
  return 'error'
})

const revenuePerDriverProgress = computed(() => {
  const target = 5000
  return (revenuePerDriver.value / target) * 100
})

// Top drivers data
const topDrivers = ref([
  {
    id: 1,
    name: 'أحمد محمد',
    orders: 45,
    revenue: 6750,
    trend: '+12',
    trendIcon: 'mdi-trending-up',
    trendColor: 'success'
  },
  {
    id: 2,
    name: 'خالد علي',
    orders: 42,
    revenue: 6300,
    trend: '+8',
    trendIcon: 'mdi-trending-up',
    trendColor: 'success'
  },
  {
    id: 3,
    name: 'سعيد عبدالله',
    orders: 38,
    revenue: 5700,
    trend: '-3',
    trendIcon: 'mdi-trending-down',
    trendColor: 'error'
  }
])

const getMedalColor = (index: number) => {
  if (index === 0) return 'warning' // Gold
  if (index === 1) return 'grey-darken-1' // Silver
  if (index === 2) return 'orange-darken-2' // Bronze
  return 'grey-lighten-1'
}
</script>

<style scoped>
.performance-metric {
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.top-performers-list {
  background-color: transparent;
}

.top-performers-list .v-list-item {
  border-bottom: 1px solid #f0f0f0;
}

.top-performers-list .v-list-item:last-child {
  border-bottom: none;
}
</style>
