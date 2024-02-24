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

export default function ManageOpening({ state, dispatch, openings, setOpenings }: Props) {
  const setSnackBar = useContext(SnackBarContext)!

  function getOpeningData(): OpeningData {
    const opening = {
      name: state.inputName,
      index: state.openinIndex,
      graph: mediator.proxy.graphBuilder.graph
    }
    return opening
  }

  function handleSave() {
    setOpenings("save", getOpeningData())
    dispatch({ type: "setInputName", payload: "" })
  }

  function handleRename() {
    if (state.openinIndex === NO_OPENING_SELECTED) {
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
      message: `Opening renamed to "${state.inputName}"`
    })
  }

  function handleReset() {
    mediator.proxy.resetGraph()
    dispatch({ type: "setOpening", payload: { index: -1, name: "" } })
  }

  function handleModify() {
    setOpenings("edit", getOpeningData())
    dispatch({ type: "setInputName", payload: "" })
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
        {state.currentView === "library" ? (
          <>
            <Button onClick={handleRename} fullWidth size="lg">
              Rename
            </Button>
            <Button onClick={handleModify} fullWidth size="lg">
              Export PNG
            </Button>
          </>
        ) : (
          <>
            {state.openinIndex !== NO_OPENING_SELECTED ? (
              <>
                <Button color="success" onClick={handleModify} sx={{ fontSize: "sm" }} fullWidth size="lg">
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
