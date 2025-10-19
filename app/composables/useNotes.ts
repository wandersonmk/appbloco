export const useNotes = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Buscar todas as notas do usuário
  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar notas:', error)
      return []
    }

    return data || []
  }

  // Criar nova nota
  const createNote = async (note: {
    title: string
    content: string
    category?: string
  }) => {
    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          title: note.title,
          content: note.content,
          category: note.category,
          user_id: user.value?.id,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar nota:', error)
      throw error
    }

    return data
  }

  // Atualizar nota
  const updateNote = async (
    id: string,
    note: {
      title?: string
      content?: string
      category?: string
    }
  ) => {
    const { data, error } = await supabase
      .from('notes')
      .update({
        ...note,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar nota:', error)
      throw error
    }

    return data
  }

  // Deletar nota
  const deleteNote = async (id: string) => {
    const { error } = await supabase.from('notes').delete().eq('id', id)

    if (error) {
      console.error('Erro ao deletar nota:', error)
      throw error
    }
  }

  return {
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  }
}
