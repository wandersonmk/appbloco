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
  
  // Clona o conteúdo para processar
  let content = editorRef.value.innerHTML
  
  // Remove <br> temporariamente e substitui por marcador
  content = content.replace(/<br\s*\/?>/gi, '|||BR|||')
  
  // Converte tags de formatação (do mais específico para o mais geral)
  content = content.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
  content = content.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
  content = content.replace(/<em[^>]*>(.*?)<\/em>/gi, '_$1_')
  content = content.replace(/<i[^>]*>(.*?)<\/i>/gi, '_$1_')
  content = content.replace(/<u[^>]*>(.*?)<\/u>/gi, '~~$1~~')
  
  // Converte parágrafos e divs de alinhamento
  content = content.replace(/<div[^>]*style="text-align:\s*center;"[^>]*>(.*?)<\/div>/gi, '[center]$1[/center]')
  content = content.replace(/<div[^>]*style="text-align:\s*left;"[^>]*>(.*?)<\/div>/gi, '[left]$1[/left]')
  content = content.replace(/<div[^>]*style="text-align:\s*right;"[^>]*>(.*?)<\/div>/gi, '[right]$1[/right]')
  
  // Remove parágrafos normais (substitui por quebra de linha)
  content = content.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1|||BR|||')
  content = content.replace(/<div[^>]*>(.*?)<\/div>/gi, '$1|||BR|||')
  
  // Remove todas as outras tags HTML
  content = content.replace(/<[^>]*>/g, '')
  
  // Decodifica entidades HTML
  content = content.replace(/&nbsp;/g, ' ')
  content = content.replace(/&amp;/g, '&')
  content = content.replace(/&lt;/g, '<')
  content = content.replace(/&gt;/g, '>')
  content = content.replace(/&quot;/g, '"')
  content = content.replace(/&#39;/g, "'")
  
  // Restaura quebras de linha
  content = content.replace(/\|\|\|BR\|\|\|/g, '\n')
  
  // Limpa espaços extras e múltiplas quebras de linha
  content = content.replace(/\n{3,}/g, '\n\n')
  content = content.trim()
  
  return content
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
