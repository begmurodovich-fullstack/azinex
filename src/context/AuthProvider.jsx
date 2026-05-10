import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './authContext'

const SESSION_KEY = 'azinex-session-v1'
const TOKEN_KEY = 'azinex-token-v1'
const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

function readJson(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJson(SESSION_KEY))
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [loading, setLoading] = useState(false)

  const persistAuth = useCallback((nextUser, nextToken) => {
    setUser(nextUser)
    setToken(nextToken || '')

    if (nextUser) localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
    else localStorage.removeItem(SESSION_KEY)

    if (nextToken) localStorage.setItem(TOKEN_KEY, nextToken)
    else localStorage.removeItem(TOKEN_KEY)
  }, [])

  const authFetch = useCallback(async (path, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    }
    if (token) headers.Authorization = `Bearer ${token}`
    
    const res = await fetch(`${apiBase}${path}`, { ...options, headers })
    
    if (res.status === 401) {
      persistAuth(null, '')
    }
    
    return res
  }, [token, persistAuth])

  const login = useCallback(async (email, password) => {
    const e = email.trim().toLowerCase()
    if (!e || !password) return { ok: false, error: "Email va parolni kiriting" }

    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: e, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        return { ok: false, error: data?.error || 'Email yoki parol noto‘g‘ri' }
      }
      persistAuth(data.user, data.token)
      return { ok: true }
    } catch {
      return { ok: false, error: 'Serverga ulanib bo‘lmadi' }
    } finally {
      setLoading(false)
    }
  }, [persistAuth])

  const signup = useCallback(async ({ name, email, password }) => {
    const n = name.trim()
    const e = email.trim().toLowerCase()
    if (n.length < 1) return { ok: false, error: 'Ism kiriting' }
    if (password.length < 8) return { ok: false, error: 'Parol kamida 8 belgi bo‘lsin' }

    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: n, email: e, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        return { ok: false, error: data?.error || "Ro'yxatdan o'tishda xatolik" }
      }
      return { ok: true, message: data.message }
    } catch {
      return { ok: false, error: 'Serverga ulanib bo‘lmadi' }
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshMe = useCallback(async () => {
    if (!token) return null
    try {
      const res = await authFetch('/me', { method: 'GET' })
      if (!res.ok) {
        persistAuth(null, '')
        return null
      }
      const data = await res.json()
      if (data?.user) {
        persistAuth(data.user, token)
        return data.user
      }
    } catch {
      return null
    }
    return null
  }, [authFetch, persistAuth, token])

  const logout = useCallback(() => {
    persistAuth(null, '')
  }, [persistAuth])

  const connectTelegram = useCallback(async (chatId = '') => {
    const payload = {}
    if (chatId) payload.chatId = chatId
    const res = await authFetch('/connect-telegram', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return { ok: false, error: data?.error || 'Telegram ulanmadi' }
    await refreshMe()
    return { ok: true, ...data }
  }, [authFetch, refreshMe])

  const notifyExpense = useCallback(async ({ amount, category }) => {
    const res = await authFetch('/notify', {
      method: 'POST',
      body: JSON.stringify({ amount, category }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return { ok: false, error: data?.error || 'Notify xatoligi' }
    return { ok: true }
  }, [authFetch])

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      signup,
      logout,
      loading,
      connectTelegram,
      notifyExpense,
      refreshMe,
      isAuthenticated: !!user,
      authFetch,
    }),
    [user, token, login, signup, logout, loading, connectTelegram, notifyExpense, refreshMe, authFetch],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
