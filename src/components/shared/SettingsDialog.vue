<template>
  <v-dialog v-model="isOpen" max-width="800" scrollable>
    <v-card>
      <v-card-title class="d-flex align-center bg-primary">
        <v-icon icon="mdi-cog" class="ml-2" color="white" />
        <span class="text-white">الإعدادات</span>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-0">
        <v-row no-gutters>
          <!-- Sidebar Tabs -->
          <v-col cols="12" md="3" class="border-e">
            <v-list density="comfortable" nav>
              <v-list-item
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                :active="activeTab === tab.value"
                @click="activeTab = tab.value"
              >
                <template #prepend>
                  <v-icon :icon="tab.icon" />
                </template>
                <v-list-item-title>{{ tab.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>

          <!-- Content Area -->
          <v-col cols="12" md="9">
            <div class="pa-6">
              <!-- Dashboard Tab -->
              <div v-if="activeTab === 'dashboard'">
                <h3 class="text-h6 mb-4">إعدادات لوحة المعلومات</h3>

                <v-switch
                  v-model="localPrefs.showRecentOrders"
                  label="عرض الطلبات الأخيرة"
                  color="primary"
                  hide-details
                  class="mb-4"
                />

                <v-select
                  v-model="localPrefs.kpiLayout"
                  :items="layoutOptions"
                  label="تخطيط المؤشرات"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="mb-4"
                />

                <div class="mb-4">
                  <label class="text-subtitle-2 mb-2 d-block">
                    ارتفاع الرسوم البيانية: {{ localPrefs.chartHeight }}px
                  </label>
                  <v-slider
                    v-model="localPrefs.chartHeight"
                    :min="200"
                    :max="500"
                    :step="50"
                    show-ticks="always"
                    tick-size="4"
                    color="primary"
                  />
                </div>
              </div>

              <!-- Table Tab -->
              <div v-if="activeTab === 'table'">
                <h3 class="text-h6 mb-4">إعدادات الجداول</h3>

                <v-select
                  v-model="localPrefs.defaultRowsPerPage"
                  :items="rowsPerPageOptions"
                  label="عدد الصفوف الافتراضي في الصفحة"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="mb-4"
                />

                <v-switch
                  v-model="localPrefs.compactMode"
                  label="الوضع المضغوط للجداول"
                  color="primary"
                  hide-details
                  class="mb-2"
                />
                <p class="text-caption text-grey mb-4">
                  يقلل المسافات بين الصفوف لعرض المزيد من البيانات
                </p>
              </div>

              <!-- Theme Tab -->
              <div v-if="activeTab === 'theme'">
                <h3 class="text-h6 mb-4">إعدادات المظهر</h3>

                <label class="text-subtitle-2 mb-2 d-block">لون التمييز</label>
                <v-chip-group
                  v-model="selectedColorIndex"
                  mandatory
                  column
                  class="mb-4"
                >
                  <v-chip
                    v-for="(color, index) in accentColors"
                    :key="color.value"
                    :value="index"
                    :color="color.value"
                    filter
                    size="large"
                  >
                    <v-icon icon="mdi-check" start />
                    {{ color.label }}
                  </v-chip>
                </v-chip-group>

                <v-alert type="info" variant="tonal" density="compact">
                  سيتم تطبيق اللون المحدد على الأزرار والعناصر البارزة
                </v-alert>
              </div>

              <!-- Notifications Tab -->
              <div v-if="activeTab === 'notifications'">
                <h3 class="text-h6 mb-4">إعدادات الإشعارات</h3>

                <v-switch
                  v-model="localPrefs.enableSounds"
                  label="تفعيل الأصوات"
                  color="primary"
                  hide-details
                  class="mb-2"
                />
                <p class="text-caption text-grey mb-4">
                  تشغيل صوت عند استلام إشعار جديد
                </p>

                <v-switch
                  v-model="localPrefs.enableDesktopNotifications"
                  label="إشعارات سطح المكتب"
                  color="primary"
                  hide-details
                  class="mb-2"
                />
                <p class="text-caption text-grey mb-4">
                  عرض إشعارات سطح المكتب حتى عند عدم فتح التطبيق
                </p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-btn variant="text" @click="resetToDefaults">
          <v-icon icon="mdi-restore" start />
          إعادة تعيين
        </v-btn>
        <v-spacer />
        <v-btn variant="text" @click="cancel">إلغاء</v-btn>
        <v-btn color="primary" @click="save">
          <v-icon icon="mdi-content-save" start />
          حفظ
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePreferencesStore } from '@/stores/preferences'
import { useNotification } from '@/composables/useNotification'
import { useConfirm } from '@/composables/useConfirm'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const preferencesStore = usePreferencesStore()
const { showSuccess } = useNotification()
const { confirm } = useConfirm()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const activeTab = ref('dashboard')

// Local copy of preferences for editing
const localPrefs = ref({ ...preferencesStore.$state })

// Watch for dialog open to reset local prefs
watch(isOpen, (value) => {
  if (value) {
    localPrefs.value = { ...preferencesStore.$state }
  }
})

const tabs = [
  { value: 'dashboard', title: 'لوحة المعلومات', icon: 'mdi-view-dashboard' },
  { value: 'table', title: 'الجداول', icon: 'mdi-table' },
  { value: 'theme', title: 'المظهر', icon: 'mdi-palette' },
  { value: 'notifications', title: 'الإشعارات', icon: 'mdi-bell' }
]

const layoutOptions = [
  { title: 'شبكة', value: 'grid' },
  { title: 'قائمة', value: 'list' }
]

const rowsPerPageOptions = [10, 20, 50, 100]

const accentColors = [
  { label: 'سماوي', value: '#00E5FF' },
  { label: 'أزرق', value: '#2196F3' },
  { label: 'بنفسجي', value: '#9C27B0' },
  { label: 'وردي', value: '#E91E63' },
  { label: 'برتقالي', value: '#FF9800' },
  { label: 'أخضر', value: '#4CAF50' }
]

const selectedColorIndex = computed({
  get: () => accentColors.findIndex(c => c.value === localPrefs.value.accentColor),
  set: (index) => {
    if (accentColors[index]) {
      localPrefs.value.accentColor = accentColors[index].value
    }
  }
})

const save = () => {
  preferencesStore.updatePreferences(localPrefs.value)
  showSuccess('تم حفظ الإعدادات بنجاح')
  isOpen.value = false
}

const cancel = () => {
  localPrefs.value = { ...preferencesStore.$state }
  isOpen.value = false
}

const resetToDefaults = async () => {
  const confirmed = await confirm({
    title: 'إعادة تعيين الإعدادات',
    message: 'هل تريد إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟',
    type: 'warning',
    confirmText: 'إعادة تعيين',
    confirmColor: 'warning'
  })

  if (confirmed) {
    preferencesStore.resetToDefaults()
    localPrefs.value = { ...preferencesStore.$state }
    showSuccess('تم إعادة تعيين الإعدادات')
  }
}
</script>

<style scoped>
.border-e {
  border-inline-end: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
