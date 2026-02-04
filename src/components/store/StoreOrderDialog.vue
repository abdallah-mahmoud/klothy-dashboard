<template>
  <v-dialog v-model="dialogVisible" max-width="700">
    <v-card v-if="order">
      <!-- Header -->
      <v-toolbar color="white" border="b" class="px-4">
        <v-toolbar-title class="font-weight-bold text-h6">
          <span class="text-primary">{{ order.orderNumber }}</span>
          <v-chip size="small" :color="getStatusColor(order.status)" class="mr-3" variant="flat">
            {{ getStatusText(order.status) }}
          </v-chip>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" size="small" @click="dialogVisible = false"></v-btn>
      </v-toolbar>

      <v-card-text class="pa-0 bg-grey-lighten-5">
        <v-container class="pa-4">
          <v-row>
            <!-- Customer Info -->
            <v-col cols="12" md="6">
              <v-card elevation="0" border class="h-100">
                <v-card-text>
                  <div class="text-caption text-grey mb-1">العميل</div>
                  <div class="d-flex align-center mb-4">
                    <v-avatar color="primary" variant="tonal" size="40" class="ml-3">
                      <span class="text-h6 font-weight-bold">{{ order.customer?.charAt(0) }}</span>
                    </v-avatar>
                    <div>
                      <div class="font-weight-bold text-body-1">{{ order.customer }}</div>
                      <div class="text-caption text-grey">عميل كلوثي</div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Order Stats -->
            <v-col cols="12" md="6">
              <v-card elevation="0" border class="h-100">
                <v-card-text>
                  <div class="d-flex justify-space-between mb-2">
                    <span class="text-grey text-caption">تاريخ الطلب</span>
                    <span class="font-weight-bold">{{ order.date || '02/02/2026 - 10:30 ص' }}</span>
                  </div>
                   <div class="d-flex justify-space-between mb-2">
                    <span class="text-grey text-caption">طريقة الدفع</span>
                    <span class="font-weight-bold">محفظة التطبيق</span>
                  </div>
                  <v-divider class="my-3"></v-divider>
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-grey text-body-2">إجمالي الخدمات</span>
                    <span class="text-h6 font-weight-bold text-primary">{{ order.total || '45.00' }} ر.س</span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Items List -->
          <v-card elevation="0" border class="mt-4">
            <v-card-title class="text-subtitle-1 font-weight-bold bg-grey-lighten-4 py-2 px-4 border-b">
              تفاصيل الأصناف ({{ order.itemsCount || order.items }} صنف)
            </v-card-title>
            <v-card-text class="pa-0">
              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-right">الصنف</th>
                    <th class="text-center">الكمية</th>
                    <th class="text-center">السعر</th>
                    <th class="text-end">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in (order.details || mockItems)" :key="item.id">
                    <td>
                      <div class="py-2">
                        <div class="font-weight-bold">{{ item.name }}</div>
                        <div class="text-caption text-grey">{{ item.service }}</div>
                      </div>
                    </td>
                    <td class="text-center">{{ item.qty }}</td>
                    <td class="text-center">{{ item.price }}</td>
                    <td class="text-end font-weight-bold">{{ item.total }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-container>
      </v-card-text>

      <!-- Actions Footer -->
      <v-divider></v-divider>
      <v-card-actions class="pa-4 bg-white">
        <v-btn variant="outlined" color="grey" @click="dialogVisible = false">إغلاق</v-btn>
        <v-spacer></v-spacer>
        <!-- Dynamic Actions based on Status -->
        <v-btn v-if="order.status === 'incoming'" color="primary" variant="flat" prepend-icon="mdi-check" @click="$emit('accept', order)">استلام الطلب</v-btn>
        <v-btn v-if="order.status === 'receiving'" color="deep-orange" variant="flat" prepend-icon="mdi-check-all" @click="$emit('confirm-receive', order)">تأكيد الاستلام</v-btn>
        <v-btn v-if="order.status === 'processing'" color="blue" variant="flat" prepend-icon="mdi-check-circle-outline" @click="$emit('ready', order)">تعيين كجاهز</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  order: any
}>()

const emit = defineEmits(['update:modelValue', 'accept', 'confirm-receive', 'ready'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// MOCK Data helpers
const mockItems = [
  { id: 1, name: 'ثوب أبيض', service: 'غسيل وكوي', qty: 3, price: '8.00', total: '24.00' },
  { id: 2, name: 'شماغ', service: 'كوي فقط', qty: 2, price: '5.00', total: '10.00' },
  { id: 3, name: 'بنطلون جينز', service: 'غسيل جاف', qty: 1, price: '11.00', total: '11.00' },
]

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    incoming: 'orange',
    receiving: 'deep-orange',
    processing: 'blue',
    ready: 'success'
  }
  return colors[status] || 'grey'
}

function getStatusText(status: string) {
  const texts: Record<string, string> = {
    incoming: 'طلب جديد',
    receiving: 'انتظار الاستلام',
    processing: 'جاري الغسيل',
    ready: 'جاهز للتسليم'
  }
  return texts[status] || status
}
</script>

<style scoped>
.v-table th {
  font-weight: bold !important;
  color: var(--text-secondary);
}
</style>
