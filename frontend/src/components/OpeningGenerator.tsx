import { useEffect, useRef } from "react"
import Stack from "@mui/joy/Stack"
import Mediator from "../common/Mediator"
import Controls from "./Controls/Controls"
import Board from "./Board"
import Information from "./Information"
import Graph from "./Graph"

const mediator = new Mediator()

export default function OpeningGenerator() {
  const boardRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<HTMLDivElement>(null)
  const openingGeneratorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mediator.initialize(boardRef, graphRef)
    graphRef.current?.addEventListener("contextmenu", (e) => e.preventDefault())
    window.addEventListener("keydown", () => openingGeneratorRef.current?.focus())
    return () => {
      graphRef.current?.removeEventListener("contextmenu", (e) => e.preventDefault())
      window.removeEventListener("keydown", () => openingGeneratorRef.current?.focus())
    }
  }, [])

  return (
    <div style={{ outline: "none" }} tabIndex={1} ref={openingGeneratorRef} onKeyDown={(e) => mediator.proxy.keyStroke("down", e.key)}>
      <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2} sx={{ pt: 2, height: "100vh", width: "100rem" }}>
        <Stack direction="column" justifyContent="flex-start" alignItems="center" spacing={2} sx={{ overflow: "auto", height: "100%", maxHeight: "100%" }}>
          <Stack direction="row" justifyContent="space-evenly" spacing={2} sx={{ width: "100%" }}>
            <Board boardRef={boardRef} />
            <Information />
          </Stack>
          <Graph graphRef={graphRef} />
        </Stack>
        <Controls />
      </Stack>
    </div>
  )
}
