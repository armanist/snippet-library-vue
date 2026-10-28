<script setup lang="ts">
import SnippetCard from './SnippetCard.vue';
import Pagination from './Pagination.vue';
import { useSnippetList } from './use-snippet-list';
import type { Snippet } from '../contracts/snippet'

const emit = defineEmits<{
  (event: 'edit-requested', snippet: Snippet): void
  (event: 'delete-requested', snippet: Snippet): void
}>()

const {
  snippets,
  isLoading,
  searchTerm,
  pagination,
  resetToFirstPage,
  goToPage
} = useSnippetList()

function handleEdit(snippet: Snippet): void {
  emit('edit-requested', snippet)
}

function handleDelete(snippet: Snippet): void {
  emit('delete-requested', snippet)
}
</script>

<template>
  <div>
    <label class="mb-4 grid gap-1.5 text-sm font-semibold text-slate-700">
      Search
      <input 
        v-model="searchTerm" 
        @input="resetToFirstPage"
        class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900" type="search" name="search"
        placeholder="Search snippets..." 
      />
    </label>

    <p v-if="isLoading" class="text-slate-600" role="status">
      {{ snippets.length > 0 ? 'Updating snippets...' : 'Loading snippets...' }}
    </p>
    <p v-if="!isLoading && snippets.length === 0" class="text-slate-600">
      {{ searchTerm.trim() ? 'No snippets match your search.' : 'No snippets yet.' }}
    </p>

   <div v-if="snippets.length > 0" class="grid gap-4">
      <SnippetCard 
        v-for="snippet in snippets" 
        :key="snippet.id" 
        :snippet="snippet"
        @edit-requested="handleEdit"
        @delete-requested="handleDelete" 
      />
    </div>

   <Pagination
      v-if="pagination"
      class="mt-5"
      :pagination="pagination"
      :disabled="isLoading"
      @page-change="goToPage"
    />
  </div>
</template>
