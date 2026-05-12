# バドミントン ストリング管理アプリ 仕様書

## 概要

バドミントンのストリング（ガット）テンションと交換時期を管理するための PWA（Progressive Web App）。
沖縄の気象データを利用したリアルタイムのテンション推定が特徴。
URL を共有するだけで誰でも使えるブラウザアプリ（ログイン不要・インストール不要）。

- **URL（本番）**: Vercel デプロイ。`claude/badminton-string-tracker-8fas2` ブランチが本番。
- **リポジトリ**: `syohei073077-stack/Claude-Code-app`
- **技術スタック**: React 19 / Vite / Tailwind CSS v4 / PWA (vite-plugin-pwa)
- **データ永続化**: `localStorage`（バックエンドなし、完全クライアントサイド）

---

## 画面構成

### メイン画面 (`App.jsx`)

```
[ヘッダー]
  🏸 ストリング管理   [?ヘルプ] [🔔通知] [+ ラケット追加]
  バドミントンストリングのテンション・交換時期を管理

[気象ストリップ] WeatherStrip
  🌺 沖縄 現在の気象  🌡️ 28.5°C  💧 84%  更新: 14:30 [更新]

[統計カード] (ラケット1件以上のとき表示)
  ラケット数 | 交換超過 | 通知

[通知バナー] NotificationBanner
  通知未許可のとき: 許可リクエストバナーを表示

[ラケットカードリスト]
  RacketCard × n件

[空状態] EmptyState
  ラケットが0件のとき表示。追加ボタン付き。
```

### オーバーレイ

- **RacketForm**: ラケット追加・編集フォーム（全画面モーダル）
- **HelpModal**: 計算モデルの説明（全画面モーダル）

---

## データモデル

### ラケットオブジェクト

```typescript
type Racket = {
  id: string            // UUID (uuidv4)
  brand: string         // ブランド名 例: 'YONEX'
  name: string          // モデル名 例: 'アストロクス99プロ'
  stringType: string    // ストリング名 例: 'エクスボルト65'
  tension: number       // 初期テンション (lbs)
  stringDate: string    // 張り替え日 ISO date string 例: '2025-03-01'
  replacementDays: number  // 交換目安日数 例: 45
  weeklyFreq: number    // 週の練習回数 例: 3
  memo: string          // メモ（任意）
  createdAt: string     // 作成日時 ISO datetime string
}
```

**localStorage キー**: `badminton-rackets`（JSON 配列）

---

## コンポーネント詳細

### `App.jsx`

- フック（`useRackets`, `useNotifications`, `useOkinawaWeather`）を統合するルート
- `showForm`, `editTarget`, `showHelp` を `useState` で管理
- 交換超過件数を `overdueCount` で計算してサマリーに表示
- `handleSave(data)`: 新規は `addRacket`、編集は `updateRacket` を呼ぶ

### `RacketCard.jsx`

- ラケット1件の表示カード
- **折りたたみ**: クリックで詳細展開（`expanded` state）
- **ステータスバッジ**: `good` / `warning` / `soon` / `overdue` / `unknown`
- **進捗バー**: 経過日数 / 交換目安日数
- **補正内訳**: 「沖縄気象による補正内訳」トグルで詳細表示（`showBreakdown` state）
- `weather` プロパティ（`{ temperature, humidity }`）を受け取りテンション計算に渡す

ステータスの閾値:

| ステータス | 条件 |
|---|---|
| `overdue` | 残日数 ≤ 0（超過） |
| `soon` | 残日数 1〜7日 |
| `warning` | 残日数 8〜14日 |
| `good` | 残日数 15日以上 |
| `unknown` | `replacementDays` 未設定 |

### `RacketForm.jsx`

- 追加・編集の共通フォーム
- `initial` プロパティが `null` なら新規、ラケットオブジェクトなら編集モード
- **ブランド選択**: `RACKET_BRANDS` リストから選択
- **ラケット名**: ブランド選択後に対応モデルを optgroup 付きドロップダウンで表示。ブランド未選択時はテキスト入力
- **ストリング**: 全ブランドを optgroup で分類した単一ドロップダウン（`YONEX / VICTOR / GOSEN / MIZUNO / LI-NING / Ashaway`）
- **週の頻度選択**: 選択に応じて `replacementDays` を自動入力（上書き可）

#### 対応ブランド（ラケット）

