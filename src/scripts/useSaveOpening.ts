import { GraphType } from "./Graph"

export type OpeningData = {
  name: string
  graph: GraphType
  index: number
}

type Save = (name: string, graph: GraphType) => void
type GetAll = () => OpeningData[]
type Remove = (opening: OpeningData) => void

const KEY_LOCALSTORAGE = "key_localstorage"

export default function useSaveOpening(): [Save, GetAll, Remove] {
  function getAll(): OpeningData[] {
    const data = localStorage.getItem(KEY_LOCALSTORAGE)
    if (data) return JSON.parse(data)
    return []
  }

  function save(name: string, graph: GraphType) {
    const savedData = getAll()

    const opening = {
      name: name,
      graph: graph,
      index: savedData.length - 1
    }
    const newData = [...savedData, opening]
    localStorage.setItem(KEY_LOCALSTORAGE, JSON.stringify(newData))
  }

  function remove(opening: OpeningData) {
    const savedData = getAll().filter((value) => value.index !== opening.index)
    localStorage.setItem(KEY_LOCALSTORAGE, JSON.stringify(savedData))
  }

  return [save, getAll, remove]
}
