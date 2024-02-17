import React, { useEffect, useState } from "react"

function getValue(key, initialValue) {
  const persistedData = JSON.parse(localStorage.getItem(key))
  if (persistedData) return persistedData

  if (initialValue instanceof Function) return initialValue()

  return initialValue
}

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value])

  return [value, setValue]
}
