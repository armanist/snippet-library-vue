import { useToast } from "@/shared/toast/use-toast"
import { useConfirmDialog } from "@/shared/confirm-dialog/use-confirm-dialog"
import { notifySnippetChanges } from "../services/snippet-changes"
import { SNIPPET_DATA_SOURCE } from "../services/snippet-data-source"
import type { Snippet } from "../contracts/snippet"

const snippetApi = SNIPPET_DATA_SOURCE

export function useSnippetDelete() {
    const toast = useToast();
    const confirmDialog = useConfirmDialog()

    function handleDeleteRequested(snippet: Snippet): void {
        confirmDialog.open(snippet.id, snippet.title)
    }

    async function handleDeleteConfirmed(): Promise<void> {
        const id = confirmDialog.pendingId.value

        if (!id) {
            return
        }

        try {
            await snippetApi.delete(id)

            notifySnippetChanges()

            confirmDialog.close()

            toast.showSuccess('Snippet deleted.')
        } catch (error) {
            let message = error instanceof Error ? error.message : 'Failed to delete snippet.'

            toast.showError(message)
        }
    }

    return {
        dialogVisible: confirmDialog.visible,
        dialogTitle: confirmDialog.pendingTitle,
        cancelDelete: confirmDialog.close,
        handleDeleteRequested,
        handleDeleteConfirmed,
    }
}