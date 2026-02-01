// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(localStorage.getItem('authToken'))

    const isAuthenticated = computed(() => !!token.value)
    const isAdmin = computed(() => user.value?.role === 'admin')
    const isStoreManager = computed(() => user.value?.role === 'store_manager')

    async function login(email: string, password: string) {
        // Mock authentication - replace with actual API call
        if (email === 'admin@klothy.com' && password === 'demo123') {
            const mockUser: User = {
                id: '1',
                name: 'مدير النظام',
                email: 'admin@klothy.com',
                phone: '+966501234567',
                role: 'admin',
                avatar: '/avatars/admin.jpg',
            }

            const mockToken = 'mock_jwt_token_' + Date.now()

            user.value = mockUser
            token.value = mockToken
            localStorage.setItem('authToken', mockToken)
            localStorage.setItem('user', JSON.stringify(mockUser))

            return { success: true, user: mockUser }
        } else if (email === 'store@klothy.com' && password === 'demo123') {
            const mockUser: User = {
                id: '2',
                name: 'مدير المغسلة',
                email: 'store@klothy.com',
                phone: '+966507654321',
                role: 'store_manager',
                avatar: '/avatars/store.jpg',
            }

            const mockToken = 'mock_jwt_token_' + Date.now()

            user.value = mockUser
            token.value = mockToken
            localStorage.setItem('authToken', mockToken)
            localStorage.setItem('user', JSON.stringify(mockUser))

            return { success: true, user: mockUser }
        }

        throw new Error('بيانات الدخول غير صحيحة')
    }

    function logout() {
        user.value = null
        token.value = null
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
    }

    function initializeAuth() {
        const storedUser = localStorage.getItem('user')
        if (storedUser && token.value) {
            user.value = JSON.parse(storedUser)
        }
    }

    return {
        user,
        token,
        isAuthenticated,
        isAdmin,
        isStoreManager,
        login,
        logout,
        initializeAuth,
    }
})
