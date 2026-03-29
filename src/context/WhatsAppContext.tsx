import { type PropsWithChildren, createContext, useContext, useMemo, useState } from 'react'
import { whatsappMessages } from '../utils/whatsapp'

type WhatsAppContextValue = {
  message: string
  setMessage: (message: string) => void
  resetMessage: () => void
}

const defaultMessage = whatsappMessages.general

const WhatsAppContext = createContext<WhatsAppContextValue | null>(null)

export function WhatsAppProvider({ children }: PropsWithChildren) {
  const [message, setMessage] = useState(defaultMessage)

  const resetMessage = () => {
    setMessage(defaultMessage)
  }

  const value = useMemo<WhatsAppContextValue>(
    () => ({
      message,
      setMessage,
      resetMessage,
    }),
    [message],
  )

  return <WhatsAppContext.Provider value={value}>{children}</WhatsAppContext.Provider>
}

export function useWhatsAppContext() {
  const context = useContext(WhatsAppContext)

  if (!context) {
    throw new Error('useWhatsAppContext must be used within WhatsAppProvider')
  }

  return context
}
