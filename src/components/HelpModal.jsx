import { X, ExternalLink } from 'lucide-react'

export default function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">計算モデルについて</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-6 text-sm text-gray-700">

          {/* Intro */}
          <p className="text-gray-500 leading-relaxed">
            このアプリは4つの要素を組み合わせて現在のテンションを推定しています。
            いずれも厳密な計測値ではなく<span className="font-medium text-gray-700">参考目安</span>です。
          </p>

          {/* Section 1 */}
          <Section title="① 時間劣化" badge="−5% / 最初7日、−3% / 30日">
            <p className="leading-relaxed">
              張り直後はナイロン繊維が伸び（クリープ現象）、
              <span className="font-medium">7日以内に初期テンションの5〜8%が失われる</span>
              ことが Yonex 技術資料や複数のストリングメーカーの公表データで示されています。
              その後は月あたり2〜4%の緩やかな低下が経験則として知られており、
              本モデルでは中間値の 3%/30日 を採用しています。
            </p>
            <Caveat>
              素材によって差があります。ポリエステル系は初期低下が小さく長期的には安定、
              ナチュラルガットは湿度の影響を強く受けます。現在のモデルはナイロン系を前提としています。
            </Caveat>
          </Section>

          {/* Section 2 */}
          <Section title="② 気温補正" badge="−0.1 lbs / °C">
            <p className="leading-relaxed">
              ストリング（ナイロン系）の線膨張係数は約
              <span className="font-medium"> 7〜9 × 10⁻⁵ /°C</span>、
              グラファイトフレームは約 <span className="font-medium">1〜3 × 10⁻⁶ /°C</span> です。
              この差によって気温が上がるとストリングだけが伸び、実効テンションが低下します。
            </p>
            <p className="leading-relaxed mt-2">
              プロストリンガーの間では
              <span className="font-medium">「10°F（約5.6°C）上昇で約1 lbs 低下」</span>
              という経験則が広く使われており、換算すると約 0.18 lbs/°C。
              本モデルでは長期累積計算への適用を考慮して保守的に
              <span className="font-medium"> 0.1 lbs/°C </span>
              としています。
            </p>
            <p className="leading-relaxed mt-2">
              沖縄は夏季（7〜8月）の平均気温が約30°Cに達するため、
              基準温度20°Cとの差10°C × 0.1 = <span className="font-medium text-red-500">−1.0 lbs</span>
              の追加低下が生じます。
            </p>
          </Section>

          {/* Section 3 */}
          <Section title="④ 湿度補正" badge="−0.02 lbs / %RH">
            <p className="leading-relaxed">
              ナイロン66（ストリングの主材料）は高湿度環境で
              <span className="font-medium">吸水率が3〜5%増加</span>します。
              水分を吸収したストリングは弾性率が低下し、実効テンションが下がります。
            </p>
            <p className="leading-relaxed mt-2">
              バドミントン・テニスの研究では高湿度（80%以上）で
              0.5〜1 lbs 程度の差が報告されています。
              バドミントンストリングはテニスより細く影響が小さいため、
              <span className="font-medium"> 0.02 lbs/% </span>
              としています（基準湿度50%超過分に対して適用）。
            </p>
            <p className="leading-relaxed mt-2">
              沖縄の梅雨〜夏季（6〜9月）の平均湿度は80〜84%で、
              基準との差30〜34% × 0.02 = <span className="font-medium text-red-500">−0.6〜0.7 lbs</span>
              の追加低下が生じます。
            </p>
          </Section>

          {/* Section 4 */}
          <Section title="④ 使用頻度補正" badge="−0.02 lbs / セッション">
            <p className="leading-relaxed">
              1回のプレー（約1.5時間）ごとにストリングはシャトルとの衝突による
              <span className="font-medium">微細な摩耗とクリープの蓄積</span>が進みます。
              ラケットスポーツの研究では、打球数の増加とともにテンション損失が加速することが示されており、
              実験データでは50〜100時間のプレーで初期テンションの
              <span className="font-medium">5〜10% 相当が追加損失</span>
              されると報告されています。
            </p>
            <p className="leading-relaxed mt-2">
              本モデルでは入力された週の練習頻度から張り日以降の累積セッション数を算出し、
              <span className="font-medium">1セッション = −0.02 lbs</span> として加算します。
              例: 週3回 × 90日 ≈ 39セッション → <span className="font-medium text-red-500">−0.78 lbs</span>
            </p>
            <Caveat>
              セッション時間や打球強度によって実際の劣化量は大きく異なります。
              本補正はあくまで参考値です。
            </Caveat>
          </Section>

          {/* Okinawa averaging */}
          <Section title="沖縄の気象データの使い方">
            <p className="leading-relaxed">
              「張り日」から今日までの期間を月ごとに区切り、
              各月の在籍日数で加重平均した気温・湿度を計算に使います。
              たとえば5月に張り7月現在なら、5月・6月・7月の実日数で重みをつけた平均値が採用されます。
            </p>
            <p className="leading-relaxed mt-2">
              リアルタイム値は Open-Meteo API（那覇: 26.21°N, 127.68°E）から取得し、
              30分ごとに更新します。API 取得失敗時は沖縄の月別平均値にフォールバックします。
            </p>
          </Section>

          {/* Limitations */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 flex flex-col gap-2">
            <p className="font-semibold text-amber-800">⚠️ モデルの限界</p>
            <ul className="list-disc list-inside space-y-1 text-amber-700 leading-relaxed">
              <li>精度は <span className="font-medium">±1〜2 lbs 程度</span> の目安です</li>
              <li>使用頻度は週単位の平均で推定しており、セッションの強度は未反映です</li>
              <li>ポリ・ナチュラルガット系は補正係数が異なります</li>
              <li>張り方・マシンの違いによる個体差があります</li>
              <li>厳密な管理にはテンションゲージによる実測を推奨します</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}

function Section({ title, badge, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="font-bold text-gray-900">{title}</h3>
        {badge && (
          <span className="text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="text-gray-600">{children}</div>
    </div>
  )
}

function Caveat({ children }) {
  return (
    <p className="mt-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">
      ※ {children}
    </p>
  )
}
