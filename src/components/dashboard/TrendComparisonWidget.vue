<template>
  <v-card>
    <v-card-title class="d-flex align-center justify-space-between">
      <span>مقارنة الاتجاهات</span>
      <v-btn-toggle v-model="timeframe" mandatory size="small" density="compact">
        <v-btn value="week">أسبوع</v-btn>
        <v-btn value="month">شهر</v-btn>
        <v-btn value="year">سنة</v-btn>
      </v-btn-toggle>
    </v-card-title>

    <v-divider />

    <v-card-text>
      <apexchart
        type="line"
        :height="chartHeight"
        :options="chartOptions"
        :series="chartSeries"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePreferencesStore } from '@/stores/preferences'

const preferencesStore = usePreferencesStore()

const timeframe = ref<'week' | 'month' | 'year'>('month')

// Use chart height from preferences
const chartHeight = computed(() => preferencesStore.chartHeight)

// Mock data generator based on timeframe
const generateData = (timeframe: string) => {
  const now = new Date()
  const data: { date: string; orders: number; revenue: number; avgValue: number }[] = []

  let days = 7
  if (timeframe === 'month') days = 30
  if (timeframe === 'year') days = 365

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split('T')[0] || '',
      orders: Math.floor(Math.random() * 50) + 20,
      revenue: Math.floor(Math.random() * 5000) + 2000,
      avgValue: Math.floor(Math.random() * 100) + 50
    })
  }

  return data
}

// Chart data based on timeframe
const chartData = computed(() => generateData(timeframe.value))

const chartSeries = computed(() => [
  {
    name: 'الطلبات',
    data: chartData.value.map(d => d.orders)
  },
  {
    name: 'الإيرادات (ر.س)',
    data: chartData.value.map(d => d.revenue / 100) // Scale down for chart
  },
  {
    name: 'متوسط القيمة',
    data: chartData.value.map(d => d.avgValue)
  }
])

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false
      }
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800
    },
    fontFamily: 'Cairo, sans-serif'
  },
  colors: ['#00E5FF', '#1E88E5', '#66BB6A'],
  stroke: {
    width: [3, 3, 3],
    curve: 'smooth'
  },
  markers: {
    size: 4,
    hover: {
      size: 6
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: chartData.value.map(d => {
      const date = new Date(d.date)
      if (timeframe.value === 'week') {
        return date.toLocaleDateString('ar-SA', { weekday: 'short' })
      } else if (timeframe.value === 'month') {
        return date.getDate().toString()
      } else {
        return date.toLocaleDateString('ar-SA', { month: 'short' })
      }
    }),
    labels: {
      style: {
        colors: '#666',
        fontSize: '12px'
      }
    }
  },
  yaxis: [
    {
      title: {
        text: 'عدد الطلبات',
        style: {
          color: '#00E5FF',
          fontSize: '12px',
          fontWeight: 600
        }
      },
      labels: {
        style: {
          colors: '#00E5FF'
        }
      }
    },
    {
      opposite: true,
      title: {
        text: 'الإيرادات (ر.س)',
        style: {
          color: '#1E88E5',
          fontSize: '12px',
          fontWeight: 600
        }
      },
      labels: {
        style: {
          colors: '#1E88E5'
        }
      }
    },
    {
      show: false
    }
  ],
  legend: {
    position: 'top',
    horizontalAlign: 'center',
    fontSize: '13px',
    fontWeight: 600,
    labels: {
      colors: '#333'
    }
  },
  grid: {
    borderColor: '#f0f0f0',
    strokeDashArray: 4
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (value: number, { seriesIndex }: any) => {
        if (seriesIndex === 0) return `${value} طلب`
        if (seriesIndex === 1) return `${(value * 100).toFixed(0)} ر.س`
        return `${value} ر.س`
      }
    }
  }
}))

// Watch timeframe changes for animations
watch(timeframe, () => {
  // Chart will auto-update via computed properties
})
</script>
