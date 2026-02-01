import { ref } from 'vue'
import { useToast, POSITION } from 'vue-toastification'

// Re-export toast for direct usage
export const toast = useToast()

/**
 * Composable for showing notifications
 */
export function useNotification() {
    const showSuccess = (message: string, title?: string) => {
        toast.success(title ? `${title}: ${message}` : message, {
            timeout: 3000,
            position: POSITION.TOP_LEFT, // RTL friendly
            rtl: true
        })
    }

    const showError = (message: string, title?: string) => {
        toast.error(title ? `${title}: ${message}` : message, {
            timeout: 5000,
            position: POSITION.TOP_LEFT,
            rtl: true
        })
    }

    const showWarning = (message: string, title?: string) => {
        toast.warning(title ? `${title}: ${message}` : message, {
            timeout: 4000,
            position: POSITION.TOP_LEFT,
            rtl: true
        })
    }

    const showInfo = (message: string, title?: string) => {
        toast.info(title ? `${title}: ${message}` : message, {
            timeout: 3000,
            position: POSITION.TOP_LEFT,
            rtl: true
        })
    }

    const showLoading = (message: string = 'جاري التحميل...') => {
        return toast.info(message, {
            timeout: false, // Don't auto-dismiss
            closeButton: false,
            position: POSITION.TOP_LEFT,
            rtl: true
        })
    }

    return {
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showLoading
    }
}
