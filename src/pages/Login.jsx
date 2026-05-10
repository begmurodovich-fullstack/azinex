import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) return <Navigate to="/" replace />

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const res = login(email, password)
    if (res.ok) navigate('/', { replace: true })
    else setError(res.error || 'Xatolik')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-4 py-12">
      <div className="mb-10 w-full max-w-xs text-center">
        <img
          src="/branding/logo-dark.png"
          alt="Azinex"
          className="mx-auto h-36 w-36 rounded-full object-cover shadow-xl shadow-slate-900/15 ring-1 ring-border dark:shadow-black/50"
          width={144}
          height={144}
        />
        <p className="mt-4 text-xs tracking-wide text-muted">
          Premium Financial Life
        </p>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-2xl shadow-slate-900/10 dark:shadow-black/40">
        <h1 className="text-center text-xl font-semibold text-foreground">
          Kirish
        </h1>
        <p className="mt-1 text-center text-sm text-muted">
          Hisobingizga kiring
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {error ? (
            <p className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          ) : null}
          <div>
            <label
              htmlFor="login-email"
              className="mb-1 block text-xs text-muted"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground placeholder:text-faint focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="email@misol.uz"
            />
          </div>
          <div>
            <label htmlFor="login-pass" className="mb-1 block text-xs text-muted">
              Parol
            </label>
            <input
              id="login-pass"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            Kirish
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Hisobingiz yo‘qmi?{' '}
          <Link className="font-medium text-emerald-400 hover:underline" to="/signup">
            Ro‘yxatdan o‘tish
          </Link>
        </p>
      </div>
    </div>
  )
}
