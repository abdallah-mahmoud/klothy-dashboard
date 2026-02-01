<template>
  <v-menu location="bottom">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        prepend-icon="mdi-bookmark"
        variant="outlined"
        color="primary"
      >
        الإعدادات المحفوظة
        <v-badge
          v-if="savedPresets.length > 0"
          :content="savedPresets.length"
          color="secondary"
          inline
          class="mr-2"
        />
      </v-btn>
    </template>

    <v-card min-width="320" max-width="400">
      <v-card-title class="text-subtitle-1 font-weight-bold">
        فلاتر محفوظة
      </v-card-title>

      <v-divider />

      <!-- Preset List -->
      <v-list v-if="savedPresets.length > 0" density="compact">
        <v-list-item
          v-for="preset in savedPresets"
          :key="preset.id"
          @click="handleApplyPreset(preset)"
          class="preset-item"
        >
          <template #prepend>
            <v-avatar :color="preset.color" size="32">
              <v-icon :icon="preset.icon" size="18" color="white" />
            </v-avatar>
          </template>
          
          <v-list-item-title class="text-body-2 font-weight-medium">
            {{ preset.name }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            {{ preset.filterCount }} فلتر
          </v-list-item-subtitle>

          <template #append>
            <v-btn
              icon="mdi-delete"
              variant="text"
              size="x-small"
              color="error"
              @click.stop="handleDeletePreset(preset.id)"
            />
          </template>
        </v-list-item>
      </v-list>

      <!-- Empty State -->
      <div v-else class="pa-6 text-center">
        <v-icon icon="mdi-bookmark-outline" size="48" color="grey-lighten-2" class="mb-2" />
        <p class="text-body-2 text-grey">لا توجد إعدادات محفوظة</p>
      </div>

      <v-divider />

      <!-- Save Current Filters Button -->
      <v-list density="compact">
        <v-list-item
          prepend-icon="mdi-content-save"
          @click="$emit('save-current')"
          class="save-preset-item"
        >
          <v-list-item-title class="text-body-2 font-weight-medium">
            حفظ الفلاتر الحالية
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { useConfirm } from '@/composables/useConfirm'
import type { FilterPreset } from '@/composables/useFilterPresets'

interface Props {
  savedPresets: FilterPreset[]
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'apply-preset', preset: FilterPreset): void
  (e: 'delete-preset', id: string): void
  (e: 'save-current'): void
}>()

const { confirm } = useConfirm()

const handleApplyPreset = (preset: FilterPreset) => {
  emit('apply-preset', preset)
}

const handleDeletePreset = async (id: string) => {
  const confirmed = await confirm({
    title: 'حذف الإعداد',
    message: 'هل تريد حذف هذا الإعداد المحفوظ؟',
    type: 'warning',
    confirmText: 'حذف',
    confirmColor: 'error'
  })
  
  if (confirmed) {
    emit('delete-preset', id)
  }
}
</script>

<style scoped>
.preset-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.preset-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.save-preset-item {
  cursor: pointer;
  background-color: rgba(0, 229, 255, 0.05);
}

.save-preset-item:hover {
  background-color: rgba(0, 229, 255, 0.1);
}
</style>
