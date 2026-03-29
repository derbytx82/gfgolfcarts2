export function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return 'Call for price'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPhone(value: string | null | undefined) {
  if (!value) {
    return 'Not available'
  }

  return value
}
