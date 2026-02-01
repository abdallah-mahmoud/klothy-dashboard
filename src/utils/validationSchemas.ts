import { validationRules } from '@/composables/useValidation'

const { required, email, phone, minLength, maxLength, numeric, minValue } = validationRules

/**
 * Validation schemas for all forms in the application
 */

// Login Form
export const loginSchema = {
    email: [
        required('البريد الإلكتروني مطلوب'),
        email()
    ],
    password: [
        required('كلمة المرور مطلوبة'),
        minLength(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    ]
}

// Order Form
export const orderSchema = {
    customerName: [
        required('اسم العميل مطلوب'),
        minLength(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
    ],
    customerPhone: [
        required('رقم الجوال مطلوب'),
        phone()
    ],
    pickupAddress: [
        required('عنوان الاستلام مطلوب'),
        minLength(10, 'العنوان يجب أن يكون 10 أحرف على الأقل')
    ],
    deliveryAddress: [
        required('عنوان التوصيل مطلوب'),
        minLength(10, 'العنوان يجب أن يكون 10 أحرف على الأقل')
    ],
    laundryId: [
        required('يرجى اختيار المغسلة')
    ],
    notes: [
        maxLength(500, 'الملاحظات يجب ألا تتجاوز 500 حرف')
    ]
}

// Driver Form
export const driverSchema = {
    name: [
        required('اسم المندوب مطلوب'),
        minLength(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
    ],
    phone: [
        required('رقم الجوال مطلوب'),
        phone()
    ],
    licenseNumber: [
        required('رقم رخصة القيادة مطلوب'),
        minLength(10, 'رقم الرخصة يجب أن يكون 10 أرقام')
    ],
    vehicleType: [
        required('نوع المركبة مطلوب')
    ],
    vehiclePlate: [
        required('رقم اللوحة مطلوب')
    ],
    email: [
        email('البريد الإلكتروني غير صالح')
    ]
}

// Laundry Form
export const laundrySchema = {
    name: [
        required('اسم المغسلة مطلوب'),
        minLength(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
    ],
    phone: [
        required('رقم الجوال مطلوب'),
        phone()
    ],
    address: [
        required('العنوان مطلوب'),
        minLength(10, 'العنوان يجب أن يكون 10 أحرف على الأقل')
    ],
    location: [
        required('الموقع الجغرافي مطلوب')
    ],
    capacity: [
        required('السعة القصوى مطلوبة'),
        numeric('السعة يجب أن تكون رقماً'),
        minValue(1, 'السعة يجب أن تكون على الأقل 1')
    ],
    email: [
        email('البريد الإلكتروني غير صالح')
    ]
}

// Pricing Form
export const pricingSchema = {
    serviceName: [
        required('اسم الخدمة مطلوب'),
        minLength(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
    ],
    price: [
        required('السعر مطلوب'),
        numeric('السعر يجب أن يكون رقماً'),
        minValue(0, 'السعر لا يمكن أن يكون سالباً')
    ],
    duration: [
        numeric('المدة يجب أن تكون رقماً'),
        minValue(0, 'المدة لا يمكن أن تكون سالبة')
    ],
    category: [
        required('التصنيف مطلوب')
    ]
}

// Customer Form (for customer management)
export const customerSchema = {
    name: [
        required('اسم العميل مطلوب'),
        minLength(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
    ],
    phone: [
        required('رقم الجوال مطلوب'),
        phone()
    ],
    email: [
        email('البريد الإلكتروني غير صالح')
    ],
    address: [
        minLength(10, 'العنوان يجب أن يكون 10 أحرف على الأقل')
    ]
}
