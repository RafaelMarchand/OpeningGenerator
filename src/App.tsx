import { useEffect, useRef, useState } from "react"
import Generator from "./Generator"
import Stack from "@mui/joy/Stack"

import Mediator from "./scripts/Mediator"
import { Box } from "@mui/joy"

import "../node_modules/chessground/assets/chessground.base.css"
import "../node_modules/chessground/assets/chessground.brown.css"
import "../node_modules/chessground/assets/chessground.cburnett.css"
import GraphPopUps from "./GraphPopUps"
import NextMoves from "./NextMoves"

function App() {
  const boardRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<HTMLDivElement>(null)
  const [mediator, setMediator] = useState<Mediator | null>(null)

  useEffect(() => {
    setMediator(new Mediator(boardRef, graphRef))
    graphRef.current!.addEventListener("contextmenu", (e) => e.preventDefault())
  }, [])

  return (
    <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
      <Generator mediator={mediator}></Generator>
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <Stack direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
          <Box ref={boardRef} style={{ width: "400px", height: "400px" }} />
          {mediator && <NextMoves mediator={mediator}></NextMoves>}
        </Stack>
        <Box>
          <Box ref={graphRef} />
          {mediator && <GraphPopUps mediator={mediator} graphRef={graphRef} />}
        </Box>
      </Stack>
    </Stack>
  )
}

export default App
