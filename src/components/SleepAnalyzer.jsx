import { useMemo, useRef, useState } from 'react'
import { Upload, Loader2, Save, Trash2, ChevronDown, ChevronUp, Moon, Info } from 'lucide-react'
import { scoreSleep, fmtDuration } from '../utils/sleepScore'
import { ocrSleepImage } from '../utils/sleepOcr'
import { useSleepLogs } from '../hooks/useSleepLogs'

const LEVEL_STYLES = {
  excellent: { ring: 'text-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' },
  good: { ring: 'text-sky-500', badge: 'bg-sky-100 text-sky-700 border-sky-200', bar: 'bg-sky-500' },
  normal: { ring: 'text-amber-500', badge: 'bg-amber-100 text-amber-700 border-amber-200', bar: 'bg-amber-500' },
  poor: { ring: 'text-red-500', badge: 'bg-red-100 text-red-700 border-red-200', bar: 'bg-red-500' },
  unknown: { ring: 'text-gray-300', badge: 'bg-gray-100 text-gray-500 border-gray-200', bar: 'bg-gray-300' },
}

const SUB_LABELS = {
  duration: '睡眠時間',
  deep: '深い眠り',
  rem: 'REM',
  awake: '中途覚醒',
  timing: '就寝時刻',
}

const emptyForm = {
  deep: { h: '', m: '' },
  light: { h: '', m: '' },
  rem: { h: '', m: '' },
  total: { h: '', m: '' },
  awake: '',
  bedtime: '',
  waketime: '',
  date: new Date().toISOString().slice(0, 10),
}

const toMin = (part) => {
  const h = parseInt(part.h, 10) || 0
  const m = parseInt(part.m, 10) || 0
  return h * 60 + m
}
const minToParts = (min) => ({ h: String(Math.floor(min / 60)), m: String(Math.round(min % 60)) })

