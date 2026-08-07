import { useToast } from '../context/ToastContext'

export function useNotification() {
  const { toast } = useToast()
  return toast
}

export default useNotification
