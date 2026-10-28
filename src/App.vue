<script setup lang="ts">
import SnippetList from './snippets/snippet-list/SnippetList.vue'
import SnippetForm from './snippets/snippet-form/SnippetForm.vue'
import Toast from './shared/toast/Toast.vue'
import ConfirmDialog from './shared/confirm-dialog/ConfirmDialog.vue'
import Pagination from './shared/Pagination.vue'
import { useToast } from './shared/toast/use-toast.ts'
import { useConfirmDialog } from './shared/confirm-dialog/use-confirm-dialog.ts'
import { useSnippetList } from './snippets/snippet-list/use-snippet-list.ts'
import { useSnippetForm } from './snippets/snippet-form/use-snippet-form'
import { notifySnippetChanges } from './snippets/services/snippet-changes.ts'
import { SNIPPET_DATA_SOURCE } from './snippets/services/snippet-data-source'
import type { Snippet } from './snippets/contracts/snippet.ts'

const snippetApi = SNIPPET_DATA_SOURCE
const toast = useToast();
const confirmDialog = useConfirmDialog();

const {
  snippets,
  isLoading,
  searchTerm,
  pagination,
  resetToFirstPage,
  goToPage,
} = useSnippetList()

const {
  editingSnippet,
  startEdit,
  cancelEdit,
  handleSubmitted
} = useSnippetForm()

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
          @cancelled="cancelEdit"
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
            @input="resetToFirstPage"
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
          @edit-requested="startEdit"
          @delete-requested="handleDeleteRequested"
        />
        <Pagination
          v-if="pagination"
          class="mt-5"
          :pagination="pagination"
          :disabled="isLoading"
          @page-change="goToPage"
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
