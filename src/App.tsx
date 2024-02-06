import { RefObject, useEffect, useReducer, useRef, useState } from "react"
import Generator from "./Generator"
import Stack from "@mui/joy/Stack"

import Mediator from "./scripts/Mediator"
import { Box } from "@mui/joy"

import "../node_modules/chessground/assets/chessground.base.css"
import "../node_modules/chessground/assets/chessground.brown.css"
import "../node_modules/chessground/assets/chessground.cburnett.css"
import { NodePosition as Position } from "./scripts/Graph"
import Board from "./scripts/Board"
import GraphPopUps from "./GraphPopUps"

export interface DispatchGraphPopUp {
  type: reducerAction
  payload: any
}

export type reducerAction = "showButton" | "hideButton" | "showBoard" | "hideBoard"

export type GraphPopUpsState = {
  showBoard: boolean
  showRemoveButton: boolean
  fen: string
  position: Position
}

const DEFAULT_GRAPH_POPUPS: GraphPopUpsState = {
  showBoard: false,
  showRemoveButton: false,
  fen: Board.STARTING_POSITION,
  position: {
    x: 0,
    y: 0
  }
}

function reducerGraphPopUps(prevState: GraphPopUpsState, action: DispatchGraphPopUp): GraphPopUpsState {
  const state = {
    ...prevState
  }
  switch (action.type) {
    case "showBoard":
      state.showBoard = true
      state.fen = action.payload.fen
      state.position = action.payload.position
      break
    case "hideBoard":
      state.showBoard = false
      break
    case "showButton":
      state.showRemoveButton = true
      state.fen = action.payload.fen
      state.position = action.payload.position
      break
    case "hideButton":
      state.showRemoveButton = false
      break
  }
  return state
}

function App() {
  const boardRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<HTMLDivElement>(null)
  const mediatorRef = useRef<Mediator | null>(null)
  const [graphPopUps, dispatchGraphPopUps] = useReducer(reducerGraphPopUps, DEFAULT_GRAPH_POPUPS)

  useEffect(() => {
    mediatorRef.current = new Mediator(boardRef, graphRef)
    mediatorRef.current.listen("dspatchGraphPopUp", dispatchGraphPopUps)
    graphRef.current!.addEventListener("contextmenu", (e) => e.preventDefault())
  }, [])

  return (
    <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
      <Generator mediatorRef={mediatorRef}></Generator>
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <div ref={boardRef} style={{ width: "400px", height: "400px" }} />
        <Box>
          <Box ref={graphRef} />
          <GraphPopUps mediatorRef={mediatorRef} graphRef={graphRef} state={graphPopUps} />
        </Box>
      </Stack>
    </Stack>
  )
}

export default App
