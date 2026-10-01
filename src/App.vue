<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SnippetList from './snippets/SnippetList.vue'
import SnippetForm from './snippets/SnippetForm.vue'
import Toast from './shared/Toast.vue'
import ConfirmDialog from './shared/ConfirmDialog.vue'
import { SnippetApi } from './snippets/snippet-api'
import type { Snippet, SnippetDraft } from './snippets/snippet'

const snippetApi = new SnippetApi()
const snippets = ref<Snippet[]>([])
const isLoading = ref(true)

const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const deleteDialogVisible = ref(false)
const pendingDeleteId = ref<string | null>(null)
const pendingDeleteTitle = ref('')

onMounted(async () => {
  try {
    const result = await snippetApi.getAll()
    snippets.value = result.snippets
  } catch (error) {
    toastMessage.value = error instanceof Error ? error.message : 'Failed to load snippets.'
    toastType.value = 'error'
  } finally {
    isLoading.value = false
  }
})

function handleSubmitted(draft: SnippetDraft): void {
  snippets.value.unshift({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...draft,
  })

  toastMessage.value = 'Snippet added.'
  toastType.value = 'success'
}

function handleValidationError(message: string): void {
  toastMessage.value = message
  toastType.value = 'error'
}

function handleDeleteRequested(id: string): void {
  const snippet = snippets.value.find((currentSnippet) => currentSnippet.id === id)

  if (!snippet) {
    return
  }

  pendingDeleteId.value = id
  pendingDeleteTitle.value = snippet.title
  deleteDialogVisible.value = true
}

function handleDeleteConfirmed(): void {
  if (!pendingDeleteId.value) {
    return
  }

  snippets.value = snippets.value.filter((snippet) => snippet.id !== pendingDeleteId.value)

  closeDeleteDialog()

  toastMessage.value = 'Snippet deleted.'
  toastType.value = 'success'
}

function closeDeleteDialog(): void {
  deleteDialogVisible.value = false
  pendingDeleteId.value = null
  pendingDeleteTitle.value = ''
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
        <h2 class="mb-4 text-xl font-semibold text-slate-900">Add Snippet</h2>
        <SnippetForm @submitted="handleSubmitted" @validation-error="handleValidationError" />
      </section>

      <section
        class="min-h-[220px] min-w-0 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 class="mb-4 text-xl font-semibold text-slate-900">Your Snippets</h2>
        <p v-if="isLoading" class="text-slate-600">Loading snippets...</p>
        <SnippetList v-else :snippets="snippets" @delete-requested="handleDeleteRequested" />
      </section>
    </section>
    <Toast :message="toastMessage" :type="toastType" />

    <ConfirmDialog
      :visible="deleteDialogVisible"
      :snippet-title="pendingDeleteTitle"
      @confirmed="handleDeleteConfirmed"
      @cancelled="closeDeleteDialog"
    />
  </main>
</template>
