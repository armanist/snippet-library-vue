<script setup lang="ts">
import SnippetCard from './SnippetCard.vue'
import type { Snippet } from './snippet'

const props = defineProps<{ snippets: Snippet[] }>()

const emit = defineEmits<{
  (event: 'delete-requested', id: string): void
}>()

function handleDelete(id: string): void {
  emit('delete-requested', id)
}
</script>

<template>
  <div class="grid gap-4">
    <SnippetCard
      v-for="snippet in props.snippets"
      :key="snippet.id"
      :snippet="snippet"
      @delete-requested="handleDelete"
    />
  </div>
</template>
