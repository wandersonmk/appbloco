<template>
  <div class="formatted-textarea">
    <!-- Toolbar -->
    <div class="toolbar bg-gray-50 border border-gray-300 rounded-t-lg p-2 flex flex-wrap gap-1">
      <!-- Bold -->
      <button
        @click="wrapSelection('**', '**')"
        type="button"
        class="toolbar-btn p-2 rounded hover:bg-gray-200 transition-colors font-bold text-gray-800"
        title="Negrito"
      >
        <span class="text-lg">B</span>
      </button>

      <!-- Italic -->
      <button
        @click="wrapSelection('_', '_')"
        type="button"
        class="toolbar-btn p-2 rounded hover:bg-gray-200 transition-colors font-bold italic text-gray-800"
        title="Itálico"
      >
        <span class="text-lg">I</span>
      </button>

      <!-- Underline -->
      <button
        @click="wrapSelection('__', '__')"
        type="button"
        class="toolbar-btn p-2 rounded hover:bg-gray-200 transition-colors font-bold underline text-gray-800"
        title="Sublinhado"
      >
        <span class="text-lg">U</span>
      </button>

      <div class="w-px h-6 bg-gray-300 mx-1"></div>

      <!-- Align Left -->
      <button
        @click="alignText('left')"
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
        @click="alignText('center')"
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
        @click="alignText('right')"
        type="button"
        class="toolbar-btn p-2 rounded hover:bg-gray-200 transition-colors"
        title="Alinhar à direita"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4h14v2H3V4zm4 4h10v2H7V8zm-4 4h14v2H3v-2zm4 4h10v2H7v-2z"/>
        </svg>
      </button>
    </div>

    <!-- Textarea e Preview -->
    <div class="relative">      
      <!-- Textarea -->
      <textarea
        ref="textareaRef"
        :value="modelValue"
        @input="handleInput"
        :placeholder="placeholder"
        :rows="rows"
        class="w-full px-4 py-3 text-base border-2 border-t-0 border-gray-200 rounded-b-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
      ></textarea>
      
      <!-- Preview ao vivo (pequeno) -->
      <div v-if="modelValue" class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-xs font-semibold text-blue-700 mb-1">📝 Preview:</p>
        <div v-html="livePreview" class="text-sm text-gray-800"></div>
      </div>
    </div>

    <!-- Preview -->
    <div v-if="showPreview" class="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <p class="text-sm font-semibold text-gray-700 mb-2">Preview:</p>
      <div v-html="formattedContent" class="prose prose-sm max-w-none"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  rows?: number
  showPreview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Digite seu texto...',
  rows: 10,
  showPreview: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const wrapSelection = (before: string, after: string) => {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  const selectedText = text.substring(start, end)

  if (selectedText) {
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
    emit('update:modelValue', newText)
    
    // Restaura o foco e a seleção
    nextTick(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    })
  }
}

const alignText = (alignment: string) => {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  
  // Encontra o início da linha atual
  let lineStart = start
  while (lineStart > 0 && text[lineStart - 1] !== '\n') {
    lineStart--
  }
  
  // Encontra o fim da linha atual
  let lineEnd = end
  while (lineEnd < text.length && text[lineEnd] !== '\n') {
    lineEnd++
  }
  
  const lineText = text.substring(lineStart, lineEnd)
  const tag = `[${alignment}]`
  const closeTag = `[/${alignment}]`
  
  // Remove tags de alinhamento existentes
  const cleanLine = lineText.replace(/\[(left|center|right)\]/g, '').replace(/\[\/(left|center|right)\]/g, '')
  
  const newLine = tag + cleanLine + closeTag
  const newText = text.substring(0, lineStart) + newLine + text.substring(lineEnd)
  
  emit('update:modelValue', newText)
  
  nextTick(() => {
    textarea.focus()
  })
}

const formattedContent = computed(() => {
  let html = props.modelValue || ''
  
  // Converte marcação para HTML
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negrito
  html = html.replace(/_(.*?)_/g, '<em>$1</em>') // Itálico
  html = html.replace(/__(.*?)__/g, '<u>$1</u>') // Sublinhado
  html = html.replace(/\[left\](.*?)\[\/left\]/g, '<div style="text-align: left;">$1</div>') // Esquerda
  html = html.replace(/\[center\](.*?)\[\/center\]/g, '<div style="text-align: center;">$1</div>') // Centro
  html = html.replace(/\[right\](.*?)\[\/right\]/g, '<div style="text-align: right;">$1</div>') // Direita
  html = html.replace(/\n/g, '<br>') // Quebras de linha
  
  return html
})

// Preview ao vivo enquanto digita
const livePreview = computed(() => {
  let text = props.modelValue || ''
  
  // Aplica formatação HTML completa
  let html = text
  
  // Negrito
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Itálico (evita conflito com underline)
  html = html.replace(/(?<!_)_([^_]+?)_(?!_)/g, '<em>$1</em>')
  
  // Sublinhado
  html = html.replace(/__(.*?)__/g, '<u>$1</u>')
  
  // Centro
  html = html.replace(/\[center\](.*?)\[\/center\]/g, '<div class="text-center">$1</div>')
  
  // Esquerda
  html = html.replace(/\[left\](.*?)\[\/left\]/g, '<div class="text-left">$1</div>')
  
  // Direita
  html = html.replace(/\[right\](.*?)\[\/right\]/g, '<div class="text-right">$1</div>')
  
  // Quebras de linha
  html = html.replace(/\n/g, '<br>')
  
  return html
})
</script>

<style scoped>
.toolbar-btn:hover {
  background-color: #e5e7eb;
}

.toolbar-btn:active {
  background-color: #d1d5db;
}
</style>
