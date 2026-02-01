import { ref, computed } from 'vue'
import { useNotification } from './useNotification'

export interface Driver {
    id: string
    name: string
    phone: string
    status: 'active' | 'inactive' | 'on_trip'
    assignedLaundryId: string | null
    assignedLaundryName: string | null
    totalTrips: number
    rating: number
    unpaidRevenue: number
    avatar?: string
}

// Mock data
const mockDrivers: Driver[] = [
    {
        id: 'driver-1',
        name: 'أحمد محمد',
        phone: '0501234567',
        status: 'active',
        assignedLaundryId: 'laundry-1',
        assignedLaundryName: 'المغسلة الرئيسية',
        totalTrips: 245,
        rating: 4.8,
        unpaidRevenue: 450
    },
    {
        id: 'driver-2',
        name: 'خالد علي',
        phone: '0509876543',
        status: 'active',
        assignedLaundryId: 'laundry-2',
        assignedLaundryName: 'فرع الملز',
        totalTrips: 198,
        rating: 4.6,
        unpaidRevenue: 320
    },
    {
        id: 'driver-3',
        name: 'سعيد عبدالله',
        phone: '0551234567',
        status: 'on_trip',
        assignedLaundryId: 'laundry-1',
        assignedLaundryName: 'المغسلة الرئيسية',
        totalTrips: 156,
        rating: 4.7,
        unpaidRevenue: 50
    },
    {
        id: 'driver-4',
        name: 'محمد عبدالرحمن',
        phone: '0557654321',
        status: 'inactive',
        assignedLaundryId: null,
        assignedLaundryName: null,
        totalTrips: 67,
        rating: 4.2,
        unpaidRevenue: 0
    },
    {
        id: 'driver-5',
        name: 'عبدالله سالم',
        phone: '0543216789',
        status: 'active',
        assignedLaundryId: 'laundry-2',
        assignedLaundryName: 'فرع الملز',
        totalTrips: 189,
        rating: 4.5,
        unpaidRevenue: 200
    },
    {
        id: 'driver-6',
        name: 'فهد إبراهيم',
        phone: '0598765432',
        status: 'active',
        assignedLaundryId: 'laundry-3',
        assignedLaundryName: 'فرع العليا',
        totalTrips: 134,
        rating: 4.4,
        unpaidRevenue: 150
    }
]

export function useDrivers() {
    const { showSuccess, showError } = useNotification()

    const drivers = ref<Driver[]>([...mockDrivers])
    const loading = ref(false)
    const searchQuery = ref('')
    const selectedLaundryFilter = ref<string | null>(null)

    // Computed: Filtered drivers
    const filteredDrivers = computed(() => {
        let filtered = drivers.value

        // Filter by search query
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase()
            filtered = filtered.filter(driver =>
                driver.name.toLowerCase().includes(query) ||
                driver.phone.includes(query)
            )
        }

        // Filter by laundry
        if (selectedLaundryFilter.value) {
            filtered = filtered.filter(driver =>
                driver.assignedLaundryId === selectedLaundryFilter.value
            )
        }

        return filtered
    })

    // Computed: Active drivers count
    const activeDriversCount = computed(() =>
        drivers.value.filter(d => d.status === 'active').length
    )

    // Computed: Unassigned drivers count
    const unassignedDriversCount = computed(() =>
        drivers.value.filter(d => !d.assignedLaundryId).length
    )

    // Get drivers by laundry
    const getDriversByLaundry = (laundryId: string) => {
        return drivers.value.filter(driver => driver.assignedLaundryId === laundryId)
    }

    // Get available drivers (active and assigned)
    const getAvailableDrivers = (laundryId?: string) => {
        return drivers.value.filter(driver => {
            if (driver.status !== 'active') return false
            if (!laundryId) return true
            return driver.assignedLaundryId === laundryId
        })
    }

    // Assign driver to laundry
    const assignDriverToLaundry = async (
        driverId: string,
        laundryId: string,
        laundryName: string
    ) => {
        loading.value = true
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800))

            const driverIndex = drivers.value.findIndex(d => d.id === driverId)
            if (driverIndex === -1) {
                throw new Error('السائق غير موجود')
            }

            const driver = drivers.value[driverIndex]
            if (!driver) return false

            driver.assignedLaundryId = laundryId
            driver.assignedLaundryName = laundryName

            showSuccess(`تم إسناد السائق إلى ${laundryName}`)
            return true
        } catch (error) {
            showError('حدث خطأ أثناء الإسناد')
            return false
        } finally {
            loading.value = false
        }
    }

    // Unassign driver from laundry
    const unassignDriver = async (driverId: string) => {
        loading.value = true
        try {
            await new Promise(resolve => setTimeout(resolve, 500))

            const driverIndex = drivers.value.findIndex(d => d.id === driverId)
            if (driverIndex === -1) {
                throw new Error('السائق غير موجود')
            }

            const driver = drivers.value[driverIndex]
            if (!driver) return false

            driver.assignedLaundryId = null
            driver.assignedLaundryName = null

            showSuccess('تم إلغاء إسناد السائق')
            return true
        } catch (error) {
            showError('حدث خطأ أثناء إلغاء الإسناد')
            return false
        } finally {
            loading.value = false
        }
    }

    // Update driver status
    const updateDriverStatus = async (
        driverId: string,
        status: Driver['status']
    ) => {
        loading.value = true
        try {
            await new Promise(resolve => setTimeout(resolve, 500))

            const driverIndex = drivers.value.findIndex(d => d.id === driverId)
            if (driverIndex === -1) {
                throw new Error('السائق غير موجود')
            }

            const driver = drivers.value[driverIndex]
            if (!driver) return false

            driver.status = status

            showSuccess('تم تحديث حالة السائق')
            return true
        } catch (error) {
            showError('حدث خطأ أثناء تحديث الحالة')
            return false
        } finally {
            loading.value = false
        }
    }

    // Get driver by ID
    const getDriverById = (id: string) => {
        return drivers.value.find(d => d.id === id)
    }

    // Settle driver revenue
    const settleDriverRevenue = async (driverId: string) => {
        loading.value = true
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            const driver = drivers.value.find(d => d.id === driverId)
            if (driver) {
                driver.unpaidRevenue = 0
                showSuccess(`تم سداد مستحقات السائق ${driver.name}`)
                return true
            }
            return false
        } finally {
            loading.value = false
        }
    }

    return {
        drivers,
        filteredDrivers,
        loading,
        searchQuery,
        selectedLaundryFilter,
        activeDriversCount,
        unassignedDriversCount,
        getDriversByLaundry,
        getAvailableDrivers,
        assignDriverToLaundry,
        unassignDriver,
        updateDriverStatus,
        getDriverById,
        settleDriverRevenue
    }
}
