<template>
  <div class="rich-text-editor">
    <!-- Toolbar -->
    <div v-if="editor" class="toolbar bg-gray-50 border border-gray-300 rounded-t-lg p-2 flex flex-wrap gap-1">
      <!-- Bold -->
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        class="toolbar-btn"
        type="button"
        title="Negrito (Ctrl+B)"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 4v12h4.5c1.38 0 2.5-.62 2.5-2 0-.87-.5-1.5-1.25-1.75.75-.25 1.25-.88 1.25-1.75 0-1.38-1.12-2-2.5-2H6zm2 2h2c.55 0 1 .45 1 1s-.45 1-1 1H8V6zm0 4h2.5c.83 0 1.5.67 1.5 1.5S11.33 13 10.5 13H8v-3z"/>
        </svg>
      </button>

      <!-- Italic -->
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        class="toolbar-btn"
        type="button"
        title="Itálico (Ctrl+I)"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 4v2h1.5l-3 8H7v2h6v-2h-1.5l3-8H16V4h-6z"/>
        </svg>
      </button>

      <!-- Underline -->
      <button
        @click="editor.chain().focus().toggleUnderline().run()"
        :class="{ 'is-active': editor.isActive('underline') }"
        class="toolbar-btn"
        type="button"
        title="Sublinhado (Ctrl+U)"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 3v7c0 2.21 1.79 4 4 4s4-1.79 4-4V3h-2v7c0 1.1-.9 2-2 2s-2-.9-2-2V3H6zm-2 14h12v2H4v-2z"/>
        </svg>
      </button>

      <div class="w-px h-6 bg-gray-300 mx-1"></div>

      <!-- Align Left -->
      <button
        @click="editor.chain().focus().setTextAlign('left').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
        class="toolbar-btn"
        type="button"
        title="Alinhar à esquerda"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4h14v2H3V4zm0 4h10v2H3V8zm0 4h14v2H3v-2zm0 4h10v2H3v-2z"/>
        </svg>
      </button>

      <!-- Align Center -->
      <button
        @click="editor.chain().focus().setTextAlign('center').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
        class="toolbar-btn"
        type="button"
        title="Centralizar"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4h14v2H3V4zm3 4h8v2H6V8zm-3 4h14v2H3v-2zm3 4h8v2H6v-2z"/>
        </svg>
      </button>

      <!-- Align Right -->
      <button
        @click="editor.chain().focus().setTextAlign('right').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
        class="toolbar-btn"
        type="button"
        title="Alinhar à direita"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4h14v2H3V4zm4 4h10v2H7V8zm-4 4h14v2H3v-2zm4 4h10v2H7v-2z"/>
        </svg>
      </button>

      <!-- Align Justify -->
      <button
        @click="editor.chain().focus().setTextAlign('justify').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
        class="toolbar-btn"
        type="button"
        title="Justificar"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4h14v2H3V4zm0 4h14v2H3V8zm0 4h14v2H3v-2zm0 4h14v2H3v-2z"/>
        </svg>
      </button>

      <div class="w-px h-6 bg-gray-300 mx-1"></div>

      <!-- Bullet List -->
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        class="toolbar-btn"
        type="button"
        title="Lista com marcadores"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4h2v2H4V4zm4 1h9v1H8V5zM4 9h2v2H4V9zm4 1h9v1H8v-1zm-4 4h2v2H4v-2zm4 1h9v1H8v-1z"/>
        </svg>
      </button>

      <!-- Ordered List -->
      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        class="toolbar-btn"
        type="button"
        title="Lista numerada"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 4h1v4H5V4zm1 5H5v1h1v1H5v1h2V9H6V9zm-1 5h1v1H5v1h2v-3H5v1zM8 5h9v1H8V5zm0 5h9v1H8v-1zm0 5h9v1H8v-1z"/>
        </svg>
      </button>

      <div class="w-px h-6 bg-gray-300 mx-1"></div>

      <!-- Clear Format -->
      <button
        @click="editor.chain().focus().clearNodes().unsetAllMarks().run()"
        class="toolbar-btn"
        type="button"
        title="Limpar formatação"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
        </svg>
      </button>
    </div>

    <!-- Editor Content -->
    <editor-content 
      :editor="editor" 
      class="editor-content border border-t-0 border-gray-300 rounded-b-lg p-4 min-h-[200px] bg-white focus-within:border-blue-500 transition-colors"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'

interface Props {
  modelValue: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Escreva sua nota aqui...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
  ],
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
    },
  },
})

watch(() => props.modelValue, (value) => {
  const isSame = editor.value?.getHTML() === value
  if (!isSame && editor.value) {
    editor.value.commands.setContent(value, false)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.toolbar-btn {
  @apply p-2 rounded hover:bg-gray-200 transition-colors duration-150;
}

.toolbar-btn.is-active {
  @apply bg-blue-100 text-blue-600;
}

:deep(.ProseMirror) {
  min-height: 200px;
  outline: none;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

:deep(.ProseMirror ul) {
  list-style-type: disc;
}

:deep(.ProseMirror ol) {
  list-style-type: decimal;
}

:deep(.ProseMirror li) {
  margin: 0.25rem 0;
}

:deep(.ProseMirror strong) {
  font-weight: bold;
}

:deep(.ProseMirror em) {
  font-style: italic;
}

:deep(.ProseMirror u) {
  text-decoration: underline;
}

:deep(.ProseMirror [style*="text-align: left"]) {
  text-align: left;
}

:deep(.ProseMirror [style*="text-align: center"]) {
  text-align: center;
}

:deep(.ProseMirror [style*="text-align: right"]) {
  text-align: right;
}

:deep(.ProseMirror [style*="text-align: justify"]) {
  text-align: justify;
}
</style>
