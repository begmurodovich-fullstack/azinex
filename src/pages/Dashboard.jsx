import { Plus, ShoppingBag, TrendingDown, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { MoneyDigitsField } from '../components/MoneyDigitsField'
import { useCategories } from '../context/useCategories'
import { useCurrency } from '../context/useCurrency'
import { useExpenses } from '../context/useExpenses'
import { formatDateShort } from '../lib/format'
import {
  formatGroupedFromDigits,
  inputCurrencyHint,
  inputLocaleForCurrency,
} from '../lib/moneyInput'

export function Dashboard() {
  const {
    expenses,
    totalBalance,
    setTotalBalance,
    addToBalance,
    totalExpensesAmount,
  } = useExpenses()
  const { formatMoney, currency } = useCurrency()
  const locale = inputLocaleForCurrency(currency)
  const { getMeta } = useCategories()
  /** null = saqlangan balansdan ko‘rsatish; yozishda raqamlar qatori */
  const [balDigits, setBalDigits] = useState(null)
  const [topUpDigits, setTopUpDigits] = useState('')

  const balanceDigitsEffective =
    balDigits !== null
      ? balDigits
      : totalBalance > 0
        ? String(totalBalance)
        : ''

  const monthlyBuOy = useMemo(() => {
    const d = new Date()
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    return expenses
      .filter((e) => e.date.startsWith(ym))
      .reduce((s, e) => s + e.amount, 0)
  }, [expenses])

  const topCategory = useMemo(() => {
    const byCat = {}
    for (const e of expenses) {
      byCat[e.categoryKey] = (byCat[e.categoryKey] || 0) + e.amount
    }
    let maxKey = null
    let maxAmt = 0
    for (const [k, v] of Object.entries(byCat)) {
      if (v > maxAmt) {
        maxAmt = v
        maxKey = k
      }
    }
    if (!maxKey || maxAmt === 0) {
      return { label: null, amount: 0 }
    }
    const meta = getMeta(maxKey)
    return { label: meta.label, amount: maxAmt }
  }, [expenses, getMeta])

  const recent = useMemo(() => {
    return [...expenses]
      .sort((a, b) => {
        const da = a.date + 'T' + a.time
        const db = b.date + 'T' + b.time
        return db.localeCompare(da)
      })
      .slice(0, 5)
  }, [expenses])

  const oyNomi = useMemo(() => {
    const d = new Date()
    return d.toLocaleDateString('uz-UZ', { month: 'long' })
  }, [])

  /** Kiritilgan boshlang‘ich mablag‘dan barcha xarajatlar ayiriladi */
  const qoldiqBalans = useMemo(
    () => totalBalance - totalExpensesAmount,
    [totalBalance, totalExpensesAmount],
  )

  const qoldiqIjobiy = qoldiqBalans >= 0

  function commitBalance() {
    const raw =
      balDigits !== null
        ? balDigits
        : totalBalance > 0
          ? String(totalBalance)
          : ''
    const n = raw === '' ? 0 : parseInt(raw, 10)
    setTotalBalance(Number.isFinite(n) && n >= 0 ? n : 0)
    setBalDigits(null)
  }

  function hamyongaQoshish() {
    const n = topUpDigits === '' ? NaN : parseInt(topUpDigits, 10)
    if (!Number.isFinite(n) || n <= 0) return
    addToBalance(n)
    setTopUpDigits('')
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Bosh sahifa
        </h1>
        <p className="mt-1 text-sm text-muted">
          Xarajatlaringiz va balansingizni kuzating
        </p>
      </div>

      <div
        className={
          qoldiqIjobiy
            ? 'mb-6 rounded-2xl bg-emerald-500 p-6 shadow-lg shadow-emerald-500/20'
            : 'mb-6 rounded-2xl bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 p-6 shadow-lg shadow-orange-900/30'
        }
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white/90">
                  Qolgan mablag‘
                </p>
                <p className="mt-1 break-words text-3xl font-bold tabular-nums text-white">
                  {formatMoney(qoldiqBalans)}
                </p>
                {!qoldiqIjobiy ? (
                  <p className="mt-2 max-w-md text-xs font-medium text-white/95">
                    Xarajatlar hamyon fondidan oshib ketdi — yuqoridan pul
                    qo‘shing yoki fondni to‘g‘rilang.
                  </p>
                ) : null}
                <div className="mt-4 grid gap-3 rounded-xl bg-black/15 px-3 py-3 text-xs text-white/85 sm:grid-cols-3">
                  <div>
                    <span className="block text-white/60">Hamyon fondi</span>
                    <span className="font-semibold tabular-nums">
                      {formatMoney(totalBalance)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-white/60">Jami xarajat</span>
                    <span className="font-semibold tabular-nums text-white/95">
                      −{formatMoney(totalExpensesAmount)}
                    </span>
                  </div>
                  <div className="sm:border-l sm:border-white/20 sm:pl-3">
                    <span className="block text-white/60">Hisob</span>
                    <span className="text-[11px] leading-snug text-white/75">
                      fond − xarajat = qoldiq
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 lg:max-w-sm lg:items-stretch">
            <div className="rounded-xl border border-white/25 bg-white/10 p-4">
              <p className="text-xs font-semibold text-white">
                Hamyonga pul qo‘shish
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-white/70">
                Yangi tushum (masalan 300 000) — joriy fondga qo‘shiladi, butun
                summani qayta hisoblash shart emas.
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch">
                <MoneyDigitsField
                  id="topup-input"
                  digits={topUpDigits}
                  onDigitsChange={setTopUpDigits}
                  locale={locale}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      hamyongaQoshish()
                    }
                  }}
                  placeholder="Masalan: 300 000"
                  className="min-w-0 flex-1 rounded-lg border border-white/35 bg-black/20 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-300/60"
                />
                <button
                  type="button"
                  onClick={hamyongaQoshish}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  <Plus className="h-4 w-4" />
                  Qo‘shish
                </button>
              </div>
              {topUpDigits ? (
                <p className="mt-2 text-[11px] text-white/65">
                  ≈{' '}
                  <span className="font-medium text-white/90">
                    {formatGroupedFromDigits(topUpDigits, locale)}
                  </span>{' '}
                  · {inputCurrencyHint(currency)}
                </p>
              ) : null}
            </div>

            <details className="group rounded-xl border border-white/20 bg-black/10 p-3 text-white/90">
              <summary className="cursor-pointer list-none text-xs font-medium text-white/90 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="underline decoration-white/30 underline-offset-2 group-open:no-underline">
                  Hamyon fondini to‘liq almashtirish
                </span>
                <span className="mt-1 block text-[11px] font-normal text-white/55">
                  Boshqa hisobdan ko‘chirsangiz yoki summani noldan belgilamoqchi
                  bo‘lsangiz
                </span>
              </summary>
              <div className="mt-3 flex w-full flex-col gap-1 border-t border-white/10 pt-3">
                <label
                  className="text-[11px] text-white/70"
                  htmlFor="balance-input"
                >
                  Yangi fond (butun summa)
                </label>
                <div className="flex w-full gap-2">
                  <MoneyDigitsField
                    id="balance-input"
                    digits={balanceDigitsEffective}
                    onDigitsChange={(d) => setBalDigits(d)}
                    locale={locale}
                    onFocus={() =>
                      setBalDigits(
                        totalBalance > 0 ? String(totalBalance) : '',
                      )
                    }
                    onBlur={commitBalance}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        commitBalance()
                      }
                    }}
                    placeholder="Masalan: 5 000 000"
                    className="w-full rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                  <button
                    type="button"
                    onClick={commitBalance}
                    className="shrink-0 rounded-lg bg-white/20 px-3 py-2 text-sm font-medium text-white hover:bg-white/30"
                  >
                    Saqlash
                  </button>
                </div>
                <p className="text-[11px] leading-snug text-white/50">
                  Yozayotganda:{' '}
                  <span className="font-medium tabular-nums text-white/80">
                    {formatGroupedFromDigits(balanceDigitsEffective, locale) ||
                      '—'}
                  </span>
                  <span className="mt-0.5 block text-white/40 sm:mt-0 sm:inline">
                    <span className="hidden sm:inline"> · </span>
                    {inputCurrencyHint(currency)}
                  </span>
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border-subtle bg-surface p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
              <TrendingDown className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted">Shu oygi xarajatlar</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                {formatMoney(monthlyBuOy)}
              </p>
              <p className="text-xs text-muted">{oyNomi} oyi</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
              <ShoppingBag className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted">Eng ko‘p sarflangan tur</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {topCategory.label ?? '—'}
              </p>
              <p className="text-xs text-muted">
                {topCategory.amount > 0
                  ? formatMoney(topCategory.amount)
                  : "Hozircha ma'lumot yo'q"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          So‘nggi xarajatlar
        </h2>
        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface/50 px-4 py-8 text-center text-sm text-muted">
            Hozircha xarajat yo‘q. «Xarajat qo‘shish» bo‘limidan kiriting.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {recent.map((e) => {
              const meta = getMeta(e.categoryKey)
              const Icon = meta.Icon
              return (
                <div
                  key={e.id}
                  className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${meta.iconWrap}`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{e.category}</p>
                      <p className="text-xs text-muted">
                        {formatDateShort(e.date)}, {e.time}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium tabular-nums text-expense">
                    -{formatMoney(e.amount)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
