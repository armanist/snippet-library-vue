import { ref, watch } from 'vue'
import { useToast } from '@/shared/toast/use-toast'
import { snippetChanges } from '../services/snippet-changes'
import { SNIPPET_DATA_SOURCE } from '../services/snippet-data-source'
import type { PaginationMetadata } from '../contracts/find-snippet'
import type { Snippet } from '../contracts/snippet'

const pageSize = 2
const snippetApi = SNIPPET_DATA_SOURCE

export function useSnippetList() {
    const toast = useToast()

    const snippets = ref<Snippet[]>([])
    const isLoading = ref(true)
    const searchTerm = ref('')
    const pagination = ref<PaginationMetadata | null>(null)
    const currentPage = ref(1)

    watch(
        [searchTerm, currentPage, snippetChanges],
        ([search, requestedPage], oldValues, onCleanup) => {
            const controller = new AbortController()
            const previousSearch = oldValues?.[0]
            const debounceDelay = previousSearch === undefined || previousSearch === search ? 0 : 300

            const debounceTimer = setTimeout(async () => {
                isLoading.value = true

                try {
                    const result = await snippetApi.getAll(
                        {
                            search: search.trim(),
                            page: requestedPage,
                            limit: pageSize,
                        },
                        controller.signal,
                    )

                    if (result.pagination.totalPages > 0 && requestedPage > result.pagination.totalPages) {
                        currentPage.value = result.pagination.totalPages
                        return
                    }

                    snippets.value = result.snippets
                    pagination.value = result.pagination
                } catch (error) {
                    if (!controller.signal.aborted) {
                        let message = error instanceof Error ? error.message : 'Failed to load snippets.'

                        toast.showError(message)
                    }
                } finally {
                    if (!controller.signal.aborted) {
                        isLoading.value = false
                    }
                }
            }, debounceDelay)

            onCleanup(() => {
                clearTimeout(debounceTimer)
                controller.abort()
            })
        },
        { immediate: true },
    )

    function resetToFirstPage(): void {
        currentPage.value = 1
    }

    function goToPage(requestedPage: number): void {
        if (!pagination.value || requestedPage < 1 || requestedPage > pagination.value.totalPages) {
            return
        }

        currentPage.value = requestedPage
    }

    return {
        snippets,
        isLoading,
        searchTerm,
        pagination,
        resetToFirstPage,
        goToPage
    }
}