import { ref } from 'vue'

export function useKeyboardShortcuts() {
    const isSearchOpen = ref(false)
    const isShortcutsHelpOpen = ref(false)

    // Setup keyboard event listener
    const handleKeyDown = (event: KeyboardEvent) => {
        // Don't trigger shortcuts if user is typing in an input
        const target = event.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            // Allow Escape to close modals even when in input
            if (event.key !== 'Escape') return
        }

        // Ctrl/Cmd + K - Open search
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault()
            isSearchOpen.value = true
        }

        // ? - Show keyboard shortcuts help
        if (event.key === '?' && !event.shiftKey) {
            event.preventDefault()
            isShortcutsHelpOpen.value = true
        }

        // Escape - Close modals/dialogs
        if (event.key === 'Escape') {
            isSearchOpen.value = false
            isShortcutsHelpOpen.value = false
        }
    }

    const registerShortcuts = () => {
        document.addEventListener('keydown', handleKeyDown)
    }

    const unregisterShortcuts = () => {
        document.removeEventListener('keydown', handleKeyDown)
    }

    return {
        isSearchOpen,
        isShortcutsHelpOpen,
        registerShortcuts,
        unregisterShortcuts
    }
}

/**
 * Keyboard shortcuts configuration
 */
export const keyboardShortcuts = [
    {
        key: 'Ctrl/Cmd + K',
        description: 'فتح البحث العام',
        category: 'navigation'
    },
    {
        key: '?',
        description: 'عرض اختصارات لوحة المفاتيح',
        category: 'help'
    },
    {
        key: 'Esc',
        description: 'إغلاق النوافذ المنبثقة',
        category: 'general'
    },
    {
        key: 'Tab',
        description: 'التنقل بين العناصر التفاعلية',
        category: 'navigation'
    },
    {
        key: 'Shift + Tab',
        description: 'التنقل العكسي',
        category: 'navigation'
    },
    {
        key: 'Enter',
        description: 'تأكيد/إرسال النموذج',
        category: 'general'
    },
    {
        key: '↑ ↓',
        description: 'التنقل في القوائم',
        category: 'navigation'
    }
]