| ブランド | シリーズ例 |
|---|---|
| YONEX | アストロクス, ナノフレア, アークセイバー, デュオラ, ボルトリック, ナノレイ, ナノスピード, アーマーテック, カーボネックス, マッスルパワー, Ti, アイソメトリック など |
| MIZUNO | アクロスピード, アクロフォース, フォルティウス, アルティウス, JPX, キャリバー, ルミナソニック など |
| VICTOR | THRUSTER, AURASPEED, DRIVE X, JETSPEED, BRAVE SWORD, HYPERNANO X, METEOR X など |
| LI-NING | AXFORCE, BLADEX, HALBERTEC, TECTONIC, WINDSTORM, AERONAUT, 3D CALIBAR, TURBO CHARGING, N シリーズ など |
| APACS | Woven, Nano Fusion Speed, Duplex Power, Feather Weight, Z-Ziggler など |
| GOSEN | INFERNO, GRAVITAS, COCYTUS, RYOGA（凌駕）, CUSTOMEDGE, ROOTS, LEGENDARY など |
| Kumpoo / Babolat / FZ FORZA / その他 | テキスト入力 |

#### 対応ブランド（ストリング）

| ブランド | シリーズ |
|---|---|
| YONEX | エクスボルト63/65/68, BG80パワー・BG80・BG66アルティマックス・BG66フォース・BG65チタン・BG65・スカイアーク, エアロバイトブースト・エアロバイト・エアロソニック, ナノジー99エース・ナノジー99・ナノジー98・ナノジー95 |
| VICTOR | VBS-63・VBS-66ナノ・VBS-68・VBS-68パワー・VBS-69ナノ・VBS-70・VS-69 |
| GOSEN | ライゾニック58・ライゾニック65 |
| MIZUNO | M-スムース65H・M-スムース65R・M-スムース66H・M-スムース68S |
| LI-NING | N58〜N70, No.1・No.5 |
| Ashaway | ジーマックス66ファイア・ジーマックス68TX |

#### 頻度と自動入力される目安日数

| 頻度 | 目安日数 |
|---|---|
| 週1回 | 90日 |
| 週2回 | 60日 |
| 週3回 | 45日 |
| 週4回 | 30日 |
| 週5回 | 21日 |
| 週6回以上 | 14日 |

### `HelpModal.jsx`

- テンション計算モデルの説明モーダル
- ① 時間劣化、② 気温補正、③ 湿度補正、④ 使用頻度補正 の4セクション
- 沖縄の気象データの加重平均の説明
- モデルの限界（精度 ±1〜2 lbs 程度）の注記

### `NotificationBanner.jsx`

- 通知許可状態に応じたバナー表示
- `permission === 'default'` のとき許可を促すバナー表示

---

## フック詳細

### `useRackets.js`

- `localStorage` キー `badminton-rackets` に JSON 配列を読み書き
- `rackets`: ラケット配列
- `addRacket(data)`: UUID を付与して追加
- `updateRacket(id, data)`: 指定 id のラケットを更新
- `deleteRacket(id)`: 指定 id を削除

### `useOkinawaWeather.js`

- **エンドポイント**: `https://api.open-meteo.com/v1/forecast`
- **座標**: 那覇 26.21°N, 127.68°E
- **取得項目**: `temperature_2m`（気温°C）, `relative_humidity_2m`（湿度%）
- **ポーリング間隔**: 30分
- **フォールバック**: API 失敗時は月別平均値を使用

#### 沖縄 月別平均値（フォールバック用）

| 月 | 気温(°C) | 湿度(%) |
|---|---|---|
| 1月 | 17.0 | 70 |
| 2月 | 17.2 | 72 |
| 3月 | 19.4 | 74 |
| 4月 | 22.7 | 76 |
| 5月 | 25.6 | 80 |
| 6月 | 28.5 | 84 |
| 7月 | 30.4 | 82 |
| 8月 | 30.5 | 80 |
| 9月 | 29.1 | 78 |
| 10月 | 25.8 | 74 |
| 11月 | 22.3 | 72 |
| 12月 | 18.9 | 70 |

- `weather`: `{ temperature: number, humidity: number }` または `null`
- `loading`: boolean
- `error`: エラーメッセージ または `null`
- `updatedAt`: 最終取得日時 `Date` または `null`
- `refetch`: 手動更新関数

### `useNotifications.js`

