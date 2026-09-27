<script setup lang="ts">
type ToastType = 'success' | 'error'

defineProps<{
  message: string
  type: ToastType
}>()
</script>
<template>
  <div
    v-if="message"
    :class="[
      'fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-md px-4 py-3 text-sm font-semibold text-white shadow-lg',
      type === 'success' ? 'bg-emerald-700' : 'bg-red-700',
    ]"
    :role="type === 'error' ? 'alert' : 'status'"
  >
    {{ message }}
  </div>
</template>
