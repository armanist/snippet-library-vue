import { ref } from 'vue'
import { useToast } from '@/shared/toast/use-toast'
import { notifySnippetChanges } from '../services/snippet-changes'
import { SNIPPET_DATA_SOURCE } from '../services/snippet-data-source'
import type { SnippetDraft } from '../contracts/create-snippet'
import type { Snippet } from '../contracts/snippet'

const snippetApi = SNIPPET_DATA_SOURCE

export function useSnippetForm() {
    const toast = useToast()

    const editingSnippet = ref<Snippet | null>(null)

    function startEdit(snippet: Snippet): void {
        editingSnippet.value = snippet
    }

    function cancelEdit(): void {
        editingSnippet.value = null
    }

    async function handleSubmitted(draft: SnippetDraft): Promise<void> {
        const snippetToEdit = editingSnippet.value

        try {
            if (snippetToEdit) {
                await snippetApi.update(snippetToEdit.id, draft)

                cancelEdit()

                toast.showSuccess('Snippet updated.')
            } else {
                await snippetApi.create(draft)

                toast.showSuccess('Snippet added.')
            }

            notifySnippetChanges()
        } catch (error) {
            let message = error instanceof Error
                ? error.message
                : snippetToEdit
                    ? 'Failed to update snippet.'
                    : 'Failed to create snippet.'

            toast.showError(message)
        }
    }

    return {
        editingSnippet,
        startEdit,
        cancelEdit,
        handleSubmitted
    }
}