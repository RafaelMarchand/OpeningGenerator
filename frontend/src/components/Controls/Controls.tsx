import { Button, Stack, ToggleButtonGroup } from "@mui/joy"
import Configuration from "./Configuration"
import { useContext, useReducer } from "react"
import Openings from "./Openings"
import Mediator from "../../common/Mediator"
import ManageOpening from "./ManageOpening"
import useSaveOpening from "../../common/useSaveOpening"
import { ProxyIdentifier } from "../../common/Proxy"
import { SnackBarContext } from "../SnackBarProvider"

export interface DispatchController {
  type: ActionController
  payload: any
}

export type ActionController = "setOpening" | "edit" | "toggle" | "setInputName" | "saveChanges"

export type ControllerState = {
  currentView: ProxyIdentifier
  inputName: string
  openingIndex: -1
}

export const NO_OPENING_SELECTED = -1

function reducer(prevState: ControllerState, action: DispatchController): ControllerState {
  const state = {
    ...prevState
  }

  switch (action.type) {
    case "setInputName":
      state.inputName = action.payload
      break
    case "setOpening":
      state.openingIndex = action.payload.index
      state.inputName = action.payload.name
      break
    case "edit":
      state.openingIndex = action.payload.index
      state.inputName = action.payload.name
      state.currentView = "Generator"
      break
    case "toggle":
      state.currentView = prevState.currentView === "Generator" ? "Library" : "Generator"
      state.openingIndex = NO_OPENING_SELECTED
      state.inputName = ""
      break
    case "saveChanges":
      state.openingIndex = NO_OPENING_SELECTED
      state.inputName = ""
      break
  }
  return state
}

const mediator = new Mediator()

const DEFAULT_CONTROL_STATE: ControllerState = {
  currentView: "Generator",
  inputName: "",
  openingIndex: NO_OPENING_SELECTED
}

export default function Controls() {
  const [state, dispatch] = useReducer(reducer, DEFAULT_CONTROL_STATE)
  const [openings, setOpenings] = useSaveOpening()
  const setSnackBar = useContext(SnackBarContext)!

  return (
    <Stack direction="column" justifyContent="space-between" alignItems="stretch" spacing={2} sx={{ width: "24%", height: "100%", pb: 2 }}>
      <Stack direction="column" justifyContent="flex-start" alignItems="stretch" spacing={0} sx={{ width: "auto", height: "80%" }}>
        <ToggleButtonGroup
          size="lg"
          variant="solid"
          value={String(state.currentView)}
          onChange={(_event, newValue) => {
            if (state.currentView === "Generator" && mediator.generatorProxy.isGenerating) {
              setSnackBar({
                color: "primary",
                open: true,
                message: "Can not switch to Library while generating"
              })
              return
            }
            if (newValue) {
              dispatch({ type: "toggle", payload: {} })
              mediator.switchProxy()
              mediator.proxy.updateUI()
            }
          }}>
          <Button
            value="Generator"
            sx={{
              width: "50%",
              whiteSpace: "nowrap",
              borderBottomRightRadius: "0",
              borderBottomLeftRadius: "0",
              backgroundColor: state.currentView === "Generator" ? "#212121" : "",
              "&:hover": {
                backgroundColor: ""
              }
            }}>
            Create Opening
          </Button>
          <Button
            value="Library"
            sx={{
              width: "50%",
              borderBottomRightRadius: "0",
              borderBottomLeftRadius: "0",
              backgroundColor: state.currentView !== "Generator" ? "#212121" : "",
              "&:hover": {
                backgroundColor: ""
              }
            }}>
            Library
          </Button>
        </ToggleButtonGroup>
        {state.currentView === "Generator" ? <Configuration /> : <Openings dispatch={dispatch} openings={openings} setOpenings={setOpenings} />}
      </Stack>
      <ManageOpening state={state} dispatch={dispatch} openings={openings} setOpenings={setOpenings} />
    </Stack>
  )
}
