import { defineStore } from 'pinia'

export interface UserPreferences {
    // Dashboard Layout
    kpiLayout: 'grid' | 'list'
    chartHeight: number
    showRecentOrders: boolean

    // Table Settings
    defaultRowsPerPage: number
    compactMode: boolean

    // Theme
    accentColor: string

    // Notifications
    enableSounds: boolean
    enableDesktopNotifications: boolean
}

const DEFAULT_PREFERENCES: UserPreferences = {
    kpiLayout: 'grid',
    chartHeight: 300,
    showRecentOrders: true,
    defaultRowsPerPage: 20,
    compactMode: false,
    accentColor: '#00E5FF',
    enableSounds: true,
    enableDesktopNotifications: false
}

export const usePreferencesStore = defineStore('preferences', {
    state: (): UserPreferences => ({ ...DEFAULT_PREFERENCES }),

    getters: {
        // Dashboard getters
        isGridLayout: (state) => state.kpiLayout === 'grid',
        isListLayout: (state) => state.kpiLayout === 'list',

        // Theme getters
        currentAccentColor: (state) => state.accentColor,

        // Notifications
        shouldPlaySounds: (state) => state.enableSounds,
        shouldShowDesktopNotifications: (state) => state.enableDesktopNotifications
    },

    actions: {
        // Load preferences from localStorage
        loadPreferences() {
            try {
                const stored = localStorage.getItem('user_preferences')
                if (stored) {
                    const parsed = JSON.parse(stored)
                    this.$patch(parsed)
                }
            } catch (error) {
                console.error('Failed to load preferences:', error)
            }
        },

        // Save preferences to localStorage
        savePreferences() {
            try {
                localStorage.setItem('user_preferences', JSON.stringify(this.$state))
            } catch (error) {
                console.error('Failed to save preferences:', error)
            }
        },

        // Update a single preference
        updatePreference<K extends keyof UserPreferences>(
            key: K,
            value: UserPreferences[K]
        ) {
            this.$patch({ [key]: value } as Partial<UserPreferences>)
            this.savePreferences()
        },

        // Update multiple preferences
        updatePreferences(preferences: Partial<UserPreferences>) {
            this.$patch(preferences)
            this.savePreferences()
        },

        // Reset to defaults
        resetToDefaults() {
            this.$patch(DEFAULT_PREFERENCES)
            this.savePreferences()
        },

        // Initialize (call on app mount)
        initialize() {
            this.loadPreferences()
        }
    }
})
