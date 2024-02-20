import { Button, Stack, ToggleButtonGroup } from "@mui/joy"
import Configuration from "./Configuration"
import Save from "./Save"
import { useState } from "react"
import Openings from "../Openings"
import ViewToggler from "./ViewToggler"

export default function Settings() {
  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      alignItems="stretch"
      spacing={2}
      sx={{ width: "24%", height: "100%", pb: 2 }}>
      <ViewToggler />
    </Stack>
  )
}
