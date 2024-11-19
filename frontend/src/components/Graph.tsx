import { RefObject, useEffect, useState } from "react"
import Stack from "@mui/joy/Stack"
import Mediator from "../common/Mediator"
import { Box, Typography } from "@mui/joy"
import GraphPopUps from "./GraphPopUps"
import { State } from "../common/Proxy"

interface Props {
  graphRef: RefObject<HTMLDivElement>
}

enum TextState {
  Generator = 0,
  Library = 1,
  None = 2
}

const mediator = new Mediator()

export default function Graph({ graphRef }: Props) {
  const [showText, setShowText] = useState<number>(TextState.Generator)

  useEffect(() => {
    mediator.listen(Mediator.STATE_CHANGE, ({ graph, currentProxy }: State) => {
      if (graph.size === 0) {
        if (currentProxy === "Generator") {
          setShowText(TextState.Generator)
        }
        if (currentProxy === "Library") {
          setShowText(TextState.Library)
        }
      } else {
        setShowText(TextState.None)
      }
    })
    return () => {
      mediator.remove(Mediator.STATE_CHANGE)
    }
  }, [])

  return (
    <Box
      sx={{
        position: "relative",
        width: "1000px",
        height: "500px"
      }}>
      {showText !== TextState.None && (
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
              Add Repertoire moves
              <br /> either by Generate Opening
              <br /> or by making moves on the board
            </Typography>
          )}
          {showText === TextState.Library && (
            <Typography sx={{ textAlign: "center", color: "neutral.200" }} level="h1">
              Choose Repertoire from Library
            </Typography>
          )}
        </Stack>
      )}
      <Box className="T3-graph" ref={graphRef} />
      <GraphPopUps graphRef={graphRef} />
    </Box>
  )
}
