<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
    <!-- Header -->
    <header class="bg-white shadow-md sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <span class="text-3xl md:text-4xl">📝</span>
            <div>
              <h1 class="text-xl md:text-2xl font-bold text-gray-800">Bloco de Notas</h1>
              <p class="text-xs md:text-sm text-gray-600">
                <span v-if="loading">Carregando...</span>
                <span v-else>{{ notes.length }} {{ notes.length === 1 ? 'nota' : 'notas' }}</span>
              </p>
            </div>
          </div>
          
          <button
            @click="openCreateModal"
            :disabled="loading"
            class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 px-4 py-2.5 md:px-6 md:py-3 flex items-center space-x-2"
          >
            <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="hidden sm:inline">Nova Nota</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <!-- Search and Filter -->
      <div class="mb-6">
        <NoteSearch
          :categories="categories"
          @search="handleSearch"
          @filter="handleFilter"
        />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Notes Grid -->
      <div v-else-if="filteredNotes.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        <NoteCard
          v-for="note in filteredNotes"
          :key="note.id"
          :note="note"
          @view="openViewModal"
          @edit="openEditModal"
          @delete="confirmDelete"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 md:py-20">
        <div class="text-6xl md:text-7xl mb-4">📭</div>
        <h2 class="text-2xl md:text-3xl font-bold text-gray-700 mb-3">
          {{ searchQuery || filterCategory ? 'Nenhuma nota encontrada' : 'Nenhuma nota ainda' }}
        </h2>
        <p class="text-base md:text-lg text-gray-600 mb-8 max-w-md mx-auto px-4">
          {{ searchQuery || filterCategory ? 'Tente outro termo de busca ou filtro' : 'Comece criando sua primeira nota!' }}
        </p>
        <button
          v-if="!searchQuery && !filterCategory"
          @click="openCreateModal"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4 text-base md:text-lg inline-flex items-center space-x-2"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Criar Primeira Nota</span>
        </button>
      </div>
    </main>

    <!-- Modals -->
    <ClientOnly>
      <!-- Modal de Edição/Criação -->
      <NoteModal
        :is-open="isModalOpen"
        :note="editingNote"
        @close="closeModal"
        @save="saveNote"
      />
      
      <!-- Modal de Visualização -->
      <NoteViewModal
        :is-open="isViewModalOpen"
        :note="viewingNote"
        @close="closeViewModal"
        @edit="openEditFromView"
        @delete="confirmDelete"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { Note, NoteFormData } from '~/types/note'

// Composables
const toast = useToast()
const { notes, loading, fetchNotes, createNote, updateNote, deleteNote } = useSupabaseNotes()

// Estado
const isModalOpen = ref(false)
const editingNote = ref<Note | null>(null)
const isViewModalOpen = ref(false)
const viewingNote = ref<Note | null>(null)
const searchQuery = ref('')
const filterCategory = ref('')

// Categorias únicas
const categories = computed(() => {
  const cats = notes.value
    .map(note => note.category)
    .filter(Boolean) as string[]
  return [...new Set(cats)].sort()
})

// Notas filtradas
const filteredNotes = computed(() => {
  let filtered = notes.value

  // Filtrar por busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    )
  }

  // Filtrar por categoria
  if (filterCategory.value) {
    filtered = filtered.filter(note => note.category === filterCategory.value)
  }

  // Ordenar por data de atualização (mais recente primeiro)
  return filtered.sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )
})

// Funções
const openCreateModal = () => {
  editingNote.value = null
  isModalOpen.value = true
}

const openEditModal = (note: Note) => {
  editingNote.value = note
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingNote.value = null
}

const openViewModal = (note: Note) => {
  viewingNote.value = note
  isViewModalOpen.value = true
}

const closeViewModal = () => {
  isViewModalOpen.value = false
  viewingNote.value = null
}

const openEditFromView = (note: Note) => {
  closeViewModal()
  editingNote.value = note
  isModalOpen.value = true
}

const saveNote = async (noteData: NoteFormData) => {
  try {
    if (editingNote.value) {
      // Editar nota existente
      const result = await updateNote(editingNote.value.id, noteData)
      if (result) {
        toast.success('✅ Nota atualizada com sucesso!')
        closeModal()
      } else {
        toast.error('❌ Erro ao atualizar nota')
      }
    } else {
      // Criar nova nota
      const result = await createNote(noteData)
      if (result) {
        toast.success('✅ Nota criada com sucesso!')
        closeModal()
      } else {
        toast.error('❌ Erro ao criar nota')
      }
    }
  } catch (error) {
    console.error('Erro ao salvar nota:', error)
    toast.error('❌ Erro ao salvar nota')
  }
}

const confirmDelete = async (note: Note) => {
  if (confirm(`Tem certeza que deseja excluir a nota "${note.title}"?`)) {
    try {
      const success = await deleteNote(note.id)
      if (success) {
        toast.info('🗑️ Nota excluída')
      } else {
        toast.error('❌ Erro ao excluir nota')
      }
    } catch (error) {
      console.error('Erro ao deletar nota:', error)
      toast.error('❌ Erro ao excluir nota')
    }
  }
}

const handleSearch = (query: string) => {
  searchQuery.value = query
}

const handleFilter = (category: string) => {
  filterCategory.value = category
}

// Lifecycle
onMounted(() => {
  fetchNotes()
})
</script>
