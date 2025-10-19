<template>
  <button
    :type="type"
    :disabled="disabled"
    class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    @click="handleClick"
  >
    <slot>Button</slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>
