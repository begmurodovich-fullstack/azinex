import { useMemo, useState } from 'react'
import { Banknote } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MoneyDigitsField } from '../components/MoneyDigitsField'
import { useCategories } from '../context/useCategories'
import { useCurrency } from '../context/useCurrency'
import { useExpenses } from '../context/useExpenses'
import {
  formatGroupedFromDigits,
  inputCurrencyHint,
  inputLocaleForCurrency,
} from '../lib/moneyInput'

export function AddExpense() {
  const navigate = useNavigate()
  const { addExpense } = useExpenses()
  const { currency } = useCurrency()
  const locale = inputLocaleForCurrency(currency)
  const { allOptions, addCustomCategory } = useCategories()
  const [amountDigits, setAmountDigits] = useState('')
  const [selected, setSelected] = useState('food')
  const [newCatLabel, setNewCatLabel] = useState('')
  const [catErr, setCatErr] = useState('')

  const selectedKey = useMemo(() => {
    if (allOptions.some((c) => c.key === selected)) return selected
    return allOptions[0]?.key ?? 'food'
  }, [allOptions, selected])

  function handleSubmit(e) {
    e.preventDefault()
    const n =
      amountDigits === '' ? NaN : parseInt(amountDigits, 10)
    if (!Number.isFinite(n) || n <= 0) return
    const cat = allOptions.find((c) => c.key === selectedKey)
    if (!cat) return
    addExpense({
      amount: Math.round(n),
      categoryKey: cat.key,
      categoryLabel: cat.label,
    })
    navigate('/expenses')
  }

  function handleAddCategory(ev) {
    ev.preventDefault()
    setCatErr('')
    const key = addCustomCategory(newCatLabel)
    if (!key) {
      setCatErr('Bo‘sh yoki takroriy turkum nomi')
      return
    }
    setNewCatLabel('')
    setSelected(key)
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Xarajat qo‘shish
        </h1>
        <p className="mt-1 text-sm text-muted">Yangi xarajatni kiriting</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-surface p-6 shadow-xl shadow-slate-900/10 dark:shadow-black/30"
      >
        <label className="mb-2 block text-sm text-muted" htmlFor="amount">
          Summa (so‘mda)
        </label>
        <div className="relative mb-2">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
            <Banknote className="h-5 w-5" aria-hidden />
          </span>
          <MoneyDigitsField
            id="amount"
            digits={amountDigits}
            onDigitsChange={setAmountDigits}
            locale={locale}
            placeholder="Masalan: 51 000"
            className="w-full rounded-xl border border-border bg-input py-3 pl-12 pr-4 text-foreground placeholder:text-faint focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <p className="mb-6 text-xs leading-relaxed text-muted">
          {amountDigits ? (
            <>
              <span className="text-soft">Ko‘rinish: </span>
              <span className="font-semibold tabular-nums text-emerald-400/95">
                {formatGroupedFromDigits(amountDigits, locale)} so‘m
              </span>
              <span className="block pt-1 text-faint sm:inline sm:before:hidden">
                {' '}
                — {inputCurrencyHint(currency)}. Saqlashdan oldin summa har doim
                so‘mda hisoblanadi.
              </span>
            </>
          ) : (
            <>
              Raqamlarni yozing — mingliklar avtomatik chiqadi (masalan 51000 →{' '}
              {formatGroupedFromDigits('51000', locale)}). Valyuta tanlovi faqat
              ajratgich uslubiga ta’sir qiladi.
            </>
          )}
        </p>

        <p className="mb-3 text-sm text-muted">Turkum</p>
        <div className="mb-6 grid grid-cols-2 gap-3">
          {allOptions.map((c) => {
            const Icon = c.Icon
            const active = selectedKey === c.key
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setSelected(c.key)}
                className={[
                  'flex items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm font-medium transition',
                  active
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-border bg-input text-foreground hover:border-border-strong',
                ].join(' ')}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${c.iconWrap}`}
                >
                  <Icon className="h-4 w-4 text-white" />
                </span>
                <span className="line-clamp-2">{c.label}</span>
              </button>
            )
          })}
        </div>

        <div className="mb-8 rounded-xl border border-border bg-elevated p-4">
          <p className="mb-2 text-xs font-medium text-muted">
            Yangi turkum qo‘shish
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={newCatLabel}
              onChange={(e) => setNewCatLabel(e.target.value)}
              placeholder="Masalan: Ta’lim, Sport..."
              className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-faint focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="shrink-0 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/25"
            >
              Qo‘shish
            </button>
          </div>
          {catErr ? (
            <p className="mt-2 text-xs text-red-400">{catErr}</p>
          ) : (
            <p className="mt-2 text-[11px] text-faint">
              Turkumlar qurilmada saqlanadi — keyingi safar ham ko‘rinadi.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-500 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-400"
        >
          Saqlash
        </button>
      </form>
    </div>
  )
}
