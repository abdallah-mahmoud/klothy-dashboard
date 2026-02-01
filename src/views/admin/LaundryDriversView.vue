<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-2" style="color: #1A237E">
        إسناد السائقين للمغاسل
      </h1>
      <p class="text-grey-darken-1">إدارة إسناد السائقين للمغاسل المختلفة</p>
    </div>

    <!-- Stats Row -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="primary" size="48" class="ml-3">
              <v-icon icon="mdi-account-group" color="white" size="28" />
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ drivers.length }}</div>
              <div class="text-body-2 text-grey">إجمالي السائقين</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="success" size="48" class="ml-3">
              <v-icon icon="mdi-check-circle" color="white" size="28" />
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ activeDriversCount }}</div>
              <div class="text-body-2 text-grey">النشطين</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="warning" size="48" class="ml-3">
              <v-icon icon="mdi-link-off" color="white" size="28" />
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ unassignedDriversCount }}</div>
              <div class="text-body-2 text-grey">غير مسندين</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="info" size="48" class="ml-3">
              <v-icon icon="mdi-store" color="white" size="28" />
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ totalFacilities }}</div>
              <div class="text-body-2 text-grey">المغاسل</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters Row -->
    <v-card class="mb-6 pa-4" elevation="2">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            label="البحث عن سائق"
            placeholder="الاسم أو رقم الهاتف"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="selectedLaundryFilter"
            :items="laundryFilterItems"
            label="فلترة حسب المغسلة"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
        </v-col>
      </v-row>
    </v-card>

    <!-- Drivers Grid -->
    <v-row>
      <v-col
        v-for="driver in filteredDrivers"
        :key="driver.id"
        cols="12"
        md="6"
        lg="4"
      >
        <DriverCard
          :driver="driver"
          @reassign="handleReassign(driver)"
          @activate="handleActivate(driver)"
          @deactivate="handleDeactivate(driver)"
          @unassign="handleUnassign(driver)"
          @edit="handleEdit(driver)"
          @settle="handleSettle"
        />
      </v-col>

      <!-- Empty State -->
      <v-col v-if="filteredDrivers.length === 0" cols="12">
        <EmptyState
          icon="mdi-account-search"
          title="لا توجد نتائج"
          description="لم يتم العثور على سائقين بناءً على البحث أو الفلاتر المحددة"
        />
      </v-col>
    </v-row>

    <!-- Assign Driver Dialog -->
    <AssignDriverDialog
      v-model="showAssignDialog"
      :driver-id="selectedDriver?.id"
      :driver-name="selectedDriver?.name"
      :current-laundry-id="selectedDriver?.assignedLaundryId || undefined"
      :current-laundry-name="selectedDriver?.assignedLaundryName || undefined"
      :loading="loading"
      @save="handleSaveAssignment"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDrivers, type Driver } from '@/composables/useDrivers'
import { useLaundryFacilities } from '@/composables/useLaundryFacilities'
import { useConfirm } from '@/composables/useConfirm'
import { useNotification } from '@/composables/useNotification'
import DriverCard from '@/components/drivers/DriverCard.vue'
import AssignDriverDialog from '@/components/shared/AssignDriverDialog.vue'
import EmptyState from '@/components/shared/EmptyState.vue'

const {
  drivers,
  filteredDrivers,
  loading,
  searchQuery,
  selectedLaundryFilter,
  activeDriversCount,
  unassignedDriversCount,
  assignDriverToLaundry,
  unassignDriver,
  updateDriverStatus,
  settleDriverRevenue
} = useDrivers()

const { laundries, totalFacilities, getLaundriesForSelect } = useLaundryFacilities()
const { confirm } = useConfirm()
const { showSuccess } = useNotification()

const showAssignDialog = ref(false)
const selectedDriver = ref<Driver | null>(null)

const laundryFilterItems = ref([
  { title: 'كل المغاسل', value: null },
  ...getLaundriesForSelect()
])

const handleReassign = (driver: Driver) => {
  selectedDriver.value = driver
  showAssignDialog.value = true
}

const handleSaveAssignment = async (laundryId: string, laundryName: string) => {
  if (!selectedDriver.value) return

  const success = await assignDriverToLaundry(
    selectedDriver.value.id,
    laundryId,
    laundryName
  )

  if (success) {
    showAssignDialog.value = false
    selectedDriver.value = null
  }
}

const handleActivate = async (driver: Driver) => {
  await updateDriverStatus(driver.id, 'active')
}

const handleDeactivate = async (driver: Driver) => {
  const confirmed = await confirm({
    title: 'تعطيل السائق',
    message: `هل تريد تعطيل السائق ${driver.name}؟`,
    confirmText: 'تعطيل',
    confirmColor: 'warning'
  })

  if (confirmed) {
    await updateDriverStatus(driver.id, 'inactive')
  }
}

const handleUnassign = async (driver: Driver) => {
  const confirmed = await confirm({
    title: 'إلغاء الإسناد',
    message: `هل تريد إلغاء إسناد السائق ${driver.name} من ${driver.assignedLaundryName}؟`,
    type: 'warning',
    confirmText: 'إلغاء الإسناد',
    confirmColor: 'warning'
  })

  if (confirmed) {
    await unassignDriver(driver.id)
  }
}

const handleEdit = (driver: Driver) => {
  // TODO: Implement edit driver functionality
  console.log('Edit driver:', driver)
}

const handleSettle = async (driver: Driver) => {
  const confirmed = await confirm({
    title: 'سداد مستحقات السائق',
    message: `هل أنت متأكد من سداد مبلغ ${driver.unpaidRevenue} ر.س للسائق ${driver.name}؟`,
    confirmText: 'تأكيد السداد',
    confirmColor: 'primary'
  })

  if (confirmed) {
    await settleDriverRevenue(driver.id)
  }
}
</script>
