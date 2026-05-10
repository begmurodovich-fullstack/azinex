import { Send } from 'lucide-react'

/**
 * Telegram: @azinex_bot — havola .env yoki quyidagi standart.
 */
const DEFAULT_TG = 'https://t.me/azinex_bot'

export function TelegramFab() {
  const href = import.meta.env.VITE_TELEGRAM_BOT_URL || DEFAULT_TG

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="Telegram: @azinex_bot"
      aria-label="Telegram bot — Azinex"
      className="fixed z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#229ED9] text-white shadow-xl shadow-black/35 ring-2 ring-white/25 transition hover:scale-105 hover:bg-[#1f8bc7] hover:ring-emerald-400/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 dark:shadow-black/45 dark:ring-white/30 max-[480px]:bottom-[max(1rem,env(safe-area-inset-bottom,0px))] max-[480px]:right-[max(0.75rem,env(safe-area-inset-right,0px))] bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] sm:bottom-6 sm:right-6"
    >
      <Send className="h-7 w-7" strokeWidth={2.25} aria-hidden />
    </a>
  )
}
