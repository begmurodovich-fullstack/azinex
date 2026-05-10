/** Qisqa oy nomlari (diagramma o‘qi) */
export const OY_QISQA = [
  'Yan',
  'Fev',
  'Mar',
  'Apr',
  'May',
  'Iyun',
  'Iyul',
  'Avg',
  'Sen',
  'Okt',
  'Noy',
  'Dek',
]

/** "YYYY-MM" → diagramma uchun yozuv */
export function oyYorliginiBer(ym) {
  const [y, m] = ym.split('-').map(Number)
  if (!y || !m || m < 1 || m > 12) return ym
  return `${OY_QISQA[m - 1]} ${String(y).slice(-2)}`
}
