<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-2" style="color: #1F2E45">
        لوحة كانبان - الطلبات
      </h1>
      <p class="text-secondary">إدارة الطلبات من الاستلام إلى الجاهزية</p>
    </div>

    <!-- Kanban Board -->
    <v-row>
      <!-- Column 1: Incoming (Yellow) -->
      <v-col cols="12" md="3">
        <div class="kanban-column incoming">
          <div class="kanban-column-header glass-card">
            <v-icon color="#FFA500" class="ml-2" size="24">mdi-truck-delivery</v-icon>
            <span class="column-title">قادم إليك</span>
            <v-spacer></v-spacer>
            <v-chip size="small" color="#FFA500" class="mr-2">{{ incomingOrders.length }}</v-chip>
          </div>
          <v-card
            v-for="order in incomingOrders"
            :key="order.id"
            class="kanban-card modern-card pa-4"
            elevation="0"
          >
            <div class="d-flex justify-space-between mb-2">
              <span class="font-weight-bold">{{ order.orderNumber }}</span>
              <v-chip size="x-small" color="orange">{{ order.eta }}</v-chip>
            </div>
            <div class="text-caption mb-2">{{ order.customer }}</div>
            <div class="text-caption text-grey">{{ order.items }} صنف</div>
            <div class="d-flex align-center mt-2">
              <v-icon size="16" color="grey" class="ml-1">mdi-clock-outline</v-icon>
              <span class="text-caption text-grey">{{ order.time }}</span>
            </div>
          </v-card>
        </div>
      </v-col>

      <!-- Column 2: Receiving (Orange) -->
      <v-col cols="12" md="3">
        <div class="kanban-column receiving">
          <div class="kanban-column-header glass-card">
            <v-icon color="#E65100" class="ml-2" size="24">mdi-hand-back-right</v-icon>
            <span class="column-title">تأكيد الاستلام</span>
            <v-spacer></v-spacer>
            <v-chip size="small" color="#E65100" class="mr-2">{{ receivingOrders.length }}</v-chip>
          </div>
          <v-card
            v-for="order in receivingOrders"
            :key="order.id"
            class="kanban-card modern-card pa-4"
            elevation="0"
          >
            <div class="d-flex justify-space-between mb-2">
              <span class="font-weight-bold">{{ order.orderNumber }}</span>
              <v-icon color="success" size="20">mdi-check-circle</v-icon>
            </div>
            <div class="text-caption mb-2">{{ order.customer }}</div>
            <div class="text-caption text-grey mb-3">{{ order.items }} صنف</div>
            <v-btn
              color="deep-orange"
              size="small"
              block
              variant="flat"
              @click="reviewOrder(order)"
            >
              مراجعة واستلام
            </v-btn>
          </v-card>
        </div>
      </v-col>

      <!-- Column 3: Processing (Blue) -->
      <v-col cols="12" md="3">
        <div class="kanban-column processing">
          <div class="kanban-column-header glass-card">
            <v-icon color="#00C2FF" class="ml-2" size="24">mdi-washing-machine</v-icon>
            <span class="column-title">جاري الغسيل</span>
            <v-spacer></v-spacer>
            <v-chip size="small" color="#00C2FF" class="mr-2">{{ processingOrders.length }}</v-chip>
          </div>
          <v-card
            v-for="order in processingOrders"
            :key="order.id"
            class="kanban-card modern-card pa-4"
            elevation="0"
          >
            <div class="d-flex justify-space-between mb-2">
              <span class="font-weight-bold">{{ order.orderNumber }}</span>
              <v-icon color="blue" size="20">mdi-progress-clock</v-icon>
            </div>
            <div class="text-caption mb-2">{{ order.customer }}</div>
            <div class="text-caption text-grey mb-2">{{ order.items }} صنف</div>
            <div class="d-flex align-center mb-3">
              <v-icon size="16" color="blue" class="ml-1">mdi-timer-outline</v-icon>
              <span class="text-caption text-blue">{{ order.duration }}</span>
            </div>
            <v-btn
              color="blue"
              size="small"
              block
              variant="outlined"
              @click="markAsReady(order)"
            >
              تم الانتهاء
            </v-btn>
          </v-card>
        </div>
      </v-col>

      <!-- Column 4: Ready (Green) -->
      <v-col cols="12" md="3">
        <div class="kanban-column ready">
          <div class="kanban-column-header glass-card">
            <v-icon color="#4CAF50" class="ml-2" size="24">mdi-check-all</v-icon>
            <span class="column-title">جاهز للتسليم</span>
            <v-spacer></v-spacer>
            <v-chip size="small" color="#4CAF50" class="mr-2">{{ readyOrders.length }}</v-chip>
          </div>
          <v-card
            v-for="order in readyOrders"
            :key="order.id"
            class="kanban-card modern-card pa-4"
            elevation="0"
          >
            <div class="d-flex justify-space-between mb-2">
              <span class="font-weight-bold">{{ order.orderNumber }}</span>
              <v-icon color="success" size="20">mdi-check-circle</v-icon>
            </div>
            <div class="text-caption mb-2">{{ order.customer }}</div>
            <div class="text-caption text-grey mb-2">{{ order.items }} صنف</div>
            <div class="d-flex align-center mb-3">
              <v-icon size="16" color="grey" class="ml-1">mdi-clock-check-outline</v-icon>
              <span class="text-caption text-grey">{{ order.readyTime }}</span>
            </div>
            <v-chip size="small" color="success" variant="outlined" block>
              في انتظار المندوب
            </v-chip>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <StoreOrderDialog
      v-model="showOrderDialog"
      :order="selectedOrder"
      @accept="handleAccept"
      @confirm-receive="handleConfirmReceive"
      @ready="markAsReady"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StoreOrderDialog from '@/components/store/StoreOrderDialog.vue'

