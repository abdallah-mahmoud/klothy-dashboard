<template>
  <v-dialog v-model="isOpen" max-width="600">
    <v-card>
      <v-card-title class="d-flex align-center bg-secondary">
        <v-icon icon="mdi-download" class="ml-2" color="white" />
        <span class="text-white">تصدير البيانات</span>
      </v-card-title>

      <v-divider />

      <v-card-text class="pt-6">
        <!-- Export Format Selection -->
        <div class="mb-6">
          <label class="text-subtitle-2 font-weight-bold mb-2 d-block">صيغة التصدير</label>
          <v-chip-group v-model="selectedFormat" mandatory column>
            <v-chip
              v-for="format in exportFormats"
              :key="format.value"
              :value="format.value"
              filter
              variant="outlined"
              size="large"
            >
              <v-icon :icon="format.icon" start />
              {{ format.label }}
            </v-chip>
          </v-chip-group>
        </div>

        <!-- Column Selection -->
        <div class="mb-6">
          <label class="text-subtitle-2 font-weight-bold mb-2 d-block">الأعمدة المطلوبة</label>
          <v-select
            v-model="selectedColumns"
            :items="availableColumns"
            label="اختر الأعمدة"
            variant="outlined"
            multiple
            chips
            closable-chips
            density="compact"
          >
            <template #prepend-inner>
              <v-icon icon="mdi-table-column" />
            </template>
          </v-select>
          
          <div class="d-flex gap-2 mt-2">
            <v-btn
              size="small"
              variant="text"
              @click="selectAllColumns"
            >
              تحديد الكل
            </v-btn>
            <v-btn
              size="small"
              variant="text"
              @click="selectedColumns = []"
            >
              إلغاء التحديد
            </v-btn>
          </div>
        </div>

        <!-- Date Range Filter -->
        <div class="mb-6">
          <label class="text-subtitle-2 font-weight-bold mb-2 d-block">نطاق التاريخ (اختياري)</label>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="dateRange.from"
                type="date"
                label="من تاريخ"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="dateRange.to"
                type="date"
                label="إلى تاريخ"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
        </div>

        <!-- Export Summary -->
        <v-alert type="info" variant="tonal" density="compact">
          <div class="text-body-2">
            <strong>ملخص التصدير:</strong>
            <ul class="mt-2">
              <li>الصيغة: {{ formatLabel }}</li>
              <li>الأعمدة: {{ selectedColumns.length }} عمود</li>
              <li>البيانات: {{ estimatedRows }} صف تقريباً</li>
            </ul>
          </div>
        </v-alert>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="cancel">إلغاء</v-btn>
        <v-btn
          color="secondary"
          :disabled="selectedColumns.length === 0"
          :loading="exporting"
          @click="exportData"
        >
          <v-icon icon="mdi-download" start />
          تصدير
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useNotification } from '@/composables/useNotification'

interface Props {
  modelValue: boolean
  data?: any[]
  filename?: string
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  filename: 'export'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { showSuccess, showError } = useNotification()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedFormat = ref<'xlsx' | 'csv' | 'pdf'>('xlsx')
const selectedColumns = ref<string[]>([])
const dateRange = ref({
  from: '',
  to: ''
})
const exporting = ref(false)

const exportFormats = [
  { label: 'Excel (.xlsx)', value: 'xlsx', icon: 'mdi-file-excel' },
  { label: 'CSV (.csv)', value: 'csv', icon: 'mdi-file-delimited' },
  { label: 'PDF (.pdf)', value: 'pdf', icon: 'mdi-file-pdf' }
]

const availableColumns = [
  { title: 'رقم الطلب', value: 'orderId' },
  { title: 'العميل', value: 'customer' },
  { title: 'رقم الهاتف', value: 'phone' },
  { title: 'العنوان', value: 'address' },
  { title: 'الحالة', value: 'status' },
  { title: 'التاريخ', value: 'date' },
  { title: 'المبلغ', value: 'amount' },
  { title: 'طريقة الدفع', value: 'paymentMethod' },
  { title: 'السائق', value: 'driver' }
]

const formatLabel = computed(() => {
  return exportFormats.find(f => f.value === selectedFormat.value)?.label || ''
})

const estimatedRows = computed(() => {
  let rows = props.data.length
  if (dateRange.value.from || dateRange.value.to) {
    rows = Math.floor(rows * 0.7) // Estimate filtered rows
  }
  return rows
})

// Initialize with all columns selected
watch(isOpen, (value) => {
  if (value && selectedColumns.value.length === 0) {
    selectAllColumns()
  }
})

const selectAllColumns = () => {
  selectedColumns.value = availableColumns.map(col => col.value)
}

const cancel = () => {
  isOpen.value = false
}

const exportData = async () => {
  if (selectedColumns.value.length === 0) {
    showError('الرجاء اختيار عمود واحد على الأقل')
    return
  }

  exporting.value = true

  try {
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Filter data by date range if specified
    let dataToExport = props.data
    if (dateRange.value.from || dateRange.value.to) {
      dataToExport = filterByDateRange(dataToExport)
    }

    // Generate file based on format
    switch (selectedFormat.value) {
      case 'xlsx':
        exportToExcel(dataToExport)
        break
      case 'csv':
        exportToCSV(dataToExport)
        break
      case 'pdf':
        exportToPDF(dataToExport)
        break
    }

    showSuccess(`تم تصدير ${dataToExport.length} سجل بنجاح`)
    isOpen.value = false
  } catch (error) {
    console.error('Export error:', error)
    showError('حدث خطأ أثناء التصدير')
  } finally {
    exporting.value = false
  }
}

const filterByDateRange = (data: any[]) => {
  return data.filter(row => {
    if (!row.date) return true
    const rowDate = new Date(row.date)
    if (dateRange.value.from && rowDate < new Date(dateRange.value.from)) return false
    if (dateRange.value.to && rowDate > new Date(dateRange.value.to)) return false
    return true
  })
}

const exportToExcel = (data: any[]) => {
  // This is a mock implementation
  // In production, use a library like xlsx or exceljs
  const csvContent = generateCSVContent(data)
  downloadFile(csvContent, `${props.filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
}

const exportToCSV = (data: any[]) => {
  const csvContent = generateCSVContent(data)
  downloadFile(csvContent, `${props.filename}.csv`, 'text/csv')
}

const exportToPDF = (data: any[]) => {
  // This is a mock implementation
  // In production, use a library like jsPDF
  const content = `PDF Export: ${data.length} records`
  downloadFile(content, `${props.filename}.pdf`, 'application/pdf')
}

const generateCSVContent = (data: any[]) => {
  // Get selected column headers
  const headers = selectedColumns.value
    .map(colValue => availableColumns.find(c => c.value === colValue)?.title || colValue)
    .join(',')

  // Generate rows
  const rows = data.map(row => {
    return selectedColumns.value.map(col => {
      const value = row[col] || ''
      // Escape commas and quotes
      return `"${String(value).replace(/"/g, '""')}"`
    }).join(',')
  }).join('\n')

  return `${headers}\n${rows}`
}

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
</script>
