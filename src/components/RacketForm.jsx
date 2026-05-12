import { useState } from 'react'
import { X } from 'lucide-react'

const RACKET_BRANDS = [
  'Yonex', 'Victor', 'Li-Ning', 'Babolat', 'Carlton', 'Ashaway', 'Forza', 'その他',
]

const RACKET_TYPES = [
  '攻撃型', 'オールラウンド型', '守備型', 'コントロール型',
]

const STRING_TYPES = [
  'Yonex BG65', 'Yonex BG65Ti', 'Yonex BG80', 'Yonex BG80 Power',
  'Yonex Aerobite', 'Yonex Aerobite Boost',
  'Yonex Nanogy 95', 'Yonex Nanogy 98', 'Yonex Nanogy 99',
  'Victor VS-850', 'Victor VBS-66N', 'Victor VBS-70',
  'Li-Ning No.1', 'Li-Ning No.5',
  'Ashaway Zymax 66 Fire', 'Ashaway Zymax 68 TX',
  'その他',
]

const WEEKLY_FREQ_OPTIONS = [
  { value: 1, label: '週1回' },
  { value: 2, label: '週2回' },
  { value: 3, label: '週3回' },
  { value: 4, label: '週4回' },
  { value: 5, label: '週5回' },
  { value: 6, label: '週6回以上' },
]

function initStringType(value) {
  if (!value) return { select: '', custom: '' }
  if (STRING_TYPES.includes(value)) return { select: value, custom: '' }
  return { select: 'その他', custom: value }
}

const DEFAULT_FORM = {
  brand: '',
  name: '',
  racketType: '',
  stringDate: new Date().toISOString().slice(0, 10),
  tension: '',
  replacementDays: 90,
  weeklyFreq: 2,
  memo: '',
}

export default function RacketForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ? {
    brand: initial.brand ?? '',
    name: initial.name ?? '',
    racketType: initial.racketType ?? '',
    stringDate: initial.stringDate ?? DEFAULT_FORM.stringDate,
    tension: initial.tension ?? '',
    replacementDays: initial.replacementDays ?? 90,
    weeklyFreq: initial.weeklyFreq ?? 2,
    memo: initial.memo ?? '',
  } : DEFAULT_FORM)

  const [stringType, setStringType] = useState(() => initStringType(initial?.stringType ?? ''))

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    const resolvedStringType = stringType.select === 'その他'
      ? stringType.custom
      : stringType.select
    onSave({
      ...form,
      stringType: resolvedStringType,
      tension: form.tension ? Number(form.tension) : null,
      replacementDays: form.replacementDays ? Number(form.replacementDays) : null,
      weeklyFreq: Number(form.weeklyFreq),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {initial ? 'ラケット情報を編集' : 'ラケットを追加'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <Field label="ブランド">
            <select
              value={form.brand}
              onChange={e => set('brand', e.target.value)}
              className="input"
            >
              <option value="">選択してください</option>
              {RACKET_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>

          <Field label="ラケット名 *">
            <input
              type="text"
              required
              placeholder="例: Astrox 99"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="input"
            />
          </Field>

          <Field label="ラケットの種類">
            <select
              value={form.racketType}
              onChange={e => set('racketType', e.target.value)}
              className="input"
            >
              <option value="">選択してください</option>
              {RACKET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>

          <Field label="ストリングの種類">
            <select
              value={stringType.select}
              onChange={e => setStringType({ select: e.target.value, custom: '' })}
              className="input"
            >
              <option value="">選択してください</option>
              {STRING_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {stringType.select === 'その他' && (
              <input
                type="text"
                placeholder="ストリング名を入力"
                value={stringType.custom}
                onChange={e => setStringType(prev => ({ ...prev, custom: e.target.value }))}
                className="input mt-2"
              />
            )}
          </Field>

          <Field label="張った日にち">
            <input
              type="date"
              value={form.stringDate}
              onChange={e => set('stringDate', e.target.value)}
              className="input"
            />
          </Field>

          <Field label="テンション (lbs)">
            <input
              type="number"
              min="10"
              max="40"
              step="0.5"
              placeholder="例: 24"
              value={form.tension}
              onChange={e => set('tension', e.target.value)}
              className="input"
            />
          </Field>

          <Field label="バドミントンの頻度">
            <select
              value={form.weeklyFreq}
              onChange={e => set('weeklyFreq', e.target.value)}
              className="input"
            >
              {WEEKLY_FREQ_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>

          <Field label="張替え目安 (日)">
            <input
              type="number"
              min="1"
              max="365"
              placeholder="例: 90"
              value={form.replacementDays}
              onChange={e => set('replacementDays', e.target.value)}
              className="input"
            />
            <p className="text-xs text-gray-400 mt-1">※ 一般的な目安: 週1回プレー→ 90日、週3回→ 60日</p>
          </Field>

          <Field label="メモ">
            <textarea
              placeholder="張り方のメモ、ショップ名など"
              value={form.memo}
              onChange={e => set('memo', e.target.value)}
              rows={2}
              className="input resize-none"
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 btn-secondary">
              キャンセル
            </button>
            <button type="submit" className="flex-1 btn-primary">
              {initial ? '更新する' : '追加する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}
