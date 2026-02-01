<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-2" style="color: #1A237E">
        معالجة الطلب
      </h1>
      <p class="text-grey-darken-1">تأكيد العناصر ووضع الملاحظات</p>
    </div>

    <!-- Order Info Card -->
    <v-card class="mb-4" elevation="2">
      <v-card-title class="bg-primary text-white">
        معلومات الطلب #{{ order.orderNumber }}
      </v-card-title>
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-3">
              <v-icon color="primary" class="ml-2">mdi-account</v-icon>
              <div>
                <div class="text-caption text-grey">العميل</div>
                <div class="font-weight-bold">{{ order.customer }}</div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-3">
              <v-icon color="blue" class="ml-2">mdi-clock</v-icon>
              <div>
                <div class="text-caption text-grey">الوقت المتوقع للتسليم</div>
                <div class="font-weight-bold">{{ order.expectedDelivery }}</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Items Checklist -->
    <v-card elevation="2" class="mb-4">
      <v-card-title>العناصر المستلمة</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="item in order.items"
            :key="item.id"
            class="border-b pa-4"
          >
            <template #prepend>
              <v-checkbox
                v-model="item.received"
                color="success"
                @update:model-value="updateItemStatus(item)"
              ></v-checkbox>
            </template>

            <div class="flex-grow-1">
              <v-list-item-title class="text-h6 mb-2">
                {{ item.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ item.service }} - الكمية: {{ item.quantity }}
              </v-list-item-subtitle>

              <!-- Condition Selection -->
              <v-chip-group
                v-model="item.condition"
                mandatory
                class="mt-2"
              >
                <v-chip value="good" color="green" filter size="small">
                  <v-icon start>mdi-check-circle</v-icon>
                  حالة جيدة
                </v-chip>
                <v-chip value="stained" color="orange" filter size="small">
                  <v-icon start>mdi-water</v-icon>
                  به بقع
                </v-chip>
                <v-chip value="damaged" color="red" filter size="small">
                  <v-icon start>mdi-alert</v-icon>
                  تالف
                </v-chip>
              </v-chip-group>

              <!-- Notes for item -->
              <v-textarea
                v-if="item.condition !== 'good'"
                v-model="item.notes"
                label="ملاحظات"
                rows="2"
                variant="outlined"
                density="compact"
                class="mt-2"
                placeholder="أضف ملاحظات حول البقع أو التلف..."
              ></v-textarea>
            </div>

            <template #append>
              <div class="text-left">
                <div class="text-h6 font-weight-bold">{{ item.price }} ر.س</div>
                <div class="text-caption text-grey">× {{ item.quantity }}</div>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- Photo Upload -->
    <v-card elevation="2" class="mb-4">
      <v-card-title>صور العناصر</v-card-title>
      <v-card-text>
        <v-file-input
          label="التقاط صور للعناصر قبل الغسيل"
          prepend-icon="mdi-camera"
          variant="outlined"
          multiple
          accept="image/*"
          chips
        ></v-file-input>
        <div class="text-caption text-grey mt-2">
          يُنصح بالتقاط صور للعناصر ذات البقع أو التلف
        </div>
      </v-card-text>
    </v-card>

    <!-- General Notes -->
    <v-card elevation="2" class="mb-4">
      <v-card-title>ملاحظات عامة</v-card-title>
      <v-card-text>
        <v-textarea
          v-model="generalNotes"
          label="أضف أي ملاحظات إضافية"
          rows="3"
          variant="outlined"
          placeholder="مثال: العميل طلب الاستعجال، يرجى إتمام الطلب في 24 ساعة"
        ></v-textarea>
      </v-card-text>
    </v-card>

    <!-- Action Buttons -->
    <v-card elevation="2">
      <v-card-text>
        <div class="d-flex gap-3 justify-end">
          <v-btn
            color="grey"
            variant="outlined"
            size="large"
            @click="saveProgress"
          >
            حفظ كمسودة
          </v-btn>
          <v-btn
            color="success"
            variant="flat"
            size="large"
            prepend-icon="mdi-check-bold"
            :disabled="!allItemsReceived"
            @click="confirmReceiving"
          >
            تأكيد الاستلام والبدء في الغسيل
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const generalNotes = ref('')

// Mock order data
const order = ref({
  orderNumber: 'ORD-1243',
  customer: 'خالد سعيد',
  expectedDelivery: 'غداً 3:00 م',
  items: [
    {
      id: 1,
      name: 'ثوب',
      service: 'غسيل وكوي',
      quantity: 3,
      price: 30,
      received: false,
      condition: 'good',
      notes: '',
    },
    {
      id: 2,
      name: 'شماغ',
      service: 'كوي فقط',
      quantity: 2,
      price: 15,
      received: false,
      condition: 'good',
      notes: '',
    },
    {
      id: 3,
      name: 'قميص',
      service: 'غسيل وكوي',
      quantity: 5,
      price: 20,
      received: false,
      condition: 'good',
      notes: '',
    },
  ],
})

const allItemsReceived = computed(() => {
  return order.value.items.every((item) => item.received)
})

function updateItemStatus(item: any) {
  console.log('Item status updated:', item.name, item.received)
}

function saveProgress() {
  console.log('Save progress')
  // TODO: Save to backend as draft
}

function confirmReceiving() {
  console.log('Confirm receiving')
  // TODO: Call API to confirm and move to processing
  router.push('/store/kanban')
}
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid #E0E0E0;
}

.gap-3 {
  gap: 12px;
}
</style>
