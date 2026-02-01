<template>
  <div>
    <!-- Back Button -->
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-right"
      class="mb-4"
      to="/admin/orders"
    >
      العودة إلى الطلبات
    </v-btn>

    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2" style="color: #1A237E">
          {{ order.orderNumber }}
        </h1>
        <p class="text-grey-darken-1">تفاصيل الطلب الكاملة</p>
      </div>
      <div class="d-flex gap-2">
        <v-btn color="primary" variant="outlined" prepend-icon="mdi-printer">
          طباعة
        </v-btn>
        <v-btn color="error" variant="outlined" prepend-icon="mdi-cancel">
          إلغاء الطلب
        </v-btn>
      </div>
    </div>

    <!-- Three Column Layout -->
    <v-row>
      <!-- Left Column - Customer & Location -->
      <v-col cols="12" md="4">
        <!-- Customer Card -->
        <v-card class="mb-4" elevation="2">
          <v-card-title>بيانات العميل</v-card-title>
          <v-card-text>
            <div class="d-flex align-center mb-4">
              <v-avatar size="56" color="primary" class="ml-3">
                <span class="text-h5 text-white">{{ order.client[0] }}</span>
              </v-avatar>
              <div>
                <div class="font-weight-bold text-h6">{{ order.client }}</div>
                <div class="text-caption text-grey">عميل منذ 2025</div>
              </div>
            </div>

            <v-list density="compact">
              <v-list-item prepend-icon="mdi-phone">
                <v-list-item-title class="d-flex align-center justify-space-between">
                  <span>{{ order.phone }}</span>
                  <v-btn icon="mdi-phone" size="small" color="primary" variant="tonal"></v-btn>
                </v-list-item-title>
              </v-list-item>
              <v-list-item prepend-icon="mdi-map-marker">
                <v-list-item-title>{{ order.address }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Map Card -->
        <v-card elevation="2">
          <v-card-title>الموقع</v-card-title>
          <v-card-text class="pa-0">
            <div style="height: 200px; background: #E0E0E0; position: relative">
              <div class="d-flex align-center justify-center" style="height: 100%">
                <v-icon size="48" color="primary">mdi-map</v-icon>
              </div>
              <!-- Placeholder for Google Maps -->
            </div>
            <div class="pa-4">
              <div class="d-flex align-center mb-2">
                <v-icon color="green" class="ml-2">mdi-alpha-a-circle</v-icon>
                <span class="text-caption">نقطة الاستلام: {{ order.address }}</span>
              </div>
              <div class="d-flex align-center">
                <v-icon color="blue" class="ml-2">mdi-alpha-b-circle</v-icon>
                <span class="text-caption">المغسلة: {{ order.laundry }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Center Column - Invoice & Items -->
      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title>الفاتورة</v-card-title>
          <v-card-text>
            <!-- Items List -->
            <div class="mb-4">
              <div class="text-subtitle-2 font-weight-bold mb-3">الأصناف المطلوبة</div>
              <v-list>
                <v-list-item
                  v-for="item in order.items"
                  :key="item.id"
                  class="px-0"
                >
                  <template #prepend>
                    <v-avatar color="grey-lighten-3" class="ml-3">
                      <v-icon color="primary">{{ item.icon }}</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.service }}</v-list-item-subtitle>
                  <template #append>
                    <div class="text-left">
                      <div class="font-weight-bold">{{ item.price }} ر.س</div>
                      <div class="text-caption">× {{ item.quantity }}</div>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- Payment Summary -->
            <div class="text-subtitle-2 font-weight-bold mb-3">ملخص الدفع</div>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-grey">المجموع</span>
              <span>{{ order.subtotal }} ر.س</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-grey">الضريبة (15%)</span>
              <span>{{ order.tax }} ر.س</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-grey">رسوم التوصيل</span>
              <span>{{ order.delivery }} ر.س</span>
            </div>
            <div class="d-flex justify-space-between mb-2 text-success">
              <span>الخصم</span>
              <span>-{{ order.discount }} ر.س</span>
            </div>
            <v-divider class="my-3"></v-divider>
            <div class="d-flex justify-space-between text-h6 font-weight-bold">
              <span>الإجمالي</span>
              <span>{{ order.total }} ر.س</span>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- Payment Method -->
            <div class="d-flex align-center">
              <v-icon color="primary" class="ml-2">mdi-credit-card</v-icon>
              <span>Visa ****{{ order.cardLastFour }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right Column - Timeline & Actions -->
      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title>تتبع الطلب</v-card-title>
          <v-card-text>
            <!-- Timeline -->
            <v-timeline side="end" density="compact">
              <v-timeline-item
                v-for="(event, index) in order.timeline"
                :key="index"
                :dot-color="event.completed ? 'success' : event.current ? 'primary' : 'grey-lighten-2'"
                size="small"
              >
                <template #icon>
                  <v-icon v-if="event.completed" size="16">mdi-check</v-icon>
                  <v-icon v-else-if="event.current" size="16">mdi-circle</v-icon>
                </template>
                <div class="mb-4">
                  <div
                    class="font-weight-bold"
                    :class="event.current ? 'text-primary' : event.completed ? '' : 'text-grey'"
                  >
                    {{ event.title }}
                  </div>
                  <div class="text-caption text-grey">{{ event.time }}</div>
                  <div v-if="event.description" class="text-caption mt-1">
                    {{ event.description }}
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>

            <v-divider class="my-4"></v-divider>

            <!-- Action Buttons -->
            <div class="d-flex flex-column gap-2">
              <v-btn
                color="primary"
                variant="tonal"
                prepend-icon="mdi-account-switch"
                block
                @click="reassignDriver"
              >
                إعادة تعيين مندوب
              </v-btn>
              <v-btn
                color="error"
                variant="outlined"
                prepend-icon="mdi-cancel"
                block
                @click="cancelOrder"
              >
                إلغاء الطلب
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Mock order data
const order = ref({
  id: route.params.id,
  orderNumber: '#ORD-1234',
  client: 'أحمد محمد',
  phone: '+966 50 123 4567',
  address: 'حي النخيل، شارع الملك فهد، الرياض',
  laundry: 'مغسلة النظافة',
  cardLastFour: '1234',
  subtotal: 213.04,
  tax: 31.96,
  delivery: 15.00,
  discount: 15.00,
  total: 245.00,
  items: [
    {
      id: 1,
      name: 'ثوب',
      service: 'غسيل وكوي',
      quantity: 3,
      price: 30.00,
      icon: 'mdi-hanger',
    },
    {
      id: 2,
      name: 'شماغ',
      service: 'كوي فقط',
      quantity: 2,
      price: 15.00,
      icon: 'mdi-scarf',
    },
    {
      id: 3,
      name: 'قميص',
      service: 'غسيل وكوي',
      quantity: 5,
      price: 20.00,
      icon: 'mdi-tshirt-crew',
    },
  ],
  timeline: [
    {
      title: 'تم إنشاء الطلب',
      time: '10:00 ص',
      description: 'تم استلام الطلب من العميل',
      completed: true,
      current: false,
    },
    {
      title: 'تم تعيين المندوب',
      time: '10:05 ص',
      description: 'المندوب: خالد السائق',
      completed: true,
      current: false,
    },
    {
      title: 'جاري الاستلام',
      time: '10:20 ص',
      description: 'المندوب في الطريق للعميل',
      completed: false,
      current: true,
    },
    {
      title: 'وصل للمغسلة',
      time: '',
      description: '',
      completed: false,
      current: false,
    },
    {
      title: 'جاري الغسيل',
      time: '',
      description: '',
      completed: false,
      current: false,
    },
    {
      title: 'جاهز للتسليم',
      time: '',
      description: '',
      completed: false,
      current: false,
    },
    {
      title: 'تم التسليم',
      time: '',
      description: '',
      completed: false,
      current: false,
    },
  ],
})

function reassignDriver() {
  console.log('Reassign driver')
  // TODO: Open driver selection dialog
}

function cancelOrder() {
  console.log('Cancel order')
  // TODO: Open cancellation dialog
}
</script>
