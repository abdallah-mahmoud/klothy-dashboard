// src/types/index.ts
/**
 * TypeScript interfaces for Klothy Dashboard
 * Based on API specification from the report
 */

export type UserRole = 'client' | 'admin' | 'store_manager' | 'driver'

export interface User {
    id: string
    name: string
    phone: string
    email?: string
    role: UserRole
    avatar?: string
}

export type DriverStatus = 'active' | 'pending' | 'banned' | 'offline'

export interface DriverDocuments {
    nationalId: string
    drivingLicense: string
    vehicleRegistration: string
    vehiclePhoto: string
}

export interface Driver extends User {
    role: 'driver'
    licenseNumber: string
    vehicleType: string
    vehicleYear: number
    plateNumber: string
    status: DriverStatus
    currentLocation?: {
        lat: number
        lng: number
    }
    documents: DriverDocuments
    rating?: number
    completedTrips?: number
}

export interface Coordinates {
    lat: number
    lng: number
}

export interface Laundry {
    id: string
    name: string
    managerName: string
    phone: string
    location: Coordinates
    serviceArea?: any // GeoJSON polygon
    commissionRate: number
    status: 'active' | 'inactive'
    commercialRegistration?: string
}

export type OrderStatus =
    | 'new'
    | 'driver_assigned'
    | 'pickup_in_progress'
    | 'picked_up'
    | 'at_store'
    | 'washing'
    | 'ready'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled'

export type PaymentMethod = 'cash' | 'card' | 'wallet'

export interface PaymentInfo {
    method: PaymentMethod
    cardLastFour?: string
    transactionId?: string
}

export interface OrderEvent {
    status: OrderStatus
    timestamp: Date
    description: string
    icon?: string
}

export interface Service {
    id: string
    nameAr: string
    nameEn: string
    icon?: string
    parentId?: string
}

export interface Product {
    id: string
    serviceId: string
    nameAr: string
    nameEn?: string
    basePrice: number
    expressPrice?: number
    icon?: string
}

export interface OrderItem {
    id: string
    service: Service
    product: Product
    quantity: number
    pricePerUnit: number
    totalPrice: number
}

export interface Address {
    street: string
    city: string
    coordinates: Coordinates
}

export interface Order {
    id: string
    orderNumber: string
    client: User
    driver?: Driver
    laundry: Laundry
    items: OrderItem[]
    status: OrderStatus
    pickupAddress: Address
    deliveryAddress: Address
    subtotal: number
    tax: number
    deliveryFee: number
    discount: number
    totalAmount: number
    payment: PaymentInfo
    timeline: OrderEvent[]
    createdAt: Date
    updatedAt: Date
    notes?: string
}

export interface DashboardStats {
    activeOrders: number
    todaySales: number
    onlineDrivers: number
    openLaundries: number
    yesterdayComparison: {
        orders: number // percentage change
        sales: number
        drivers: number
        laundries: number
    }
}

export interface RevenueData {
    date: string
    revenue: number
}

export interface OrdersBreakdown {
    new: number
    inProgress: number
    completed: number
    cancelled: number
}

export interface LaundryStats {
    totalOrders: number
    grossRevenue: number
    commission: number
    netEarnings: number
    monthlyRevenue: RevenueData[]
}

export interface Transfer {
    id: string
    date: Date
    amount: number
    bankAccount: string
    status: 'pending' | 'completed' | 'failed'
}
