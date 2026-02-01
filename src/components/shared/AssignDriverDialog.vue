<template>
  <v-dialog v-model="isOpen" max-width="500">
    <v-card>
      <v-card-title class="d-flex align-center bg-primary">
        <v-icon icon="mdi-swap-horizontal" class="ml-2" color="white" />
        <span class="text-white">{{ dialogTitle }}</span>
      </v-card-title>

      <v-divider />

      <v-card-text class="pt-6">
        <!-- Driver Info (if editing existing assignment) -->
        <div v-if="driverId" class="mb-4 pa-3 bg-grey-lighten-4" style="border-radius: 8px;">
          <div class="text-subtitle-2 text-grey-darken-1 mb-1">السائق</div>
          <div class="text-h6 font-weight-bold">{{ driverName }}</div>
        </div>

        <!-- Laundry Selection -->
        <v-select
          v-model="selectedLaundry"
          :items="laundryItems"
          label="اختر المغسلة *"
          variant="outlined"
          density="compact"
          :rules="[v => !!v || 'الرجاء اختيار مغسلة']"
          class="mb-4"
        >
          <template #prepend-inner>
            <v-icon icon="mdi-store" />
          </template>
          <template #item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps">
              <template #subtitle>
                <span class="text-caption">{{ item.subtitle }}</span>
              </template>
            </v-list-item>
          </template>
        </v-select>

        <!-- Current Assignment Warning -->
        <v-alert
          v-if="driverId && currentLaundryId && selectedLaundry !== currentLaundryId"
          type="warning"
          variant="tonal"
          density="compact"
          class="mb-4"
        >
          <div class="text-body-2">
            سيتم نقل السائق من <strong>{{ currentLaundryName }}</strong> إلى المغسلة الجديدة
          </div>
        </v-alert>

        <!-- Info Message -->
        <v-alert type="info" variant="tonal" density="compact">
          <div class="text-body-2">
            السائق سيستقبل طلبات من هذه المغسلة فقط
          </div>
        </v-alert>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="cancel">إلغاء</v-btn>
        <v-btn
          color="primary"
          :disabled="!selectedLaundry"
          :loading="loading"
          @click="save"
        >
          <v-icon icon="mdi-check" start />
          حفظ
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useLaundryFacilities } from '@/composables/useLaundryFacilities'

interface Props {
  modelValue: boolean
  driverId?: string
  driverName?: string
  currentLaundryId?: string
  currentLaundryName?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', laundryId: string, laundryName: string): void
}>()

const { getLaundriesForSelect } = useLaundryFacilities()

const selectedLaundry = ref<string>('')

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const dialogTitle = computed(() => {
  if (props.driverId) {
    return props.currentLaundryId ? 'إعادة إسناد السائق' : 'إسناد السائق'
  }
  return 'إسناد سائق للمغسلة'
})

const laundryItems = computed(() => getLaundriesForSelect())

// Watch dialog open to initialize selected laundry
watch(isOpen, (value) => {
  if (value) {
    selectedLaundry.value = props.currentLaundryId || ''
  }
})

const save = () => {
  if (!selectedLaundry.value) return

  const selectedItem = laundryItems.value.find(
    item => item.value === selectedLaundry.value
  )
  
  if (selectedItem) {
    emit('save', selectedLaundry.value, selectedItem.title)
  }
}

const cancel = () => {
  isOpen.value = false
  selectedLaundry.value = ''
}
</script>
