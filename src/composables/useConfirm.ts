import { ref, type Ref } from 'vue'

interface ConfirmOptions {
    title?: string
    message: string
    confirmText?: string
    confirmColor?: string
    type?: 'danger' | 'warning' | 'info'
}

interface ConfirmState {
    isOpen: Ref<boolean>
    options: Ref<ConfirmOptions>
    resolve: ((value: boolean) => void) | null
}

const state: ConfirmState = {
    isOpen: ref(false),
    options: ref({} as ConfirmOptions),
    resolve: null
}

export function useConfirm() {
    const confirm = (options: ConfirmOptions): Promise<boolean> => {
        state.options.value = options
        state.isOpen.value = true

        return new Promise((resolve) => {
            state.resolve = resolve
        })
    }

    const handleConfirm = () => {
        if (state.resolve) {
            state.resolve(true)
        }
        state.isOpen.value = false
    }

    const handleCancel = () => {
        if (state.resolve) {
            state.resolve(false)
        }
        state.isOpen.value = false
    }

    return {
        isOpen: state.isOpen,
        options: state.options,
        confirm,
        handleConfirm,
        handleCancel
    }
}
