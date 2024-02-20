import { createContext, useEffect, useRef, useState } from "react"
import Stack from "@mui/joy/Stack"
import Mediator from "../../scripts/Mediator"
import { Box } from "@mui/joy"

import GraphPopUps from "./GraphPopUps"
import NextMoves from "./NextMoves"
import Settings from "./Settings"
import Board from "./Board"
import Information from "./Information"

export const MediatorContext = createContext<Mediator | null>(null)

function OpeningGenerator() {
  const boardRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<HTMLDivElement>(null)
  const [mediator, setMediator] = useState<Mediator | null>(null)

  useEffect(() => {
    setMediator(new Mediator(boardRef, graphRef))
    graphRef.current?.addEventListener("contextmenu", (e) => e.preventDefault())
  }, [])

  return (
    <MediatorContext.Provider value={mediator}>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={2}
        sx={{ pt: 2, height: "100vh", width: "100rem" }}>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          sx={{ overflow: "auto", maxHeight: "100%" }}>
          <Stack direction="row" justifyContent="space-evenly" spacing={2} sx={{ width: "100%" }}>
            <Board boardRef={boardRef} />
            <Information />
          </Stack>
          <Box>
            <Box ref={graphRef} />
            <GraphPopUps graphRef={graphRef} />
          </Box>
        </Stack>
        <Settings />
      </Stack>
    </MediatorContext.Provider>
  )
}

export default OpeningGenerator
