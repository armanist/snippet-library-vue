<script setup lang="ts">
import { ref, watch } from 'vue'
import SnippetList from './snippets/SnippetList.vue'
import SnippetForm from './snippets/SnippetForm.vue'
import Toast from './shared/toast/Toast.vue'
import ConfirmDialog from './shared/confirm-dialog/ConfirmDialog.vue'
import Pagination from './shared/Pagination.vue'
import { useToast } from './shared/toast/use-toast.ts'
import { useConfirmDialog } from './shared/confirm-dialog/use-confirm-dialog.ts'
import { SNIPPET_DATA_SOURCE } from './snippets/services/snippet-data-source'
import type { PaginationMetadata } from './snippets/contracts/find-snippet.ts'
import type { SnippetDraft } from './snippets/contracts/create-snippet.ts'
import type { Snippet } from './snippets/contracts/snippet.ts'

const snippetApi = SNIPPET_DATA_SOURCE

const snippets = ref<Snippet[]>([])
const isLoading = ref(true)
const searchTerm = ref('')
const pagination = ref<PaginationMetadata | null>(null)
const currentPage = ref(1)
const refreshKey = ref(0)
const editingSnippet = ref<Snippet | null>(null)

const toast = useToast();
const confirmDialog = useConfirmDialog();

const pageSize = 2

watch(
  [searchTerm, currentPage, refreshKey],
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

async function handleSubmitted(draft: SnippetDraft): Promise<void> {
  const snippetToEdit = editingSnippet.value

  try {
    if (snippetToEdit) {
      await snippetApi.update(snippetToEdit.id, draft)

      editingSnippet.value = null

      toast.showSuccess('Snippet updated.')
    } else {
      await snippetApi.create(draft)

      toast.showSuccess('Snippet added.')
    }

    refreshKey.value += 1
  } catch (error) {
    let message = error instanceof Error
        ? error.message
        : snippetToEdit
          ? 'Failed to update snippet.'
          : 'Failed to create snippet.'
    
    toast.showError(message)
  }
}

function handleSearchInput(): void {
  currentPage.value = 1
}

function handlePageChange(requestedPage: number): void {
  if (!pagination.value || requestedPage < 1 || requestedPage > pagination.value.totalPages) {
    return
  }

  currentPage.value = requestedPage
}

function handleEditRequested(id: string): void {
  const snippet = snippets.value.find((currentSnippet) => currentSnippet.id === id)

  if (!snippet) {
    return
  }

  editingSnippet.value = snippet
}

function handleEditCancelled(): void {
  editingSnippet.value = null
}

function handleDeleteRequested(id: string): void {
  const snippet = snippets.value.find((currentSnippet) => currentSnippet.id === id)

  if (!snippet) {
    return
  }

  confirmDialog.open(snippet.id, snippet.title)
}

async function handleDeleteConfirmed(): Promise<void> {
  const id = confirmDialog.pendingId.value

  if (!id) {
    return
  }

  try {
    await snippetApi.delete(id)

    if (snippets.value.length === 1 && currentPage.value > 1) {
      currentPage.value -= 1
    } else {
      refreshKey.value += 1
    }

    confirmDialog.close()

    toast.showSuccess('Snippet deleted.')
  } catch (error) {
    let message = error instanceof Error ? error.message : 'Failed to delete snippet.'
    
    toast.showError(message)
  }
}

</script>
<template>
  <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
    <header class="mb-8">
      <h1 class="mb-3 text-4xl font-bold leading-tight text-slate-900">Snippet Library</h1>
      <p class="max-w-xl text-lg leading-7 text-slate-600">
        Save small code snippets by language, tags and title.
      </p>
    </header>

    <section class="grid items-start gap-6 lg:grid-cols-[22.5rem_minmax(0,1fr)]">
      <section
        class="min-h-[220px] min-w-0 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 class="mb-4 text-xl font-semibold text-slate-900">
          {{ editingSnippet ? 'Edit Snippet' : 'Add Snippet' }}
        </h2>
        <SnippetForm
          :editing-snippet="editingSnippet"
          @submitted="handleSubmitted"
          @validation-error="toast.showError"
          @cancelled="handleEditCancelled"
        />
      </section>

      <section
        class="min-h-[220px] min-w-0 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 class="mb-4 text-xl font-semibold text-slate-900">Your Snippets</h2>
        <label class="mb-4 grid gap-1.5 text-sm font-semibold text-slate-700">
          Search
          <input
            v-model="searchTerm"
            @input="handleSearchInput"
            class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900"
            type="search"
            name="search"
            placeholder="Search snippets..."
          />
        </label>
        <p v-if="isLoading" class="text-slate-600" role="status">
          {{ snippets.length > 0 ? 'Updating snippets...' : 'Loading snippets...' }}
        </p>
        <p v-if="!isLoading && snippets.length === 0" class="text-slate-600">
          {{ searchTerm.trim() ? 'No snippets match your search.' : 'No snippets yet.' }}
        </p>
        <SnippetList
          v-if="snippets.length > 0"
          :snippets="snippets"
          @edit-requested="handleEditRequested"
          @delete-requested="handleDeleteRequested"
        />
        <Pagination
          v-if="pagination"
          class="mt-5"
          :pagination="pagination"
          :disabled="isLoading"
          @page-change="handlePageChange"
        />
      </section>
    </section>
    <Toast :message="toast.message.value" :type="toast.type.value" />

    <ConfirmDialog
      :visible="confirmDialog.visible.value"
      :snippet-title="confirmDialog.pendingTitle.value"
      @confirmed="handleDeleteConfirmed"
      @cancelled="confirmDialog.close"
    />
  </main>
</template>
