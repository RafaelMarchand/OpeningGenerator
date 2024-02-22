import { Button, Stack, ToggleButtonGroup } from "@mui/joy"
import Configuration from "./Configuration"
import { useEffect, useReducer, useState } from "react"
import Openings from "./Openings"
import Mediator, { ProxyIdentifier } from "../../common/Mediator"
import ManageOpening from "./ManageOpening"

export interface DispatchController {
  type: ActionController
  payload: any
}

export type ActionController = "setName" | "edit" | "toggle"

export type ControllerState = {
  currentView: ProxyIdentifier
  editOpening: boolean
  openingName: string
}

function reducer(prevState: ControllerState, action: DispatchController): ControllerState {
  const state = {
    ...prevState
  }
  switch (action.type) {
    case "setName":
      state.openingName = action.payload
      break
    case "edit":
      state.openingName = action.payload.name
      state.currentView = "generator"
      state.editOpening = true
      break
    case "toggle":
      state.currentView = prevState.currentView === "generator" ? "library" : "generator"
      break
  }
  return state
}

const DEFAULT_STATE: ControllerState = {
  currentView: "generator",
  editOpening: false,
  openingName: ""
}

const mediator = new Mediator()

export default function Controls() {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE)

  useEffect(() => {
    mediator.listen("toggleView", (identifier: ProxyIdentifier) => {
      //setCurrentView(identifier)
    })
  }, [])

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
          value={state.currentView}
          onChange={(_event, newValue) => {
            if (newValue) dispatch({ type: "toggle", payload: {} })
            mediator.switchProxy(newValue!)
            mediator.proxy.updateUI()
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
        {state.currentView === "generator" ? <Configuration /> : <Openings dispatch={dispatch} />}
      </Stack>
      <ManageOpening state={state} dispatch={dispatch} />
    </Stack>
  )
}
