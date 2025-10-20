// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    scanPageMeta: true,
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    redirect: false,
  },
  nitro: {
    preset: 'vercel',
    minify: true,
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'tiptap-core': ['@tiptap/vue-3', '@tiptap/starter-kit'],
            'tiptap-extensions': [
              '@tiptap/extension-underline',
              '@tiptap/extension-text-align',
              '@tiptap/extension-placeholder'
            ],
          },
        },
      },
    },
  },
})