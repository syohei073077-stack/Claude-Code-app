import { useState, useEffect } from 'react'

// Naha, Okinawa coordinates
const LAT = 26.21
const LON = 127.68

// Monthly average temperature (°C) and humidity (%) for Okinawa, index 0 = January
export const OKINAWA_MONTHLY_AVG_TEMP = [17.0, 17.2, 19.4, 22.7, 25.6, 28.5, 30.4, 30.5, 29.1, 25.8, 22.3, 18.9]
export const OKINAWA_MONTHLY_AVG_HUMID = [70, 72, 74, 76, 80, 84, 82, 80, 78, 74, 72, 70]

export function useOkinawaWeather() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)

  async function fetchWeather() {
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${LAT}&longitude=${LON}` +
        `&current=temperature_2m,relative_humidity_2m` +
        `&timezone=Asia%2FTokyo`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Weather fetch failed')
      const json = await res.json()
      setWeather({
        temperature: json.current.temperature_2m,
        humidity: json.current.relative_humidity_2m,
      })
      setUpdatedAt(new Date())
      setError(null)
    } catch (e) {
      setError(e.message)
      const m = new Date().getMonth()
      setWeather({
        temperature: OKINAWA_MONTHLY_AVG_TEMP[m],
        humidity: OKINAWA_MONTHLY_AVG_HUMID[m],
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
    const id = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  return { weather, loading, error, updatedAt, refetch: fetchWeather }
}
