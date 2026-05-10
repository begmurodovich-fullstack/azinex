/** Demo kurslar: ichki hisob har doim so‘mda */
export const UZS_PER_UNIT = {
  UZS: 1,
  USD: 12650,
  RUB: 158,
}

export const CURRENCIES = [
  { code: 'UZS', label: "O‘zbek so‘mi" },
  { code: 'USD', label: 'AQSH dollari' },
  { code: 'RUB', label: 'Rossiya rubli' },
]

/**
 * @param {number} uzsAmount
 * @param {'UZS'|'USD'|'RUB'} currency
 */
export function convertFromUzs(uzsAmount, currency) {
  const rate = UZS_PER_UNIT[currency] ?? 1
  return uzsAmount / rate
}

/**
 * @param {number} uzsAmount
 * @param {'UZS'|'USD'|'RUB'} currency
 */
export function formatMoneyFromUzs(uzsAmount, currency) {
  if (currency === 'UZS') {
    const sign = uzsAmount < 0 ? '-' : ''
    const abs = Math.round(Math.abs(uzsAmount))
    return `${sign}${new Intl.NumberFormat('uz-UZ').format(abs)} so‘m`
  }
  const n = convertFromUzs(uzsAmount, currency)
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(n)
}

/**
 * @param {number} uzsAmount
 * @param {'UZS'|'USD'|'RUB'} currency
 */
export function formatMoneyCompactFromUzs(uzsAmount, currency) {
  const n = convertFromUzs(uzsAmount, currency)
  if (currency === 'UZS') {
    const v = Math.abs(n)
    const sign = n < 0 ? '-' : ''
    if (v >= 1_000_000) return `${sign}${(v / 1e6).toFixed(1)} mln`
    if (v >= 1000) return `${sign}${Math.round(v / 1000)} ming`
    return `${sign}${Math.round(v)}`
  }
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n)
}
