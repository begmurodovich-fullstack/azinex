import { useCallback, useMemo, useState } from 'react'
import {
  formatMoneyCompactFromUzs,
  formatMoneyFromUzs,
} from '../lib/currency'
import { CurrencyContext } from './currencyContext'

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(
    /** @type {'UZS'|'USD'|'RUB'} */ ('UZS'),
  )

  const formatMoney = useCallback(
    (uzs) => formatMoneyFromUzs(uzs, currency),
    [currency],
  )

  const formatCompact = useCallback(
    (uzs) => formatMoneyCompactFromUzs(uzs, currency),
    [currency],
  )

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      formatMoney,
      formatCompact,
    }),
    [currency, formatMoney, formatCompact],
  )

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}
