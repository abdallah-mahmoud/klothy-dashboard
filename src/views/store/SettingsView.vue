<template>
  <div>
    <h1 class="text-h4 font-weight-bold mb-6 text-secondary">إعدادات المتجر</h1>

    <v-row>
      <!-- Navigation Tabs -->
      <v-col cols="12" md="3">
        <v-card class="modern-card" elevation="0" border>
          <v-tabs v-model="activeTab" direction="vertical" color="primary">
            <v-tab value="general" prepend-icon="mdi-store-cog">عام</v-tab>
            <v-tab value="notifications" prepend-icon="mdi-bell-outline">الإشعارات</v-tab>
          </v-tabs>
        </v-card>
      </v-col>

      <!-- Content Area -->
      <v-col cols="12" md="9">
        <v-window v-model="activeTab">
          
          <!-- General Settings -->
          <v-window-item value="general">
            <v-card class="modern-card pa-4" elevation="0" border>
              <v-card-title class="font-weight-bold mb-4">معلومات المتجر</v-card-title>
              <v-card-text>
                <div class="d-flex align-center mb-6">
                  <v-avatar size="80" color="grey-lighten-3" class="ml-4">
                    <v-img src="/src/assets/logo.png" alt="Logo"></v-img>
                  </v-avatar>
                  <div>
                    <v-btn size="small" variant="outlined" color="primary">تغيير الشعار</v-btn>
                    <div class="text-caption text-grey mt-1">PNG, JPG بحد أقصى 2MB</div>
                  </div>
                </div>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field label="اسم المتجر" v-model="storeData.name" variant="outlined" density="compact"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field label="رقم الهاتف" v-model="storeData.phone" variant="outlined" density="compact"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea label="العنوان التفصيلي" v-model="storeData.address" variant="outlined" rows="2"></v-textarea>
                  </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <h3 class="text-h6 font-weight-bold mb-4">حالة التشغيل</h3>
                <v-card variant="tonal" :color="getStatusColor(storeData.status)" class="pa-4 mb-4">
                  <div class="d-flex justify-space-between align-center">
                    <div class="d-flex align-center">
                      <v-icon :color="getStatusColor(storeData.status)" class="ml-2">mdi-circle</v-icon>
                      <div>
                        <div class="font-weight-bold">حالة المتجر الحالية: {{ getStatusText(storeData.status) }}</div>
                        <div class="text-caption">يحدد هذا الخيار ظهور متجرك للعملاء</div>
                      </div>
                    </div>
                    <v-menu>
                      <template v-slot:activator="{ props }">
                         <v-btn v-bind="props" :color="getStatusColor(storeData.status)" variant="flat">تغيير الحالة</v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="storeData.status = 'open'" title="مفتوح" prepend-icon="mdi-circle" color="success"></v-list-item>
                        <v-list-item @click="storeData.status = 'busy'" title="مشغول (ضغط عالي)" prepend-icon="mdi-circle" color="warning"></v-list-item>
                        <v-list-item @click="storeData.status = 'closed'" title="مغلق مؤقتاً" prepend-icon="mdi-circle" color="error"></v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </v-card>

                <v-btn color="primary" size="large" block class="mt-4" @click="showSaveSuccess">حفظ التغييرات</v-btn>
              </v-card-text>
            </v-card>
          </v-window-item>

           <!-- Notifications -->
          <v-window-item value="notifications">
            <v-card class="modern-card pa-4" elevation="0" border>
              <v-card-title class="font-weight-bold mb-4">تفضيلات الإشعارات</v-card-title>
              <v-card-text>
                <v-list lines="two">
                  <v-list-item title="طلب جديد" subtitle="تلقي إشعار صوتي ومرئي عند وصول طلب جديد">
                     <template v-slot:append>
                        <v-switch v-model="notifications.newOrder" color="primary" inset></v-switch>
                     </template>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item title="وصول المندوب" subtitle="تنبيه عند وصول المندوب لاستلام الطلبات الجاهزة">
                     <template v-slot:append>
                        <v-switch v-model="notifications.driverArrival" color="primary" inset></v-switch>
                     </template>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item title="التقارير اليومية" subtitle="إرسال ملخص يومي للإيرادات عبر البريد الإلكتروني">
                     <template v-slot:append>
                        <v-switch v-model="notifications.dailyReport" color="primary" inset></v-switch>
                     </template>
                  </v-list-item>
                </v-list>
                 <v-btn color="primary" size="large" block class="mt-4" @click="showSaveSuccess">حفظ التفضيلات</v-btn>
              </v-card-text>
            </v-card>
          </v-window-item>

        </v-window>
      </v-col>
    </v-row>

    <!-- Feedback Snackbar -->
    <v-snackbar
      v-model="snackbar"
      color="success"
      location="top"
      timeout="2000"
    >
      <div class="d-flex align-center">
        <v-icon class="ml-2">mdi-check-circle</v-icon>
        <span class="font-weight-bold">تم حفظ التغييرات بنجاح</span>
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('general')
const snackbar = ref(false)

const storeData = ref({
  name: 'مغاسل الملقا الحديثة',
  phone: '0551234567',
  address: 'الرياض، حي الملقا، شارع أنس بن مالك',
  status: 'open'
})

const notifications = ref({
  newOrder: true,
  driverArrival: true,
  dailyReport: false
})

function showSaveSuccess() {
  snackbar.value = true
}

function getStatusColor(status: string) {
  if (status === 'open') return 'success'
  if (status === 'busy') return 'warning'
  return 'error'
}

function getStatusText(status: string) {
   if (status === 'open') return 'مفتوح'
  if (status === 'busy') return 'مشغول'
  return 'مغلق'
}
</script>
