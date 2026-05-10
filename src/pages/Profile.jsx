import { useState } from 'react'
import { User, Phone, Image as ImageIcon } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export function Profile() {
  const { user, authFetch, refreshMe } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '')
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Ism bo‘sh bo‘lishi mumkin emas' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const res = await authFetch('/user-data/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, phone, avatarUrl })
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data?.error || 'Xatolik yuz berdi' })
      } else {
        setMessage({ type: 'success', text: 'Profil saqlandi!' })
        await refreshMe() // Update the context user
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Tarmoq xatosi' })
    } finally {
      setLoading(false)
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Faqat rasm yuklash mumkin' })
      return
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Rasm hajmi 2MB dan oshmasligi kerak' })
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      setAvatarUrl(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Profil sozlamalari
        </h1>
        <p className="mt-1 text-sm text-muted">
          Shaxsiy ma'lumotlaringizni yangilang
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-subtle bg-elevated shadow-sm">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="h-full w-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <User className="h-10 w-10 text-muted" />
            )}
          </div>
          <div className="flex flex-col justify-center text-center sm:text-left">
            <h2 className="text-lg font-medium text-foreground">{user?.name}</h2>
            <p className="text-sm text-muted">{user?.email}</p>
            <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
              <label className="cursor-pointer rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-500 transition-colors hover:bg-emerald-500/20">
                Rasm yuklash
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              {avatarUrl && (
                <button type="button" onClick={() => setAvatarUrl('')} className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500/20">
                  O'chirish
                </button>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="name">
              Ism Familiya
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <User className="h-5 w-5" />
              </span>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ismingizni kiriting"
                className="w-full rounded-xl border border-border bg-input py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-faint focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="phone">
              Telefon raqam
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <Phone className="h-5 w-5" />
              </span>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full rounded-xl border border-border bg-input py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-faint focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="avatarUrl">
              Rasm havolasi (URL)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <ImageIcon className="h-5 w-5" />
              </span>
              <input
                id="avatarUrl"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/rasmim.jpg"
                className="w-full rounded-xl border border-border bg-input py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-faint focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-muted">
              Rasmning internetdagi manzilini (URL) kiriting
            </p>
          </div>

          <div className="mt-4 border-t border-border-subtle pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-400 disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
            {message.text && (
              <p className={`mt-3 text-sm ${message.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                {message.text}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
