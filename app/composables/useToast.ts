export const useToast = () => {
  // Usar importação dinâmica para evitar problemas de SSR
  const showToast = async (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    if (process.client) {
      const { useToast: useToastification } = await import('vue-toastification')
      const toast = useToastification()
      
      switch (type) {
        case 'success':
          toast.success(message)
          break
        case 'error':
          toast.error(message)
          break
        case 'warning':
          toast.warning(message)
          break
        case 'info':
          toast.info(message)
          break
      }
    }
  }

  return {
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    warning: (message: string) => showToast(message, 'warning'),
    info: (message: string) => showToast(message, 'info'),
    default: (message: string) => showToast(message, 'info')
  }
}
