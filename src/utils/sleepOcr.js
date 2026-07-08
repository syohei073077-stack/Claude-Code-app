// スクショOCR（無料・ブラウザ内で完結）。tesseract.js を遅延ロードして
// 睡眠アプリの数値をベストエフォートで抽出する。誤読前提なので、呼び出し側は
// 必ず結果を編集可能フィールドに入れてユーザー確認を取ること。

// 認識した「時間トークン」を分に変換。
// [A, B] を渡すと A時間B分。B省略時は「A分」または大きければそのまま分。
function toMinutes(a, b) {
  if (b != null) return a * 60 + b // "1 33 min" → 1h33m
  // 単独数値: 60超なら分そのもの、それ以下も分として扱う
  return a
}

// OCRテキストから睡眠指標を抽出する。
// 期待レイアウト順: 深い眠り → 浅い眠り → REM → 睡眠時間 →（起きている 回）
export function parseSleepText(raw) {
  if (!raw) return { fields: {}, confidence: 'low', rawText: raw || '' }
  // 全角→半角、余分な記号を空白化
  const text = raw
    .replace(/[０-９]/g, (d) => '０１２３４５６７８９'.indexOf(d))
    .replace(/[：]/g, ':')
    .replace(/[^0-9a-zA-Z:回\s]/g, ' ')
    .replace(/\s+/g, ' ')

  // 「N h M min」「N M min」「N min」を出現順に収集
  const durations = []
  const re = /(\d{1,2})\s*h?\s*(\d{1,2})\s*m(?:in)?\b|(\d{1,3})\s*m(?:in)?\b/gi
  let m
  while ((m = re.exec(text)) !== null) {
    if (m[1] !== undefined && m[2] !== undefined) {
      durations.push(toMinutes(Number(m[1]), Number(m[2])))
    } else if (m[3] !== undefined) {
      durations.push(toMinutes(Number(m[3]), null))
    }
  }

  // 覚醒回数: 「N 回」
  let awakeCount = null
  const awakeM = text.match(/(\d{1,2})\s*回/)
  if (awakeM) awakeCount = Number(awakeM[1])

  // 就寝/起床の候補（hh:mm）。ノイズが多いので候補として返すのみ。
  const clocks = [...text.matchAll(/(\d{1,2}):(\d{2})/g)]
    .map((c) => `${c[1].padStart(2, '0')}:${c[2]}`)

  // durations を順にマッピング（deep, light, rem, total）
  const [deepMin, lightMin, remMin, totalMin] = durations
  const fields = {}
  if (deepMin != null) fields.deepMin = deepMin
  if (lightMin != null) fields.lightMin = lightMin
  if (remMin != null) fields.remMin = remMin
  if (totalMin != null) fields.totalMin = totalMin
  if (awakeCount != null) fields.awakeCount = awakeCount

  // 信頼度: 4つの時間＋回が揃えば mid、それ未満は low
  const confidence = durations.length >= 4 ? 'mid' : 'low'

  return { fields, confidence, clocks, rawText: raw }
}

// 画像ファイル(File/Blob/dataURL)をOCRしてパース結果を返す。
// tesseract.js は初回のみ言語データを取得（以降ブラウザにキャッシュ）。
export async function ocrSleepImage(image, onProgress) {
  const { default: Tesseract } = await import('tesseract.js')
  const { data } = await Tesseract.recognize(image, 'eng', {
    logger: (msg) => {
      if (onProgress && msg.status === 'recognizing text') {
        onProgress(Math.round(msg.progress * 100))
      }
    },
  })
  return parseSleepText(data.text)
}
