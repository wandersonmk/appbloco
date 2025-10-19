<template>
  <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group">
    <div class="p-5 md:p-6">
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 line-clamp-2 flex-1 pr-2">
          {{ note.title || 'Sem título' }}
        </h3>
        <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            @click.stop="$emit('edit', note)"
            class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            title="Editar"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            @click.stop="$emit('delete', note)"
            class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Excluir"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <p class="text-gray-600 text-sm md:text-base line-clamp-3 mb-4 leading-relaxed">
        {{ note.content || 'Sem conteúdo' }}
      </p>
      
      <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100">
        <span class="text-xs md:text-sm text-gray-500 font-medium">{{ formattedDate }}</span>
        <span v-if="note.category" class="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold rounded-full shadow-sm">
          {{ note.category }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Note {
  id: string
  title: string
  content: string
  category?: string
  createdAt: Date
  updatedAt: Date
}

interface Props {
  note: Note
}

const props = defineProps<Props>()

defineEmits<{
  edit: [note: Note]
  delete: [note: Note]
}>()

const formattedDate = computed(() => {
  const date = new Date(props.note.updatedAt)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