// Mock data for each column
const incomingOrders = ref([
  {
    id: 1,
    orderNumber: '#ORD-1245',
    customer: 'أحمد محمد',
    items: 5,
    eta: '10 دقائق',
    time: 'منذ 5 دقائق',
  },
  {
    id: 2,
    orderNumber: '#ORD-1246',
    customer: 'فاطمة علي',
    items: 3,
    eta: '15 دقيقة',
    time: 'منذ 8 دقائق',
  },
])

const receivingOrders = ref([
  {
    id: 3,
    orderNumber: '#ORD-1243',
    customer: 'خالد سعيد',
    items: 7,
  },
  {
    id: 4,
    orderNumber: '#ORD-1244',
    customer: 'نورة عبدالله',
    items: 4,
  },
])

const processingOrders = ref([
  {
    id: 5,
    orderNumber: '#ORD-1240',
    customer: 'سعد حسن',
    items: 6,
    duration: '2 ساعة 15 دقيقة',
  },
  {
    id: 6,
    orderNumber: '#ORD-1241',
    customer: 'مريم أحمد',
    items: 8,
    duration: '1 ساعة 45 دقيقة',
  },
  {
    id: 7,
    orderNumber: '#ORD-1242',
    customer: 'عبدالله يوسف',
    items: 5,
    duration: '45 دقيقة',
  },
])

const readyOrders = ref([
  {
    id: 8,
    orderNumber: '#ORD-1237',
    customer: 'هند سالم',
    items: 3,
    readyTime: 'منذ 20 دقيقة',
    status: 'ready'
  },
  {
    id: 9,
    orderNumber: '#ORD-1238',
    customer: 'محمد عمر',
    items: 9,
    readyTime: 'منذ 35 دقيقة',
    status: 'ready'
  },
])

const selectedOrder = ref(null)
const showOrderDialog = ref(false)

function openOrderDetails(order: any, statusContext: string) {
  selectedOrder.value = { ...order, status: statusContext }
  showOrderDialog.value = true
}

function reviewOrder(order: any) {
  openOrderDetails(order, 'receiving')
}

function markAsReady(order: any) {
  console.log('Mark as ready:', order.orderNumber)
  // Logic to move card would go here (omitted for UI demo)
  showOrderDialog.value = false
}

function handleAccept(order: any) {
  console.log('Accept order:', order.orderNumber)
  showOrderDialog.value = false
}

function handleConfirmReceive(order: any) {
  console.log('Confirm receive:', order.orderNumber)
  showOrderDialog.value = false
}
</script>

<style scoped>
/* Kanban Column Styling */
.kanban-column {
  background: var(--surface-grey);
  border-radius: var(--radius-lg);
  padding: 12px;
  min-height: 600px;
}

.kanban-column-header {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: var(--radius-lg) !important;
  font-weight: 700;
  font-size: 1.0625rem;
  color: var(--text-primary);
}

.column-title {
  font-weight: 700;
  flex-grow: 1;
}

/* Kanban Card Styling */
.kanban-card {
  margin-bottom: 12px;
  cursor: move;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.kanban-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover) !important;
  border-color: var(--primary-cyan);
}

.kanban-card:active {
  cursor: grabbing;
  transform: scale(1.02);
  opacity: 0.9;
}

/* Column-specific backgrounds */
.incoming .kanban-column-header {
  background: linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(255, 165, 0, 0.05) 100%);
}

.receiving .kanban-column-header {
  background: linear-gradient(135deg, rgba(230, 81, 0, 0.1) 0%, rgba(230, 81, 0, 0.05) 100%);
}

.processing .kanban-column-header {
  background: linear-gradient(135deg, rgba(0, 194, 255, 0.1) 0%, rgba(0, 194, 255, 0.05) 100%);
}

.ready .kanban-column-header {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
}

.gap-2 {
  gap: 8px;
}
</style>
