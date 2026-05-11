import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const COMMON_STRINGS = [
  'Yonex BG65', 'Yonex BG80', 'Yonex Aerobite', 'Yonex Nanogy 98',
  'Victor VS-850', 'Li-Ning No.1', 'Ashaway Zymax 66 Fire',
]

const DEFAULT_FORM = {
  name: '',
  racketType: '',
  stringType: '',
  stringDate: new Date().toISOString().slice(0, 10),
  tension: '',
  replacementDays: 90,
  memo: '',
}

export default function RacketForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ? {
    name: initial.name ?? '',
    racketType: initial.racketType ?? '',
    stringType: initial.stringType ?? '',
    stringDate: initial.stringDate ?? DEFAULT_FORM.stringDate,
    tension: initial.tension ?? '',
    replacementDays: initial.replacementDays ?? 90,
    memo: initial.memo ?? '',
  } : DEFAULT_FORM)

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave({
      ...form,
      tension: form.tension ? Number(form.tension) : null,
      replacementDays: form.replacementDays ? Number(form.replacementDays) : null,
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
          <Field label="ラケット名 *" required>
            <input
              type="text"
              required
              placeholder="例: Yonex Astrox 99"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="input"
            />
          </Field>

          <Field label="ラケットの種類">
            <input
              type="text"
              placeholder="例: 攻撃型 / オールラウンド"
              value={form.racketType}
              onChange={e => set('racketType', e.target.value)}
              className="input"
            />
          </Field>

          <Field label="ストリングの種類">
            <input
              type="text"
              list="string-list"
              placeholder="例: Yonex BG65"
              value={form.stringType}
              onChange={e => set('stringType', e.target.value)}
              className="input"
            />
            <datalist id="string-list">
              {COMMON_STRINGS.map(s => <option key={s} value={s} />)}
            </datalist>
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

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}
