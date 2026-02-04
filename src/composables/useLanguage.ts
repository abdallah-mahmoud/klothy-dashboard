import { useI18n } from 'vue-i18n'
import { watch } from 'vue'

export function useLanguage() {
    const { locale } = useI18n()

    // Watch for locale changes and update document attributes
    watch(locale, (newLocale) => {
        // Save to localStorage
        localStorage.setItem('language', newLocale)

        // Update HTML direction and lang
        document.documentElement.setAttribute('dir', newLocale === 'ar' ? 'rtl' : 'ltr')
        document.documentElement.setAttribute('lang', newLocale)
    }, { immediate: true })

    function toggleLanguage() {
        locale.value = locale.value === 'ar' ? 'en' : 'ar'
    }

    function setLanguage(lang: 'ar' | 'en') {
        locale.value = lang
    }

    return {
        locale,
        toggleLanguage,
        setLanguage
    }
}
