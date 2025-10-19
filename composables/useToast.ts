import { useToast as useToastification } from 'vue-toastification'

export const useToast = () => {
  const toast = useToastification()

  return {
    success: (message: string) => {
      toast.success(message)
    },
    error: (message: string) => {
      toast.error(message)
    },
    warning: (message: string) => {
      toast.warning(message)
    },
    info: (message: string) => {
      toast.info(message)
    },
    default: (message: string) => {
      toast(message)
    }
  }
}
