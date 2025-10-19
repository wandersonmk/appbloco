<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ isEditing ? 'Editar Nota' : 'Nova Nota' }}
        </h2>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 text-2xl leading-none"
        >
          ×
        </button>
      </div>
      
      <div class="p-6 space-y-4">
        <AppInput
          v-model="localNote.title"
          label="Título"
          placeholder="Digite o título da nota..."
          required
        />
        
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Conteúdo
          </label>
          <textarea
            v-model="localNote.content"
            placeholder="Digite o conteúdo da nota..."
            rows="10"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
            required
          ></textarea>
        </div>
        
        <AppInput
          v-model="localNote.category"
          label="Categoria (opcional)"
          placeholder="Ex: Trabalho, Pessoal, Estudos..."
        />
      </div>
      
      <div class="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
        <button
          @click="closeModal"
          class="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
        >
          Cancelar
        </button>
        <button
          @click="saveNote"
          class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          {{ isEditing ? 'Salvar Alterações' : 'Criar Nota' }}
        </button>
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
  isOpen: boolean
  note?: Note | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [note: Partial<Note>]
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
  
  const noteData: Partial<Note> = {
    ...localNote.value,
    category: localNote.value.category || undefined
  }
  
  if (props.note) {
    noteData.id = props.note.id
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
