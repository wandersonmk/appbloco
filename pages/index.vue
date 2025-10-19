<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
    <!-- Header -->
    <header class="bg-white shadow-md sticky top-0 z-40">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <span class="text-4xl">📝</span>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Bloco de Notas</h1>
              <p class="text-sm text-gray-600">{{ notes.length }} {{ notes.length === 1 ? 'nota' : 'notas' }}</p>
            </div>
          </div>
          
          <button
            @click="openCreateModal"
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
          >
            <span class="text-xl">+</span>
            <span>Nova Nota</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Search and Filter -->
      <div class="mb-6">
        <NoteSearch
          :categories="categories"
          @search="handleSearch"
          @filter="handleFilter"
        />
      </div>

      <!-- Notes Grid -->
      <div v-if="filteredNotes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NoteCard
          v-for="note in filteredNotes"
          :key="note.id"
          :note="note"
          @edit="openEditModal"
          @delete="confirmDelete"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="text-6xl mb-4">📭</div>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">
          {{ searchQuery || filterCategory ? 'Nenhuma nota encontrada' : 'Nenhuma nota ainda' }}
        </h2>
        <p class="text-gray-600 mb-6">
          {{ searchQuery || filterCategory ? 'Tente outro termo de busca ou filtro' : 'Comece criando sua primeira nota!' }}
        </p>
        <button
          v-if="!searchQuery && !filterCategory"
          @click="openCreateModal"
          class="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          Criar Primeira Nota
        </button>
      </div>
    </main>

    <!-- Modal -->
    <NoteModal
      :is-open="isModalOpen"
      :note="editingNote"
      @close="closeModal"
      @save="saveNote"
    />
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

const toast = useToast()

// Estado
const notes = ref<Note[]>([
  {
    id: '1',
    title: 'Bem-vindo ao Bloco de Notas! 👋',
    content: 'Esta é uma nota de exemplo. Você pode criar, editar e excluir notas. Use as categorias para organizar suas anotações e a busca para encontrá-las rapidamente!',
    category: 'Exemplo',
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
const isModalOpen = ref(false)
const editingNote = ref<Note | null>(null)
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
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
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

const saveNote = (noteData: Partial<Note>) => {
  if (noteData.id) {
    // Editar nota existente
    const index = notes.value.findIndex(n => n.id === noteData.id)
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        ...noteData,
        updatedAt: new Date()
      }
      toast.success('✅ Nota atualizada com sucesso!')
    }
  } else {
    // Criar nova nota
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteData.title || '',
      content: noteData.content || '',
      category: noteData.category,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    notes.value.push(newNote)
    toast.success('✅ Nota criada com sucesso!')
  }
}

const confirmDelete = (note: Note) => {
  if (confirm(`Tem certeza que deseja excluir a nota "${note.title}"?`)) {
    notes.value = notes.value.filter(n => n.id !== note.id)
    toast.info('🗑️ Nota excluída')
  }
}

const handleSearch = (query: string) => {
  searchQuery.value = query
}

const handleFilter = (category: string) => {
  filterCategory.value = category
}
</script>
