<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4"
      @click.self="closeModal"
    >
      <div class="bg-white w-full md:max-w-3xl md:rounded-2xl rounded-t-3xl shadow-2xl transform transition-all duration-300 max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-5 flex justify-between items-center">
          <div>
            <h2 class="text-xl md:text-2xl font-bold">
              {{ isEditing ? 'Editar Nota' : 'Nova Nota' }}
            </h2>
            <p class="text-blue-100 text-sm mt-1">
              {{ isEditing ? 'Atualize os detalhes da sua nota' : 'Crie uma nova anotação' }}
            </p>
          </div>
          <button
            @click="closeModal"
            class="text-white hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Título *
            </label>
            <input
              v-model="localNote.title"
              type="text"
              placeholder="Digite um título para sua nota..."
              required
              class="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Conteúdo *
            </label>
            <RichTextEditor 
              v-model="localNote.content"
              placeholder="Digite o conteúdo da sua nota..."
            />
          </div>
          
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Categoria (opcional)
            </label>
            <input
              v-model="localNote.category"
              type="text"
              placeholder="Ex: Trabalho, Pessoal, Estudos..."
              class="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 flex flex-col-reverse md:flex-row gap-3 border-t border-gray-200">
          <button
            @click="closeModal"
            class="w-full md:w-auto px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            Cancelar
          </button>
          <button
            @click="saveNote"
            class="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {{ isEditing ? '💾 Salvar Alterações' : '✨ Criar Nota' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Note, NoteFormData } from '~/types/note'

interface Props {
  isOpen: boolean
  note?: Note | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [note: NoteFormData]
}>()

const localNote = ref({
  title: '',
  content: '',
  category: ''
})

const isEditing = computed(() => !!props.note)

watch(() => props.note, (newNote) => {
  if (newNote) {
    localNote.value = {
      title: newNote.title,
      content: newNote.content,
      category: newNote.category || ''
    }
  } else {
    localNote.value = {
      title: '',
      content: '',
      category: ''
    }
  }
}, { immediate: true })

const closeModal = () => {
  emit('close')
}

const saveNote = () => {
  if (!localNote.value.title || !localNote.value.content) {
    return
  }
  
  const noteData: NoteFormData = {
    title: localNote.value.title,
    content: localNote.value.content,
    category: localNote.value.category || undefined
  }
  
  emit('save', noteData)
  closeModal()
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
