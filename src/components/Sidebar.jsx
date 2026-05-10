import { NavLink, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Crown,
  LayoutDashboard,
  List,
  LogOut,
  Plus,
  User,
} from 'lucide-react'
import { useAuth } from '../context/useAuth'

const items = [
  { to: '/', label: 'Bosh sahifa', icon: LayoutDashboard },
  { to: '/add', label: 'Xarajat qo‘shish', icon: Plus },
  { to: '/expenses', label: 'Xarajatlar ro‘yxati', icon: List },
  { to: '/statistics', label: 'Statistika', icon: BarChart3 },
  { to: '/subscription', label: 'Obuna', icon: Crown },
  { to: '/profile', label: 'Profil', icon: User },
]

/**
 * @param {object} props
 * @param {boolean} [props.mobileOpen]
 * @param {() => void} [props.onNavigate] — mobil menyu: havolani bosganda yopish
 */
export function Sidebar({ mobileOpen = false, onNavigate }) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function chiqish() {
    onNavigate?.()
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={[
        'flex w-[min(18rem,88vw)] shrink-0 flex-col border-r border-border-subtle bg-surface px-4 py-6 transition-transform duration-200 ease-out',
        'fixed inset-y-0 left-0 z-40 lg:relative lg:z-0 lg:w-56 lg:translate-x-0',
        mobileOpen ? 'translate-x-0 shadow-2xl shadow-black/40' : '-translate-x-full lg:translate-x-0',
      ].join(' ')}
    >
      <div className="mb-8 lg:mb-10">
        <div className="text-xl font-semibold text-emerald-400">Azinex</div>
        <div className="text-xs text-muted">Xarajatlarni kuzatish</div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-emerald-500 text-white'
                  : 'text-muted hover:bg-[color:var(--app-hover)] hover:text-foreground',
              ].join(' ')
            }
          >
            <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={chiqish}
        className="mt-6 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-[color:var(--app-hover)] hover:text-foreground"
      >
        <LogOut className="h-5 w-5 shrink-0" strokeWidth={2} />
        Chiqish
      </button>

      <p className="mt-auto pt-6 text-center text-xs text-faint">
        © 2026 Azinex
      </p>
    </aside>
  )
}
