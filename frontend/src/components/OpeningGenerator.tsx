import { useEffect, useRef } from "react"
import Stack from "@mui/joy/Stack"
import Mediator from "../common/Mediator"
import Controls from "./Controls/Controls"
import Board from "./Board"
import Information from "./Information"
import Graph from "./Graph"
import { NAVIGATION_KEYS } from "../common/Proxy"

const mediator = new Mediator()

export default function OpeningGenerator() {
  const boardRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<HTMLDivElement>(null)
  const navigationArea = useRef<HTMLDivElement>(null)

  function handleKeyDown(event: KeyboardEvent) {
    if (Object.values(NAVIGATION_KEYS).includes(event.key)) {
      navigationArea.current?.focus()
    }
    mediator.proxy.keyStroke("down", event.key)
  }

  useEffect(() => {
    mediator.initialize(boardRef, graphRef)
    graphRef.current?.addEventListener("contextmenu", (e) => e.preventDefault())
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      graphRef.current?.removeEventListener("contextmenu", (e) => e.preventDefault())
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2} sx={{ pt: 2, height: "100vh", width: "100%" }}>
      <Stack
        tabIndex={1}
        ref={navigationArea}
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
        sx={{ outline: "none", overflow: "auto", height: "100%", maxHeight: "100%" }}>
        <Stack direction="row" justifyContent="space-evenly" spacing={2} sx={{ width: "100%" }}>
          <Board boardRef={boardRef} />
          <Information />
        </Stack>
        <Graph graphRef={graphRef} />
      </Stack>
      <Controls />
    </Stack>
  )
}
