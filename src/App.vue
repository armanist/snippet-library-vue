<script setup lang="ts">
import { ref } from 'vue'
import SnippetList from './snippets/SnippetList.vue'
import type { Snippet, SnippetDraft } from './snippets/snippet'
import SnippetForm from './snippets/SnippetForm.vue'
import Toast from './shared/Toast.vue'
import ConfirmDialog from './shared/ConfirmDialog.vue'

const snippets = ref<Snippet[]>([
  {
    id: '1',
    title: 'Array map',
    language: 'typescript',
    code: 'const labels = items.map((item) => item.label)',
    tags: ['arrays', 'typescript'],
    createdAt: '2026-09-27T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'JSON response',
    language: 'php',
    code: 'return response()->json($data);',
    tags: ['php', 'laravel'],
    createdAt: '2026-09-27T00:00:00.000Z',
  },
])

const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const deleteDialogVisible = ref(false)
const pendingDeleteId = ref<string | null>(null)
const pendingDeleteTitle = ref('')

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
        <SnippetList :snippets="snippets" @delete-requested="handleDeleteRequested" />
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
