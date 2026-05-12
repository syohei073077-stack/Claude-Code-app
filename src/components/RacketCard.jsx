import { format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { calcCurrentTension, getTensionBreakdown, getDaysStatus, getStatusLevel } from '../utils/tension'

const STATUS_STYLES = {
  overdue: { bar: 'bg-red-500', badge: 'bg-red-100 text-red-700 border-red-200', label: '交換超過', card: 'border-red-300' },
  soon:    { bar: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700 border-orange-200', label: 'まもなく交換', card: 'border-orange-300' },
  warning: { bar: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: '交換近し', card: 'border-yellow-300' },
  good:    { bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: '良好', card: 'border-gray-200' },
  unknown: { bar: 'bg-gray-300', badge: 'bg-gray-100 text-gray-600 border-gray-200', label: '未設定', card: 'border-gray-200' },
}

export default function RacketCard({ racket, onEdit, onDelete, weather }) {
  const [showDetail, setShowDetail] = useState(false)

  const temp = weather?.temperature ?? null
  const humid = weather?.humidity ?? null

  const freq = racket.weeklyFrequency ?? 0
  const currentTension = calcCurrentTension(racket.tension, racket.stringDate, temp, humid, freq)
  const breakdown = getTensionBreakdown(racket.tension, racket.stringDate, temp, humid, freq)
  const status = getDaysStatus(racket.stringDate, racket.replacementDays)
  const level = getStatusLevel(status?.remaining ?? null)
  const style = STATUS_STYLES[level]
  const progress = status && racket.replacementDays
    ? Math.min((status.elapsed / racket.replacementDays) * 100, 100)
    : 0

  const tensionLoss = racket.tension && currentTension
    ? Math.round((racket.tension - currentTension) * 10) / 10
    : null

  return (
    <div className={`bg-white rounded-2xl border-2 ${style.card} shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 truncate">{racket.name}</h2>
          <p className="text-sm text-gray-500 truncate">{racket.stringType || '—'}</p>
        </div>
        <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full border ${style.badge}`}>
          {style.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <InfoItem label="張り日" value={racket.stringDate ? format(parseISO(racket.stringDate), 'yyyy/MM/dd', { locale: ja }) : '—'} />
        <InfoItem label="初期テンション" value={racket.tension ? `${racket.tension} lbs` : '—'} />
        <InfoItem
          label="現在のテンション"
          value={currentTension ? `${currentTension} lbs` : '—'}
          sub={tensionLoss ? `−${tensionLoss} lbs` : null}
          highlight
        />
        <InfoItem
          label="残日数"
          value={status ? (status.remaining <= 0 ? `${Math.abs(status.remaining)}日超過` : `あと ${status.remaining}日`) : '—'}
          warn={level === 'overdue' || level === 'soon'}
        />
      </div>

      {racket.replacementDays && (
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{status?.elapsed ?? 0}日経過</span>
            <span>{racket.replacementDays}日</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${style.bar}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Okinawa weather & tension breakdown */}
      {breakdown && (
        <div>
          <button
            onClick={() => setShowDetail(v => !v)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showDetail ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            沖縄気象による補正内訳
          </button>
          {showDetail && (
            <div className="mt-2 bg-sky-50 rounded-xl px-4 py-3 text-xs text-gray-600 flex flex-col gap-1.5">
              <WeatherRow
                icon="🌡️"
                label={`現在の気温 (沖縄)`}
                value={temp !== null ? `${temp}°C` : '—'}
              />
              <WeatherRow
                icon="💧"
                label={`現在の湿度 (沖縄)`}
                value={humid !== null ? `${humid}%` : '—'}
              />
              <div className="border-t border-sky-200 my-1" />
              <WeatherRow
                icon="📅"
                label={`張り日からの平均気温`}
                value={`${breakdown.avgTemp}°C`}
              />
              <WeatherRow
                icon="🌊"
                label={`張り日からの平均湿度`}
                value={`${breakdown.avgHumid}%`}
              />
              <div className="border-t border-sky-200 my-1" />
              <WeatherRow
                icon="🔥"
                label="気温によるテンション低下"
                value={`${breakdown.tempLoss} lbs`}
                warn
              />
              <WeatherRow
                icon="💦"
                label="湿度によるテンション低下"
                value={`${breakdown.humidLoss} lbs`}
                warn
              />
              {breakdown.sessions > 0 && (
                <WeatherRow
                  icon="🏸"
                  label={`使用による低下 (推定${breakdown.sessions}回)`}
                  value={`${breakdown.usageLoss} lbs`}
                  warn
                />
              )}
            </div>
          )}
        </div>
      )}

      {racket.memo && (
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">{racket.memo}</p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onEdit(racket)}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm text-blue-600 border border-blue-200 rounded-xl py-2 hover:bg-blue-50 transition-colors"
        >
          <Pencil size={14} /> 編集
        </button>
        <button
          onClick={() => onDelete(racket.id)}
          className="flex items-center justify-center gap-1.5 text-sm text-red-500 border border-red-200 rounded-xl px-3 py-2 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

function InfoItem({ label, value, highlight, warn, sub }) {
  return (
    <div className="bg-gray-50 rounded-xl px-3 py-2">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={`font-semibold ${highlight ? 'text-blue-600' : warn ? 'text-red-600' : 'text-gray-800'}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-red-400">{sub}</p>}
    </div>
  )
}

function WeatherRow({ icon, label, value, warn }) {
  return (
    <div className="flex justify-between items-center">
      <span className="flex items-center gap-1.5 text-gray-500">{icon} {label}</span>
      <span className={`font-medium ${warn ? 'text-red-500' : 'text-sky-700'}`}>{value}</span>
    </div>
  )
}
