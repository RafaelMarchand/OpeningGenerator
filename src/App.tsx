import { useEffect, useReducer, useRef, useState } from "react"

import Generator from "./Generator"
import Graph from "./Graph"
import Stack from "@mui/joy/Stack"

import Chessground from "@react-chess/chessground"

// these styles must be imported somewhere
import "chessground/assets/chessground.base.css"
import "chessground/assets/chessground.brown.css"
import "chessground/assets/chessground.cburnett.css"

const STARTING_POSITION = "rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2"

const INITIAL_STATE = {
  config: {
    fen: STARTING_POSITION
  }
}

const generator = new Generator(STARTING_POSITION, null, null)

function App() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const [board, setBoard] = useState(STARTING_POSITION)
  //const [generator] = useState(new Generator(STARTING_POSITION, dispatch, setBoard))
  generator.dispatch = dispatch
  generator.setBoard = setBoard

  function reducer(state: any, position: any) {
    state.config.fen = position
    return state
  }

  return (
    <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
      <Chessground key={board} config={state.config} height={400} width={400}></Chessground>
      <Graph generator={generator} />
    </Stack>
  )
}

export default App
