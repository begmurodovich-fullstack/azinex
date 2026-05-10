import { useCallback, useEffect, useMemo, useState } from 'react'
import { getCategoryMeta, mergeCategoryOptions } from '../lib/categories'
import { CategoryContext } from './categoryContext'
import { useAuth } from './useAuth'

export function CategoryProvider({ children }) {
  const { authFetch, isAuthenticated } = useAuth()
  const [userCategories, setUserCategories] = useState([])

  useEffect(() => {
    if (!isAuthenticated) return;
    let mounted = true;
    authFetch("/user-data")
      .then(res => res.json())
      .then(data => {
        if (mounted && data.ok) {
          setUserCategories(data.categories || []);
        }
      })
      .catch(console.error);
    
    return () => { mounted = false; };
  }, [authFetch, isAuthenticated]);

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
    
    // Check local duplicate first
    if (userCategories.some((c) => c.label.toLowerCase() === t.toLowerCase())) {
      return null;
    }

    // Backend generated ID and Key, but we need to return something synchronous.
    // Instead, we will generate ID/Key locally for immediate return.
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}`;
    const key = `u_${id}`;
    
    authFetch("/user-data/categories", {
      method: "POST",
      body: JSON.stringify({ label: t })
    }).then(res => res.json()).then(data => {
      if (data.ok && data.category) {
        setUserCategories(prev => {
          if (prev.some(c => c.key === data.category.key || c.label.toLowerCase() === t.toLowerCase())) {
            return prev;
          }
          return [...prev, data.category];
        });
      }
    }).catch(console.error);

    // Optimistically update
    setUserCategories(prev => [...prev, { id, key, label: t }]);
    return key;
  }, [authFetch, userCategories])

  const removeCustomCategory = useCallback((key) => {
    if (!key.startsWith('u_')) return
    setUserCategories((prev) => prev.filter((c) => c.key !== key))
    
    authFetch(`/user-data/categories/${key}`, {
      method: "DELETE"
    }).catch(console.error);
  }, [authFetch])

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
