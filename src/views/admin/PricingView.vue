<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2" style="color: #1A237E">
          الخدمات والأسعار
        </h1>
        <p class="text-grey-darken-1">إدارة خدمات الغسيل والأسعار</p>
      </div>
      <div class="d-flex gap-2">
        <v-btn color="secondary" variant="outlined" prepend-icon="mdi-download">
          تصدير الأسعار
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-plus">
          إضافة خدمة جديدة
        </v-btn>
      </div>
    </div>

    <!-- Service Categories Tabs -->
    <v-tabs v-model="activeCategory" color="primary" class="mb-4">
      <v-tab
        v-for="category in categories"
        :key="category.value"
        :value="category.value"
      >
        <v-icon start>{{ category.icon }}</v-icon>
        {{ category.label }}
      </v-tab>
    </v-tabs>

    <!-- Service Items Table -->
    <v-window v-model="activeCategory">
      <v-window-item
        v-for="category in categories"
        :key="category.value"
        :value="category.value"
      >
        <v-card elevation="2">
          <v-card-title class="d-flex align-center justify-space-between">
            <span>{{ category.label }}</span>
            <v-btn color="primary" size="small" prepend-icon="mdi-plus">
              إضافة {{ category.singular }}
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="getServicesByCategory(category.value)"
              :items-per-page="10"
              class="elevation-0"
            >
              <!-- Service Name -->
              <template #item.name="{ item }">
                <div class="d-flex align-center">
                  <v-icon :color="category.color" class="ml-3">
                    {{ category.icon }}
                  </v-icon>
                  <div>
                    <div class="font-weight-bold">{{ item.nameAr }}</div>
                    <div class="text-caption text-grey">{{ item.nameEn }}</div>
                  </div>
                </div>
              </template>

              <!-- Price -->
              <template #item.price="{ item }">
                <span class="text-h6 font-weight-bold">{{ item.price }} ر.س</span>
              </template>

              <!-- Status -->
              <template #item.isActive="{ item }">
                <v-switch
                  :model-value="item.isActive"
                  color="success"
                  hide-details
                  density="compact"
                  @update:model-value="toggleService(item)"
                ></v-switch>
              </template>

              <!-- Actions -->
              <template #item.actions="{ item }">
                <div class="d-flex gap-2">
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="editService(item)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click="deleteService(item)"
                  ></v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Pricing Rules Card -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>قواعد التسعير</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template #prepend>
                  <v-icon color="primary">mdi-truck</v-icon>
                </template>
                <v-list-item-title>رسوم التوصيل</v-list-item-title>
                <template #append>
                  <v-chip color="primary">15 ر.س</v-chip>
                  <v-btn icon="mdi-pencil" size="small" variant="text" class="mr-2"></v-btn>
                </template>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon color="green">mdi-percent</v-icon>
                </template>
                <v-list-item-title>نسبة الضريبة (VAT)</v-list-item-title>
                <template #append>
                  <v-chip color="green">15%</v-chip>
                  <v-btn icon="mdi-pencil" size="small" variant="text" class="mr-2"></v-btn>
                </template>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon color="orange">mdi-clock-fast</v-icon>
                </template>
                <v-list-item-title>رسوم الاستعجال</v-list-item-title>
                <template #append>
                  <v-chip color="orange">+20 ر.س</v-chip>
                  <v-btn icon="mdi-pencil" size="small" variant="text" class="mr-2"></v-btn>
                </template>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon color="purple">mdi-gift</v-icon>
                </template>
                <v-list-item-title>الحد الأدنى للطلب المجاني</v-list-item-title>
                <template #append>
                  <v-chip color="purple">100 ر.س</v-chip>
                  <v-btn icon="mdi-pencil" size="small" variant="text" class="mr-2"></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>عروض وخصومات</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template #prepend>
                  <v-icon color="red">mdi-tag</v-icon>
                </template>
                <v-list-item-title>خصم العملاء الجدد</v-list-item-title>
                <v-list-item-subtitle>لأول 3 طلبات</v-list-item-subtitle>
                <template #append>
                  <v-chip color="red" size="small">-20%</v-chip>
                </template>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon color="blue">mdi-star</v-icon>
                </template>
                <v-list-item-title>خصم العضوية الذهبية</v-list-item-title>
                <v-list-item-subtitle>لأكثر من 50 طلب</v-list-item-subtitle>
                <template #append>
                  <v-chip color="blue" size="small">-15%</v-chip>
                </template>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon color="cyan">mdi-calendar-multiple</v-icon>
                </template>
                <v-list-item-title>عرض نهاية الأسبوع</v-list-item-title>
                <v-list-item-subtitle>الخميس - الجمعة</v-list-item-subtitle>
                <template #append>
                  <v-chip color="cyan" size="small">-10%</v-chip>
                </template>
              </v-list-item>
            </v-list>

            <v-divider class="my-3"></v-divider>

            <v-btn color="primary" variant="outlined" block prepend-icon="mdi-plus">
              إضافة عرض جديد
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeCategory = ref('clothing')

const categories = [
  { label: 'الملابس', singular: 'قطعة', value: 'clothing', icon: 'mdi-tshirt-crew', color: 'blue' },
  { label: 'الأطقم', singular: 'طقم', value: 'sets', icon: 'mdi-hanger', color: 'purple' },
  { label: 'المفروشات', singular: 'قطعة', value: 'furnishings', icon: 'mdi-bed', color: 'green' },
  { label: 'السجاد', singular: 'سجادة', value: 'carpets', icon: 'mdi-rug', color: 'orange' },
]

