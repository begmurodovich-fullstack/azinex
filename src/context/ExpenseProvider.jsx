import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { ExpenseContext } from './expenseContext'

const STORAGE_EXPENSES = 'azinex-expenses-v1'
const STORAGE_BALANCE = 'azinex-balance-v1'

function readExpenses() {
  try {
    const raw = localStorage.getItem(STORAGE_EXPENSES)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function readBalance() {
  try {
    const raw = localStorage.getItem(STORAGE_BALANCE)
    if (raw == null || raw === '') return 0
    const n = Number(raw)
    return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0
  } catch {
    return 0
  }
}

function expenseReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `exp-${Date.now()}`
      const d = new Date()
      const pad = (n) => String(n).padStart(2, '0')
      return [
        {
          id,
          date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
          time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
          category: action.payload.categoryLabel,
          categoryKey: action.payload.categoryKey,
          amount: action.payload.amount,
        },
        ...state,
      ]
    }
    case 'delete':
      return state.filter((e) => e.id !== action.id)
    default:
      return state
  }
}

export function ExpenseProvider({ children }) {
  const [expenses, dispatch] = useReducer(expenseReducer, undefined, readExpenses)

  const [totalBalance, setTotalBalanceState] = useState(readBalance)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_EXPENSES, JSON.stringify(expenses))
    } catch {
      /* ignore */
    }
  }, [expenses])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BALANCE, String(totalBalance))
    } catch {
      /* ignore */
    }
  }, [totalBalance])

  const setTotalBalance = useCallback((value) => {
    let n
    if (typeof value === 'string') {
      const d = value.replace(/\D/g, '')
      n = d === '' ? 0 : parseInt(d, 10)
    } else {
      n = Number(value)
    }
    if (!Number.isFinite(n) || n < 0) return
    setTotalBalanceState(Math.round(n))
  }, [])

  /** Hamyonga yangi pul qo‘shish (masalan bankdan yoki naqd) — jami fondga qo‘shiladi */
  const addToBalance = useCallback((value) => {
    let n
    if (typeof value === 'string') {
      const d = value.replace(/\D/g, '')
      n = d === '' ? 0 : parseInt(d, 10)
    } else {
      n = Number(value)
    }
    if (!Number.isFinite(n) || n <= 0) return
    setTotalBalanceState((prev) => Math.round(prev + n))
  }, [])

  const totalExpensesAmount = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses],
  )

  const value = useMemo(
    () => ({
      expenses,
      totalBalance,
      setTotalBalance,
      addToBalance,
      totalExpensesAmount,
      addExpense: (payload) => dispatch({ type: 'add', payload }),
      deleteExpense: (id) => dispatch({ type: 'delete', id }),
    }),
    [expenses, totalBalance, setTotalBalance, addToBalance, totalExpensesAmount],
  )

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  )
}
