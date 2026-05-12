import { useState } from 'react'
import { X } from 'lucide-react'

const RACKET_BRANDS = [
  'Yonex', 'ミズノ', 'ゴーセン', 'Victor', 'Li-Ning',
  'アパックス', 'バボラ', 'Forza', 'Kumpoo', 'その他',
]

const RACKET_MODELS = {
  'Yonex': [
    'アストロクス88D PRO',
    'アストロクス88S PRO',
    'アストロクス99 PRO',
    'アストロクス99 GAME',
    'アストロクス77 PRO',
    'アストロクス77 GAME',
    'アストロクス55',
    'アストロクス22 PRO',
    'アストロクス22',
    'ナノフレア1000Z',
    'ナノフレア1000ゲーム',
    'ナノフレア800PRO',
    'ナノフレア800',
    'ナノフレア800ゲーム',
    'ナノフレア700',
    'ナノフレア600',
    'ナノフレア370スピード',
    'アークセイバー11PRO',
    'アークセイバー7PRO',
    'デュオラ10',
    'その他',
  ],
  'ミズノ': [
    'フォルティウス80',
    'フォルティウス70',
    'フォルティウス60',
    'アルティウス01スピード',
    'アルティウス01フィール',
    'その他',
  ],
  'ゴーセン': [
    'カルフォルニア CX S',
    'カルフォルニア CX F',
    'カルフォルニア CX P',
    'その他',
  ],
  'Victor': [
    'ブレイドX',
    'スペクトラ10Q',
    'スペクトラ9X',
    'ハイパーナノX900',
    'ハイパーナノX800',
    'スレッシャー',
    'その他',
  ],
  'Li-Ning': [
    'TB ナノ',
    'ハーモニカ',
    'バウンド',
    'その他',
  ],
  'アパックス': [
    'アパックス スーパーシリーズ',
    'その他',
  ],
  'バボラ': [
    'サトリ ライト',
    'サトリ エクスセル',
    'その他',
  ],
  'Forza': [
    'パワーブレード 1000',
    'パワーブレード 900',
    'その他',
  ],
  'Kumpoo': [
    'K520',
    'K530',
    'その他',
  ],
}

const STRING_TYPES = [
  // Yonex
  'ヨネックス BG65',
  'ヨネックス BG65チタン',
  'ヨネックス BG66',
  'ヨネックス BG66フォース',
  'ヨネックス BG66アルティマックス',
  'ヨネックス BG80',
  'ヨネックス BG80パワー',
  'ヨネックス エアロバイト',
  'ヨネックス エアロバイトブースト',
  'ヨネックス ナノジー95',
  'ヨネックス ナノジー98',
  'ヨネックス ナノジー99',
  'ヨネックス ナノジー99アセス',
  'ヨネックス エクスボルト63',
  'ヨネックス エクスボルト65',
  'ヨネックス エクスボルト66',
  // Victor
  'ビクター VBS-66ナノ',
  'ビクター VBS-70',
  'ビクター VS-850',
  // Gosen
  'ゴーセン エッグパワー61',
  'ゴーセン エッグパワー63',
  'ゴーセン BM',
  // Li-Ning
  'リーニン ナンバー1',
  'リーニン ナンバー5',
  // Ashaway
  'アシュアウェイ ジーマックス66ファイア',
  'アシュアウェイ ジーマックス68TX',
  // その他
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

function initSelect(value, options) {
  if (!value) return { select: '', custom: '' }
  if (options.includes(value)) return { select: value, custom: '' }
  return { select: 'その他', custom: value }
}

const DEFAULT_FORM = {
  brand: '',
  stringDate: new Date().toISOString().slice(0, 10),
  tension: '',
  replacementDays: 90,
  weeklyFreq: 2,
  memo: '',
}

export default function RacketForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ? {
    brand: initial.brand ?? '',
    stringDate: initial.stringDate ?? DEFAULT_FORM.stringDate,
    tension: initial.tension ?? '',
    replacementDays: initial.replacementDays ?? 90,
    weeklyFreq: initial.weeklyFreq ?? 2,
    memo: initial.memo ?? '',
  } : DEFAULT_FORM)

  const modelOptions = RACKET_MODELS[form.brand] ?? []

  const [racketName, setRacketName] = useState(() =>
    initSelect(initial?.name ?? '', RACKET_MODELS[initial?.brand ?? ''] ?? [])
  )
  const [stringType, setStringType] = useState(() =>
    initSelect(initial?.stringType ?? '', STRING_TYPES)
  )

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleBrandChange(brand) {
    set('brand', brand)
    setRacketName({ select: '', custom: '' })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const resolvedName = racketName.select === 'その他' ? racketName.custom : racketName.select
    const resolvedString = stringType.select === 'その他' ? stringType.custom : stringType.select
    if (!resolvedName.trim()) return
    onSave({
      ...form,
      name: resolvedName,
      stringType: resolvedString,
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
              onChange={e => handleBrandChange(e.target.value)}
              className="input"
            >
              <option value="">選択してください</option>
              {RACKET_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>

          <Field label="ラケット名 *">
            {modelOptions.length > 0 ? (
              <>
                <select
                  value={racketName.select}
                  onChange={e => setRacketName({ select: e.target.value, custom: '' })}
                  className="input"
                  required={racketName.select !== 'その他'}
                >
                  <option value="">選択してください</option>
                  {modelOptions.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                {racketName.select === 'その他' && (
                  <input
                    type="text"
                    required
                    placeholder="モデル名を入力"
                    value={racketName.custom}
                    onChange={e => setRacketName(prev => ({ ...prev, custom: e.target.value }))}
                    className="input mt-2"
                  />
                )}
              </>
            ) : (
              <input
                type="text"
                required
                placeholder="例: アストロクス99"
                value={racketName.select === 'その他' ? racketName.custom : racketName.select}
                onChange={e => setRacketName({ select: 'その他', custom: e.target.value })}
                className="input"
              />
            )}
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
