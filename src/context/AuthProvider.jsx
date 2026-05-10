import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './authContext'

const USERS_KEY = 'azinex-users-v1'
const SESSION_KEY = 'azinex-session-v1'

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const a = JSON.parse(raw)
    return Array.isArray(a) ? a : []
  } catch {
    return []
  }
}

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const u = JSON.parse(raw)
    if (u && typeof u.email === 'string') return u
    return null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession())

  const persistSession = useCallback((next) => {
    if (next) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(next))
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
    setUser(next)
  }, [])

  const login = useCallback((email, password) => {
    const e = email.trim().toLowerCase()
    const users = readUsers()
    const found = users.find((u) => u.email === e)
    if (!found || found.password !== password) {
      return {
        ok: false,
        error: 'Email yoki parol noto‘g‘ri',
      }
    }
    const session = { email: found.email, name: found.name || found.email }
    persistSession(session)
    return { ok: true }
  }, [persistSession])

  const signup = useCallback(
    ({ name, email, password }) => {
      const e = email.trim().toLowerCase()
      const users = readUsers()
      if (users.some((u) => u.email === e)) {
        return { ok: false, error: 'Bu email bilan ro‘yxatdan o‘tilgan' }
      }
      const row = {
        name: name.trim(),
        email: e,
        password,
      }
      users.push(row)
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
      persistSession({ email: e, name: row.name })
      return { ok: true }
    },
    [persistSession],
  )

  const logout = useCallback(() => {
    persistSession(null)
  }, [persistSession])

  const value = useMemo(
    () => ({
      user,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
    }),
    [user, login, signup, logout],
  )

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}
