<template>
  <v-dialog v-model="dialogVisible" max-width="500">
    <v-card>
      <v-toolbar color="white" border="b" class="px-4">
        <v-toolbar-title class="font-weight-bold text-h6">
          {{ isEdit ? 'تعديل الخدمة' : 'إضافة خدمة جديدة' }}
        </v-toolbar-title>
        <v-btn icon="mdi-close" variant="text" size="small" @click="dialogVisible = false"></v-btn>
      </v-toolbar>

      <v-card-text class="pa-4">
        <v-form ref="form" v-model="valid">
          <!-- Service Name -->
          <div class="mb-4">
            <div class="text-caption font-weight-bold mb-1">اسم الخدمة</div>
            <v-text-field
              v-model="editedItem.name"
              placeholder="مثال: ثوب، شماغ، فستان..."
              variant="outlined"
              density="compact"
              :rules="[v => !!v || 'اسم الخدمة مطلوب']"
            ></v-text-field>
          </div>

          <!-- Category -->
          <div class="mb-4">
            <div class="text-caption font-weight-bold mb-1">الفئة</div>
            <v-select
              v-model="editedItem.category"
              :items="categories"
              placeholder="اختر الفئة"
              variant="outlined"
              density="compact"
              :rules="[v => !!v || 'الفئة مطلوبة']"
            ></v-select>
          </div>

          <v-row>
            <!-- Price -->
            <v-col cols="6">
              <div class="text-caption font-weight-bold mb-1">السعر (ر.س)</div>
              <v-text-field
                v-model="editedItem.price"
                type="number"
                placeholder="0.00"
                variant="outlined"
                density="compact"
                :rules="[v => !!v || 'السعر مطلوب']"
                min="0"
              ></v-text-field>
            </v-col>

            <!-- Duration -->
            <v-col cols="6">
              <div class="text-caption font-weight-bold mb-1">المدة المتوقعة</div>
              <v-select
                v-model="editedItem.duration"
                :items="durations"
                placeholder="اختر المدة"
                variant="outlined"
                density="compact"
              ></v-select>
            </v-col>
          </v-row>

          <!-- Status Toggle (for Edit only) -->
          <v-card v-if="isEdit" border flat class="pa-3 mt-2 d-flex align-center justify-space-between bg-grey-lighten-5">
            <div class="d-flex align-center">
              <v-icon :color="editedItem.active ? 'success' : 'grey'" class="ml-2">
                {{ editedItem.active ? 'mdi-check-circle' : 'mdi-circle-off-outline' }}
              </v-icon>
              <div>
                <div class="font-weight-bold text-caption">حالة الخدمة</div>
                <div class="text-caption text-grey">{{ editedItem.active ? 'متاح للطلب' : 'غير متاح حالياً' }}</div>
              </div>
            </div>
            <v-switch
              v-model="editedItem.active"
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
          {{ isEdit ? 'حفظ التغييرات' : 'إضافة الخدمة' }}
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

const categories = ['ملابس رجالية', 'ملابس نسائية', 'أطفال', 'مفروشات', 'غسيل جاف', 'كي فقط']
const durations = ['24 ساعة', '48 ساعة', '72 ساعة', 'فوري (6 ساعات)']

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!editedItem.value.id)

watch(() => props.item, (newVal) => {
  if (newVal) {
    editedItem.value = { ...newVal }
  } else {
    // Reset for new item
    editedItem.value = {
      name: '',
      category: null,
      price: '',
      duration: '24 ساعة',
      active: true
    }
  }
}, { immediate: true })

function save() {
  emit('save', editedItem.value)
  dialogVisible.value = false
}
</script>
