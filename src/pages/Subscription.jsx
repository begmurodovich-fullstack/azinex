import { Check, Crown } from 'lucide-react'
import { useCurrency } from '../context/useCurrency'

const freeFeatures = [
  'Oyiga 50 tagacha xarajat',
  'Oddiy statistika',
  '3 ta turkum',
  'Qo‘lda xarajat kiritish',
]

const premiumFeatures = [
  'Cheksiz xarajat yozuvlari',
  'Chuqur tahlil va tavsiyalar',
  'Cheksiz maxsus turkumlar',
  'CSV/PDF ga eksport',
  'Byudjet maqsamlari va ogohlantirishlar',
  'Bir necha valyuta',
  'Ustuvor qo‘llab-quvvatlash',
  'Reklamasiz interfeys',
]

export function Subscription() {
  const { formatMoney } = useCurrency()

  return (
    <div className="mx-auto max-w-4xl">
      <p className="mb-10 text-center text-lg text-foreground">
        Chuqur imkoniyatlarni oching — xarajatlarni yaxshiroq boshqaring
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col rounded-2xl border border-border bg-surface p-8">
          <h2 className="text-xl font-semibold text-foreground">Bepul</h2>
          <p className="mt-2 text-3xl font-bold tabular-nums">{formatMoney(0)}</p>
          <p className="text-sm text-muted">/ oy</p>
          <ul className="mt-8 flex flex-1 flex-col gap-3">
            {freeFeatures.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-muted">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-faint" />
                {t}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-8 w-full rounded-xl border border-border bg-muted-surface py-3 text-sm font-medium text-muted"
          >
            Joriy tarif
          </button>
        </div>

        <div className="relative flex flex-col rounded-2xl border border-emerald-500/40 bg-surface p-8 shadow-lg shadow-emerald-500/10">
          <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white">
            <Crown className="h-3.5 w-3.5" />
            Mashhur
          </span>
          <h2 className="text-xl font-semibold text-foreground">Premium</h2>
          <p className="mt-2 text-3xl font-bold tabular-nums">
            {formatMoney(29000)}
          </p>
          <p className="text-sm text-muted">/ oy</p>
          <ul className="mt-8 flex flex-1 flex-col gap-3">
            {premiumFeatures.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                {t}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-8 w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white transition hover:bg-emerald-400"
          >
            Premiumga o‘tish
          </button>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-border-subtle bg-surface px-6 py-4 text-center text-xs text-muted">
        Xavfsiz to‘lov • Istalgan vaqtda bekor qilish • 7 kunlik pul qaytarish kafolati
      </div>
    </div>
  )
}
