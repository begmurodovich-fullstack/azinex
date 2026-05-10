import { useCallback, useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useCategories } from '../context/useCategories'
import { useCurrency } from '../context/useCurrency'
import { useExpenses } from '../context/useExpenses'
import { useTheme } from '../context/useTheme'
import { oyYorliginiBer } from '../lib/months'

export function Statistics() {
  const { expenses } = useExpenses()
  const { formatMoney, formatCompact } = useCurrency()
  const { getMeta } = useCategories()
  const { theme } = useTheme()

  const chart = useMemo(() => {
    const dark = theme === 'dark'
    return {
      tooltipBg: dark ? '#1c2128' : '#ffffff',
      tooltipBorder: dark
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : '1px solid rgba(15, 23, 42, 0.12)',
      pieLabel: dark ? '#e6edf3' : '#0f172a',
      grid: dark ? '#30363d' : '#e2e8f0',
      tickFill: dark ? '#8b949e' : '#64748b',
      cursor: dark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.06)',
      labelStrong: dark ? '#fff' : '#0f172a',
      itemMuted: dark ? '#8b949e' : '#64748b',
    }
  }, [theme])

  const tooltipStyle = useMemo(
    () => ({
      backgroundColor: chart.tooltipBg,
      border: chart.tooltipBorder,
      borderRadius: '8px',
      fontSize: '12px',
    }),
    [chart.tooltipBg, chart.tooltipBorder],
  )

  const monthlyTrend = useMemo(() => {
    const byMonth = {}
    for (const e of expenses) {
      const ym = e.date.slice(0, 7)
      if (ym.length !== 7) continue
      byMonth[ym] = (byMonth[ym] || 0) + e.amount
    }
    return Object.keys(byMonth)
      .sort()
      .map((ym) => ({
        month: oyYorliginiBer(ym),
        amount: byMonth[ym],
      }))
  }, [expenses])

  const { pieRows, pieData, maxCat } = useMemo(() => {
    const sums = {}
    for (const e of expenses) {
      sums[e.categoryKey] = (sums[e.categoryKey] || 0) + e.amount
    }
    const keys = Object.keys(sums).filter((k) => sums[k] > 0)
    const rows = keys.map((k) => {
      const meta = getMeta(k)
      return {
        key: k,
        name: meta.label,
        value: sums[k],
        color: meta.chartColor,
      }
    })
    const pie = rows.map((r) => ({ ...r }))
    const maxV = Math.max(0, ...rows.map((r) => r.value))
    return { pieRows: rows, pieData: pie, maxCat: maxV }
  }, [expenses, getMeta])

  const avgDaily = useMemo(() => {
    const d = new Date()
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const list = expenses.filter((e) => e.date.startsWith(ym))
    if (!list.length) return 0
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
    const sum = list.reduce((s, e) => s + e.amount, 0)
    return Math.round(sum / daysInMonth)
  }, [expenses])

  const highest = useMemo(() => {
    if (!expenses.length) return 0
    return Math.max(...expenses.map((e) => e.amount))
  }, [expenses])

  const txCount = expenses.length

  const renderPieLabel = useCallback(
    (props) => {
      const { cx, cy, midAngle, outerRadius, name, percent } = props
      if (percent == null || name == null) return null
      const pct =
        typeof percent === 'number' && percent <= 1
          ? Math.round(percent * 100)
          : Math.round(percent)
      const RAD = Math.PI / 180
      const r = outerRadius + 22
      const x = cx + r * Math.cos(-midAngle * RAD)
      const y = cy + r * Math.sin(-midAngle * RAD)
      const textAnchor = x > cx ? 'start' : 'end'
      return (
        <text
          x={x}
          y={y}
          fill={chart.pieLabel}
          textAnchor={textAnchor}
          dominantBaseline="central"
          className="text-xs"
        >
          {`${name} ${pct}%`}
        </text>
      )
    },
    [chart.pieLabel],
  )

  const pieEmpty = pieData.length === 0
  const barEmpty = monthlyTrend.length === 0

  const cardShadow =
    'transition-shadow duration-300 hover:shadow-lg hover:shadow-slate-900/10 dark:hover:shadow-black/20'

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1
          className="animate-stat-fade-up text-2xl font-semibold tracking-tight text-foreground"
          style={{ animationDelay: '0ms' }}
        >
          Statistika
        </h1>
        <p
          className="mt-1 animate-stat-fade-up text-sm text-muted"
          style={{ animationDelay: '70ms' }}
        >
          Sarflashingiz tuzilmasini tahlil qiling
        </p>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <div
          className={`animate-stat-fade-up rounded-2xl border border-border-subtle bg-surface p-6 ${cardShadow}`}
          style={{ animationDelay: '120ms' }}
        >
          <h2 className="mb-4 text-sm font-medium text-muted">
            Turkumlar bo‘yicha taqsimot
          </h2>
          <div className="relative h-72 w-full">
            {pieEmpty ? (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border bg-elevated/50 px-4 text-center text-sm text-muted">
                Xarajat qo‘shilgach diagramma paydo bo‘ladi
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={88}
                    paddingAngle={2}
                    labelLine={false}
                    label={renderPieLabel}
                    isAnimationActive
                    animationBegin={180}
                    animationDuration={900}
                    animationEasing="ease-out"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatMoney(Number(value))}
                    contentStyle={tooltipStyle}
                    labelStyle={{
                      color: chart.labelStrong,
                      fontWeight: 600,
                    }}
                    itemStyle={{ color: chart.itemMuted }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div
          className={`animate-stat-fade-up rounded-2xl border border-border-subtle bg-surface p-6 ${cardShadow}`}
          style={{ animationDelay: '200ms' }}
        >
          <h2 className="mb-4 text-sm font-medium text-muted">
            Turkumlar tafsiloti
          </h2>
          <div className="flex flex-col gap-4">
            {pieRows.length === 0 ? (
              <p className="text-sm text-muted">
                Hozircha ma&apos;lumot yo&apos;q
              </p>
            ) : (
              pieRows.map((row, i) => (
                <div
                  key={row.key}
                  className="animate-stat-fade-up"
                  style={{ animationDelay: `${260 + i * 65}ms` }}
                >
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-200 hover:scale-125"
                        style={{ backgroundColor: row.color }}
                      />
                      <span className="text-foreground">{row.name}</span>
                    </div>
                    <span className="tabular-nums text-muted">
                      {formatMoney(row.value)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-chart-track">
                    <div
                      className="animate-stat-progress h-full rounded-full"
                      style={{
                        width: `${maxCat ? (row.value / maxCat) * 100 : 0}%`,
                        backgroundColor: row.color,
                        animationDelay: `${320 + i * 70}ms`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div
            className="mt-8 animate-stat-fade-up rounded-xl border border-border-subtle bg-elevated p-4"
            style={{ animationDelay: `${280 + pieRows.length * 65}ms` }}
          >
            <p className="text-xs text-muted">
              Qo'shimcha limit (keyinroq sozlash mumkin)
            </p>
            <div className="mt-2 flex items-center justify-between gap-4">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-chart-track-2">
                <div
                  className="animate-stat-progress h-full rounded-full bg-emerald-500"
                  style={{
                    width: '0%',
                    animationDelay: `${360 + pieRows.length * 70}ms`,
                  }}
                />
              </div>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {formatMoney(0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mb-6 animate-stat-fade-up rounded-2xl border border-border-subtle bg-surface p-6 ${cardShadow}`}
        style={{ animationDelay: '280ms' }}
      >
        <h2 className="mb-6 text-sm font-medium text-foreground">
          Oylar kesimida xarajat
        </h2>
        <div className="h-72 w-full">
          {barEmpty ? (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border bg-elevated/50 px-4 text-center text-sm text-muted">
              Bir necha oy uchun xarajat qo‘shilgach grafik chiqadi
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={chart.grid} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: chart.tickFill, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: chart.tickFill, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatCompact(v)}
                />
                <Tooltip
                  formatter={(value) => formatMoney(Number(value))}
                  contentStyle={tooltipStyle}
                  labelStyle={{
                    color: chart.labelStrong,
                    fontWeight: 600,
                  }}
                  itemStyle={{ color: chart.itemMuted }}
                  cursor={{ fill: chart.cursor }}
                />
                <Bar
                  dataKey="amount"
                  name="Harajat"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={48}
                  isAnimationActive
                  animationBegin={120}
                  animationDuration={1100}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div
          className="animate-stat-fade-up rounded-xl border border-border-subtle bg-surface p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-emerald-500/20"
          style={{ animationDelay: '360ms' }}
        >
          <p className="text-xs text-muted">O‘rtacha kunlik xarajat (shu oy)</p>
          <p
            className="animate-stat-count mt-2 text-2xl font-semibold tabular-nums text-foreground"
            style={{ animationDelay: '480ms' }}
          >
            {formatMoney(avgDaily)}
          </p>
        </div>
        <div
          className="animate-stat-fade-up rounded-xl border border-border-subtle bg-surface p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-emerald-500/20"
          style={{ animationDelay: '420ms' }}
        >
          <p className="text-xs text-muted">Eng katta bir martalik xarajat</p>
          <p
            className="animate-stat-count mt-2 text-2xl font-semibold tabular-nums text-foreground"
            style={{ animationDelay: '540ms' }}
          >
            {formatMoney(highest)}
          </p>
        </div>
        <div
          className="animate-stat-fade-up rounded-xl border border-border-subtle bg-surface p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-emerald-500/20"
          style={{ animationDelay: '480ms' }}
        >
          <p className="text-xs text-muted">Tranzaksiyalar soni</p>
          <p
            className="animate-stat-count mt-2 text-2xl font-semibold tabular-nums text-foreground"
            style={{ animationDelay: '600ms' }}
          >
            {txCount}
          </p>
        </div>
      </div>
    </div>
  )
}
