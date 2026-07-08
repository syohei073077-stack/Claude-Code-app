import { useState, useEffect, useCallback } from 'react'

const KEY = 'sleep-logs'

// 睡眠記録を localStorage に永続化（useRackets と同じ方式）。
// 1レコード: { id, date, deepMin, lightMin, remMin, totalMin, awakeCount,
//              bedtime, waketime, score, createdAt }
export function useSleepLogs() {
  const [logs, setLogs] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(logs))
    } catch {
      // 保存失敗は無視（プライベートモード等）
    }
  }, [logs])

  const addLog = useCallback((log) => {
    setLogs((prev) => {
      const entry = { ...log, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
      // 同じ日付があれば置き換え、新しい順で保持
      const filtered = prev.filter((l) => l.date !== log.date)
      return [entry, ...filtered].sort((a, b) => (a.date < b.date ? 1 : -1))
    })
  }, [])

  const deleteLog = useCallback((id) => {
    setLogs((prev) => prev.filter((l) => l.id !== id))
  }, [])

  return { logs, addLog, deleteLog }
}
