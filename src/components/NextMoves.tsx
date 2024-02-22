import { useEffect, useState } from "react"
import { Button, Stack, ToggleButtonGroup, Typography } from "@mui/joy"
import { MoveData } from "../common/GraphBuilder"
import Mediator from "../common/Mediator"

export default function NextMoves() {
  const [moves, setMoves] = useState<MoveData[]>([])
  const [selected, setSelected] = useState<number>(0)

  useEffect(() => {
    new Mediator().listen("positionChange", (moves: MoveData[]) => {
      setMoves(moves)
      setSelected(0)
    })
  }, [])

  return (
    <Stack
      sx={{ height: "100%" }}
      direction="column"
      justifyContent="center"
      alignItems="flex-start"
      spacing={2}>
      {moves.length > 0 && (
        <Typography color="primary" level="title-lg">
          Next Moves
        </Typography>
      )}
      <ToggleButtonGroup sx={{ width: "100%" }} spacing={2} orientation="vertical" value={String(selected)}>
        {moves.map((move, index) => {
          return (
            <Button
              color="primary"
              variant="soft"
              key={index}
              value={String(index)}
              onClick={() => new Mediator().proxy.playNextMove(move.fen)}
              onMouseOver={() => {
                setSelected(index)
              }}>
              {move.move}
            </Button>
          )
        })}
      </ToggleButtonGroup>
    </Stack>
  )
}
