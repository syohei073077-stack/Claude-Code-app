import { differenceInDays, parseISO, getDaysInMonth } from 'date-fns'
import { OKINAWA_MONTHLY_AVG_TEMP, OKINAWA_MONTHLY_AVG_HUMID } from '../hooks/useOkinawaWeather'

// Reference conditions when strings are typically strung (indoor shop)
const REF_TEMP = 20    // °C
const REF_HUMID = 50   // %

/**
 * Calculates weighted average of Okinawa temperature/humidity
 * from stringDate to today, using monthly averages for each month spanned.
 */
function calcMonthlyWeightedAvg(stringDate, monthlyData) {
  const start = parseISO(stringDate)
  const end = new Date()
  if (end <= start) return monthlyData[start.getMonth()]

  let totalDays = 0
  let weightedSum = 0

  const cursor = new Date(start)
  while (cursor <= end) {
    const month = cursor.getMonth()
    const year = cursor.getFullYear()
    const daysInMonth = getDaysInMonth(new Date(year, month))
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month, daysInMonth)

    const spanStart = cursor > monthStart ? cursor : monthStart
    const spanEnd = end < monthEnd ? end : monthEnd
    const days = Math.max(differenceInDays(spanEnd, spanStart) + 1, 0)

    weightedSum += monthlyData[month] * days
    totalDays += days

    cursor.setMonth(cursor.getMonth() + 1)
    cursor.setDate(1)
  }

  return totalDays > 0 ? weightedSum / totalDays : monthlyData[start.getMonth()]
}

/**
 * Temperature correction: -0.1 lbs per °C above reference.
 * Okinawa's heat (avg 28-30°C in summer) causes measurable extra tension loss.
 */
function tempCorrection(avgTemp) {
  return -(avgTemp - REF_TEMP) * 0.1
}

/**
 * Humidity correction: high humidity causes nylon strings to absorb moisture
 * and soften, reducing effective tension.
 * -0.02 lbs per % above reference (effect is smaller than temperature).
 */
function humidCorrection(avgHumid) {
  return -(avgHumid - REF_HUMID) * 0.02
}

/**
 * Usage correction: each session causes additional tension loss from repeated impact.
 * -0.02 lbs per session (conservative estimate for nylon strings).
 */
function usageCorrection(weeklyFrequency, days) {
  if (!weeklyFrequency || weeklyFrequency <= 0) return 0
  const sessions = weeklyFrequency * (days / 7)
  return -(sessions * 0.02)
}

/**
 * Main tension calculation.
 * Combines time-based degradation + temperature + humidity corrections.
 * currentTemp/currentHumid: real-time values from weather API (optional).
 */
export function calcCurrentTension(initialTension, stringDate, currentTemp = null, currentHumid = null, weeklyFrequency = 0) {
  if (!initialTension || !stringDate) return null
  const days = differenceInDays(new Date(), parseISO(stringDate))
  if (days < 0) return initialTension

  // Time-based degradation: -5% in first 7 days, then -3% per 30 days
  const earlyLoss = Math.min(days / 7, 1) * 0.05
  const laterLoss = Math.max(days - 7, 0) / 30 * 0.03
  const timeFactor = Math.max(1 - earlyLoss - laterLoss, 0.7)
  const tensionAfterTime = initialTension * timeFactor

  // Use cumulative monthly averages from stringing date to today
  const avgTemp = calcMonthlyWeightedAvg(stringDate, OKINAWA_MONTHLY_AVG_TEMP)
  const avgHumid = calcMonthlyWeightedAvg(stringDate, OKINAWA_MONTHLY_AVG_HUMID)

  // Environmental corrections based on cumulative exposure
  const envCorrection = tempCorrection(avgTemp) + humidCorrection(avgHumid)

  // Additional real-time correction if weather data is available
  // (weighted lightly: current conditions contribute ~10% of effect)
  let realtimeCorrection = 0
  if (currentTemp !== null) realtimeCorrection += tempCorrection(currentTemp) * 0.1
  if (currentHumid !== null) realtimeCorrection += humidCorrection(currentHumid) * 0.1

  // Usage correction: impact stress from repeated play sessions
  const useCorrection = usageCorrection(weeklyFrequency, days)

  const final = tensionAfterTime + envCorrection + realtimeCorrection + useCorrection
  return Math.round(Math.max(final, initialTension * 0.6) * 10) / 10
}

export function getTensionBreakdown(initialTension, stringDate, currentTemp, currentHumid, weeklyFrequency = 0) {
  if (!initialTension || !stringDate) return null
  const days = differenceInDays(new Date(), parseISO(stringDate))
  const avgTemp = calcMonthlyWeightedAvg(stringDate, OKINAWA_MONTHLY_AVG_TEMP)
  const avgHumid = calcMonthlyWeightedAvg(stringDate, OKINAWA_MONTHLY_AVG_HUMID)
  const sessions = weeklyFrequency > 0 ? Math.round(weeklyFrequency * (days / 7)) : 0
  return {
    days,
    avgTemp: Math.round(avgTemp * 10) / 10,
    avgHumid: Math.round(avgHumid),
    tempLoss: Math.round(tempCorrection(avgTemp) * 10) / 10,
    humidLoss: Math.round(humidCorrection(avgHumid) * 10) / 10,
    sessions,
    usageLoss: Math.round(usageCorrection(weeklyFrequency, days) * 10) / 10,
  }
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
