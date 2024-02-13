import { useEffect, useState } from "react"
import Mediator from "./scripts/Mediator"
import { Button, Stack } from "@mui/joy"

interface Props {
  mediator: Mediator | null
}

export default function NextMoves({ mediator }: Props) {
  if (!mediator) return <></>
  const [moves, setMoves] = useState<string[]>([])

  useEffect(() => {
    mediator.listen("positionChange", setMoves)
  }, [])

  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
      {moves.map((move) => {
        return <Button>{move}</Button>
      })}
    </Stack>
  )
}