- Web Notifications API のラッパー
- `permission`: `'default'` / `'granted'` / `'denied'`
- `requestPermission()`: 通知許可をリクエスト
- `checkAndNotify()`: 交換超過・まもなく交換のラケットに対してブラウザ通知を発火
- 毎時間自動チェック（`setInterval` 1時間）

---

## テンション計算モデル (`src/utils/tension.js`)

### メイン関数

```
calcCurrentTension(initialTension, stringDate, currentTemp, currentHumid, weeklyFreq)
  → 現在の推定テンション (lbs) | null
```

### 計算式（4要素の合算）

#### ① 時間劣化

```
earlyLoss = min(days / 7, 1) × 0.05      // 最初7日: 最大-5%
laterLoss = max(days - 7, 0) / 30 × 0.03  // 以降: -3% / 30日
timeFactor = max(1 - earlyLoss - laterLoss, 0.7)  // 下限70%
tensionAfterTime = initialTension × timeFactor
```

#### ② 気温補正（沖縄月別加重平均）

```
avgTemp = 張り日〜今日を月ごとに日数加重平均した気温
tempCorrection = -(avgTemp - 20) × 0.1   // -0.1 lbs / °C（基準: 20°C）
```

#### ③ 湿度補正（沖縄月別加重平均）

```
avgHumid = 張り日〜今日を月ごとに日数加重平均した湿度
humidCorrection = -(avgHumid - 50) × 0.02  // -0.02 lbs / %（基準: 50%）
```

#### ④ リアルタイム補正（API 取得値）

```
realtimeCorrection = tempCorrection(currentTemp) × 0.1
                   + humidCorrection(currentHumid) × 0.1
// API 取得失敗時は 0
```

#### ⑤ 使用頻度補正

```
sessions = weeklyFreq × (days / 7)
usageLoss = -sessions × 0.02   // -0.02 lbs / セッション
```

#### 最終値

```
final = tensionAfterTime + tempCorrection + humidCorrection + realtimeCorrection + usageLoss
result = max(final, initialTension × 0.65)  // 下限: 初期の65%
return round(result, 1小数)
```

### サブ関数

- `getTensionBreakdown(...)`: 各補正の内訳値を返す（カード詳細表示用）
- `getDaysStatus(stringDate, replacementDays)`: `{ elapsed, remaining }` を返す
- `getStatusLevel(remaining)`: `'good' | 'warning' | 'soon' | 'overdue' | 'unknown'` を返す
- `calcMonthlyWeightedAvg(stringDate, monthlyData)`: 月別データの加重平均を計算

---

## ファイル構成

```
Claude-Code-app/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json              # SPA リライトルール
├── CLAUDE.md                # Claude Code 向けプロジェクト説明
├── SPEC.md                  # この仕様書
├── story-images.html        # Instagram ストーリー用説明画像（ブラウザで開く）
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css            # Tailwind v4 @theme 設定
    ├── App.css              # グローバルリセット
    ├── assets/
    ├── components/
    │   ├── RacketCard.jsx
    │   ├── RacketForm.jsx
    │   ├── HelpModal.jsx
    │   └── NotificationBanner.jsx
    ├── hooks/
    │   ├── useRackets.js
    │   ├── useOkinawaWeather.js
    │   └── useNotifications.js
    └── utils/
        └── tension.js
```

---

## デプロイ・ブランチ戦略

| ブランチ | 役割 |
|---|---|
| `claude/badminton-string-tracker-8fas2` | **本番ブランチ**。Vercel がこのブランチを自動デプロイ |
| `claude/promote-deployment-production-N7WoD` | 作業ブランチ。完成したら本番ブランチにも同時 push |

```bash
# 開発ブランチへ push
git push origin HEAD:claude/promote-deployment-production-N7WoD

# 本番ブランチへも push（Vercel が自動デプロイ）
git push origin HEAD:claude/badminton-string-tracker-8fas2
```

---

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動（Vite HMR）
npm run build    # プロダクションビルド
npm run lint     # ESLint
npm run preview  # プロダクションビルドをローカルプレビュー
```

テストランナーは未設定。

---

## 制約・注意事項

- データはブラウザの `localStorage` にのみ保存される（端末をまたいだ同期なし）
- 計算精度は **±1〜2 lbs 程度の目安**（厳密な計測値ではない）
- テンションモデルはナイロン系ストリングを前提。ポリ・ナチュラルガットは補正係数が異なる
- ストリングの張り方・マシンの違いによる個体差あり
- 通知機能はブラウザの許可が必要。iOS Safari は制限あり
