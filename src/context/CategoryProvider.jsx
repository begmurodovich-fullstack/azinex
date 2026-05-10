import { useCallback, useEffect, useMemo, useState } from 'react'
import { getCategoryMeta, mergeCategoryOptions } from '../lib/categories'
import { CategoryContext } from './categoryContext'

const STORAGE = 'azinex-user-categories-v1'

function readUserCategories() {
  try {
    const raw = localStorage.getItem(STORAGE)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (x) =>
        x &&
        typeof x.key === 'string' &&
        typeof x.label === 'string' &&
        x.key.startsWith('u_'),
    )
  } catch {
    return []
  }
}

export function CategoryProvider({ children }) {
  const [userCategories, setUserCategories] = useState(readUserCategories)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(userCategories))
    } catch {
      /* ignore */
    }
  }, [userCategories])

  const allOptions = useMemo(
    () => mergeCategoryOptions(userCategories),
    [userCategories],
  )

  const getMeta = useCallback(
    (key) => getCategoryMeta(key, userCategories),
    [userCategories],
  )

  /** @returns {string | null} yangi kalit yoki null (takroriy nomda null) */
  const addCustomCategory = useCallback((label) => {
    const t = label.trim()
    if (!t) return null
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `id-${Date.now()}`
    const key = `u_${id}`
    let added = /** @type {string | null} */ (null)
    setUserCategories((prev) => {
      if (prev.some((c) => c.label.toLowerCase() === t.toLowerCase())) {
        return prev
      }
      added = key
      return [...prev, { id, key, label: t }]
    })
    return added
  }, [])

  const removeCustomCategory = useCallback((key) => {
    if (!key.startsWith('u_')) return
    setUserCategories((prev) => prev.filter((c) => c.key !== key))
  }, [])

  const value = useMemo(
    () => ({
      userCategories,
      allOptions,
      getMeta,
      addCustomCategory,
      removeCustomCategory,
    }),
    [
      userCategories,
      allOptions,
      getMeta,
      addCustomCategory,
      removeCustomCategory,
    ],
  )

  return (
    <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
  )
}
