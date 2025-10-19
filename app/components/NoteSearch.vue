<template>
  <div class="bg-white rounded-xl shadow-md p-4 md:p-5 border border-gray-100">
    <div class="flex flex-col md:flex-row gap-3 md:gap-4">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar notas por título ou conteúdo..."
          class="w-full pl-11 pr-4 py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          @input="handleSearch"
        />
      </div>
      
      <div class="relative md:w-64">
        <select
          v-model="selectedCategory"
          class="w-full px-4 py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white cursor-pointer appearance-none"
          @change="handleFilter"
        >
          <option value="">📁 Todas as categorias</option>
          <option v-for="category in categories" :key="category" :value="category">
            🏷️ {{ category }}
          </option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
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
