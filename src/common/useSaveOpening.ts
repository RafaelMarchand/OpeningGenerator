import { useState } from "react"
import { GraphType } from "./GraphBuilder"

export type OpeningData = {
  name: string
  graph: GraphType
  index: number
}

type ReducerT = (action: useOpeningsActions, opening: OpeningData) => void
export type useOpeningsActions = "remove" | "save" | "edit"

const KEY_LOCALSTORAGE = "key_localstorage"

export default function useSaveOpening(): [OpeningData[], ReducerT] {
  const [openings, setOpenings] = useState<OpeningData[]>(getAll)

  function reducer(action: useOpeningsActions, opening: OpeningData) {
    let newData: OpeningData[] = getAll()

    if (action === "remove") {
      newData = newData.filter((value) => value.index !== opening.index)
    } else if (action === "save") {
      opening.index = newData.length === 0 ? 0 : newData.length
      newData = [...newData, opening]
    } else if (action === "edit") {
      newData[opening.index!] = opening
    }

    localStorage.setItem(KEY_LOCALSTORAGE, JSON.stringify(newData))
    setOpenings(newData)
  }

  function getAll(): OpeningData[] {
    const data = localStorage.getItem(KEY_LOCALSTORAGE)
    if (data) return JSON.parse(data)
    return []
  }

  return [openings, reducer]
}
