import { Stack } from "@mui/joy"
import Configuration from "./Configuration"
import Save from "./Save"

export default function Settings() {
  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="stretch" spacing={2}>
      <Configuration />
      <Save />
    </Stack>
  )
}
