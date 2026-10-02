<script setup lang="ts">
import type { PaginationMetadata } from '@/snippets/snippet'

const props = defineProps<{
  pagination: PaginationMetadata
  disabled: boolean
}>()

const emit = defineEmits<{
  (event: 'page-change', page: number): void
}>()

function requestPage(page: number): void {
  emit('page-change', page)
}
</script>
<template>
  <nav
    v-if="props.pagination.totalPages > 0"
    class="flex flex-wrap items-center justify-between gap-4"
    aria-label="Snippet pagination"
  >
    <p class="text-sm text-slate-600">
      Page {{ props.pagination.page }} of {{ props.pagination.totalPages }} ({{
        props.pagination.total
      }}
      snippets)
    </p>

    <div class="flex gap-2">
      <button
        type="button"
        class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="props.disabled || props.pagination.page <= 1"
        @click="requestPage(props.pagination.page - 1)"
      >
        Previous
      </button>

      <button
        type="button"
        class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="props.disabled || props.pagination.page >= props.pagination.totalPages"
        @click="requestPage(props.pagination.page + 1)"
      >
        Next
      </button>
    </div>
  </nav>
</template>
