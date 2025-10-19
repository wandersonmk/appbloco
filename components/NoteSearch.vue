<template>
  <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
    <div class="flex items-center gap-3">
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar notas..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          @input="handleSearch"
        />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>
      
      <select
        v-model="selectedCategory"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        @change="handleFilter"
      >
        <option value="">Todas as categorias</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  categories: string[]
}

defineProps<Props>()

const emit = defineEmits<{
  search: [query: string]
  filter: [category: string]
}>()

const searchQuery = ref('')
const selectedCategory = ref('')

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const handleFilter = () => {
  emit('filter', selectedCategory.value)
}
</script>
