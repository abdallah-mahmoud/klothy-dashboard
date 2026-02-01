import { ref } from 'vue'
import { useNotification } from './useNotification'

export interface FilterPreset {
    id: string
    name: string
    icon: string
    color: string
    filters: Record<string, any>
    createdAt: string
    filterCount: number
}

export function useFilterPresets(filterKey: string) {
    const STORAGE_KEY = `filter_presets_${filterKey}`
    const { showSuccess, showInfo, showError } = useNotification()

    const savedPresets = ref<FilterPreset[]>([])

    // Load from localStorage
    const loadPresets = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                savedPresets.value = JSON.parse(stored)
            }
        } catch (error) {
            console.error('Failed to load presets:', error)
            showError('فشل تحميل الإعدادات المحفوظة')
        }
    }

    // Save to localStorage
    const savePresets = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPresets.value))
        } catch (error) {
            console.error('Failed to save presets:', error)
            showError('فشل حفظ الإعدادات')
        }
    }

    // Count active filters
    const countFilters = (filters: Record<string, any>): number => {
        let count = 0
        Object.values(filters).forEach(value => {
            if (value !== null && value !== undefined && value !== '' &&
                !(Array.isArray(value) && value.length === 0)) {
                count++
            }
        })
        return count
    }

    // Add new preset
    const addPreset = (preset: Omit<FilterPreset, 'id' | 'createdAt' | 'filterCount'>) => {
        const filterCount = countFilters(preset.filters)

        if (filterCount === 0) {
            showInfo('لا توجد فلاتر نشطة للحفظ')
            return null
        }

        const newPreset: FilterPreset = {
            ...preset,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            filterCount
        }

        savedPresets.value.push(newPreset)
        savePresets()
        showSuccess(`تم حفظ الإعداد "${preset.name}"`)
        return newPreset
    }

    // Delete preset
    const deletePreset = (id: string) => {
        const preset = savedPresets.value.find(p => p.id === id)
        savedPresets.value = savedPresets.value.filter(p => p.id !== id)
        savePresets()

        if (preset) {
            showSuccess(`تم حذف الإعداد "${preset.name}"`)
        }
    }

    // Apply preset (returns the filters object)
    const applyPreset = (preset: FilterPreset) => {
        showInfo(`تم تطبيق الإعداد "${preset.name}"`)
        return { ...preset.filters }
    }

    // Update preset
    const updatePreset = (id: string, updates: Partial<FilterPreset>) => {
        const index = savedPresets.value.findIndex(p => p.id === id)
        if (index !== -1) {
            savedPresets.value[index] = {
                ...savedPresets.value[index],
                ...updates
            } as FilterPreset
            savePresets()
            showSuccess('تم تحديث الإعداد')
        }
    }

    // Initialize
    loadPresets()

    return {
        savedPresets,
        loadPresets,
        addPreset,
        deletePreset,
        applyPreset,
        updatePreset
    }
}
