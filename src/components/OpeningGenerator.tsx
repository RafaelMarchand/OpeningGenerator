import { useEffect, useRef } from "react"
import Stack from "@mui/joy/Stack"
import Mediator from "../common/Mediator"
import { Box } from "@mui/joy"

import GraphPopUps from "./GraphPopUps"
import Controls from "./Controls/Controls"
import Board from "./Board"
import Information from "./Information"

function OpeningGenerator() {
  const boardRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    new Mediator().initialize(boardRef, graphRef)
    graphRef.current?.addEventListener("contextmenu", (e) => e.preventDefault())
  }, [])

  return (
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
      <Controls />
    </Stack>
  )
}

export default OpeningGenerator
