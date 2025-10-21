import type { Note, NoteFormData } from '~/types/note'

export const useSupabaseNotes = () => {
  const supabase = useSupabaseClient()
  const notes = ref<Note[]>([])
  const loading = ref(false)

  // Buscar todas as notas
  const fetchNotes = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Erro ao buscar notas:', error)
        return
      }
      
      // Converte null para undefined na categoria
      notes.value = (data || []).map(note => ({
        ...note,
        category: note.category || undefined
      }))
    } catch (error) {
      console.error('Erro ao buscar notas:', error)
    } finally {
      loading.value = false
    }
  }

  // Criar uma nova nota
  const createNote = async (noteData: NoteFormData): Promise<Note | null> => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          title: noteData.title,
          content: noteData.content,
          category: noteData.category
        }])
        .select()
        .single()
      
      if (error) {
        console.error('Erro ao criar nota:', error)
        return null
      }
      
      // Adicionar a nova nota ao início da lista
      const newNote: Note = {
        ...data,
        category: data.category || undefined
      }
      notes.value.unshift(newNote)
      return newNote
    } catch (error) {
      console.error('Erro ao criar nota:', error)
      return null
    }
  }

  // Atualizar uma nota
  const updateNote = async (id: string, noteData: NoteFormData): Promise<Note | null> => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({
          title: noteData.title,
          content: noteData.content,
          category: noteData.category,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Erro ao atualizar nota:', error)
        return null
      }
      
      // Atualizar a nota na lista
      const updatedNote: Note = {
        ...data,
        category: data.category || undefined
      }
      const index = notes.value.findIndex(note => note.id === id)
      if (index !== -1) {
        notes.value[index] = updatedNote
      }
      
      return updatedNote
    } catch (error) {
      console.error('Erro ao atualizar nota:', error)
      return null
    }
  }

  // Deletar uma nota
  const deleteNote = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Erro ao deletar nota:', error)
        return false
      }
      
      // Remover a nota da lista
      notes.value = notes.value.filter(note => note.id !== id)
      return true
    } catch (error) {
      console.error('Erro ao deletar nota:', error)
      return false
    }
  }

  return {
    notes: readonly(notes),
    loading: readonly(loading),
    fetchNotes,
    createNote,
    updateNote,
    deleteNote
  }
}