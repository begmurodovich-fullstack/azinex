import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export function Signup() {
  const { user, signup } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')

  if (user) return <Navigate to="/" replace />

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Parol kamida 6 belgi bo‘lsin')
      return
    }
    if (password !== password2) {
      setError('Parollar mos emas')
      return
    }
    const res = signup({ name, email, password })
    if (res.ok) navigate('/', { replace: true })
    else setError(res.error || 'Ro‘yxatdan o‘tish amalga oshmadi')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-4 py-12">
      <div className="mb-8 w-full max-w-xs text-center">
        <img
          src="/branding/logo-dark.png"
          alt="Azinex"
          className="mx-auto h-40 w-40 rounded-full object-cover shadow-xl shadow-slate-900/15 ring-1 ring-border dark:shadow-black/50"
          width={160}
          height={160}
        />
        <p className="mt-4 text-xs tracking-wide text-muted">
          Premium Financial Life
        </p>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-2xl shadow-slate-900/10 dark:shadow-black/40">
        <h1 className="text-center text-xl font-semibold text-foreground">
          Ro‘yxatdan o‘tish
        </h1>
        <p className="mt-1 text-center text-sm text-muted">
          Yangi hisob yarating
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {error ? (
            <p className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          ) : null}
          <div>
            <label htmlFor="su-name" className="mb-1 block text-xs text-muted">
              Ism
            </label>
            <input
              id="su-name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Ismingiz"
            />
          </div>
          <div>
            <label htmlFor="su-email" className="mb-1 block text-xs text-muted">
              Email
            </label>
            <input
              id="su-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="email@misol.uz"
            />
          </div>
          <div>
            <label htmlFor="su-pass" className="mb-1 block text-xs text-muted">
              Parol (kamida 6 belgi)
            </label>
            <input
              id="su-pass"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="su-pass2" className="mb-1 block text-xs text-muted">
              Parolni tasdiqlang
            </label>
            <input
              id="su-pass2"
              type="password"
              autoComplete="new-password"
              required
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            Ro‘yxatdan o‘tish
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Allaqachon hisob bormi?{' '}
          <Link className="font-medium text-emerald-400 hover:underline" to="/login">
            Kirish
          </Link>
        </p>

        <p className="mt-4 text-center text-[10px] leading-relaxed text-faint">
          Demo rejim: ma’lumotlar brauzerda saqlanadi. Production uchun server va
          xavfsiz parol kerak.
        </p>
      </div>
    </div>
  )
}
