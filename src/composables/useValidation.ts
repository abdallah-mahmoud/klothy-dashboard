/**
 * Common validation rules for forms
 */

export const validationRules = {
    // Required field
    required: (message: string = 'هذا الحقل مطلوب') => {
        return (value: any) => !!value || message
    },

    // Minimum length
    minLength: (min: number, message?: string) => {
        return (value: string) => {
            if (!value) return true // Let required handle empty values
            return value.length >= min || message || `يجب أن يكون ${min} أحرف على الأقل`
        }
    },

    // Maximum length
    maxLength: (max: number, message?: string) => {
        return (value: string) => {
            if (!value) return true
            return value.length <= max || message || `يجب ألا يتجاوز ${max} حرف`
        }
    },

    // Email format
    email: (message: string = 'البريد الإلكتروني غير صالح') => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return (value: string) => {
            if (!value) return true
            return emailRegex.test(value) || message
        }
    },

    // Phone number (Saudi format)
    phone: (message: string = 'رقم الجوال غير صالح') => {
        const phoneRegex = /^(05|5)[0-9]{8}$/
        return (value: string) => {
            if (!value) return true
            const cleanValue = value.replace(/\s+/g, '')
            return phoneRegex.test(cleanValue) || message
        }
    },

    // Numeric only
    numeric: (message: string = 'يجب أن يكون رقماً') => {
        return (value: string) => {
            if (!value) return true
            return !isNaN(Number(value)) || message
        }
    },

    // Minimum value
    minValue: (min: number, message?: string) => {
        return (value: number | string) => {
            if (!value) return true
            const numValue = Number(value)
            return numValue >= min || message || `يجب أن يكون ${min} على الأقل`
        }
    },

    // Maximum value
    maxValue: (max: number, message?: string) => {
        return (value: number | string) => {
            if (!value) return true
            const numValue = Number(value)
            return numValue <= max || message || `يجب ألا يتجاوز ${max}`
        }
    },

    // Match another field (e.g., password confirmation)
    match: (otherValue: any, fieldName: string, message?: string) => {
        return (value: any) => {
            return value === otherValue || message || `يجب أن يتطابق مع ${fieldName}`
        }
    },

    // URL format
    url: (message: string = 'الرابط غير صالح') => {
        const urlRegex = /^https?:\/\/.+/
        return (value: string) => {
            if (!value) return true
            return urlRegex.test(value) || message
        }
    }
}

/**
 * Composable for form validation
 */
export function useValidation() {
    return {
        rules: validationRules
    }
}
