import { Button, IconButton, Stack, ToggleButtonGroup, Typography } from "@mui/joy"
import useSaveOpening, { OpeningData } from "../scripts/useSaveOpening"
import { useContext } from "react"
import { Delete, Edit } from "@mui/icons-material"
import { MediatorContext } from "./OpeningGenerator/OpeningGenerator"

export default function Openings() {
  const mediator = useContext(MediatorContext)
  const [openings, dispatch] = useSaveOpening()

  function handleClick(opening: OpeningData) {
    mediator?.action("loadOpening", opening)
  }

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="stretcht"
      spacing={1}
      sx={{
        backgroundColor: "background.level2",
        p: 2,
        borderRadius: "0.3rem",
        width: "100%",
        height: "100%"
      }}>
      <Typography color="primary" level="title-lg" sx={{ pb: 1 }}>
        Openings
      </Typography>
      {openings.map((opening: OpeningData) => {
        return (
          <ToggleButtonGroup variant="outlined" key={opening.index}>
            <Button
              value="default"
              fullWidth
              sx={{ justifyContent: "flex-start" }}
              onClick={() => handleClick(opening)}>
              {opening.name}
            </Button>
            <IconButton>
              <Edit />
            </IconButton>
            <IconButton
              size="sm"
              sx={{ borderColor: "neutral.outlinedBorder" }}
              color="danger"
              onClick={() => {
                dispatch("remove", opening)
              }}>
              <Delete />
            </IconButton>
          </ToggleButtonGroup>
        )
      })}
    </Stack>
  )
}