export default function SleepAnalyzer() {
  const { logs, addLog, deleteLog } = useSleepLogs()
  const [form, setForm] = useState(emptyForm)
  const [preview, setPreview] = useState(null)
  const [ocrState, setOcrState] = useState({ running: false, progress: 0, note: null })
  const [showHistory, setShowHistory] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef(null)

  // スコア計算（入力が変わるたび再計算）
  const result = useMemo(() => {
    const deepMin = toMin(form.deep)
    const lightMin = toMin(form.light)
    const remMin = toMin(form.rem)
    const totalMin = toMin(form.total)
    const awakeCount = form.awake === '' ? null : Number(form.awake)
    const hasInput = deepMin || lightMin || remMin || totalMin
    if (!hasInput) return null
    return scoreSleep({ deepMin, lightMin, remMin, totalMin, awakeCount, bedtime: form.bedtime })
  }, [form])

  function setPart(stage, key, value) {
    const v = value.replace(/[^0-9]/g, '')
    setForm((f) => ({ ...f, [stage]: { ...f[stage], [key]: v } }))
    setSaved(false)
  }
  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    setSaved(false)
  }

  async function handleFile(file) {
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setOcrState({ running: true, progress: 0, note: null })
    try {
      const { fields, confidence, clocks } = await ocrSleepImage(file, (p) =>
        setOcrState((s) => ({ ...s, progress: p }))
      )
      setForm((f) => ({
        ...f,
        deep: fields.deepMin != null ? minToParts(fields.deepMin) : f.deep,
        light: fields.lightMin != null ? minToParts(fields.lightMin) : f.light,
        rem: fields.remMin != null ? minToParts(fields.remMin) : f.rem,
        total: fields.totalMin != null ? minToParts(fields.totalMin) : f.total,
        awake: fields.awakeCount != null ? String(fields.awakeCount) : f.awake,
      }))
      setOcrState({
        running: false,
        progress: 100,
        note:
          confidence === 'mid'
            ? { type: 'ok', text: '読み取りました。数値が合っているか確認して、就寝時刻を入力してください。', clocks }
            : { type: 'warn', text: 'うまく読み取れませんでした。下の欄に手入力してください。', clocks },
      })
    } catch {
      setOcrState({ running: false, progress: 0, note: { type: 'warn', text: 'OCRに失敗しました。手入力してください。' } })
    }
  }

  function handleSave() {
    if (!result) return
    addLog({
      date: form.date,
      deepMin: toMin(form.deep),
      lightMin: toMin(form.light),
      remMin: toMin(form.rem),
      totalMin: toMin(form.total) || result.totalMin,
      awakeCount: form.awake === '' ? null : Number(form.awake),
      bedtime: form.bedtime,
      waketime: form.waketime,
      score: result.score,
    })
    setSaved(true)
  }

  const level = result ? LEVEL_STYLES[result.level.key] : LEVEL_STYLES.unknown

  return (
    <div className="flex flex-col gap-5">
      {/* アップロード */}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-2xl px-5 py-6 flex flex-col items-center gap-2 hover:bg-indigo-50 transition-colors"
        >
          {preview ? (
            <img src={preview} alt="睡眠スクショ" className="max-h-40 rounded-xl shadow-sm" />
          ) : (
            <>
              <Upload size={26} className="text-indigo-400" />
              <span className="text-sm font-medium text-indigo-700">睡眠アプリのスクショを選択</span>
              <span className="text-xs text-gray-400">自動で数値を読み取ります（無料・端末内で処理）</span>
            </>
          )}
        </button>
        {preview && !ocrState.running && (
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-2 text-xs text-indigo-500 hover:text-indigo-700"
          >
            別のスクショを選ぶ
          </button>
        )}
      </div>

      {ocrState.running && (
        <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 rounded-xl px-4 py-3">
          <Loader2 size={16} className="animate-spin" />
          読み取り中… {ocrState.progress}%
        </div>
      )}

      {ocrState.note && (
        <div
          className={`flex items-start gap-2 text-xs rounded-xl px-4 py-3 ${
            ocrState.note.type === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}
        >
          <Info size={14} className="mt-0.5 shrink-0" />
          <div>
            {ocrState.note.text}
            {ocrState.note.clocks?.length > 0 && (
              <span className="block mt-1 text-gray-500">
                検出した時刻候補: {ocrState.note.clocks.join(' / ')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 入力フォーム */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
        <p className="text-xs font-medium text-gray-500">数値（読み取り後も編集できます）</p>
        <div className="grid grid-cols-2 gap-3">
          <StageInput label="深い眠り" color="bg-purple-500" part={form.deep} onChange={(k, v) => setPart('deep', k, v)} />
          <StageInput label="浅い眠り" color="bg-purple-300" part={form.light} onChange={(k, v) => setPart('light', k, v)} />
          <StageInput label="REM" color="bg-orange-400" part={form.rem} onChange={(k, v) => setPart('rem', k, v)} />
          <StageInput label="睡眠時間 合計" color="bg-indigo-500" part={form.total} onChange={(k, v) => setPart('total', k, v)} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <NumberField label="中途覚醒(回)" value={form.awake} onChange={(v) => setField('awake', v.replace(/[^0-9]/g, ''))} placeholder="0" />
          <ClockField label="就寝時刻" value={form.bedtime} onChange={(v) => setField('bedtime', v)} />
          <ClockField label="起床時刻" value={form.waketime} onChange={(v) => setField('waketime', v)} />
        </div>
        <p className="text-[11px] text-gray-400">
          ※ 合計を空欄にすると各ステージの合算で計算します。就寝時刻を入れると「夜型度」も採点します。
        </p>
      </div>

      {/* スコア結果 */}
      {result ? (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5">
            <ScoreRing score={result.score} colorClass={level.ring} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${level.badge}`}>
                  {result.level.label}
                </span>
                <span className="text-xs text-gray-400">合計 {fmtDuration(result.totalMin)}</span>
              </div>
              <div className="flex gap-3 text-xs text-gray-500 mb-2">
                <span>深 {result.pct.deep}%</span>
                <span>浅 {result.pct.light}%</span>
                <span>REM {result.pct.rem}%</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {Object.entries(result.subs).map(([k, v]) =>
                  v == null ? null : <SubBar key={k} label={SUB_LABELS[k]} value={v} />
                )}
              </div>
            </div>
          </div>

          {/* アクションプラン */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
              <Moon size={15} className="text-indigo-500" /> 睡眠の質を上げるアクション
            </h3>
            {result.actions.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3">
                <span className="text-xl shrink-0">{a.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{a.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{a.body}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saved}
            className="flex items-center justify-center gap-2 btn-primary disabled:bg-emerald-500 disabled:opacity-100"
          >
            <Save size={16} /> {saved ? '履歴に保存しました' : `${form.date} を履歴に保存`}
          </button>
        </>
      ) : (
        <div className="text-center text-sm text-gray-400 py-6">
          スクショを選ぶか、数値を入力するとスコアが表示されます。
        </div>
      )}

      {/* 履歴 */}
      {logs.length > 0 && (
        <div>
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            {showHistory ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            履歴 ({logs.length}件)
          </button>
          {showHistory && (
            <div className="mt-3 flex flex-col gap-2">
              {logs.map((l) => {
                const lv = LEVEL_STYLES[scoreLevelKey(l.score)]
                return (
                  <div key={l.id} className="bg-white rounded-xl border border-gray-100 px-4 py-2.5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-800 w-9 text-right">{l.score}</span>
                      <div>
                        <p className="text-sm text-gray-700">{l.date}</p>
                        <p className="text-xs text-gray-400">{fmtDuration(l.totalMin)}・覚醒{l.awakeCount ?? '—'}回</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${lv.bar}`} />
                      <button onClick={() => deleteLog(l.id)} className="text-gray-300 hover:text-red-400">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function scoreLevelKey(score) {
  if (score >= 85) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 55) return 'normal'
  return 'poor'
}

function StageInput({ label, color, part, onChange }) {
  return (
    <div className="bg-gray-50 rounded-xl px-3 py-2">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <input
          inputMode="numeric"
          value={part.h}
          onChange={(e) => onChange('h', e.target.value)}
          placeholder="0"
          className="w-9 text-center bg-white border border-gray-200 rounded-lg py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <span className="text-xs text-gray-400">時間</span>
        <input
          inputMode="numeric"
          value={part.m}
          onChange={(e) => onChange('m', e.target.value)}
          placeholder="0"
          className="w-9 text-center bg-white border border-gray-200 rounded-lg py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <span className="text-xs text-gray-400">分</span>
      </div>
    </div>
  )
}

function NumberField({ label, value, onChange, placeholder }) {
  return (
    <div className="bg-gray-50 rounded-xl px-3 py-2">
      <span className="text-xs text-gray-500 block mb-1.5">{label}</span>
      <input
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-center bg-white border border-gray-200 rounded-lg py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
    </div>
  )
}

function ClockField({ label, value, onChange }) {
  return (
    <div className="bg-gray-50 rounded-xl px-3 py-2">
      <span className="text-xs text-gray-500 block mb-1.5">{label}</span>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-center bg-white border border-gray-200 rounded-lg py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
    </div>
  )
}

function SubBar({ label, value }) {
  const color = value >= 85 ? 'bg-emerald-500' : value >= 70 ? 'bg-sky-500' : value >= 55 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-gray-400 w-14 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[11px] text-gray-400 w-6 text-right">{value}</span>
    </div>
  )
}

function ScoreRing({ score, colorClass }) {
  const r = 34
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeWidth="7" className="text-gray-100" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className={`${colorClass} transition-all duration-700`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{score}</span>
        <span className="text-[10px] text-gray-400">/ 100</span>
      </div>
    </div>
  )
}
