// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: { requiresAuth: false },
    },
    {
        path: '/',
        redirect: '/admin/dashboard',
    },
    {
        path: '/admin',
        component: () => import('@/layouts/AdminLayout.vue'),
        meta: { requiresAuth: true, role: 'admin' },
        children: [
            { path: '', redirect: 'dashboard' },
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/admin/DashboardView.vue'),
            },
            {
                path: 'orders',
                name: 'Orders',
                component: () => import('@/views/admin/OrdersView.vue'),
            },
            {
                path: 'orders/:id',
                name: 'OrderDetail',
                component: () => import('@/views/admin/OrderDetailView.vue'),
            },
            {
                path: 'live-map',
                name: 'LiveMap',
                component: () => import('@/views/admin/LiveMapView.vue'),
            },
            {
                path: 'drivers',
                name: 'Drivers',
                component: () => import('@/views/admin/DriversView.vue'),
            },
            {
                path: 'drivers/:id/review',
                name: 'DriverReview',
                component: () => import('@/views/admin/DriverReviewView.vue'),
            },
            {
                path: 'laundries',
                name: 'Laundries',
                component: () => import('@/views/admin/LaundriesView.vue'),
            },
            {
                path: 'cities',
                name: 'Cities',
                component: () => import('@/views/admin/CitiesView.vue'),
            },
            {
                path: 'pricing',
                name: 'Pricing',
                component: () => import('@/views/admin/PricingView.vue'),
            },
            {
                path: 'laundry-drivers',
                name: 'LaundryDrivers',
                component: () => import('@/views/admin/LaundryDriversView.vue'),
            },
        ],
    },
    {
        path: '/store',
        component: () => import('@/layouts/StoreLayout.vue'),
        meta: { requiresAuth: true, role: 'store_manager' },
        children: [
            {
                path: 'kanban',
                name: 'StoreKanban',
                component: () => import('@/views/store/KanbanView.vue'),
            },
            { path: '', redirect: 'kanban' },
            { path: 'kanban', name: 'StoreKanban', component: () => import('@/views/store/KanbanView.vue') },
            { path: 'orders', name: 'StoreOrders', component: () => import('@/views/store/OrdersView.vue') },
            { path: 'customers', name: 'StoreCustomers', component: () => import('@/views/store/CustomersView.vue') },
            // Services route disabled - Klothy controls pricing centrally
            // { path: 'services', name: 'StoreServices', component: () => import('@/views/store/ServicesView.vue') },
            { path: 'financials', name: 'StoreFinancials', component: () => import('@/views/store/FinancialsView.vue') },
            { path: 'settings', name: 'StoreSettings', component: () => import('@/views/store/SettingsView.vue') }
        ],
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('authToken')
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

    if (requiresAuth && !isAuthenticated) {
        next('/login')
    } else if (to.path === '/login' && isAuthenticated) {
        next('/admin/dashboard')
    } else {
        next()
    }
})

export default router
