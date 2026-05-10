export function formatUZS(n) {
  return new Intl.NumberFormat('uz-UZ').format(Math.round(n))
}

export function formatDateShort(isoDate) {
  const d = new Date(isoDate + 'T12:00:00')
  return d.toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
