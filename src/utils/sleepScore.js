// 睡眠スコアリング & アクションプラン生成（純粋関数・無料/オフラインで完結）
//
// 入力は「分」単位の各睡眠ステージと覚醒回数、任意で就寝/起床時刻。
// スコアは 0〜100 の加重合成。しきい値は一般的な睡眠指標の目安に基づく。

const clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, v))

// "hh:mm" を「深夜をまたぐ連続時間軸」の小数時間へ。
// 就寝が夕方〜深夜想定なので、0〜9時台は翌日扱い(+24)にして遅寝を検出する。
export function parseClock(str) {
  if (!str) return null
  const m = String(str).match(/(\d{1,2})\s*[:：]\s*(\d{2})/)
  if (!m) return null
  let h = Number(m[1])
  const min = Number(m[2])
  if (h > 23 || min > 59) return null
  return h + min / 60
}

// 就寝時刻を「夜型度」の連続量へ。18:00→18, 24:00→24, 03:37→27.6
function bedtimeContinuous(bedStr) {
  const t = parseClock(bedStr)
  if (t == null) return null
  return t < 12 ? t + 24 : t
}

// ---- 各サブスコア（0〜100） ----

// 総睡眠時間: 7〜9時間(420〜540分)が理想
function durationScore(totalMin) {
  if (!totalMin) return null
  if (totalMin >= 420 && totalMin <= 540) return 100
  if (totalMin < 420) return clamp(100 - (420 - totalMin) / 3) // 30分不足ごとに-10
  return clamp(100 - (totalMin - 540) / 6) // 寝過ぎは緩めに減点
}

// 深い眠りの割合: 13〜23%が目安。多い分にはほぼ減点しない。
function deepScore(deepMin, totalMin) {
  if (!totalMin) return null
  const pct = (deepMin / totalMin) * 100
  if (pct >= 13 && pct <= 25) return 100
  if (pct > 25) return clamp(100 - (pct - 25) * 1.5)
  return clamp(100 - (13 - pct) * 6) // 不足は強めに減点
}

// REM睡眠の割合: 20〜25%が理想
function remScore(remMin, totalMin) {
  if (!totalMin) return null
  const pct = (remMin / totalMin) * 100
  if (pct >= 20 && pct <= 25) return 100
  if (pct < 20) return clamp(100 - (20 - pct) * 5)
  return clamp(100 - (pct - 25) * 4)
}

// 中途覚醒回数: 0〜1回が理想
function awakeScore(count) {
  if (count == null) return null
  if (count <= 1) return 100
  return clamp(100 - (count - 1) * 12)
}

// 就寝時刻（夜型度）: 23時前が理想、深夜になるほど減点
function timingScore(bedStr) {
  const b = bedtimeContinuous(bedStr)
  if (b == null) return null
  if (b <= 23) return 100 // 23:00まで
  return clamp(100 - (b - 23) * 15) // 1時間遅れるごとに-15
}

// 総量(duration)と夜型度(timing)を重めに。睡眠アーキテクチャが良くても
// 「短い・遅寝」は生活リズムとして問題なので過大評価しないための配分。
const WEIGHTS = { duration: 0.35, deep: 0.15, rem: 0.15, awake: 0.1, timing: 0.25 }

export function scoreSleep(data) {
  const { deepMin = 0, lightMin = 0, remMin = 0, awakeCount = null, bedtime = null } = data
  // 総睡眠は入力があればそれを、なければ各ステージ合算
  const totalMin = data.totalMin || deepMin + lightMin + remMin || 0

  const subs = {
    duration: durationScore(totalMin),
    deep: deepScore(deepMin, totalMin),
    rem: remScore(remMin, totalMin),
    awake: awakeScore(awakeCount),
    timing: timingScore(bedtime),
  }

  // 有効なサブスコアだけで加重平均（未入力項目は重みごと除外）
  let sum = 0
  let wSum = 0
  for (const key of Object.keys(WEIGHTS)) {
    if (subs[key] != null) {
      sum += subs[key] * WEIGHTS[key]
      wSum += WEIGHTS[key]
    }
  }
  const score = wSum > 0 ? Math.round(sum / wSum) : null

  const pct = totalMin
    ? {
        deep: Math.round((deepMin / totalMin) * 100),
        light: Math.round((lightMin / totalMin) * 100),
        rem: Math.round((remMin / totalMin) * 100),
      }
    : { deep: 0, light: 0, rem: 0 }

  return {
    score,
    level: scoreLevel(score),
    subs,
    pct,
    totalMin,
    actions: buildActions({ ...data, totalMin, subs, pct }),
  }
}

