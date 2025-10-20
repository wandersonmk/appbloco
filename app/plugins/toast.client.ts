export default defineNuxtPlugin(async (nuxtApp) => {
  // Importação dinâmica apenas no cliente para evitar problemas de SSR
  if (process.client) {
    const Toast = await import('vue-toastification')
    await import('vue-toastification/dist/index.css')
    
    const options = {
      position: 'top-right',
      timeout: 3000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: 'button',
      icon: true,
      rtl: false,
      transition: 'Vue-Toastification__bounce',
      maxToasts: 5,
      newestOnTop: true
    }

    nuxtApp.vueApp.use(Toast.default, options)
  }
})
