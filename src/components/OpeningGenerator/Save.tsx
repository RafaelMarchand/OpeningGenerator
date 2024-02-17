import { Button, Input, Stack, Typography } from "@mui/joy"
import { useContext, useState } from "react"
import { SelectChangeEvent } from "@mui/material"
import { MediatorContext } from "./OpeningGenerator"
import useSaveOpening from "../../scripts/useSaveOpening"

export default function Save() {
  const mediator = useContext(MediatorContext)
  const [saveOpening] = useSaveOpening()
  const [name, setName] = useState<string>("")

  function handleInput(event: SelectChangeEvent) {
    setName(event.target.value)
  }

  function handleClick() {
    saveOpening(name, mediator!.graph.graph)
    setName("")
  }

  return (
    <Stack
      direction="column"
      justifyContent="space-evenly"
      alignItems="stretcht"
      spacing={2}
      sx={{ backgroundColor: "background.level2", p: 2, borderRadius: "0.3rem" }}>
      <Typography color="neutral" level="h3">
        Save
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
