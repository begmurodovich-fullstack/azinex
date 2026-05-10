import { formatGroupedFromDigits } from '../lib/moneyInput'

/**
 * Minglik ajratgichlar bilan summa yozish maydoni (qiymat ichki formatda faqat raqamlar qatori).
 * @param {object} props
 * @param {string} props.digits — faqat raqamlar (masalan "51000")
 * @param {(next: string) => void} props.onDigitsChange
 * @param {string} props.locale — Intl locale (uz-UZ, en-US, …)
 * @param {string} [props.className]
 * @param {string} [props.id]
 * @param {string} [props.placeholder]
 * @param {number} [props.maxDigits]
 */
export function MoneyDigitsField({
  digits,
  onDigitsChange,
  locale,
  className = '',
  id,
  placeholder,
  maxDigits = 15,
  onBlur,
  onFocus,
  onKeyDown,
}) {
  const display = formatGroupedFromDigits(digits, locale)

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      spellCheck={false}
      placeholder={placeholder}
      value={display}
      onChange={(e) => {
        const next = e.target.value.replace(/\D/g, '').slice(0, maxDigits)
        onDigitsChange(next)
      }}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      className={className}
    />
  )
}
