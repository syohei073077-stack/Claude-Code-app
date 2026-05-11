import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'badminton-rackets'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useRackets() {
  const [rackets, setRackets] = useState(load)

  useEffect(() => {
    save(rackets)
  }, [rackets])

  function addRacket(data) {
    const racket = { id: uuidv4(), ...data, createdAt: new Date().toISOString() }
    setRackets(prev => [...prev, racket])
    return racket
  }

  function updateRacket(id, data) {
    setRackets(prev => prev.map(r => (r.id === id ? { ...r, ...data } : r)))
  }

  function deleteRacket(id) {
    setRackets(prev => prev.filter(r => r.id !== id))
  }

  return { rackets, addRacket, updateRacket, deleteRacket }
}
