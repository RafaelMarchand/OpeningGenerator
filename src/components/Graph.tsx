import { RefObject, useEffect, useState } from "react"
import Stack from "@mui/joy/Stack"
import Mediator, { ProxyIdentifier } from "../common/Mediator"
import { Box, Typography } from "@mui/joy"
import GraphPopUps from "./GraphPopUps"
import { GraphType } from "../common/GraphBuilder"

interface Props {
  graphRef: RefObject<HTMLDivElement>
}

enum TextState {
  Generator = 0,
  Library = 1,
  Nonde = 2
}

const mediator = new Mediator()

export default function Graph({ graphRef }: Props) {
  const [showText, setShowText] = useState<number>(TextState.Generator)

  useEffect(() => {
    mediator.listen("stateChange", (graph: GraphType, proxyId: ProxyIdentifier) => {
      if (graph.size === 0) {
        if (proxyId === "generator") {
          setShowText(TextState.Generator)
        }
        if (proxyId === "library") {
          setShowText(TextState.Library)
        }
      } else {
        setShowText(TextState.Nonde)
      }
    })
  }, [])

  return (
    <Box
      sx={{
        position: "relative",
        width: "1000px",
        height: "500px"
      }}>
      {showText !== TextState.Nonde && (
        <Stack
          sx={{
            height: "100%",
            width: "100%",
            backgroundColor: "black",
            borderRadius: "0.3rem",
            position: "absolute",
            top: "0",
            left: "0",
            m: 0
          }}
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}>
          {showText === TextState.Generator && (
            <Typography sx={{ textAlign: "center", color: "neutral.200" }} level="h1">
              Add repertoir moves
              <br /> either by generating moves
              <br /> or by making moves on the board
            </Typography>
          )}
          {showText === TextState.Library && (
            <Typography sx={{ textAlign: "center", color: "neutral.200" }} level="h1">
              Choose Repertoir from Library
            </Typography>
          )}
        </Stack>
      )}
      <Box ref={graphRef} />
      <GraphPopUps graphRef={graphRef} />
    </Box>
  )
}
