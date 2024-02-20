import { useState } from "react"
import { GraphType } from "./UIElements"

export type OpeningData = {
  name: string
  graph: GraphType
  index: number
  edit: boolean
}

type ReducerT = (action: Actions, opening: OpeningData) => void
type Actions = "remove" | "save" | "edit"

const KEY_LOCALSTORAGE = "key_localstorage"

export default function useSaveOpening(): [OpeningData[], ReducerT] {
  const [openings, setOpenings] = useState<OpeningData[]>(getAll)

  function reducer(action: Actions, opening: OpeningData) {
    let newData: OpeningData[] = getAll()

    if (action === "remove") {
      newData = newData.filter((value) => value.index !== opening.index)
    } else if (action === "save") {
      newData = [...newData, opening]
    } else if (action === "edit") {
      newData[opening.index] = opening
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
