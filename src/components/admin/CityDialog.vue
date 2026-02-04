<template>
  <v-dialog v-model="dialogVisible" max-width="500">
    <v-card>
      <v-toolbar color="white" border="b" class="px-4">
        <v-toolbar-title class="font-weight-bold text-h6">
          {{ isEdit ? 'تعديل المدينة' : 'إضافة مدينة جديدة' }}
        </v-toolbar-title>
        <v-btn icon="mdi-close" variant="text" size="small" @click="dialogVisible = false"></v-btn>
      </v-toolbar>

      <v-card-text class="pa-4">
        <v-form ref="form" v-model="valid">
          <!-- City Name (Arabic) -->
          <div class="mb-4">
            <div class="text-caption font-weight-bold mb-1">اسم المدينة (بالعربية)</div>
            <v-text-field
              v-model="editedItem.nameAr"
              placeholder="مثال: الرياض، جدة، الدمام..."
              variant="outlined"
              density="compact"
              :rules="[v => !!v || 'اسم المدينة بالعربية مطلوب']"
            ></v-text-field>
          </div>

          <!-- City Name (English) -->
          <div class="mb-4">
            <div class="text-caption font-weight-bold mb-1">اسم المدينة (بالإنجليزية)</div>
            <v-text-field
              v-model="editedItem.nameEn"
              placeholder="Example: Riyadh, Jeddah, Dammam..."
              variant="outlined"
              density="compact"
              dir="ltr"
              :rules="[v => !!v || 'اسم المدينة بالإنجليزية مطلوب']"
            ></v-text-field>
          </div>

          <!-- Status Toggle -->
          <v-card v-if="isEdit" border flat class="pa-3 mt-2 d-flex align-center justify-space-between bg-grey-lighten-5">
            <div class="d-flex align-center">
              <v-icon :color="editedItem.status === 'active' ? 'success' : 'grey'" class="ml-2">
                {{ editedItem.status === 'active' ? 'mdi-check-circle' : 'mdi-circle-off-outline' }}
              </v-icon>
              <div>
                <div class="font-weight-bold text-caption">حالة المدينة</div>
                <div class="text-caption text-grey">{{ editedItem.status === 'active' ? 'متاحة للطلبات' : 'معطلة حالياً' }}</div>
              </div>
            </div>
            <v-switch
              v-model="statusActive"
              color="success"
              hide-details
              density="compact"
              inset
            ></v-switch>
          </v-card>

        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn variant="outlined" color="grey" @click="dialogVisible = false">إلغاء</v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :disabled="!valid"
          @click="save"
        >
          {{ isEdit ? 'حفظ التغييرات' : 'إضافة المدينة' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  item: any
}>()

const emit = defineEmits(['update:modelValue', 'save'])

const valid = ref(false)
const editedItem = ref<any>({})

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!editedItem.value.id)

const statusActive = computed({
  get: () => editedItem.value.status === 'active',
  set: (val) => editedItem.value.status = val ? 'active' : 'inactive'
})

watch(() => props.item, (newVal) => {
  if (newVal) {
    editedItem.value = { ...newVal }
  } else {
    // Reset for new item
    editedItem.value = {
      nameAr: '',
      nameEn: '',
      status: 'active'
    }
  }
}, { immediate: true })

function save() {
  emit('save', editedItem.value)
  dialogVisible.value = false
}
</script>