const headers = [
  { title: 'الخدمة', key: 'name', align: 'start' as const },
  { title: 'السعر', key: 'price', align: 'start' as const },
  { title: 'الوقت المتوقع', key: 'estimatedTime', align: 'start' as const },
  { title: 'نشط', key: 'isActive', align: 'center' as const },
  { title: 'الإجراءات', key: 'actions', sortable: false, align: 'center' as const },
]

const services = ref([
  // Clothing - غسيل وكوي
  { id: 1, category: 'clothing', nameAr: 'ثوب - غسيل وكوي', nameEn: 'Thobe - Wash & Iron', price: 30, estimatedTime: '24 ساعة', isActive: true },
  { id: 2, category: 'clothing', nameAr: 'قميص - غسيل وكوي', nameEn: 'Shirt - Wash & Iron', price: 20, estimatedTime: '24 ساعة', isActive: true },
  { id: 3, category: 'clothing', nameAr: 'بنطلون - غسيل وكوي', nameEn: 'Pants - Wash & Iron', price: 25, estimatedTime: '24 ساعة', isActive: true },
  { id: 4, category: 'clothing', nameAr: 'فستان - غسيل وكوي', nameEn: 'Dress - Wash & Iron', price: 35, estimatedTime: '48 ساعة', isActive: true },
  
  // Clothing - غسيل جاف  
  { id: 5, category: 'clothing', nameAr: 'بدلة - غسيل جاف', nameEn: 'Suit - Dry Cleaning', price: 50, estimatedTime: '48 ساعة', isActive: true },
  { id: 6, category: 'clothing', nameAr: 'معطف - غسيل جاف', nameEn: 'Coat - Dry Cleaning', price: 60, estimatedTime: '48 ساعة', isActive: true },
  { id: 7, category: 'clothing', nameAr: 'فستان سهرة - غسيل جاف', nameEn: 'Evening Dress - Dry Cleaning', price: 70, estimatedTime: '48 ساعة', isActive: true },

  // Sets - غسيل وكوي
  { id: 11, category: 'sets', nameAr: 'طقم رجالي كامل - غسيل وكوي', nameEn: "Men's Complete Set - Wash & Iron", price: 80, estimatedTime: '48 ساعة', isActive: true },
  { id: 12, category: 'sets', nameAr: 'طقم نسائي كامل - غسيل وكوي', nameEn: "Women's Complete Set - Wash & Iron", price: 100, estimatedTime: '48 ساعة', isActive: true },
  { id: 13, category: 'sets', nameAr: 'طقم أطفال - غسيل وكوي', nameEn: "Children's Set - Wash & Iron", price: 60, estimatedTime: '24 ساعة', isActive: true },

  // Sets - غسيل جاف
  { id: 14, category: 'sets', nameAr: 'طقم رجالي رسمي - غسيل جاف', nameEn: "Men's Formal Set - Dry Cleaning", price: 150, estimatedTime: '48 ساعة', isActive: true },

  // Furnishings - غسيل وكوي
  { id: 21, category: 'furnishings', nameAr: 'شرشف سرير - غسيل وكوي', nameEn: 'Bed Sheet - Wash & Iron', price: 40, estimatedTime: '48 ساعة', isActive: true },
  { id: 22, category: 'furnishings', nameAr: 'ستارة - غسيل وكوي', nameEn: 'Curtain - Wash & Iron', price: 50, estimatedTime: '48 ساعة', isActive: true },

  // Furnishings - غسيل جاف
  { id: 23, category: 'furnishings', nameAr: 'لحاف - غسيل جاف', nameEn: 'Blanket - Dry Cleaning', price: 60, estimatedTime: '48 ساعة', isActive: true },
  { id: 24, category: 'furnishings', nameAr: 'ستارة ثقيلة - غسيل جاف', nameEn: 'Heavy Curtain - Dry Cleaning', price: 80, estimatedTime: '72 ساعة', isActive: true },

  // Carpets - غسيل جاف (السجاد يتطلب عادة غسيل جاف)
  { id: 31, category: 'carpets', nameAr: 'سجادة صغيرة - غسيل جاف', nameEn: 'Small Carpet - Dry Cleaning', price: 80, estimatedTime: '72 ساعة', isActive: true },
  { id: 32, category: 'carpets', nameAr: 'سجادة متوسطة - غسيل جاف', nameEn: 'Medium Carpet - Dry Cleaning', price: 120, estimatedTime: '72 ساعة', isActive: true },
  { id: 33, category: 'carpets', nameAr: 'سجادة كبيرة - غسيل جاف', nameEn: 'Large Carpet - Dry Cleaning', price: 180, estimatedTime: '96 ساعة', isActive: true },
])

function getServicesByCategory(category: string) {
  return services.value.filter((s) => s.category === category)
}

function toggleService(service: any) {
  service.isActive = !service.isActive
  console.log('Toggle service:', service.nameAr, service.isActive)
}

function editService(service: any) {
  console.log('Edit service:', service.nameAr)
  // TODO: Open edit dialog
}

function deleteService(service: any) {
  console.log('Delete service:', service.nameAr)
  // TODO: Show confirmation dialog
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
