import { Button, Input, Stack, Typography } from "@mui/joy"
import { Dispatch, useContext } from "react"
import { OpeningData, useOpeningsActions } from "../../common/useSaveOpening"
import Mediator from "../../common/Mediator"
import { ControllerState, DispatchController, NO_OPENING_SELECTED } from "./Controls"
import { SnackBarContext } from "../SnackBarProvider"

interface Props {
  state: ControllerState
  dispatch: Dispatch<DispatchController>
  openings: OpeningData[]
  setOpenings: (action: useOpeningsActions, opening: OpeningData) => void
}

const mediator = new Mediator()

export default function ManageOpening({ state, dispatch, setOpenings }: Props) {
  const setSnackBar = useContext(SnackBarContext)!

  function getOpeningData(): OpeningData {
    const opening = {
      name: state.inputName,
      index: state.openingIndex,
      graph: mediator.proxy.graphBuilder.graph
    }
    return opening
  }

  function handleSave() {
    if (state.inputName === "") {
      setSnackBar({
        color: "danger",
        open: true,
        message: "Please provide a name"
      })
      return
    }
    setOpenings("save", getOpeningData())
    dispatch({ type: "setInputName", payload: "" })
    mediator.generatorProxy.graphBuilder.saved = true
  }

  function handleRename() {
    if (state.openingIndex === NO_OPENING_SELECTED) {
      setSnackBar({
        color: "primary",
        open: true,
        message: "No opening selected"
      })
      return
    }
    setOpenings("edit", getOpeningData())
    setSnackBar({
      color: "success",
      open: true,
      message: `Opening renamed to ${state.inputName}`
    })
  }

  function handleReset() {
    mediator.proxy.resetGraph()
    dispatch({ type: "setOpening", payload: { index: -1, name: "" } })
  }

  function handleSaveChanges() {
    setOpenings("edit", getOpeningData())
    dispatch({ type: "saveChanges", payload: "" })
    setSnackBar({
      color: "success",
      open: true,
      message: "Opening saved"
    })
  }

  function handleExport() {
    setSnackBar({
      color: "primary",
      open: true,
      message: "Not supported yet"
    })
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
        value={state.inputName}
        color="primary"
        placeholder="Opening Name"
        variant="outlined"
        onChange={(event) => dispatch({ type: "setInputName", payload: event.target.value })}
      />
      <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
        {state.currentView === "Library" ? (
          <>
            <Button onClick={handleRename} fullWidth size="lg">
              Rename
            </Button>
            <Button onClick={handleExport} fullWidth size="lg">
              Export PNG
            </Button>
          </>
        ) : (
          <>
            {state.openingIndex !== NO_OPENING_SELECTED ? (
              <>
                <Button
                  color="success"
                  onClick={handleSaveChanges}
                  sx={{ fontSize: "sm" }}
                  fullWidth
                  size="lg">
                  Save Changes
                </Button>
                <Button color="neutral" onClick={handleReset} fullWidth size="lg">
                  Cancle
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleSave} fullWidth size="lg">
                  Save
                </Button>
                <Button onClick={handleReset} fullWidth size="lg">
                  Reset
                </Button>
              </>
            )}
          </>
        )}
      </Stack>
    </Stack>
  )
}
