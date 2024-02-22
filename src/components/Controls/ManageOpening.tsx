import { Button, Input, Stack, Typography } from "@mui/joy"
import { Dispatch } from "react"
import { SelectChangeEvent } from "@mui/material"
import useSaveOpening from "../../common/useSaveOpening"
import Mediator from "../../common/Mediator"
import { ControllerState, DispatchController } from "./Controls"

interface Props {
  state: ControllerState
  dispatch: Dispatch<DispatchController>
}

const mediator = new Mediator()

export default function ManageOpening({ state, dispatch }: Props) {
  const [openings, reducer] = useSaveOpening()

  function handleInput(event: SelectChangeEvent) {
    dispatch({ type: "setName", payload: event.target.value })
  }

  function handleSave() {
    const opening = {
      name: state.openingName,
      graph: mediator.proxy.graphBuilder.graph,
      index: openings.length === 0 ? 0 : openings.length,
      edit: false
    }
    reducer("save", opening)
    dispatch({ type: "setName", payload: "" })
  }

  function handleReset() {
    //setEdite(false)
  }

  function handleModify() {
    //setEdite(false)
  }

  return (
    <Stack
      direction="column"
      justifyContent="space-evenly"
      alignItems="stretcht"
      spacing={2}
      sx={{
        backgroundColor: "background.level2",
        p: 2,
        borderRadius: "0.3rem",
        height: "20%"
      }}>
      <Typography color="primary" level="title-lg">
        Manage Openings
      </Typography>
      <Input
        id="OpeningName"
        value={state.openingName}
        color="primary"
        placeholder="Opening Name"
        variant="outlined"
        onChange={handleInput}
      />
      <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
        {state.currentView === "library" ? (
          <Button onClick={handleModify} fullWidth size="lg">
            Rename
          </Button>
        ) : (
          <Button onClick={handleSave} fullWidth size="lg">
            Save
          </Button>
        )}
        {state.editOpening ? (
          <Button onClick={handleModify} fullWidth size="lg">
            Cancle
          </Button>
        ) : (
          <Button onClick={handleReset} fullWidth size="lg">
            Reset
          </Button>
        )}
      </Stack>
    </Stack>
  )
}
