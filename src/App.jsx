import { useState } from 'react'
import { differenceInDays, parseISO } from 'date-fns'
import { Plus, Bell, BellOff, Thermometer, Droplets, RefreshCw, HelpCircle } from 'lucide-react'
import { useRackets } from './hooks/useRackets'
import { useNotifications } from './hooks/useNotifications'
import { useOkinawaWeather } from './hooks/useOkinawaWeather'
import RacketCard from './components/RacketCard'
import RacketForm from './components/RacketForm'
import NotificationBanner from './components/NotificationBanner'
import HelpModal from './components/HelpModal'

export default function App() {
  const { rackets, addRacket, updateRacket, deleteRacket } = useRackets()
  const { permission, requestPermission, checkAndNotify } = useNotifications(rackets)
  const { weather, loading: weatherLoading, error: weatherError, updatedAt, refetch } = useOkinawaWeather()
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [showHelp, setShowHelp] = useState(false)

  function handleSave(data) {
    if (editTarget) {
      updateRacket(editTarget.id, data)
    } else {
      addRacket(data)
    }
    setShowForm(false)
    setEditTarget(null)
  }

  function handleEdit(racket) {
    setEditTarget(racket)
    setShowForm(true)
  }

  function handleDelete(id) {
    if (window.confirm('このラケットを削除しますか？')) {
      deleteRacket(id)
    }
  }

  function handleCancel() {
    setShowForm(false)
    setEditTarget(null)
  }

  const overdueCount = rackets.filter(r => {
    if (!r.stringDate || !r.replacementDays) return false
    return differenceInDays(new Date(), parseISO(r.stringDate)) >= r.replacementDays
  }).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-1 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-2xl shrink-0">🏸</span>
              <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">ストリング管理</h1>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setShowHelp(true)}
                title="計算モデルについて"
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <HelpCircle size={18} />
              </button>
              {permission === 'granted' && (
                <button
                  onClick={checkAndNotify}
                  title="通知を今すぐチェック"
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Bell size={18} />
                </button>
              )}
              {permission === 'denied' && (
                <span title="通知がブロックされています" className="p-1.5 text-gray-400">
                  <BellOff size={18} />
                </span>
              )}
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
              >
                <Plus size={16} /> ラケット追加
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 ml-9">バドミントンストリングのテンション・交換時期を管理</p>
        </header>

        {/* Okinawa weather strip */}
        <WeatherStrip weather={weather} loading={weatherLoading} error={weatherError} updatedAt={updatedAt} onRefresh={refetch} />

        <div className="mb-6 mt-4">
          <NotificationBanner permission={permission} onRequest={requestPermission} />
        </div>

        {rackets.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <StatCard label="ラケット数" value={rackets.length} />
            <StatCard label="交換超過" value={overdueCount} warn={overdueCount > 0} />
            <StatCard label="通知" value={permission === 'granted' ? 'ON' : 'OFF'} />
          </div>
        )}

        {rackets.length === 0 ? (
          <EmptyState onAdd={() => setShowForm(true)} />
        ) : (
          <div className="flex flex-col gap-4">
            {rackets.map(racket => (
              <RacketCard
                key={racket.id}
                racket={racket}
                weather={weather}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <RacketForm
          initial={editTarget}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  )
}

function WeatherStrip({ weather, loading, error, updatedAt, onRefresh }) {
  const timeStr = updatedAt
    ? updatedAt.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl px-5 py-3 flex items-center justify-between text-white shadow-sm gap-2">
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-xs font-medium text-sky-200 whitespace-nowrap">🌺 沖縄 現在の気象</span>
        {loading ? (
          <span className="text-sm text-sky-100">取得中...</span>
        ) : weather ? (
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Thermometer size={15} className="text-sky-200" />
              <span className="font-bold text-xl">{weather.temperature}°C</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Droplets size={15} className="text-sky-200" />
              <span className="font-bold text-xl">{weather.humidity}%</span>
            </span>
          </div>
        ) : (
          <span className="text-sm text-sky-200">{error ? '取得失敗（月平均値を使用中）' : '—'}</span>
        )}
      </div>
      <div className="flex items-center gap-2 text-sky-200 text-xs shrink-0">
        {timeStr && <span className="whitespace-nowrap">更新: {timeStr}</span>}
        <button onClick={onRefresh} className="hover:text-white transition-colors" title="更新">
          <RefreshCw size={14} />
        </button>
      </div>
    </div>
  )
}

function StatCard({ label, value, warn }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 text-center">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-xl font-bold ${warn ? 'text-red-500' : 'text-gray-800'}`}>{value}</p>
    </div>
  )
}

function EmptyState({ onAdd }) {
  return (
    <div className="text-center py-16 flex flex-col items-center gap-4">
      <span className="text-6xl">🏸</span>
      <div>
        <p className="text-lg font-medium text-gray-700">ラケットがまだありません</p>
        <p className="text-sm text-gray-400 mt-1">最初のラケットを追加してストリング管理を始めましょう</p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
      >
        <Plus size={18} /> ラケットを追加する
      </button>
    </div>
  )
}
