import { Pencil, Trash2 } from 'lucide-react'
import { useCategories } from '../context/useCategories'
import { useCurrency } from '../context/useCurrency'
import { useExpenses } from '../context/useExpenses'
import { formatDateShort } from '../lib/format'

export function ExpenseList() {
  const { expenses, deleteExpense, totalExpensesAmount } = useExpenses()
  const { formatMoney } = useCurrency()
  const { getMeta } = useCategories()

  const sorted = [...expenses].sort((a, b) => {
    const da = a.date + 'T' + a.time
    const db = b.date + 'T' + b.time
    return db.localeCompare(da)
  })

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Xarajatlar ro‘yxati
        </h1>
        <p className="mt-1 text-sm text-muted">
          Barcha xarajatlarni ko‘ring va boshqaring
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-surface [-webkit-overflow-scrolling:touch]">
        <div className="min-w-[min(100%,36rem)] overflow-hidden sm:min-w-0">
        <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 border-b border-border-subtle px-4 py-4 text-xs font-medium uppercase tracking-wide text-muted sm:grid-cols-[140px_1fr_140px_100px] sm:px-6">
          <span>Sana</span>
          <span>Turkum</span>
          <span className="text-right sm:text-left">Summa</span>
          <span className="text-right">Amallar</span>
        </div>
        <div className="divide-y divide-white/5">
          {sorted.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-muted sm:px-6">
              Ro‘yxat bo‘sh. «Xarajat qo‘shish» bo‘limidan ma’lumotlarni kiriting.
            </div>
          ) : (
            sorted.map((e) => {
              const meta = getMeta(e.categoryKey)
              const Icon = meta.Icon
              return (
                <div
                  key={e.id}
                  className="grid grid-cols-1 items-center gap-3 px-4 py-4 sm:grid-cols-[140px_1fr_140px_100px] sm:px-6"
                >
                  <span className="text-sm text-white">
                    {formatDateShort(e.date)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${meta.iconWrap}`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </span>
                    <span className="font-medium">{e.category}</span>
                  </div>
                  <span className="text-right text-sm font-medium tabular-nums text-expense sm:text-left">
                    -{formatMoney(e.amount)}
                  </span>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-muted transition hover:bg-[color:var(--app-hover)] hover:text-foreground"
                      aria-label="Tahrirlash"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-2 text-muted transition hover:bg-red-500/20 hover:text-red-400"
                      aria-label="O‘chirish"
                      onClick={() => deleteExpense(e.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <div className="rounded-xl border border-border bg-surface px-6 py-4 text-right">
          <p className="text-xs text-muted">Jami xarajatlar</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-expense">
            -{formatMoney(totalExpensesAmount)}
          </p>
        </div>
      </div>
    </div>
  )
}
