import {
  Car,
  Home,
  Plus,
  ShoppingBag,
  Tag,
  Zap,
} from 'lucide-react'

export const CATEGORY_OPTIONS = [
  {
    key: 'food',
    label: 'Ovqat',
    Icon: ShoppingBag,
    iconWrap: 'bg-orange-500',
  },
  {
    key: 'transport',
    label: 'Transport',
    Icon: Car,
    iconWrap: 'bg-blue-500',
  },
  {
    key: 'daily',
    label: 'Kundalik',
    Icon: Home,
    iconWrap: 'bg-purple-500',
  },
  {
    key: 'custom',
    label: 'Boshqa',
    Icon: Plus,
    iconWrap: 'bg-gray-500',
  },
]

const STATIC_MAP = {
  food: {
    label: 'Ovqat',
    chartColor: '#f97316',
    dotClass: 'bg-orange-500',
    Icon: ShoppingBag,
    iconWrap: 'bg-orange-500',
  },
  transport: {
    label: 'Transport',
    chartColor: '#3b82f6',
    dotClass: 'bg-blue-500',
    Icon: Car,
    iconWrap: 'bg-blue-500',
  },
  daily: {
    label: 'Kundalik',
    chartColor: '#a855f7',
    dotClass: 'bg-purple-500',
    Icon: Home,
    iconWrap: 'bg-purple-500',
  },
  energy: {
    label: 'Ichimliklar',
    chartColor: '#14b8a6',
    dotClass: 'bg-teal-500',
    Icon: Zap,
    iconWrap: 'bg-teal-500',
  },
  custom: {
    label: 'Boshqa',
    chartColor: '#6b7280',
    dotClass: 'bg-gray-500',
    Icon: Plus,
    iconWrap: 'bg-gray-500',
  },
}

const USER_STYLES = [
  { chartColor: '#ec4899', iconWrap: 'bg-pink-600' },
  { chartColor: '#06b6d4', iconWrap: 'bg-cyan-600' },
  { chartColor: '#eab308', iconWrap: 'bg-yellow-600' },
  { chartColor: '#6366f1', iconWrap: 'bg-indigo-600' },
  { chartColor: '#f43f5e', iconWrap: 'bg-rose-600' },
]

function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/**
 * @param {Array<{ key: string, label: string }>} userCategories
 */
export function mergeCategoryOptions(userCategories = []) {
  const extras = userCategories.map((u) => {
    const st = USER_STYLES[hashStr(u.key) % USER_STYLES.length]
    return {
      key: u.key,
      label: u.label,
      Icon: Tag,
      iconWrap: st.iconWrap,
    }
  })
  return [...CATEGORY_OPTIONS, ...extras]
}

/**
 * @param {string} key
 * @param {Array<{ key: string, label: string }>} userCategories
 */
export function getCategoryMeta(key, userCategories = []) {
  if (STATIC_MAP[key]) return STATIC_MAP[key]
  const u = userCategories.find((c) => c.key === key)
  if (u) {
    const st = USER_STYLES[hashStr(u.key) % USER_STYLES.length]
    return {
      label: u.label,
      chartColor: st.chartColor,
      dotClass: st.iconWrap.replace('bg-', 'bg-'),
      Icon: Tag,
      iconWrap: st.iconWrap,
    }
  }
  return STATIC_MAP.custom
}
