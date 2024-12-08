import { useEffect, useState } from "react"
import { Stack, Typography } from "@mui/joy"
import { MoveData } from "../common/GraphBuilder"
import Mediator from "../common/Mediator"
import Proxy from "../common/Proxy"
import { State } from "../common/Proxy"
import { grey } from "@mui/material/colors"
import { Button } from "@mui/material"

const mediator = new Mediator()

export default function NextMoves() {
  const [moves, setMoves] = useState<MoveData[]>([])
  const [selected, setSelected] = useState<number>(0)

  if (moves.length > 0) {
    mediator.board?.showArrow(moves[selected])
  }
  mediator.proxy.selectedMove = selected

  useEffect(() => {
    mediator.listen(Mediator.STATE_CHANGE, ({ nextMoves }: State) => {
      setMoves(nextMoves)
      setSelected(0)
    })
    new Array<Proxy>(mediator.generatorProxy, mediator.libraryProxy).forEach((proxy) => {
      proxy.listen(Proxy.SELECT_MOVE, (newSelected: number) => {
        setSelected(newSelected)
      })
    })

    return () => {
      new Array<Proxy>(mediator.generatorProxy, mediator.libraryProxy).forEach((proxy) => {
        proxy.remove(Proxy.SELECT_MOVE)
      })
      mediator.remove(Mediator.STATE_CHANGE)
    }
  }, [])

  return (
    <Stack className="T5-nextMoves" sx={{ height: "100%" }} direction="column" justifyContent="center" alignItems="flex-start" spacing={2}>
      {moves.length > 0 && (
        <Typography color="primary" level="title-lg">
          Next Moves
        </Typography>
      )}
      {moves.map((move, index) => {
        return (
          <Button
            color="primary"
            variant="outlined"
            key={index}
            fullWidth
            style={{ fontWeight: "bold", backgroundColor: selected === index ? grey[400] : grey[200] }}
            onClick={() => mediator.proxy.playNextMove(move.fen)}
            onMouseOver={() => {
              setSelected(index)
              if (index === selected) {
                mediator.board?.showArrow(moves[selected])
              }
            }}
            onMouseLeave={() => {
              mediator.board?.hideArrows()
            }}>
            {move.move.san}
          </Button>
        )
      })}
    </Stack>
  )
}
