<script setup lang="ts">
import { ref, watch } from 'vue'
import { languages } from './snippet'
import type { Language, Snippet, SnippetDraft } from './snippet'

const title = ref('')
const language = ref<Language>(languages[0])
const code = ref('')
const tags = ref('')

const props = defineProps<{
  editingSnippet: Snippet | null
}>()

const emit = defineEmits<{
  (event: 'submitted', draft: SnippetDraft): void
  (event: 'validation-error', message: string): void
  (event: 'cancelled'): void
}>()

watch(
  () => props.editingSnippet,
  (snippet) => {
    title.value = snippet?.title ?? ''
    language.value = snippet?.language ?? languages[0]
    code.value = snippet?.code ?? ''
    tags.value = snippet?.tags.join(', ') ?? ''
  },
  { immediate: true },
)

function resetForm(): void {
  title.value = ''
  language.value = languages[0]
  code.value = ''
  tags.value = ''
}

function handleSubmit(): void {
  const normalizedTitle = title.value.trim()
  const normalizedCode = code.value.trim()

  if (!normalizedTitle || !normalizedCode) {
    emit('validation-error', 'Title and code are required.')
    return
  }

  emit('submitted', {
    title: normalizedTitle,
    language: language.value,
    code: normalizedCode,
    tags: tags.value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  })

  if (!props.editingSnippet) {
    resetForm()
  }
}
</script>
<template>
  <form class="grid gap-4" @submit.prevent="handleSubmit">
    <label class="grid gap-1.5 text-sm font-semibold text-slate-700">
      Title
      <input
        v-model="title"
        class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        type="text"
        placeholder="PHP foreach loop"
      />
    </label>

    <label class="grid gap-1.5 text-sm font-semibold text-slate-700">
      Language
      <select
        v-model="language"
        class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      >
        <option v-for="item in languages" :key="item" :value="item">
          {{ item.toUpperCase() }}
        </option>
      </select>
    </label>

    <label class="grid gap-1.5 text-sm font-semibold text-slate-700">
      Code
      <textarea
        v-model="code"
        class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        rows="8"
        placeholder="Paste your code here"
      />
    </label>

    <label class="grid gap-1.5 text-sm font-semibold text-slate-700">
      Tags
      <input
        v-model="tags"
        class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        type="text"
        placeholder="loop, array, php"
      />
    </label>

    <button
      class="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      type="submit"
    >
      {{ props.editingSnippet ? 'Save Changes' : 'Add Snippet' }}
    </button>

    <button
      v-if="props.editingSnippet"
      class="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      type="button"
      @click="emit('cancelled')"
    >
      Cancel
    </button>
  </form>
</template>
