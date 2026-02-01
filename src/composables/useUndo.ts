import { ref } from 'vue'
import { useNotification } from './useNotification'

interface UndoAction {
    action: () => Promise<void> | void
    message: string
    timeout: number
}

export function useUndo() {
    const { showSuccess } = useNotification()
    const pendingUndo = ref<UndoAction | null>(null)
    let undoTimeout: ReturnType<typeof setTimeout>

    /**
     * Execute an action with undo capability
     * @param action The main action to execute
     * @param undoAction The action to execute if user clicks undo
     * @param message Success message to show
     * @param timeout Time window for undo (default 5000ms)
     */
    const executeWithUndo = async (
        action: () => Promise<void> | void,
        undoAction: () => Promise<void> | void,
        message: string,
        timeout = 5000
    ) => {
        // Execute the main action
        await action()

        // Store undo action
        pendingUndo.value = {
            action: undoAction,
            message,
            timeout
        }

        // Show success notification
        showSuccess(message)

        // Set timeout to finalize (remove undo option)
        undoTimeout = setTimeout(() => {
            pendingUndo.value = null
        }, timeout)
    }

    /**
     * Execute the undo action
     */
    const undo = async () => {
        if (pendingUndo.value) {
            clearTimeout(undoTimeout)

            // Execute undo action
            try {
                await pendingUndo.value.action()
                showSuccess('تم التراجع عن العملية')
            } catch (error) {
                console.error('Undo failed:', error)
            }

            // Clear pending undo
            pendingUndo.value = null
        }
    }

    /**
     * Cancel the pending undo (finalize the action)
     */
    const cancelUndo = () => {
        if (pendingUndo.value) {
            clearTimeout(undoTimeout)
            pendingUndo.value = null
        }
    }

    return {
        pendingUndo,
        executeWithUndo,
        undo,
        cancelUndo
    }
}
