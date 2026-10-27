import { ref } from "vue";

export type ToastType = 'success' | 'error'

export function useToast() {
    const message = ref('')
    const type = ref<ToastType>('success')

    function showSuccess(text: string): void {
        message.value = text
        type.value = 'success'
    }

    function showError(text: string): void {
        message.value = text
        type.value = 'error'
    }

    return {message, type, showSuccess, showError}
}