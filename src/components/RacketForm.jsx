import { useState } from 'react'
import { X } from 'lucide-react'

// ---- ブランド ----
const RACKET_BRANDS = [
  'YONEX', 'ミズノ', 'ゴーセン', 'Victor', 'Li-Ning',
  'アパックス', 'バボラ', 'FORZA', 'Kumpoo', 'その他',
]

// ---- ラケットモデル（シリーズ別グループ） ----
const RACKET_MODEL_GROUPS = {
  'YONEX': [
    {
      group: 'アストロクス',
      models: [
        'アストロクス88D PRO', 'アストロクス88D TOUR', 'アストロクス88D GAME', 'アストロクス88D PLAY',
        'アストロクス88S PRO', 'アストロクス88S TOUR', 'アストロクス88S GAME', 'アストロクス88S PLAY',
        'アストロクス99 PRO', 'アストロクス99 TOUR', 'アストロクス99 GAME', 'アストロクス99 PLAY',
        'アストロクス77 PRO', 'アストロクス77 TOUR', 'アストロクス77 GAME', 'アストロクス77 PLAY',
        'アストロクス55',
        'アストロクス38D', 'アストロクス38S',
        'アストロクス22 PRO', 'アストロクス22 TOUR', 'アストロクス22 GAME', 'アストロクス22 PLAY',
        'アストロクス7DG', 'アストロクス1DG',
      ],
    },
    {
      group: 'アークセイバー',
      models: [
        'アークセイバー11 PRO', 'アークセイバー11 TOUR', 'アークセイバー11 GAME', 'アークセイバー11 PLAY',
        'アークセイバー7 PRO', 'アークセイバー7 TOUR', 'アークセイバー7 GAME', 'アークセイバー7 PLAY',
      ],
    },
    {
      group: 'ナノフレア',
      models: [
        'ナノフレア1000Z',
        'ナノフレア1000 GAME',
        'ナノフレア800 PRO', 'ナノフレア800 TOUR', 'ナノフレア800 GAME', 'ナノフレア800 PLAY',
        'ナノフレア700',
        'ナノフレア600',
        'ナノフレア370スピード',
        'ナノフレア270スピード',
      ],
    },
    {
      group: 'デュオラ',
      models: [
        'デュオラ10 LT', 'デュオラZストライク',
      ],
    },
    {
      group: 'その他',
      models: ['その他'],
    },
  ],
  'ミズノ': [
    {
      group: 'フォルティウス',
      models: [
        'フォルティウス80', 'フォルティウス70', 'フォルティウス60',
        'フォルティウス70ストライク', 'フォルティウス60パワー',
      ],
    },
    {
      group: 'アルティウス',
      models: [
        'アルティウス01スピード', 'アルティウス01フィール',
        'アルティウス01コンビ',
      ],
    },
    {
      group: 'その他',
      models: ['その他'],
    },
  ],
  'ゴーセン': [
    {
      group: 'カルフォルニア',
      models: [
        'カルフォルニア CX S', 'カルフォルニア CX F', 'カルフォルニア CX P',
      ],
    },
    {
      group: 'その他',
      models: ['その他'],
    },
  ],
  'Victor': [
    {
      group: 'BLADE X',
      models: [
        'BLADE X', 'BLADE X FlexR',
      ],
    },
    {
      group: 'HYPERNANO X',
      models: [
        'HYPERNANO X 900 TOUR', 'HYPERNANO X 900', 'HYPERNANO X 800',
      ],
    },
    {
      group: 'THRUSTER',
      models: [
        'THRUSTER RYUGA II PRO', 'THRUSTER K 12', 'THRUSTER K 12M',
      ],
    },
    {
      group: 'JETSPEED',
      models: [
        'JETSPEED S 12 II', 'JETSPEED S 12',
      ],
    },
    {
      group: 'AURASPEED',
      models: [
        'AURASPEED 100X', 'AURASPEED 90K',
      ],
    },
    {
      group: 'その他',
      models: ['その他'],
    },
  ],
  'Li-Ning': [
    {
      group: 'TB NANO',
      models: ['TB NANO', 'TB NANO 2', 'TB NANO LIGHT'],
    },
    {
      group: 'AERONAUT',
      models: ['AERONAUT 9000D', 'AERONAUT 9000C', 'AERONAUT 7000'],
    },
    {
      group: 'その他',
      models: ['その他'],
    },
  ],
}

// ---- ストリング（ブランド別グループ） ----
const STRING_TYPE_GROUPS = [
  {
    group: 'YONEX',
    strings: [
      'ナノジー99エース',
      'ナノジー99',
      'ナノジー98',
      'ナノジー95',
      'エクスボルト66',
      'エクスボルト65',
      'エクスボルト63',
      'エアロバイトブースト',
      'エアロバイト',
      'BG80パワー',
      'BG80',
      'BG66アルティマックス',
      'BG66フォース',
      'BG66',
      'BG65チタン',
      'BG65',
    ],
  },
  {
    group: 'Victor',
    strings: [
      'VBS-66ナノ',
      'VBS-70',
      'VS-850',
    ],
  },
  {
    group: 'ゴーセン',
    strings: [
      'エッグパワー63',
      'エッグパワー61',
      'BM6500',
    ],
  },
  {
    group: 'Li-Ning',
    strings: [
      'ナンバー1',
      'ナンバー5',
    ],
  },
  {
    group: 'アシュアウェイ',
    strings: [
      'ジーマックス66ファイア',
      'ジーマックス68TX',
    ],
  },
  {
    group: 'その他',
    strings: ['その他'],
  },
]

const ALL_MODELS = Object.values(RACKET_MODEL_GROUPS).flatMap(g => g.flatMap(s => s.models))
const ALL_STRINGS = STRING_TYPE_GROUPS.flatMap(g => g.strings)

const WEEKLY_FREQ_OPTIONS = [
  { value: 1, label: '週1回' },
  { value: 2, label: '週2回' },
  { value: 3, label: '週3回' },
  { value: 4, label: '週4回' },
  { value: 5, label: '週5回' },
  { value: 6, label: '週6回以上' },
]

function initSelect(value, allOptions) {
  if (!value) return { select: '', custom: '' }
  if (allOptions.includes(value)) return { select: value, custom: '' }
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

  const [racketName, setRacketName] = useState(() =>
    initSelect(initial?.name ?? '', ALL_MODELS)
  )
  const [stringType, setStringType] = useState(() =>
    initSelect(initial?.stringType ?? '', ALL_STRINGS)
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

  const modelGroups = RACKET_MODEL_GROUPS[form.brand] ?? null

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
            {modelGroups ? (
              <>
                <select
                  value={racketName.select}
                  onChange={e => setRacketName({ select: e.target.value, custom: '' })}
                  className="input"
                >
                  <option value="">選択してください</option>
                  {modelGroups.map(({ group, models }) => (
                    <optgroup key={group} label={group}>
                      {models.map(m => <option key={m} value={m}>{m}</option>)}
                    </optgroup>
                  ))}
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
                placeholder="例: アストロクス99 PRO"
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
              {STRING_TYPE_GROUPS.map(({ group, strings }) => (
                <optgroup key={group} label={group}>
                  {strings.map(s => <option key={s} value={s}>{s}</option>)}
                </optgroup>
              ))}
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
