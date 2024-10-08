import { useEffect, useState } from "react"
import { Button, Stack, ToggleButtonGroup, Typography } from "@mui/joy"
import { MoveData } from "../common/GraphBuilder"
import Mediator from "../common/Mediator"
import { State } from "../common/Proxy"

const mediator = new Mediator()

export default function NextMoves() {
  const [moves, setMoves] = useState<MoveData[]>([])
  const [selected, setSelected] = useState<number>(0)

  useEffect(() => {
    mediator.listen(Mediator.STATE_CHANGE, ({ nextMoves }: State) => {
      setMoves(nextMoves)
      setSelected(0)
    })
    return () => {
      mediator.remove(Mediator.STATE_CHANGE)
    }
  }, [])

  return (
    <Stack
      className="T5-nextMoves"
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
              onClick={() => mediator.proxy.playNextMove(move.fen)}
              onMouseOver={() => {
                setSelected(index)
                mediator.board?.showArrow(moves[index])
              }}>
              {move.move.san}
            </Button>
          )
        })}
      </ToggleButtonGroup>
    </Stack>
  )
}
