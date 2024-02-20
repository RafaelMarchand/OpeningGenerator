import { Button, Stack, ToggleButtonGroup } from "@mui/joy"
import { useContext, useState } from "react"
import Configuration from "./Configuration"
import Openings from "../Openings"
import { MediatorContext } from "./OpeningGenerator"

export type ProxyIdentifier = "generator" | "library"

export default function ViewToggler() {
  const mediator = useContext(MediatorContext)
  const [currentView, setCurrentView] = useState<ProxyIdentifier | null>("generator")

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="stretch"
      spacing={0}
      sx={{ width: "100%", height: "100%" }}>
      <ToggleButtonGroup
        size="lg"
        variant="solid"
        value={currentView}
        onChange={(_event, newValue) => {
          if (newValue) setCurrentView(newValue)
          mediator?.switchProxy(newValue!)
        }}>
        <Button
          value="generator"
          sx={{ borderBottomRightRadius: "0", borderBottomLeftRadius: "0" }}
          fullWidth>
          Configuration
        </Button>
        <Button value="library" fullWidth sx={{ borderBottomRightRadius: "0", borderBottomLeftRadius: "0" }}>
          Library
        </Button>
      </ToggleButtonGroup>
      {currentView === "generator" ? <Configuration /> : <Openings />}
    </Stack>
  )
}
