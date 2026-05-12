import { useState } from 'react'
import { X } from 'lucide-react'

// ---- ブランド（公式表記・指定順） ----
const RACKET_BRANDS = [
  'YONEX', 'MIZUNO', 'APACS', 'LI-NING', 'VICTOR', 'GOSEN', 'Kumpoo', 'Babolat', 'FZ FORZA', 'その他',
]

// ---- ラケットモデル（シリーズ別・新しい順） ----
const RACKET_MODEL_GROUPS = {
  'YONEX': [
    {
      group: 'アストロクス',
      models: [
        'アストロクス100ZZ',
        'アストロクス100TOUR',
        'アストロクス100GAME',
        'アストロクス99 PRO',
        'アストロクス99 TOUR',
        'アストロクス99 GAME',
        'アストロクス88D PRO',
        'アストロクス88D TOUR',
        'アストロクス88D GAME',
        'アストロクス88S PRO',
        'アストロクス88S TOUR',
        'アストロクス88S GAME',
        'アストロクス77 PRO',
        'アストロクス77 TOUR',
        'アストロクス77 GAME',
        'アストロクス22 PRO',
        'アストロクス22 GAME',
        'アストロクス7DG',
        'アストロクス Nextage',
      ],
    },
    {
      group: 'ナノフレア',
      models: [
        'ナノフレア1000Z',
        'ナノフレア1000 TOUR',
        'ナノフレア1000 GAME',
        'ナノフレア800 PRO',
        'ナノフレア800 GAME',
        'ナノフレア700 PRO',
        'ナノフレア700 TOUR',
        'ナノフレア700 GAME',
        'ナノフレア600',
        'ナノフレア380',
        'ナノフレア370スピード',
        'ナノフレア300',
        'ナノフレア200',
      ],
    },
    {
      group: 'アークセイバー',
      models: [
        'アークセイバー11 PRO',
        'アークセイバー11 TOUR',
        'アークセイバー7 PRO',
        'アークセイバー7 TOUR',
        'アークセイバー3',
        'アークセイバー1',
      ],
    },
    {
      group: 'マッスルパワー',
      models: [
        'マッスルパワー6 LONG',
        'マッスルパワー3',
        'マッスルパワー2',
        'マッスルパワー1',
      ],
    },
    { group: 'その他', models: ['その他'] },
  ],

  'MIZUNO': [
    {
      group: 'アクロフォース',
      models: [
        'アクロフォース 100',
        'アクロフォース 200',
        'アクロフォース 300',
        'アクロフォース 600',
      ],
    },
    {
      group: 'アクロスピード',
      models: [
        'アクロスピード 1 アクセル',
        'アクロスピード 1 ドライブ',
        'アクロスピード 1 フォーカス',
        'アクロスピード 3',
        'アクロスピード 7',
        'アクロスピード 8',
      ],
    },
    {
      group: 'アルティウス',
      models: [
        'アルティウス 01 フィール',
        'アルティウス 01 スピード',
        'アルティウス 02 ソレア',
        'アルティウス 03 フィール',
        'アルティウス J1 フォワード',
        'アルティウス ソニック',
      ],
    },
    {
      group: 'フォルティウス',
      models: [
        'フォルティウス 11 クイック',
        'フォルティウス 11 パワー',
        'フォルティウス 20',
        'フォルティウス 60',
      ],
    },
    { group: 'その他', models: ['その他'] },
  ],

  'APACS': [
    {
      group: 'Woven',
      models: [
        'Woven Aggressive',
        'Woven Power',
        'Woven Accurate',
        'Woven Control',
        'Woven Speed',
        'Woven Gold',
        'Woven Ruby',
      ],
    },
    {
      group: 'Nano Fusion Speed',
      models: [
        'Nano Fusion Speed 722',
        'Nano Fusion Speed XR',
      ],
    },
    {
      group: 'Duplex Power',
      models: [
        'Duplex Power 55',
        'Duplex Power 63',
        'Duplex Power 68',
        'Duplex Power 72',
        'Duplex Power 78',
      ],
    },
    {
      group: 'Feather Weight',
      models: [
        'Feather Weight 55',
        'Feather Weight 65',
        'Feather Weight 75',
        'Feather Weight 500',
        'Feather Weight X II',
        'Feather Weight X Special',
      ],
    },
    {
      group: 'Z-Ziggler',
      models: [
        'Z-Ziggler',
        'Z-Ziggler 72',
        'Z-Ziggler Lite',
        'Z-Ziggler Limited',
        'Z-Ziggler Force II',
        'Ziggler LHI Pro III',
      ],
    },
    {
      group: 'Stardom',
      models: [
        'Stardom 202',
        'Stardom 90',
        'Stardom 800',
        'Stardom Fierce',
        'Stardom Force',
        'Stardom Pro III',
      ],
    },
    {
      group: 'Virtuoso',
      models: [
        'Virtuoso Light',
        'Virtuoso 10',
        'Virtuoso 20',
        'Virtuoso 30',
        'Virtuoso 50',
        'Virtuoso 68',
        'Virtuoso 80',
        'Virtuoso 90',
        'Virtuoso Pro III',
      ],
    },
    {
      group: 'Lethal',
      models: [
        'Lethal 6',
        'Lethal 8',
        'Lethal 9',
        'Lethal 10',
        'Lethal 28',
        'Lethal Light Special',
        'Lethal Light Power',
      ],
    },
    {
      group: 'Commander',
      models: [
        'Commander 10',
        'Commander 20',
        'Commander 30',
        'Commander 50',
        'Commander 60',
        'Commander 80',
        'Pro Commander',
      ],
    },
    {
      group: 'Slayer',
      models: [
        'Slayer 95 III',
        'Slayer 95 II',
        'Slayer 99',
      ],
    },
    {
      group: 'Tantrum',
      models: [
        'Tantrum 500 III',
        'Tantrum 200 III',
        'Tantrum Light',
      ],
    },
    {
      group: 'Nano',
      models: [
        'Nano 9900',
        'Nano Tube 9990',
        'Nano Power 900',
      ],
    },
    { group: 'その他', models: ['その他'] },
  ],

  'LI-NING': [
    {
      group: 'AXFORCE（雷霆）',
      models: [
        'AXFORCE 100',
        'AXFORCE 90 NEW',
        'AXFORCE 80',
        'AXFORCE 70',
        'AXFORCE 60',
        'AXFORCE BIGBANG NEW',
      ],
    },
    {
      group: 'BLADEX',
      models: [
        'BLADEX 900 SUN MAX',
        'BLADEX 900 MOON MAX',
        'BLADEX 700',
        'BLADEX 73L',
      ],
    },
    {
      group: 'WINDSTORM',
      models: [
        'WINDSTORM 79H',
        'WINDSTORM 74',
        'WINDSTORM 72S',
        'WINDSTORM 72',
      ],
    },
    {
      group: 'HALBERTEC',
      models: [
        'HALBERTEC 9000',
        'HALBERTEC 9000 POWER',
        'HALBERTEC 8000',
        'HALBERTEC 7000',
      ],
    },
    {
      group: 'AERONAUT',
      models: ['AERONAUT 9000C'],
    },
    { group: 'その他', models: ['その他'] },
  ],

  'VICTOR': [
    {
      group: 'AURASPEED（オーラスピード）',
      models: [
        'AURASPEED FANTÔME',
        'AURASPEED HS PLUS',
        'AURASPEED 100X H',
        'AURASPEED 90K',
        'AURASPEED 90K Metallic',
        'AURASPEED 90S',
        'AURASPEED Panther',
        'AURASPEED Light Fighter 80 A',
        'AURASPEED Light Fighter 40 D',
        'AURASPEED 33H',
      ],
    },
    {
      group: 'THRUSTER K（スラスターK）',
      models: [
        'THRUSTER K RYUGA II PRO',
        'THRUSTER K RYUGA Metallic',
        'THRUSTER K F CLAW ULTRA X',
        'THRUSTER K F',
        'THRUSTER K 15 Light',
        'THRUSTER K 7U',
        'THRUSTER Light Fighter 30 F',
      ],
    },
    {
      group: 'DRIVE X（ドライブX）',
      models: [
        'DRIVE X 9X',
        'DRIVE X 12',
        'DRIVE X 1 Light',
      ],
    },
    {
      group: 'BRAVE SWORD（ブレイブソード）',
      models: [
        'BRAVE SWORD 12 SE',
        'BRAVE SWORD 12',
      ],
    },
    {
      group: 'JETSPEED（ジェットスピード）',
      models: [
        'JETSPEED S 12 ii F',
        'JETSPEED S 12 F',
      ],
    },
    { group: 'その他', models: ['その他'] },
  ],

  'GOSEN': [
    {
      group: '凌駕（RYOGA）',
      models: [
        '凌駕 無双',
        '凌駕 無限',
      ],
    },
    {
      group: 'INFERNO（インフェルノ）',
      models: [
        'インフェルノ エアー +CORE',
        'インフェルノ スマート +CORE',
        'インフェルノ レイド',
        'インフェルノ タッチ',
        'インフェルノ ライト',
      ],
    },
    {
      group: 'GRAVITAS（グラビタス）',
      models: [
        'GRAVITAS 1.9-A',
        'GRAVITAS 2.3R',
        'GRAVITAS 6.5-LL',
      ],
    },
    { group: 'その他', models: ['その他'] },
  ],
}

