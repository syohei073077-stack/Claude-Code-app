import { Bell, BellOff, X } from 'lucide-react'
import { useState } from 'react'

export default function NotificationBanner({ permission, onRequest }) {
  const [dismissed, setDismissed] = useState(false)

  if (permission === 'granted' || permission === 'denied' || dismissed) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 flex items-center gap-4">
      <Bell size={20} className="text-blue-500 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-blue-900">交換時期を通知で受け取る</p>
        <p className="text-xs text-blue-600">ストリングの張替え時期が近づいたらブラウザ通知でお知らせします</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={onRequest}
          className="text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl px-4 py-2 transition-colors"
        >
          許可する
        </button>
        <button onClick={() => setDismissed(true)} className="text-blue-400 hover:text-blue-600">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
