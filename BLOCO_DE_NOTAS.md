# 📝 Bloco de Notas - Nuxt 4

Um aplicativo de bloco de notas moderno, limpo e intuitivo construído com Nuxt 4, Vue 3 e Tailwind CSS.

## ✨ Funcionalidades

- ✅ **Criar Notas**: Adicione novas notas com título, conteúdo e categoria
- ✏️ **Editar Notas**: Edite notas existentes facilmente
- 🗑️ **Excluir Notas**: Remova notas com confirmação
- 🔍 **Buscar Notas**: Busque notas por título ou conteúdo
- 🏷️ **Categorias**: Organize suas notas por categorias
- 🎨 **Interface Moderna**: Design limpo e responsivo
- 🔔 **Notificações**: Feedback visual com toast notifications
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile

## 🏗️ Arquitetura de Componentes

### Componentes Principais

- **`NoteCard.vue`**: Exibe uma nota individual com ações de editar/excluir
- **`NoteModal.vue`**: Modal para criar/editar notas
- **`NoteSearch.vue`**: Barra de busca e filtro por categoria
- **`AppButton.vue`**: Componente de botão reutilizável
- **`AppInput.vue`**: Componente de input reutilizável com máscara

### Páginas

- **`pages/index.vue`**: Página principal do bloco de notas

### Composables

- **`useToast.ts`**: Gerenciamento de notificações toast

### Tipos

- **`types/note.ts`**: Definições de tipos TypeScript

## 🚀 Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra o navegador em `http://localhost:3000`

## 🎨 Stack Tecnológica

- **Nuxt 4**: Framework Vue.js
- **Vue 3**: Framework JavaScript reativo
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Framework CSS utilitário
- **Vue Toastification**: Notificações toast

## 📦 Estrutura de Pastas

```
nuxt-app/
├── components/           # Componentes Vue reutilizáveis
│   ├── NoteCard.vue
│   ├── NoteModal.vue
│   ├── NoteSearch.vue
│   ├── AppButton.vue
│   └── AppInput.vue
├── pages/               # Páginas da aplicação
│   └── index.vue
├── composables/         # Composables Vue
│   └── useToast.ts
├── plugins/            # Plugins Nuxt
│   └── toast.client.ts
├── types/              # Definições TypeScript
│   └── note.ts
└── nuxt.config.ts      # Configuração Nuxt
```

## 💡 Próximas Funcionalidades (Sugestões)

- 💾 Persistência de dados (LocalStorage ou Backend)
- 🎨 Temas personalizados
- 📎 Anexos de arquivos
- 🔐 Autenticação de usuários
- ☁️ Sincronização na nuvem
- 📊 Estatísticas de uso
- 🔔 Lembretes e notificações
- 📤 Exportar/Importar notas

## 📄 Licença

Este projeto foi criado para fins educacionais.
