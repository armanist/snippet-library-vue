import { ref, type Ref } from 'vue'
import type { Snippet } from '../contracts/snippet'

export function useSnippetForm(snippets: Ref<Snippet[]>) {
    const editingSnippet = ref<Snippet | null>(null)

    function startEdit(id: string): void {
        const snippet = snippets.value.find((current) => current.id === id)

        if (snippet) {
            editingSnippet.value = snippet
        }
    }

    function cancelEdit(): void {
        editingSnippet.value = null
    }

    return {
        editingSnippet,
        startEdit,
        cancelEdit
    }
}