export function scoreLevel(score) {
  if (score == null) return { key: 'unknown', label: '—', color: 'gray' }
  if (score >= 85) return { key: 'excellent', label: '優秀', color: 'emerald' }
  if (score >= 70) return { key: 'good', label: '良好', color: 'sky' }
  if (score >= 55) return { key: 'normal', label: '普通', color: 'amber' }
  return { key: 'poor', label: '要改善', color: 'red' }
}

// ---- アクションプラン（ルールベース） ----
// 弱い指標を優先度順に並べ、汎用のキーストーン習慣で締める。

function buildActions({ totalMin, subs, pct, bedtime, awakeCount }) {
  const actions = []
  const bed = bedtimeContinuous(bedtime)

  // 優先度が高い順に push（後で priority でソート）
  if (bed != null && bed > 24) {
    const bedH = Math.floor(bed > 24 ? bed - 24 : bed)
    actions.push({
      priority: bed > 25 ? 1 : 2,
      icon: '🌙',
      title: '就寝時刻を前倒しする',
      body: `就寝が${String(bedH).padStart(2, '0')}時台と夜型です。毎日15〜30分ずつ早め、起床時刻を固定（休日も±1時間）すると体内時計が前に戻ります。まずは就寝1〜2時間前にスマホの明るい画面を避けるところから。`,
    })
  }

  if (subs.duration != null && totalMin < 420) {
    const short = Math.round((420 - totalMin) / 10) * 10
    actions.push({
      priority: 2,
      icon: '⏰',
      title: `睡眠時間をあと約${short}分増やす`,
      body: `総睡眠が${fmtDuration(totalMin)}で推奨の7時間に届いていません。「今より30分早く布団に入る」だけでOK。カフェインは午後2時以降オフにすると寝つきが早まります。`,
    })
  }

  if (subs.deep != null && pct.deep < 13) {
    actions.push({
      priority: 3,
      icon: '💪',
      title: '深い眠りを増やす',
      body: `深い眠りが${pct.deep}%と少なめ（目安13〜23%）。就寝90分前の入浴（40℃・15分）、日中の適度な運動、就寝前のアルコールを控えることが効きます。`,
    })
  }

  if (subs.rem != null && pct.rem < 20) {
    actions.push({
      priority: 3,
      icon: '🧠',
      title: 'REM睡眠を確保する',
      body: `REMが${pct.rem}%と少なめ（目安20〜25%）。REMは睡眠後半に多いので、総睡眠時間を伸ばすことと、寝る前のアルコールを避けることが直接効きます。`,
    })
  }

  if (awakeCount != null && awakeCount >= 2) {
    actions.push({
      priority: 3,
      icon: '🌡️',
      title: '中途覚醒を減らす',
      body: `夜間に${awakeCount}回目が覚めています。寝室を暗く・涼しく（18〜20℃目安）・静かに保ち、就寝前の水分・アルコールを控えると分断が減ります。`,
    })
  }

  // キーストーン習慣（常に1つ）
  actions.push({
    priority: 5,
    icon: '☀️',
    title: '起床時刻の固定＋朝の光',
    body: '一番効くのはこれ。毎朝同じ時間に起き、起きたらすぐ日光を5〜10分浴びる。体内時計が整い、夜自然に眠くなります。',
  })

  return actions.sort((a, b) => a.priority - b.priority).slice(0, 4)
}

export function fmtDuration(min) {
  if (!min && min !== 0) return '—'
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  if (h === 0) return `${m}分`
  return `${h}時間${m}分`
}
