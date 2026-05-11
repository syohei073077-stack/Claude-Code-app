import { differenceInDays, parseISO } from 'date-fns'

/**
 * ストリングのテンション低下モデル。
 * 最初の7日で約5%、その後は30日ごとに約3%低下する簡易モデル。
 */
export function calcCurrentTension(initialTension, stringDate) {
  if (!initialTension || !stringDate) return null
  const days = differenceInDays(new Date(), parseISO(stringDate))
  if (days < 0) return initialTension

  const earlyLoss = Math.min(days / 7, 1) * 0.05
  const laterLoss = Math.max(days - 7, 0) / 30 * 0.03
  const factor = Math.max(1 - earlyLoss - laterLoss, 0.7)

  return Math.round(initialTension * factor * 10) / 10
}

export function getDaysStatus(stringDate, replacementDays) {
  if (!stringDate || !replacementDays) return null
  const elapsed = differenceInDays(new Date(), parseISO(stringDate))
  const remaining = replacementDays - elapsed
  return { elapsed, remaining }
}

export function getStatusLevel(remaining) {
  if (remaining === null) return 'unknown'
  if (remaining <= 0) return 'overdue'
  if (remaining <= 7) return 'soon'
  if (remaining <= 14) return 'warning'
  return 'good'
}
