<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :maxlength="mask === 'phone' ? 15 : undefined"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  mask?: 'phone' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  disabled: false,
  required: false,
  mask: 'none'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const applyPhoneMask = (value: string): string => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '')
  
  // Aplica a máscara baseado na quantidade de números
  if (numbers.length <= 10) {
    // Telefone fixo: (00) 0000-0000
    return numbers
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  } else {
    // Celular: (00) 00000-0000
    return numbers
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value
  
  // Aplica a máscara se for tipo phone
  if (props.mask === 'phone') {
    value = applyPhoneMask(value)
    target.value = value
  }
  
  emit('update:modelValue', value)
}
</script>
