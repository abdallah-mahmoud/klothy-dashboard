<template>
  <v-dialog v-model="isOpen" max-width="650" persistent>
    <v-card>
      <!-- Search Input -->
      <v-card-text class="pa-4">
        <v-text-field
          ref="searchInputRef"
          v-model="query"
          placeholder="البحث في الطلبات، العملاء، المغاسل، المناديب..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          autofocus
          clearable
          hide-details
          @input="handleSearch"
          @keydown.esc="closeSearch"
          @keydown.down="navigateResults(1)"
          @keydown.up="navigateResults(-1)"
          @keydown.enter="selectResult"
        >
          <template #append-inner>
            <v-chip size="x-small" variant="text" class="text-caption">
              Esc للإغلاق
            </v-chip>
          </template>
        </v-text-field>
      </v-card-text>

      <v-divider />

      <!-- Search Results -->
      <v-card-text class="pa-0" style="max-height: 400px; overflow-y: auto">
        <!-- Loading State -->
        <div v-if="searching" class="text-center pa-8">
          <v-progress-circular indeterminate color="primary" />
          <p class="text-grey mt-4">جاري البحث...</p>
        </div>

        <!-- Results -->
        <div v-else-if="results.length > 0">
          <!-- Orders Results -->
          <div v-if="orderResults.length > 0">
            <v-list-subheader class="px-4">
              الطلبات ({{ orderResults.length }})
            </v-list-subheader>
            <v-list density="compact">
              <v-list-item
                v-for="(result, index) in orderResults"
                :key="`order-${result.item.id}`"
                :class="{ 'bg-grey-lighten-4': index === selectedIndex }"
                @click="navigateToOrder(result.item)"
              >
                <template #prepend>
                  <v-icon color="primary">mdi-clipboard-text</v-icon>
                </template>
                <v-list-item-title>{{ result.item.orderNumber }}</v-list-item-title>
                <v-list-item-subtitle>{{ result.item.customerName }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>

          <!-- Customers Results -->
          <div v-if="customerResults.length > 0">
            <v-list-subheader class="px-4">
              العملاء ({{ customerResults.length }})
            </v-list-subheader>
            <v-list density="compact">
              <v-list-item
                v-for="result in customerResults"
                :key="`customer-${result.item.id}`"
                @click="navigateToCustomer(result.item)"
              >
                <template #prepend>
                  <v-icon color="green">mdi-account</v-icon>
                </template>
                <v-list-item-title>{{ result.item.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ result.item.phone }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>

          <!-- Laundries Results -->
          <div v-if="laundryResults.length > 0">
            <v-list-subheader class="px-4">
              المغاسل ({{ laundryResults.length }})
            </v-list-subheader>
            <v-list density="compact">
              <v-list-item
                v-for="result in laundryResults"
                :key="`laundry-${result.item.id}`"
                @click="navigateToLaundry(result.item)"
              >
                <template #prepend>
                  <v-icon color="cyan">mdi-store</v-icon>
                </template>
                <v-list-item-title>{{ result.item.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ result.item.address }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>

          <!-- Drivers Results -->
          <div v-if="driverResults.length > 0">
            <v-list-subheader class="px-4">
              المناديب ({{ driverResults.length }})
            </v-list-subheader>
            <v-list density="compact">
              <v-list-item
                v-for="result in driverResults"
                :key="`driver-${result.item.id}`"
                @click="navigateToDriver(result.item)"
              >
                <template #prepend>
                  <v-icon color="orange">mdi-car</v-icon>
                </template>
                <v-list-item-title>{{ result.item.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ result.item.phone }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>
        </div>

        <!-- No Results -->
        <div v-else-if="query && !searching" class="text-center pa-8">
          <v-icon size="48" color="grey-lighten-2">mdi-magnify-close</v-icon>
          <p class="text-grey mt-4">لا توجد نتائج للبحث "{{ query }}"</p>
        </div>

        <!-- Initial State -->
        <div v-else class="text-center pa-8">
          <v-icon size="48" color="grey-lighten-2">mdi-magnify</v-icon>
          <p class="text-grey mt-4">ابدأ الكتابة للبحث...</p>
          <p class="text-caption text-grey">يمكنك البحث برقم الطلب، اسم العميل، أو أي معلومات</p>
        </div>
      </v-card-text>

      <!-- Footer -->
      <v-divider />
      <v-card-actions class="px-4 py-2">
        <v-spacer />
        <div class="d-flex gap-2 text-caption text-grey">
          <v-chip size="x-small" variant="text">↑↓ للتنقل</v-chip>
          <v-chip size="x-small" variant="text">Enter للاختيار</v-chip>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Fuse from 'fuse.js'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const router = useRouter()
const searchInputRef = ref()
const query = ref('')
const searching = ref(false)
const results = ref<any[]>([])
const selectedIndex = ref(0)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Mock data - Replace with actual data from API/store
const mockOrders = ref([
  { id: '1', orderNumber: '#ORD-1234', customerName: 'أحمد محمد', type: 'order' },
  { id: '2', orderNumber: '#ORD-1233', customerName: 'فاطمة علي', type: 'order' },
  { id: '3', orderNumber: '#ORD-1232', customerName: 'خالد سعيد', type: 'order' },
])

const mockCustomers = ref([
  { id: '1', name: 'أحمد محمد', phone: '0512345678', type: 'customer' },
  { id: '2', name: 'فاطمة علي', phone: '0523456789', type: 'customer' },
])

const mockLaundries = ref([
  { id: '1', name: 'مغسلة النظافة', address: 'شارع الملك فهد', type: 'laundry' },
  { id: '2', name: 'مغسلة الأناقة', address: 'حي العليا', type: 'laundry' },
])

const mockDrivers = ref([
  { id: '1', name: 'خالد السائق', phone: '0534567890', type: 'driver' },
  { id: '2', name: 'محمد السائق', phone: '0545678901', type: 'driver' },
])

// Fuzzy search setup
const fuseOptions = {
  threshold: 0.3,
  includeScore: true,
  keys: ['orderNumber', 'customerName', 'name', 'phone', 'address']
}

// Filter results by type
const orderResults = computed(() =>
  results.value.filter(r => r.item.type === 'order').slice(0, 5)
)

const customerResults = computed(() =>
  results.value.filter(r => r.item.type === 'customer').slice(0, 5)
)

const laundryResults = computed(() =>
  results.value.filter(r => r.item.type === 'laundry').slice(0, 5)
)

const driverResults = computed(() =>
  results.value.filter(r => r.item.type === 'driver').slice(0, 5)
)

// Search handler with debounce
let searchTimeout: ReturnType<typeof setTimeout>
const handleSearch = () => {
  clearTimeout(searchTimeout)
  
  if (!query.value || query.value.length < 2) {
    results.value = []
    return
  }

  searching.value = true
  selectedIndex.value = 0

  searchTimeout = setTimeout(() => {
    // Combine all data sources
    const allData = [
      ...mockOrders.value,
      ...mockCustomers.value,
      ...mockLaundries.value,
      ...mockDrivers.value
    ]

    const fuse = new Fuse(allData, fuseOptions)
    results.value = fuse.search(query.value).slice(0, 20)
    searching.value = false
  }, 300)
}

// Keyboard navigation
const navigateResults = (direction: number) => {
  const totalResults = results.value.length
  if (totalResults === 0) return

  selectedIndex.value = (selectedIndex.value + direction + totalResults) % totalResults
}

const selectResult = () => {
  if (results.value.length === 0) return
  
  const selected = results.value[selectedIndex.value]
  if (!selected) return

  switch (selected.item.type) {
    case 'order':
      navigateToOrder(selected.item)
      break
    case 'customer':
      navigateToCustomer(selected.item)
      break
    case 'laundry':
      navigateToLaundry(selected.item)
      break
    case 'driver':
      navigateToDriver(selected.item)
      break
  }
}

// Navigation functions
const navigateToOrder = (order: any) => {
  router.push(`/admin/orders/${order.id}`)
  closeSearch()
}

const navigateToCustomer = (customer: any) => {
  // Navigate to customer details or orders filtered by customer
  router.push(`/admin/orders?customer=${customer.id}`)
  closeSearch()
}

const navigateToLaundry = (laundry: any) => {
  router.push(`/admin/laundries?id=${laundry.id}`)
  closeSearch()
}

const navigateToDriver = (driver: any) => {
  router.push(`/admin/drivers?id=${driver.id}`)
  closeSearch()
}

const closeSearch = () => {
  isOpen.value = false
  query.value = ''
  results.value = []
  selectedIndex.value = 0
}

// Auto-focus search input when dialog opens
watch(isOpen, async (newValue) => {
  if (newValue) {
    await nextTick()
    searchInputRef.value?.focus()
  }
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
