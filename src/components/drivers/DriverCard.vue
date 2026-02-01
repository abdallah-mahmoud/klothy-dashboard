<template>
  <v-card class="driver-card" elevation="2">
    <v-card-text>
      <div class="d-flex align-center mb-3">
        <!-- Avatar -->
        <v-avatar :color="statusColor" size="56" class="ml-3">
          <span class="text-h5 font-weight-bold text-white">
            {{ driver.name.charAt(0) }}
          </span>
        </v-avatar>

        <!-- Driver Info -->
        <div class="flex-grow-1">
          <h3 class="text-h6 font-weight-bold mb-1">{{ driver.name }}</h3>
          <div class="d-flex align-center gap-2 mb-1">
            <v-icon icon="mdi-phone" size="small" />
            <span class="text-body-2">{{ driver.phone }}</span>
          </div>
          <div class="d-flex align-center gap-2">
            <v-icon icon="mdi-truck-delivery" size="small" />
            <span class="text-body-2">{{ driver.totalTrips }} رحلة</span>
            <v-icon icon="mdi-star" size="small" color="warning" class="mr-2" />
            <span class="text-body-2">{{ driver.rating }}</span>
          </div>
        </div>
      </div>

      <!-- Status & Assignment Chips -->
      <div class="d-flex gap-2 mb-3 flex-wrap">
        <!-- Status Chip -->
        <v-chip
          :color="statusColor"
          variant="flat"
          size="small"
        >
          <v-icon :icon="statusIcon" start size="16" />
          {{ statusText }}
        </v-chip>

        <!-- Laundry Assignment Chip -->
        <v-chip
          :color="driver.assignedLaundryId ? 'primary' : 'grey'"
          variant="outlined"
          size="small"
        >
          <v-icon icon="mdi-store" start size="16" />
          {{ driver.assignedLaundryName || 'غير مسند' }}
        </v-chip>
      </div>

      <!-- Actions -->
      <div class="d-flex gap-2">
        <v-btn
          color="primary"
          variant="outlined"
          size="small"
          prepend-icon="mdi-swap-horizontal"
          @click="$emit('reassign')"
        >
          {{ driver.assignedLaundryId ? 'إعادة الإسناد' : 'إسناد' }}
        </v-btn>

        <v-menu>
          <template #activator="{ props }">
            <v-btn
              icon="mdi-dots-vertical"
              variant="text"
              size="small"
              v-bind="props"
            />
          </template>
          <v-list density="compact">
            <v-list-item
              v-if="driver.status !== 'active'"
              prepend-icon="mdi-check-circle"
              title="تفعيل"
              @click="$emit('activate')"
            />
            <v-list-item
              v-if="driver.status === 'active'"
              prepend-icon="mdi-pause-circle"
              title="تعطيل"
              @click="$emit('deactivate')"
            />
            <v-list-item
              v-if="driver.assignedLaundryId"
              prepend-icon="mdi-link-off"
              title="إلغاء الإسناد"
              @click="$emit('unassign')"
            />
            <v-divider />
            <v-list-item
              prepend-icon="mdi-pencil"
              title="تعديل"
              @click="$emit('edit')"
            />
          </v-list>
        </v-menu>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Driver } from '@/composables/useDrivers'

interface Props {
  driver: Driver
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'reassign'): void
  (e: 'activate'): void
  (e: 'deactivate'): void
  (e: 'unassign'): void
  (e: 'edit'): void
}>()

const statusColor = computed(() => {
  switch (props.driver.status) {
    case 'active':
      return 'success'
    case 'on_trip':
      return 'warning'
    case 'inactive':
      return 'grey'
    default:
      return 'grey'
  }
})

const statusIcon = computed(() => {
  switch (props.driver.status) {
    case 'active':
      return 'mdi-check-circle'
    case 'on_trip':
      return 'mdi-truck-fast'
    case 'inactive':
      return 'mdi-pause-circle'
    default:
      return 'mdi-help-circle'
  }
})

const statusText = computed(() => {
  switch (props.driver.status) {
    case 'active':
      return 'نشط'
    case 'on_trip':
      return 'في رحلة'
    case 'inactive':
      return 'معطل'
    default:
      return 'غير معروف'
  }
})
</script>

<style scoped>
.driver-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 12px;
}

.driver-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.gap-2 {
  gap: 8px;
}
</style>
