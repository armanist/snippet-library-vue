import { readonly, ref } from 'vue'

export type ToastType = 'success' | 'error'

const message = ref('')
const type = ref<ToastType>('success')
let timeoutId: ReturnType<typeof setTimeout> | undefined

export function useToast() {
  function showSuccess(text: string): void {
    show(text, 'success')
  }

  function showError(text: string): void {
    show(text, 'error')
  }

  return {
    message: readonly(message),
    type: readonly(type),
    showSuccess,
    showError,
  }
}

function show(text: string, toastType: ToastType): void {
  clearTimeout(timeoutId)

  message.value = text
  type.value = toastType

  timeoutId = setTimeout(() => {
    message.value = ''
  }, 3000)
}
