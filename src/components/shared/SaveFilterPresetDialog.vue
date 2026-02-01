<template>
  <v-dialog v-model="isOpen" max-width="500">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-bookmark-plus" class="ml-2" />
        حفظ الفلاتر
      </v-card-title>

      <v-divider />

      <v-card-text class="pt-4">
        <!-- Preset Name -->
        <v-text-field
          v-model="presetName"
          label="اسم الإعداد"
          placeholder="مثال: طلبات اليوم - قيد التنفيذ"
          variant="outlined"
          autofocus
          :rules="[v => !!v || 'الرجاء إدخال اسم الإعداد']"
          class="mb-4"
        />

        <!-- Icon Selector -->
        <label class="text-subtitle-2 font-weight-bold mb-2 d-block">الأيقونة</label>
        <v-chip-group v-model="selectedIcon" mandatory column class="mb-4">
          <v-chip
            v-for="icon in iconOptions"
            :key="icon.value"
            :value="icon.value"
            filter
            variant="outlined"
          >
            <v-icon :icon="icon.value" start />
            {{ icon.label }}
          </v-chip>
        </v-chip-group>

        <!-- Color Selector -->
        <label class="text-subtitle-2 font-weight-bold mb-2 d-block">اللون</label>
        <v-chip-group v-model="selectedColor" mandatory class="mb-4">
          <v-chip
            v-for="color in colorOptions"
            :key="color.value"
            :value="color.value"
            :color="color.value"
            filter
          >
            {{ color.label }}
          </v-chip>
        </v-chip-group>

        <!-- Preview -->
        <v-alert
          type="info"
          variant="tonal"
          class="mt-4"
          density="compact"
        >
          <div class="d-flex align-center">
            <v-avatar :color="selectedColor" size="32" class="ml-2">
              <v-icon :icon="selectedIcon" size="18" color="white" />
            </v-avatar>
            <div>
              <div class="text-body-2 font-weight-medium">{{ presetName || 'اسم الإعداد' }}</div>
              <div class="text-caption">{{ filterCount }} فلتر نشط</div>
            </div>
          </div>
        </v-alert>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn @click="cancel">إلغاء</v-btn>
        <v-btn
          color="primary"
          :disabled="!presetName.trim()"
          @click="save"
        >
          حفظ
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: boolean
  filterCount: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', data: { name: string; icon: string; color: string }): void
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const presetName = ref('')
const selectedIcon = ref('mdi-filter')
const selectedColor = ref('primary')

const iconOptions = [
  { label: 'فلتر', value: 'mdi-filter' },
  { label: 'نجمة', value: 'mdi-star' },
  { label: 'علامة', value: 'mdi-bookmark' },
  { label: 'قلب', value: 'mdi-heart' },
  { label: 'برق', value: 'mdi-lightning-bolt' },
  { label: 'علم', value: 'mdi-flag' }
]

const colorOptions = [
  { label: 'أزرق', value: 'primary' },
  { label: 'برتقالي', value: 'secondary' },
  { label: 'أخضر', value: 'success' },
  { label: 'أحمر', value: 'error' },
  { label: 'بنفسجي', value: 'purple' },
  { label: 'وردي', value: 'pink' }
]

const save = () => {
  if (presetName.value.trim()) {
    emit('save', {
      name: presetName.value.trim(),
      icon: selectedIcon.value,
      color: selectedColor.value
    })
    resetForm()
    isOpen.value = false
  }
}

const cancel = () => {
  resetForm()
  isOpen.value = false
}

const resetForm = () => {
  presetName.value = ''
  selectedIcon.value = 'mdi-filter'
  selectedColor.value = 'primary'
}
</script>
