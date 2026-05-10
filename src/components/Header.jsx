import { useEffect, useRef, useState } from 'react'
import {
  Check,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CURRENCIES } from '../lib/currency'
import { useCurrency } from '../context/useCurrency'
import { useAuth } from '../context/useAuth'
import { useTheme } from '../context/useTheme'

/**
 * @param {object} props
 * @param {() => void} [props.onOpenMenu] — mobil: menyu tugmasi
 */
export function Header({ onOpenMenu }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { currency, setCurrency } = useCurrency()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  function chiqish() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b border-border-subtle bg-header-bar px-3 py-3 backdrop-blur-md sm:gap-3 sm:px-4 sm:py-4 md:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-foreground lg:hidden"
        aria-label="Menyuni ochish"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition hover:bg-[color:var(--app-hover)]"
          aria-label={
            theme === 'dark' ? 'Yorug‘ rejimga o‘tish' : 'Qorong‘u rejimga o‘tish'
          }
          title={
            theme === 'dark' ? 'Yorug‘ rejim' : 'Qorong‘u rejim'
          }
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-amber-300" />
          ) : (
            <Moon className="h-5 w-5 text-slate-600" />
          )}
        </button>

        <div className="relative" ref={rootRef}>
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label="Valyuta tanlash"
            onClick={() => setOpen((o) => !o)}
            className="flex min-w-[5.5rem] items-center justify-between gap-2 rounded-lg border border-border bg-surface px-2.5 py-2 text-sm text-foreground sm:min-w-[7rem] sm:px-3"
          >
            <span className="font-medium tabular-nums">{currency}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {open && (
            <ul
              role="listbox"
              className="absolute right-0 z-50 mt-2 max-h-[min(70vh,24rem)] min-w-[11rem] overflow-auto rounded-xl border border-border bg-dropdown py-1 shadow-xl shadow-slate-900/15 dark:shadow-black/40"
            >
              {CURRENCIES.map(({ code, label }) => {
                const active = code === currency
                return (
                  <li key={code} role="option" aria-selected={active}>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition ${
                        active
                          ? 'bg-emerald-500/15 text-foreground'
                          : 'text-soft hover:bg-[color:var(--app-hover)] hover:text-foreground'
                      }`}
                      onClick={() => {
                        setCurrency(code)
                        setOpen(false)
                      }}
                    >
                      <span>
                        <span className="font-semibold tabular-nums">{code}</span>
                        <span className="mt-0.5 block text-xs font-normal text-muted">
                          {label}
                        </span>
                      </span>
                      {active && (
                        <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="flex max-w-[min(100%,12rem)] items-center gap-2 rounded-lg border border-border bg-surface px-2 py-2 text-sm text-foreground sm:px-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500">
            <User className="h-4 w-4 text-white" />
          </span>
          <span
            className="hidden min-w-0 flex-1 truncate sm:inline"
            title={user?.email}
          >
            {user?.name || user?.email || 'Foydalanuvchi'}
          </span>
        </div>

        <button
          type="button"
          onClick={chiqish}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-2 text-sm text-muted transition hover:bg-[color:var(--app-hover)] hover:text-foreground sm:gap-2 sm:px-3"
          title="Chiqish"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Chiqish</span>
        </button>
      </div>
    </header>
  )
}
