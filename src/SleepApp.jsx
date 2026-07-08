import SleepAnalyzer from './components/SleepAnalyzer'

// 睡眠分析だけの独立アプリ（バドミントンのツールとは別ページ／別URL）。
export default function SleepApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl shrink-0">😴</span>
            <h1 className="text-xl font-bold text-gray-900">睡眠分析</h1>
          </div>
          <p className="text-xs text-gray-500 ml-9 mt-1">
            スクショから睡眠スコアと改善アクションを自動算出（無料・端末内処理）
          </p>
        </header>
        <SleepAnalyzer />
      </div>
    </div>
  )
}
