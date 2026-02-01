import { ref, computed } from 'vue'
import { useNotification } from './useNotification'

export interface LaundryFacility {
    id: string
    name: string
    location: string
    city: string
    activeDrivers: number
    activeDrivers: number
    totalOrders: number
    completedOrders: number
    laundryRevenue: number
    driverRevenue: number
    coordinates?: {
        lat: number
        lng: number
    }
}

// Mock data
const mockLaundries: LaundryFacility[] = [
    {
        id: 'laundry-1',
        name: 'المغسلة الرئيسية',
        location: 'الرياض - حي النخيل',
        city: 'الرياض',
        activeDrivers: 2,
        totalOrders: 200,
        completedOrders: 180,
        laundryRevenue: 2000,
        driverRevenue: 900,
        coordinates: {
            lat: 24.7136,
            lng: 46.6753
        }
    },
    {
        id: 'laundry-2',
        name: 'فرع الملز',
        location: 'الرياض - حي الملز',
        city: 'الرياض',
        activeDrivers: 2,
        totalOrders: 150,
        completedOrders: 142,
        laundryRevenue: 3500,
        driverRevenue: 1200,
        coordinates: {
            lat: 24.6877,
            lng: 46.7219
        }
    },
    {
        id: 'laundry-3',
        name: 'فرع العليا',
        location: 'الرياض - حي العليا',
        city: 'الرياض',
        activeDrivers: 1,
        totalOrders: 120,
        completedOrders: 110,
        laundryRevenue: 1800,
        driverRevenue: 750,
        coordinates: {
            lat: 24.6945,
            lng: 46.6851
        }
    }
]

export function useLaundryFacilities() {
    const { showSuccess, showError } = useNotification()

    const laundries = ref<LaundryFacility[]>([...mockLaundries])
    const loading = ref(false)

    // Computed: Total facilities count
    const totalFacilities = computed(() => laundries.value.length)

    // Computed: Total active drivers across all facilities
    const totalActiveDrivers = computed(() =>
        laundries.value.reduce((sum, l) => sum + l.activeDrivers, 0)
    )

    // Get laundry by ID
    const getLaundryById = (id: string) => {
        return laundries.value.find(l => l.id === id)
    }

    // Get laundries as select items
    const getLaundriesForSelect = () => {
        return laundries.value.map(laundry => ({
            title: laundry.name,
            value: laundry.id,
            subtitle: laundry.location
        }))
    }

    // Update driver count for laundry
    const updateDriverCount = (laundryId: string, count: number) => {
        const laundryIndex = laundries.value.findIndex(l => l.id === laundryId)
        if (laundryIndex !== -1) {
            const laundry = laundries.value[laundryIndex]
            if (laundry) {
                laundry.activeDrivers = count
            }
        }
    }

    // Increment driver count
    const incrementDriverCount = (laundryId: string) => {
        const laundry = getLaundryById(laundryId)
        if (laundry) {
            updateDriverCount(laundryId, laundry.activeDrivers + 1)
        }
    }

    // Decrement driver count
    const decrementDriverCount = (laundryId: string) => {
        const laundry = getLaundryById(laundryId)
        if (laundry && laundry.activeDrivers > 0) {
            updateDriverCount(laundryId, laundry.activeDrivers - 1)
        }
    }

    return {
        laundries,
        loading,
        totalFacilities,
        totalActiveDrivers,
        getLaundryById,
        getLaundriesForSelect,
        updateDriverCount,
        incrementDriverCount,
        decrementDriverCount
    }
}
