import { useEffect, useRef, useState } from "react"
import Generator from "./Generator"
import Stack from "@mui/joy/Stack"

import Mediator from "./scripts/Mediator"
import { Box } from "@mui/joy"
import BoardPopUp from "./BoardPopUp"

import "../node_modules/chessground/assets/chessground.base.css"
import "../node_modules/chessground/assets/chessground.brown.css"
import "../node_modules/chessground/assets/chessground.cburnett.css"

function App() {
  const boardRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<HTMLDivElement>(null)
  const mediator = useRef<Mediator | null>(null)
  const [boardPopUp, setBoardPopUp] = useState<boolean>(false)
  const [config, setConfig] = useState<any>({})

  function nodeHoverHandler(position: string, nodePos: any) {
    const { left, top } = graphRef.current!.getBoundingClientRect()

    if (position !== undefined) {
      setBoardPopUp(true)
      setConfig({
        config: {
          fen: position
        },
        offsetX: nodePos.x + left + 15,
        offsetY: nodePos.y + top + 15
      })
    } else {
      setBoardPopUp(false)
    }
  }

  useEffect(() => {
    mediator.current = new Mediator(boardRef, graphRef, nodeHoverHandler)
  }, [])

  return (
    <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
      <div ref={boardRef} style={{ width: "400px", height: "400px" }} />
      <Box>
        <Box ref={graphRef} sx={{ zIndex: "1" }}></Box>
        <BoardPopUp show={boardPopUp} config={config} />
      </Box>
      <Generator mediatorRef={mediator}></Generator>
    </Stack>
  )
}

export default App
