import { ref } from 'vue'

export const snippetChanges = ref(0)

export const deletedSnippetId = ref<string | null>(null)

export function notifySnippetChanges(): void {
    snippetChanges.value += 1
}

export function notifySnippetDeleted(id: string): void {
    deletedSnippetId.value = id
}