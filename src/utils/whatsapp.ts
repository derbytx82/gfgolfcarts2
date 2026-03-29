function sanitizeNumber(number: string) {
  return number.replace(/[^\d]/g, '')
}

export function buildWhatsAppUrl(number: string, message: string) {
  const sanitized = sanitizeNumber(number)
  const encoded = encodeURIComponent(message)

  return `https://wa.me/${sanitized}?text=${encoded}`
}

export const whatsappMessages = {
  general: 'Hola, quiero información sobre sus golf carts.',
  quote: 'Hola, quiero cotizar un golf cart personalizado.',
  product: (productName: string) => `Hola, me interesa este modelo: ${productName}.`,
}
