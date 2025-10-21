<template>
  <Teleport to="body">
    <div
      v-if="isOpen && note"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white w-full max-w-4xl rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 md:px-6 py-4 md:py-5">
          <div class="flex justify-between items-start gap-3">
            <div class="flex-1 min-w-0">
              <h2 class="text-lg md:text-2xl font-bold break-words line-clamp-2">
                {{ note.title }}
              </h2>
              <div class="flex flex-wrap items-center gap-2 md:gap-3 mt-2 text-xs md:text-sm text-blue-100">
                <span v-if="note.category" class="px-2 md:px-3 py-1 bg-white/20 rounded-full font-semibold">
                  {{ note.category }}
                </span>
                <span class="truncate">{{ formattedDate }}</span>
              </div>
            </div>
            <button
              @click="closeModal"
              class="text-white hover:bg-white/20 rounded-full p-2 transition-colors duration-200 flex-shrink-0"
              aria-label="Fechar"
            >
              <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-4 md:p-8">
          <div class="prose prose-sm md:prose-lg max-w-none">
            <div class="text-gray-700 text-sm md:text-lg leading-relaxed" v-html="formattedContent"></div>
          </div>
        </div>

        <!-- Footer com ações -->
        <div class="border-t border-gray-200 p-3 md:p-4 bg-gray-50 flex flex-col-reverse sm:flex-row gap-2 md:gap-3">
          <button
            @click="handleDelete"
            class="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-red-600 text-white font-semibold rounded-lg md:rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Excluir
          </button>
          <button
            @click="handleEdit"
            class="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white font-semibold rounded-lg md:rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm md:text-base sm:ml-auto"
          >
            <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Note } from '~/types/note'

interface Props {
  isOpen: boolean
  note: Note | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  edit: [note: Note]
  delete: [note: Note]
}>()

const formattedDate = computed(() => {
  if (!props.note) return ''
  const date = new Date(props.note.updated_at)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const formattedContent = computed(() => {
  if (!props.note) return ''
  let html = props.note.content || ''
  
  // Converte marcação para HTML
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negrito
  html = html.replace(/_(.*?)_/g, '<em>$1</em>') // Itálico
  html = html.replace(/~~(.*?)~~/g, '<u>$1</u>') // Sublinhado (novo formato)
  html = html.replace(/\[left\](.*?)\[\/left\]/g, '<div style="text-align: left;">$1</div>') // Esquerda
  html = html.replace(/\[center\](.*?)\[\/center\]/g, '<div style="text-align: center;">$1</div>') // Centro
  html = html.replace(/\[right\](.*?)\[\/right\]/g, '<div style="text-align: right;">$1</div>') // Direita
  html = html.replace(/\n/g, '<br>') // Quebras de linha
  
  return html
})

const closeModal = () => {
  emit('close')
}

const handleEdit = () => {
  if (props.note) {
    emit('edit', props.note)
    closeModal()
  }
}

const handleDelete = () => {
  if (props.note) {
    emit('delete', props.note)
    closeModal()
  }
}

// Fecha modal com ESC
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
