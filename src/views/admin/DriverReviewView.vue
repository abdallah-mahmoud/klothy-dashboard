<template>
  <div>
    <!-- Back Button -->
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-right"
      class="mb-4"
      to="/admin/drivers"
    >
      العودة إلى المناديب
    </v-btn>

    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-2" style="color: #1A237E">
        مراجعة طلب التسجيل
      </h1>
      <p class="text-grey-darken-1">مراجعة وثائق المندوب والموافقة على التسجيل</p>
    </div>

    <!-- Driver Info Card -->
    <v-card class="mb-4" elevation="2">
      <v-card-title class="bg-primary text-white">
        معلومات المندوب
      </v-card-title>
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="2" class="text-center">
            <v-avatar size="100" color="primary">
              <v-icon size="50" color="white">mdi-account</v-icon>
            </v-avatar>
          </v-col>
          <v-col cols="12" md="10">
            <v-row>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey mb-1">الاسم الكامل</div>
                <div class="text-h6">{{ driver.name }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey mb-1">رقم الهاتف</div>
                <div class="text-h6">{{ driver.phone }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey mb-1">البريد الإلكتروني</div>
                <div class="text-body-1">{{ driver.email }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey mb-1">العنوان</div>
                <div class="text-body-1">{{ driver.address }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey mb-1">تاريخ الميلاد</div>
                <div class="text-body-1">{{ driver.birthDate }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey mb-1">تاريخ التقديم</div>
                <div class="text-body-1">{{ driver.appliedDate }}</div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Documents Review -->
    <v-card elevation="2" class="mb-4">
      <v-card-title>الوثائق المطلوبة</v-card-title>
      <v-card-text>
        <v-row>
          <!-- National ID -->
          <v-col cols="12" md="6">
            <div class="document-section">
              <div class="d-flex align-center justify-space-between mb-3">
                <h3 class="text-h6">الهوية الوطنية</h3>
                <v-btn-toggle v-model="documentStatus.nationalId" mandatory>
                  <v-btn value="approved" color="success" size="small">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                  <v-btn value="rejected" color="error" size="small">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </div>
              <v-card elevation="1" class="document-preview">
                <v-img
                  :src="driver.documents.nationalId"
                  height="200"
                  cover
                  class="cursor-pointer"
                  @click="openImageViewer(driver.documents.nationalId)"
                >
                  <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-icon size="64" color="grey">mdi-card-account-details</v-icon>
                    </div>
                  </template>
                </v-img>
              </v-card>
              <v-text-field
                v-if="documentStatus.nationalId === 'rejected'"
                v-model="rejectionReasons.nationalId"
                label="سبب الرفض"
                variant="outlined"
                density="compact"
                class="mt-2"
              ></v-text-field>
            </div>
          </v-col>

          <!-- Driver License -->
          <v-col cols="12" md="6">
            <div class="document-section">
              <div class="d-flex align-center justify-space-between mb-3">
                <h3 class="text-h6">رخصة القيادة</h3>
                <v-btn-toggle v-model="documentStatus.driverLicense" mandatory>
                  <v-btn value="approved" color="success" size="small">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                  <v-btn value="rejected" color="error" size="small">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </div>
              <v-card elevation="1" class="document-preview">
                <v-img
                  :src="driver.documents.driverLicense"
                  height="200"
                  cover
                  class="cursor-pointer"
                  @click="openImageViewer(driver.documents.driverLicense)"
                >
                  <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-icon size="64" color="grey">mdi-card-account-details-outline</v-icon>
                    </div>
                  </template>
                </v-img>
              </v-card>
              <v-text-field
                v-if="documentStatus.driverLicense === 'rejected'"
                v-model="rejectionReasons.driverLicense"
                label="سبب الرفض"
                variant="outlined"
                density="compact"
                class="mt-2"
              ></v-text-field>
            </div>
          </v-col>

          <!-- Vehicle Registration -->
          <v-col cols="12" md="6">
            <div class="document-section">
              <div class="d-flex align-center justify-space-between mb-3">
                <h3 class="text-h6">استمارة السيارة</h3>
                <v-btn-toggle v-model="documentStatus.vehicleRegistration" mandatory>
                  <v-btn value="approved" color="success" size="small">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                  <v-btn value="rejected" color="error" size="small">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </div>
              <v-card elevation="1" class="document-preview">
                <v-img
                  :src="driver.documents.vehicleRegistration"
                  height="200"
                  cover
                  class="cursor-pointer"
                  @click="openImageViewer(driver.documents.vehicleRegistration)"
                >
                  <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-icon size="64" color="grey">mdi-car</v-icon>
                    </div>
                  </template>
                </v-img>
              </v-card>
              <v-text-field
                v-if="documentStatus.vehicleRegistration === 'rejected'"
                v-model="rejectionReasons.vehicleRegistration"
                label="سبب الرفض"
                variant="outlined"
                density="compact"
                class="mt-2"
              ></v-text-field>
            </div>
          </v-col>

          <!-- Criminal Record -->
          <v-col cols="12" md="6">
            <div class="document-section">
              <div class="d-flex align-center justify-space-between mb-3">
                <h3 class="text-h6">صحيفة السوابق</h3>
                <v-btn-toggle v-model="documentStatus.criminalRecord" mandatory>
                  <v-btn value="approved" color="success" size="small">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                  <v-btn value="rejected" color="error" size="small">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </div>
              <v-card elevation="1" class="document-preview">
                <v-img
                  :src="driver.documents.criminalRecord"
                  height="200"
                  cover
                  class="cursor-pointer"
                  @click="openImageViewer(driver.documents.criminalRecord)"
                >
                  <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-icon size="64" color="grey">mdi-file-document</v-icon>
                    </div>
                  </template>
                </v-img>
              </v-card>
              <v-text-field
                v-if="documentStatus.criminalRecord === 'rejected'"
                v-model="rejectionReasons.criminalRecord"
                label="سبب الرفض"
                variant="outlined"
                density="compact"
                class="mt-2"
              ></v-text-field>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Action Buttons -->
    <v-card elevation="2">
      <v-card-text>
        <div class="d-flex gap-3 justify-end">
          <v-btn
            color="error"
            variant="outlined"
            prepend-icon="mdi-close-circle"
            size="large"
            @click="rejectDriver"
          >
            رفض الطلب
          </v-btn>
          <v-btn
            color="success"
            variant="flat"
            prepend-icon="mdi-check-circle"
            size="large"
            :disabled="!allDocumentsApproved"
            @click="approveDriver"
          >
            الموافقة وتفعيل الحساب
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Image Viewer Dialog -->
    <v-dialog v-model="imageViewerDialog" max-width="900">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>عرض الوثيقة</span>
          <v-btn icon="mdi-close" variant="text" @click="imageViewerDialog = false"></v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-img :src="selectedImage" max-height="700" contain></v-img>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Mock driver data
const driver = ref({
  id: 101,
  name: 'عبدالرحمن أحمد محمد',
  phone: '+966 50 567 8901',
  email: 'driver@example.com',
  address: 'حي النخيل، شارع الملك فهد، الرياض',
  birthDate: '1990-05-15',
  appliedDate: '2026-01-28',
  documents: {
    nationalId: 'https://via.placeholder.com/400x250/1A237E/FFFFFF?text=National+ID',
    driverLicense: 'https://via.placeholder.com/400x250/2196F3/FFFFFF?text=Driver+License',
    vehicleRegistration: 'https://via.placeholder.com/400x250/4CAF50/FFFFFF?text=Vehicle+Registration',
    criminalRecord: 'https://via.placeholder.com/400x250/9E9E9E/FFFFFF?text=Criminal+Record',
  },
})

const documentStatus = ref({
  nationalId: 'approved',
  driverLicense: 'approved',
  vehicleRegistration: 'approved',
  criminalRecord: 'approved',
})

const rejectionReasons = ref({
  nationalId: '',
  driverLicense: '',
  vehicleRegistration: '',
  criminalRecord: '',
})

const imageViewerDialog = ref(false)
const selectedImage = ref('')

const allDocumentsApproved = computed(() => {
  return Object.values(documentStatus.value).every((status) => status === 'approved')
})

function openImageViewer(imageUrl: string) {
  selectedImage.value = imageUrl
  imageViewerDialog.value = true
}

function approveDriver() {
  console.log('Approve driver:', driver.value.name)
  // TODO: Call API to approve driver
  router.push('/admin/drivers')
}

function rejectDriver() {
  console.log('Reject driver:', driver.value.name)
  // TODO: Show confirmation dialog and call API to reject
  router.push('/admin/drivers')
}
</script>

<style scoped>
.document-section {
  height: 100%;
}

.document-preview {
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  overflow: hidden;
}

.cursor-pointer {
  cursor: pointer;
}

.gap-3 {
  gap: 12px;
}
</style>
