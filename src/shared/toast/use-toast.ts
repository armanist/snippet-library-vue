import { readonly, ref } from "vue";

export type ToastType = 'success' | 'error'

    const message = ref('')
    const type = ref<ToastType>('success')

export function useToast() {
    function showSuccess(text: string): void {
        message.value = text
        type.value = 'success'
    }

    function showError(text: string): void {
        message.value = text
        type.value = 'error'
    }

    return {
        message: readonly(message), 
        type: readonly(type), 
        showSuccess, 
        showError
    }
}