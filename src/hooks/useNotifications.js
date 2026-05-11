import { useState, useEffect, useCallback } from 'react'
import { differenceInDays, parseISO } from 'date-fns'

export function useNotifications(rackets) {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )

  async function requestPermission() {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }

  const checkAndNotify = useCallback(() => {
    if (permission !== 'granted') return

    rackets.forEach(racket => {
      if (!racket.stringDate || !racket.replacementDays) return
      const daysSinceString = differenceInDays(new Date(), parseISO(racket.stringDate))
      const daysLeft = racket.replacementDays - daysSinceString

      if (daysLeft <= 0) {
        new Notification(`🏸 ${racket.name} のストリング交換時期です`, {
          body: `張替えから ${daysSinceString} 日経過。早めの交換をおすすめします。`,
          icon: '/badminton.png',
          tag: `racket-${racket.id}`,
        })
      } else if (daysLeft <= 7) {
        new Notification(`🏸 ${racket.name} のストリング交換が近づいています`, {
          body: `あと ${daysLeft} 日で交換時期です。`,
          icon: '/badminton.png',
          tag: `racket-soon-${racket.id}`,
        })
      }
    })
  }, [permission, rackets])

  useEffect(() => {
    checkAndNotify()
    const interval = setInterval(checkAndNotify, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [checkAndNotify])

  return { permission, requestPermission, checkAndNotify }
}
