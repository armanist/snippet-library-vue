<script setup lang="ts">
import SnippetCard from './SnippetCard.vue';
import type { Snippet } from '../contracts/snippet'

const props = defineProps<{ snippets: Snippet[] }>()

const emit = defineEmits<{
  (event: 'edit-requested', snippet: Snippet): void
  (event: 'delete-requested', snippet: Snippet): void
}>()

function handleEdit(snippet: Snippet): void {
  emit('edit-requested', snippet)
}

function handleDelete(snippet: Snippet): void {
  emit('delete-requested', snippet)
}
</script>

<template>
  <div class="grid gap-4">
    <SnippetCard
      v-for="snippet in props.snippets"
      :key="snippet.id"
      :snippet="snippet"
      @edit-requested="handleEdit"
      @delete-requested="handleDelete"
    />
  </div>
</template>
