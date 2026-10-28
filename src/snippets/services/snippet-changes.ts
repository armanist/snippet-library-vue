import { ref } from 'vue'

export const snippetChanges = ref(0)

export function notifySnippetChanges(): void {
    snippetChanges.value += 1
}