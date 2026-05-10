import { useCallback, useEffect, useMemo, useState } from 'react'
import { ExpenseContext } from './expenseContext'
import { useAuth } from './useAuth'

export function ExpenseProvider({ children }) {
  const { authFetch, isAuthenticated } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [totalBalance, setTotalBalanceState] = useState(0)

  // Fetch initial data
  useEffect(() => {
    if (!isAuthenticated) return;
    let mounted = true;
    authFetch("/user-data")
      .then(res => res.json())
      .then(data => {
        if (mounted && data.ok) {
          setExpenses(data.expenses || []);
          setTotalBalanceState(data.balance || 0);
        }
      })
      .catch(console.error);
    
    return () => { mounted = false; };
  }, [authFetch, isAuthenticated]);

  const setTotalBalance = useCallback((value) => {
    let n
    if (typeof value === 'string') {
      const d = value.replace(/\D/g, '')
      n = d === '' ? 0 : parseInt(d, 10)
    } else {
      n = Number(value)
    }
    if (!Number.isFinite(n) || n < 0) return
    const amount = Math.round(n);
    setTotalBalanceState(amount)
    
    // Sync with backend
    authFetch("/user-data/balance", {
      method: "POST",
      body: JSON.stringify({ amount })
    }).catch(console.error);
  }, [authFetch])

  const addToBalance = useCallback((value) => {
    let n
    if (typeof value === 'string') {
      const d = value.replace(/\D/g, '')
      n = d === '' ? 0 : parseInt(d, 10)
    } else {
      n = Number(value)
    }
    if (!Number.isFinite(n) || n <= 0) return
    const amountToAdd = Math.round(n);
    
    setTotalBalanceState((prev) => {
      const newBalance = prev + amountToAdd;
      authFetch("/user-data/balance", {
        method: "POST",
        body: JSON.stringify({ amount: newBalance })
      }).catch(console.error);
      return newBalance;
    });
  }, [authFetch])

  const addExpense = useCallback((payload) => {
    // Optimistic local update not strictly needed, but makes UI feel fast.
    // However, the backend generates ID. So it's better to wait for backend,
    // or just let backend create and then append.
    authFetch("/user-data/expenses", {
      method: "POST",
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.expense) {
          setExpenses(prev => [data.expense, ...prev]);
        }
      })
      .catch(console.error);
  }, [authFetch])

  const deleteExpense = useCallback((id) => {
    setExpenses(prev => prev.filter(e => e.id !== id)); // Optimistic
    authFetch(`/user-data/expenses/${id}`, {
      method: "DELETE"
    }).catch(console.error);
  }, [authFetch])

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
      addExpense,
      deleteExpense,
    }),
    [expenses, totalBalance, setTotalBalance, addToBalance, totalExpensesAmount, addExpense, deleteExpense],
  )

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  )
}
