<template>
  <div class="w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
      Formulário de Exemplo
    </h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <AppInput
        v-model="formData.name"
        label="Nome"
        placeholder="Digite seu nome"
        required
      />
      
      <AppInput
        v-model="formData.email"
        type="email"
        label="E-mail"
        placeholder="seu@email.com"
        required
      />
      
      <AppInput
        v-model="formData.phone"
        type="tel"
        label="Telefone"
        placeholder="(00) 00000-0000"
        mask="phone"
      />
      
      <div class="flex gap-3 pt-4">
        <AppButton type="submit" @click="handleSubmit">
          Enviar
        </AppButton>
        
        <AppButton @click="handleReset">
          Limpar
        </AppButton>
      </div>
    </form>
    
    <div v-if="submitted" class="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
      <p class="font-semibold">✅ Formulário enviado com sucesso!</p>
      <pre class="mt-2 text-sm">{{ formData }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()

const formData = ref({
  name: '',
  email: '',
  phone: ''
})

const submitted = ref(false)

const handleSubmit = () => {
  // Validação básica
  if (!formData.value.name || !formData.value.email) {
    toast.error('Por favor, preencha todos os campos obrigatórios!')
    return
  }

  console.log('Formulário enviado:', formData.value)
  submitted.value = true
  
  // Mostra notificação de sucesso
  toast.success('✅ Formulário enviado com sucesso!')
  
  setTimeout(() => {
    submitted.value = false
  }, 3000)
}

const handleReset = () => {
  formData.value = {
    name: '',
    email: '',
    phone: ''
  }
  submitted.value = false
  
  // Mostra notificação de info
  toast.info('Formulário limpo!')
}
</script>
