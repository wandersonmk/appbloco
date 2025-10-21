<template>
  <div class="formatted-textarea">
    <!-- Toolbar -->
    <div class="toolbar bg-gray-50 border border-gray-300 rounded-t-lg p-2 flex flex-wrap gap-1">
      <!-- Bold -->
      <button
        @click="toggleFormat('bold')"
        type="button"
        class="toolbar-btn p-2 rounded hover:bg-gray-200 transition-colors font-bold text-gray-800"
        :class="{ 'bg-blue-200': isFormatActive('bold') }"
        title="Negrito (Ctrl+B)"
      >
        <span class="text-lg">B</span>
      </button>

      <!-- Italic -->
      <button
        @click="toggleFormat('italic')"
        type="button"
        class="toolbar-btn p-2 rounded hover:bg-gray-200 transition-colors font-bold italic text-gray-800"
        :class="{ 'bg-blue-200': isFormatActive('italic') }"
        title="Itálico (Ctrl+I)"
      >
        <span class="text-lg">I</span>
      </button>

      <!-- Underline -->
      <button
        @click="toggleFormat('underline')"
        type="button"
        class="toolbar-btn p-2 rounded hover:bg-gray-200 transition-colors font-bold underline text-gray-800"
        :class="{ 'bg-blue-200': isFormatActive('underline') }"
        title="Sublinhado (Ctrl+U)"
      >
        <span class="text-lg">U</span>
      </button>

      <div class="w-px h-6 bg-gray-300 mx-1"></div>

      <!-- Align Left -->
      <button
        @click="setAlignment('left')"
        type="button"
        class="toolbar-btn p-2 rounded hover:bg-gray-200 transition-colors"
        title="Alinhar à esquerda"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4h14v2H3V4zm0 4h10v2H3V8zm0 4h14v2H3v-2zm0 4h10v2H3v-2z"/>
        </svg>
      </button>

      <!-- Align Center -->
      <button
        @click="setAlignment('center')"
        type="button"
        class="toolbar-btn p-2 rounded hover:bg-gray-200 transition-colors"
        title="Centralizar"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4h14v2H3V4zm3 4h8v2H6V8zm-3 4h14v2H3v-2zm3 4h8v2H6v-2z"/>
        </svg>
      </button>

      <!-- Align Right -->
      <button
        @click="setAlignment('right')"
        type="button"
        class="toolbar-btn p-2 rounded hover:bg-gray-200 transition-colors"
        title="Alinhar à direita"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4h14v2H3V4zm4 4h10v2H7V8zm-4 4h14v2H3v-2zm4 4h10v2H7v-2z"/>
        </svg>
      </button>
    </div>

    <!-- Editor WYSIWYG -->
    <div
      ref="editorRef"
      contenteditable="true"
      @input="handleInput"
      @keydown="handleKeydown"
      :data-placeholder="placeholder"
      class="wysiwyg-editor w-full min-h-[200px] px-4 py-3 text-base border-2 border-t-0 border-gray-200 rounded-b-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 overflow-y-auto"
      :style="{ height: `${rows * 24}px` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Digite seu texto...',
  rows: 8
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref<HTMLDivElement | null>(null)

// Carrega o conteúdo inicial quando o componente é montado
onMounted(() => {
  if (editorRef.value && props.modelValue) {
    const html = convertMarkdownToHtml(props.modelValue)
    editorRef.value.innerHTML = html
  }
})

// Atualiza quando o modelValue muda externamente
watch(() => props.modelValue, (newValue) => {
  if (editorRef.value && newValue !== getMarkdownFromHtml()) {
    const html = convertMarkdownToHtml(newValue)
    editorRef.value.innerHTML = html
  }
})

// Converte markdown para HTML
const convertMarkdownToHtml = (markdown: string): string => {
  let html = markdown
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/_(.*?)_/g, '<em>$1</em>')
  html = html.replace(/~~(.*?)~~/g, '<u>$1</u>') // Mudei de __ para ~~ para sublinhado
  html = html.replace(/\[center\](.*?)\[\/center\]/g, '<div style="text-align: center;">$1</div>')
  html = html.replace(/\[left\](.*?)\[\/left\]/g, '<div style="text-align: left;">$1</div>')
  html = html.replace(/\[right\](.*?)\[\/right\]/g, '<div style="text-align: right;">$1</div>')
  html = html.replace(/\n/g, '<br>')
  return html
}

// Converte HTML de volta para markdown
const getMarkdownFromHtml = (): string => {
  if (!editorRef.value) return ''
  
  let html = editorRef.value.innerHTML
  
  // Converte tags HTML para markdown
  html = html.replace(/<strong>(.*?)<\/strong>/g, '**$1**')
  html = html.replace(/<b>(.*?)<\/b>/g, '**$1**')
  html = html.replace(/<em>(.*?)<\/em>/g, '_$1_')
  html = html.replace(/<i>(.*?)<\/i>/g, '_$1_')
  html = html.replace(/<u>(.*?)<\/u>/g, '~~$1~~')
  
  // Alinhamentos
  html = html.replace(/<div style="text-align:\s*center;">(.*?)<\/div>/g, '[center]$1[/center]')
  html = html.replace(/<div style="text-align:\s*left;">(.*?)<\/div>/g, '[left]$1[/left]')
  html = html.replace(/<div style="text-align:\s*right;">(.*?)<\/div>/g, '[right]$1[/right]')
  
  // Quebras de linha
  html = html.replace(/<br\s*\/?>/gi, '\n')
  html = html.replace(/<div>(.*?)<\/div>/g, '\n$1')
  html = html.replace(/<\/div>/g, '\n')
  
  // Remove &nbsp; e outros caracteres especiais
  html = html.replace(/&nbsp;/g, ' ')
  html = html.replace(/&amp;/g, '&')
  html = html.replace(/&lt;/g, '<')
  html = html.replace(/&gt;/g, '>')
  
  // Remove qualquer tag HTML restante
  html = html.replace(/<[^>]*>/g, '')
  
  // Limpa linhas vazias múltiplas
  html = html.replace(/\n{3,}/g, '\n\n')
  
  return html.trim()
}

const handleInput = (event: Event) => {
  const markdown = getMarkdownFromHtml()
  emit('update:modelValue', markdown)
}

const handleKeydown = (event: KeyboardEvent) => {
  // Atalhos de teclado
  if (event.ctrlKey || event.metaKey) {
    if (event.key === 'b') {
      event.preventDefault()
      toggleFormat('bold')
    } else if (event.key === 'i') {
      event.preventDefault()
      toggleFormat('italic')
    } else if (event.key === 'u') {
      event.preventDefault()
      toggleFormat('underline')
    }
  }
}

const toggleFormat = (format: string) => {
  document.execCommand(format, false)
  editorRef.value?.focus()
}

const isFormatActive = (format: string): boolean => {
  return document.queryCommandState(format)
}

const setAlignment = (align: string) => {
  const alignment = align === 'left' ? 'justifyLeft' : align === 'center' ? 'justifyCenter' : 'justifyRight'
  document.execCommand(alignment, false)
  editorRef.value?.focus()
}
</script>

<style scoped>
.wysiwyg-editor {
  background: white;
}

.wysiwyg-editor:empty:before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}

.wysiwyg-editor:focus {
  outline: none;
}

.toolbar-btn:hover {
  background-color: #e5e7eb;
}

.toolbar-btn:active {
  background-color: #d1d5db;
}
</style>
