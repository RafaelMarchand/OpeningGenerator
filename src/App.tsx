import { useEffect, useReducer, useRef, useState } from "react"
import Generator from "./Generator"
import Stack from "@mui/joy/Stack"

import Mediator from "./scripts/Mediator"
import "../node_modules/chessground/assets/chessground.base.css"
import "../node_modules/chessground/assets/chessground.brown.css"
import "../node_modules/chessground/assets/chessground.cburnett.css"

//const position = graph.getNodeAttribute(key, "position")

function App() {
  const boardRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<HTMLDivElement>(null)
  const mediator = useRef<Mediator | null>(null)

  useEffect(() => {
    mediator.current = new Mediator(boardRef, graphRef)
  })

  return (
    <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
      <div ref={boardRef} style={{ width: "600px", height: "600px" }} />
      <div ref={graphRef} />
      <Generator></Generator>
    </Stack>
  )
}

export default App
