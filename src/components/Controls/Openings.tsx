import { Button, IconButton, Stack, ToggleButtonGroup, Typography } from "@mui/joy"
import useSaveOpening, { OpeningData } from "../../common/useSaveOpening"
import { Delete, Edit } from "@mui/icons-material"
import Mediator from "../../common/Mediator"
import { DispatchController } from "./Controls"
import { Dispatch } from "react"

interface Props {
  dispatch: Dispatch<DispatchController>
}

const mediator = new Mediator()

export default function Openings({ dispatch }: Props) {
  const [openings, dispatchOpening] = useSaveOpening()

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
              onClick={() => {
                mediator.action("loadOpening", opening)
              }}>
              {opening.name}
            </Button>
            <IconButton
              onClick={() => {
                mediator.action("editOpening", opening)
                dispatch({ type: "edit", payload: opening })
              }}>
              <Edit />
            </IconButton>
            <IconButton
              size="sm"
              sx={{ borderColor: "neutral.outlinedBorder" }}
              color="danger"
              onClick={() => {
                dispatchOpening("remove", opening)
              }}>
              <Delete />
            </IconButton>
          </ToggleButtonGroup>
        )
      })}
    </Stack>
  )
}
