<template>
  <v-dialog v-model="dialogVisible" max-width="800">
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <span>سداد مستحقات المناديب</span>
        <v-btn icon="mdi-close" variant="text" size="small" @click="dialogVisible = false"></v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <!-- Header / Summary -->
        <div class="d-flex align-center justify-space-between mb-4 bg-grey-lighten-4 pa-3 rounded-lg">
          <div>
            <div class="text-caption text-grey">المغسلة</div>
            <div class="font-weight-bold">{{ laundry?.name }}</div>
          </div>
          <div class="text-end">
            <div class="text-caption text-grey">إجمالي المستحقات</div>
            <div class="text-h6 font-weight-bold text-secondary">
              {{ formatCurrency(laundry?.driverRevenue || 0) }}
            </div>
          </div>
        </div>

        <!-- Drivers List -->
        <v-list class="border rounded-lg" v-if="laundryDrivers.length > 0">
          <v-list-item
            v-for="driver in laundryDrivers"
            :key="driver.id"
            class="py-3"
          >
            <template #prepend>
              <v-avatar color="grey-lighten-3" class="ml-3">
                <v-icon icon="mdi-account" color="grey-darken-1"></v-icon>
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-bold mb-1">
              {{ driver.name }}
            </v-list-item-title>
            <v-list-item-subtitle class="d-flex align-center text-caption text-grey">
              <v-icon size="small" icon="mdi-phone" class="ml-1"></v-icon>
              {{ driver.phone }}
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex align-center gap-3">
                <div class="text-end">
                  <div class="font-weight-bold text-primary">
                    {{ formatCurrency(driver.unpaidRevenue || 0) }}
                  </div>
                  <div class="text-caption text-grey">مستحق</div>
                </div>
                
                <v-btn
                  v-if="(driver.unpaidRevenue || 0) > 0"
                  size="small"
                  color="secondary"
                  variant="tonal"
                  prepend-icon="mdi-cash-check"
                  @click="handleSettleSingle(driver)"
                  :loading="loadingObj[driver.id]"
                >
                  سداد
                </v-btn>
                <div v-else class="text-success font-weight-bold d-flex align-center px-2">
                  <v-icon size="small" start>mdi-check-circle</v-icon>
                  خالص
                </div>
              </div>
            </template>
          </v-list-item>
        </v-list>

        <!-- Empty State -->
        <div v-else class="text-center py-8 text-grey">
          <v-icon size="48" color="grey-lighten-2" class="mb-2">mdi-account-off</v-icon>
          <div>لا يوجد مناديب مسندين لهذه المغسلة</div>
        </div>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          color="grey"
          @click="dialogVisible = false"
        >
          إغلاق
        </v-btn>
        <v-btn
          v-if="hasUnpaidDrivers"
          color="secondary"
          variant="flat"
          prepend-icon="mdi-cash-multiple"
          @click="handleSettleAll"
          :loading="loadingAll"
        >
          سداد الجميع ({{ formatCurrency(totalUnpaid) }})
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDrivers, type Driver } from '@/composables/useDrivers'
import { useLaundryFacilities } from '@/composables/useLaundryFacilities'
import { useConfirm } from '@/composables/useConfirm'
import { useNotification } from '@/composables/useNotification'

const props = defineProps<{
  modelValue: boolean
  laundry: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'settled'): void
}>()

const { getDriversByLaundry, settleDriverRevenue } = useDrivers()
const { confirm } = useConfirm()
const { showSuccess } = useNotification()

const loadingObj = ref<Record<string, boolean>>({})
const loadingAll = ref(false)

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const laundryDrivers = computed(() => {
  if (!props.laundry?.id) return []
  return getDriversByLaundry(props.laundry.id)
})

const hasUnpaidDrivers = computed(() => {
  return laundryDrivers.value.some((d: Driver) => (d.unpaidRevenue || 0) > 0)
})

const totalUnpaid = computed(() => {
  return laundryDrivers.value.reduce((sum: number, d: Driver) => sum + (d.unpaidRevenue || 0), 0)
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0
  }).format(amount)
}

const handleSettleSingle = async (driver: Driver) => {
  const confirmed = await confirm({
    title: 'تأكيد السداد',
    message: `سداد مبلغ ${formatCurrency(driver.unpaidRevenue || 0)} للسائق ${driver.name}؟`,
    confirmText: 'تأكيد',
    confirmColor: 'secondary'
  })

  if (confirmed) {
    loadingObj.value[driver.id] = true
    try {
      await settleDriverRevenue(driver.id)
      // Ideally trigger a re-computation or event to update parent total
      emit('settled')
    } finally {
      loadingObj.value[driver.id] = false
    }
  }
}

const handleSettleAll = async () => {
  const confirmed = await confirm({
    title: 'سداد الجميع',
    message: `هل أنت متأكد من سداد إجمالي ${formatCurrency(totalUnpaid.value)} لجميع المناديب؟`,
    confirmText: 'تأكيد السداد',
    confirmColor: 'secondary'
  })

  if (confirmed) {
    loadingAll.value = true
    try {
      // Parallel settlement
      const unpaidDrivers = laundryDrivers.value.filter(d => (d.unpaidRevenue || 0) > 0)
      const promises = unpaidDrivers.map(d => settleDriverRevenue(d.id))
      await Promise.all(promises)
      
      showSuccess('تم سداد جميع المناديب بنجاح')
      emit('settled')
      dialogVisible.value = false
    } finally {
      loadingAll.value = false
    }
  }
}
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}
</style>
