<template>
  <div class="w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
      🔔 Demonstração de Notificações
    </h2>
    
    <div class="space-y-3">
      <button @click="showSuccess" class="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200">
        ✅ Notificação de Sucesso
      </button>
      
      <button @click="showError" class="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200">
        ❌ Notificação de Erro
      </button>
      
      <button @click="showWarning" class="w-full px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200">
        ⚠️ Notificação de Aviso
      </button>
      
      <button @click="showInfo" class="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
        ℹ️ Notificação de Info
      </button>
      
      <button @click="showDefault" class="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200">
        📢 Notificação Padrão
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()

const showSuccess = () => {
  toast.success('Operação realizada com sucesso! 🎉')
}

const showError = () => {
  toast.error('Ops! Algo deu errado. Tente novamente.')
}

const showWarning = () => {
  toast.warning('Atenção! Verifique os dados inseridos.')
}

const showInfo = () => {
  toast.info('Esta é uma mensagem informativa.')
}

const showDefault = () => {
  toast.default('Notificação padrão do sistema.')
}
</script>

<style scoped>
button {
  transition: all 0.2s;
}
</style>