// ---- ストリング（ブランド・シリーズ別グループ・公式表記） ----
const STRING_TYPE_GROUPS = [
  {
    group: 'YONEX ナノジー',
    strings: [
      'ナノジー99エース',
      'ナノジー99',
      'ナノジー98',
      'ナノジー95',
    ],
  },
  {
    group: 'YONEX エクスボルト',
    strings: [
      'エクスボルト63',
      'エクスボルト65',
      'エクスボルト68',
    ],
  },
  {
    group: 'YONEX エアロバイト / エアロソニック',
    strings: [
      'エアロバイトブースト',
      'エアロバイト',
      'エアロソニック',
    ],
  },
  {
    group: 'YONEX BG',
    strings: [
      'BG80パワー',
      'BG80',
      'BG66アルティマックス',
      'BG66フォース',
      'BG65チタン',
      'BG65',
      'スカイアーク',
    ],
  },
  {
    group: 'VICTOR VBS',
    strings: [
      'VBS-63',
      'VBS-66ナノ',
      'VBS-68',
      'VBS-68パワー',
      'VBS-69ナノ',
      'VBS-70',
      'VS-69',
    ],
  },
  {
    group: 'GOSEN ライゾニック',
    strings: [
      'ライゾニック58',
      'ライゾニック65',
    ],
  },
  {
    group: 'MIZUNO M-スムース',
    strings: [
      'M-スムース65H',
      'M-スムース65R',
      'M-スムース66H',
      'M-スムース68S',
    ],
  },
  {
    group: 'LI-NING N',
    strings: [
      'N58',
      'N61',
      'N63',
      'N65',
      'N68',
      'N69',
      'N70',
    ],
  },
  {
    group: 'LI-NING No.',
    strings: [
      'No.1',
      'No.5',
    ],
  },
  {
    group: 'Ashaway',
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
  { value: 1, label: '週1回',   recommendedDays: 90 },
  { value: 2, label: '週2回',   recommendedDays: 60 },
  { value: 3, label: '週3回',   recommendedDays: 45 },
  { value: 4, label: '週4回',   recommendedDays: 30 },
  { value: 5, label: '週5回',   recommendedDays: 21 },
  { value: 6, label: '週6回以上', recommendedDays: 14 },
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

          <Field label="ストリング張った日">
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
              onChange={e => {
                const freq = Number(e.target.value)
                const opt = WEEKLY_FREQ_OPTIONS.find(o => o.value === freq)
                setForm(prev => ({
                  ...prev,
                  weeklyFreq: freq,
                  replacementDays: opt ? opt.recommendedDays : prev.replacementDays,
                }))
              }}
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
            <p className="text-xs text-gray-400 mt-1">
              ※ 頻度に応じた目安日数が自動入力されます（手動変更も可）
            </p>
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
