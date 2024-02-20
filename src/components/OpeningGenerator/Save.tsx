import { Button, Input, Stack, Typography } from "@mui/joy"
import { useContext, useState } from "react"
import { SelectChangeEvent } from "@mui/material"
import { MediatorContext } from "./OpeningGenerator"
import useSaveOpening from "../../scripts/useSaveOpening"

export default function Save() {
  const mediator = useContext(MediatorContext)
  const [openings, reducer] = useSaveOpening()
  const [name, setName] = useState<string>("")

  function handleInput(event: SelectChangeEvent) {
    setName(event.target.value)
  }

  function handleClick() {
    const opening = {
      name: name,
      graph: mediator!.proxy.graphBuilder.graph,
      index: openings.length === 0 ? 0 : openings.length,
      edit: false
    }
    reducer("save", opening)
    setName("")
  }

  return (
    <Stack direction="column" justifyContent="space-evenly" alignItems="stretcht" spacing={2} sx={{}}>
      <Typography color="primary" level="title-lg">
        Save to Library
      </Typography>
      <Input
        value={name}
        color="primary"
        placeholder="Opening Name"
        variant="outlined"
        onChange={handleInput}
      />
      <Button onClick={handleClick} size="lg">
        Save Opening
      </Button>
    </Stack>
  )
}
