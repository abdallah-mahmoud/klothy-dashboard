<template>
  <v-dialog v-model="isOpen" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">اختصارات لوحة المفاتيح</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="isOpen = false"
          aria-label="إغلاق"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-0">
        <v-list>
          <v-list-subheader>التنقل</v-list-subheader>
          <v-list-item
            v-for="shortcut in navigationShortcuts"
            :key="shortcut.key"
          >
            <template #prepend>
              <v-chip size="small" variant="tonal" color="primary" class="font-mono">
                {{ shortcut.key }}
              </v-chip>
            </template>
            <v-list-item-title>{{ shortcut.description }}</v-list-item-title>
          </v-list-item>

          <v-divider class="my-2" />

          <v-list-subheader>عام</v-list-subheader>
          <v-list-item
            v-for="shortcut in generalShortcuts"
            :key="shortcut.key"
          >
            <template #prepend>
              <v-chip size="small" variant="tonal" color="secondary" class="font-mono">
                {{ shortcut.key }}
              </v-chip>
            </template>
            <v-list-item-title>{{ shortcut.description }}</v-list-item-title>
          </v-list-item>

          <v-divider class="my-2" />

          <v-list-subheader>مساعدة</v-list-subheader>
          <v-list-item
            v-for="shortcut in helpShortcuts"
            :key="shortcut.key"
          >
            <template #prepend>
              <v-chip size="small" variant="tonal" color="info" class="font-mono">
                {{ shortcut.key }}
              </v-chip>
            </template>
            <v-list-item-title>{{ shortcut.description }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="isOpen = false">إغلاق</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { keyboardShortcuts } from '@/composables/useKeyboardShortcuts'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const navigationShortcuts = computed(() =>
  keyboardShortcuts.filter(s => s.category === 'navigation')
)

const generalShortcuts = computed(() =>
  keyboardShortcuts.filter(s => s.category === 'general')
)

const helpShortcuts = computed(() =>
  keyboardShortcuts.filter(s => s.category === 'help')
)
</script>

<style scoped>
.font-mono {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
}
</style>
