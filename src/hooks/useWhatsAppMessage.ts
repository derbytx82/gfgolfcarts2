import { useEffect } from 'react'
import { useWhatsAppContext } from '../context/WhatsAppContext'

export function useWhatsAppMessage(message: string, deps: unknown[] = []) {
  const { setMessage } = useWhatsAppContext()

  useEffect(() => {
    setMessage(message)
  }, [message, setMessage, ...deps])
}
