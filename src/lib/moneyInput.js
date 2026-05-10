/** Faqat raqamlar (yozish, paste) */
export function stripToDigits(s) {
  return String(s ?? '').replace(/\D/g, '')
}

/**
 * Raqamlar qatorini minglik bilan chiqarish (masalan: 51 000 yoki 51,000).
 * @param {string} digitStr — faqat raqamlar
 * @param {string} locale — Intl grouping
 */
export function formatGroupedFromDigits(digitStr, locale = 'uz-UZ') {
  if (!digitStr) return ''
  const n = parseInt(digitStr, 10)
  if (!Number.isFinite(n)) return ''
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(n)
}

/** Valyuta ko‘rinishiga mos grouping locale */
export function inputLocaleForCurrency(currency) {
  if (currency === 'USD') return 'en-US'
  if (currency === 'RUB') return 'ru-RU'
  return 'uz-UZ'
}

/** Qisqa yozuv: qaysi valyutada kiritayotganingiz (faqat ko‘rsatish) */
export function inputCurrencyHint(currency) {
  if (currency === 'USD') return 'AQSH dollari ko‘rinishida ajratgichlar'
  if (currency === 'RUB') return 'Rubl ko‘rinishida ajratgichlar'
  return 'So‘m (mingliklar bilan)'
}
