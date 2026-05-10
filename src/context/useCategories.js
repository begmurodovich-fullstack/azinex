import { useContext } from 'react'
import { CategoryContext } from './categoryContext'

export function useCategories() {
  const ctx = useContext(CategoryContext)
  if (!ctx) {
    throw new Error('useCategories must be used within CategoryProvider')
  }
  return ctx
}
