import { Box, List, ListItem, Typography } from "@mui/joy"
import Stack from "@mui/joy/Stack"

export default function About() {
  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={2}
      sx={{ pt: 2, height: "100vh", width: "100rem" }}>
      <Typography color="neutral" level="h4">
        Release Alpha 0.1
      </Typography>
      <Box sx={{ width: "80%" }}>
        This first release contains the bare minimum user interface combined with a simple algorithm that
        generates openings based on the{" "}
        <a href="https://lichess.org/api#tag/Opening-Explorer/operation/openingExplorerMaster">
          lichess games API
        </a>
        . Due to the rate limit of the API, generating openings might take some time and can potentially cause
        lag, especially when using maximum depth and maximum considered response moves. As of right now, the
        layout is not fully responsive. It's advised to use desktop view in full screen.
        <br />
        <br />
        If you want to help improve the app, you can report bugs to{" "}
        <a href="mailto:rafaelm_1@live.de">rafaelm_1@live.de</a> .
      </Box>
      <Typography color="neutral" level="h4">
        Planned features
      </Typography>
      The following features are (hopefully) coming soon:
      <List marker="circle" sx={{ width: "80%" }}>
        <ListItem>Export opening as PGN</ListItem>
        <ListItem>Improved algorithm to generate openings</ListItem>
        <ListItem>Advanced settings to have more control over the generator</ListItem>
        <ListItem>Option to favor forcing lines</ListItem>
        <ListItem>
          Connect your Chess.com/Lichess account to take your current opening moves into consideration and
          generate an opening around them
        </ListItem>
      </List>
    </Stack>
  )
}
