<template>
  <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200">
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-lg font-semibold text-gray-800 truncate flex-1">
        {{ note.title || 'Sem título' }}
      </h3>
      <div class="flex gap-2 ml-2">
        <button
          @click.stop="$emit('edit', note)"
          class="text-blue-600 hover:text-blue-800 transition-colors"
          title="Editar"
        >
          ✏️
        </button>
        <button
          @click.stop="$emit('delete', note)"
          class="text-red-600 hover:text-red-800 transition-colors"
          title="Excluir"
        >
          🗑️
        </button>
      </div>
    </div>
    
    <p class="text-gray-600 text-sm line-clamp-3 mb-3">
      {{ note.content || 'Sem conteúdo' }}
    </p>
    
    <div class="flex justify-between items-center text-xs text-gray-500">
      <span>{{ formattedDate }}</span>
      <span v-if="note.category" class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
        {{ note.category }}
      </span>
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
