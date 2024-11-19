import { Stack, Typography } from "@mui/joy"
import NextMoves from "./NextMoves"

export default function Information() {
  return (
    <Stack
      className="T4-info"
      direction="column"
      justifyContent="flex-start"
      alignItems="stretch"
      spacing={2}
      sx={{
        width: "20%",
        borderRadius: "0.4rem",
        backgroundColor: "background.level2",
        p: 2
      }}>
      <Typography color="neutral" level="h3">
        Infos
      </Typography>
      <NextMoves />
    </Stack>
  )
}
