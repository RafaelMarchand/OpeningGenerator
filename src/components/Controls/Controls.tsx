import { Button, Stack, ToggleButtonGroup } from "@mui/joy"
import Configuration from "./Configuration"
import { useEffect, useReducer, useState } from "react"
import Openings from "./Openings"
import Mediator, { ProxyIdentifier } from "../../common/Mediator"
import ManageOpening from "./ManageOpening"
import useSaveOpening, { OpeningData } from "../../common/useSaveOpening"

export interface DispatchController {
  type: ActionController
  payload: any
}

export type ActionController = "setOpening" | "edit" | "toggle" | "setInputName"

export type ControllerState = {
  currentView: ProxyIdentifier
  inputName: string
  openinIndex: -1
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
      state.openinIndex = action.payload.index
      state.inputName = action.payload.name
      break
    case "edit":
      state.openinIndex = action.payload.index
      state.inputName = action.payload.name
      state.currentView = "generator"
      break
    case "toggle":
      state.currentView = prevState.currentView === "generator" ? "library" : "generator"
      state.openinIndex = NO_OPENING_SELECTED
      state.inputName = ""
      break
  }
  return state
}

const mediator = new Mediator()

const DEFAULT_CONTROL_STATE: ControllerState = {
  currentView: "generator",
  inputName: "",
  openinIndex: NO_OPENING_SELECTED
}

export default function Controls() {
  const [state, dispatch] = useReducer(reducer, DEFAULT_CONTROL_STATE)
  const [openings, setOpenings] = useSaveOpening()

  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      alignItems="stretch"
      spacing={2}
      sx={{ width: "24%", height: "100%", pb: 2 }}>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="stretch"
        spacing={0}
        sx={{ width: "100%", height: "80%" }}>
        <ToggleButtonGroup
          size="lg"
          variant="solid"
          value={String(state.currentView)}
          onChange={(_event, newValue) => {
            if (newValue) {
              dispatch({ type: "toggle", payload: {} })
              mediator.switchProxy()
              mediator.proxy.updateUI()
            }
          }}>
          <Button
            value="generator"
            sx={{ borderBottomRightRadius: "0", borderBottomLeftRadius: "0" }}
            fullWidth>
            Configuration
          </Button>
          <Button
            value="library"
            fullWidth
            sx={{ borderBottomRightRadius: "0", borderBottomLeftRadius: "0" }}>
            Library
          </Button>
        </ToggleButtonGroup>
        {state.currentView === "generator" ? (
          <Configuration />
        ) : (
          <Openings dispatch={dispatch} openings={openings} setOpenings={setOpenings} />
        )}
      </Stack>
      <ManageOpening state={state} dispatch={dispatch} openings={openings} setOpenings={setOpenings} />
    </Stack>
  )
}
