import { readonly, ref } from "vue"

export function useConfirmDialog() {
    const visible = ref(false)
    const pendingId = ref<string | null>(null)
    const pendingTitle = ref('')

    function open(id: string, title: string): void {
        pendingId.value = id
        pendingTitle.value = title
        visible.value = true
    }

    function close(): void {
        visible.value = false
        pendingId.value = null
        pendingTitle.value = ''
    }

    return {
        visible: readonly(visible),
        pendingId: readonly(pendingId),
        pendingTitle: readonly(pendingTitle),
        open,
        close
    }
}