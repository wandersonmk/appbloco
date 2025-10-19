export interface Note {
  id: string
  title: string
  content: string
  category?: string
  created_at: string
  updated_at: string
}

export interface NoteFormData {
  title: string
  content: string
  category?: string
}
