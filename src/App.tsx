import { Stack } from "@mui/joy"
import { Route, Routes } from "react-router-dom"
import Navigation from "./components/Navigation"
import OpeningGenerator from "./components/OpeningGenerator"
import SnackbarProvider from "./components/SnackBarProvider"

function App() {
  return (
    <SnackbarProvider>
      <Stack
        sx={{ padding: "0", backgroundColor: "background.level1" }}
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={2}>
        <Navigation></Navigation>
        <Routes>
          <Route path="/" element={<OpeningGenerator />} />
        </Routes>
      </Stack>
    </SnackbarProvider>
  )
}

export default App
