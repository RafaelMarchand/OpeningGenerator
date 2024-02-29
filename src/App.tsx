import { Stack } from "@mui/joy"
import { Route, Routes } from "react-router-dom"
import Navigation from "./components/Navigation"
import OpeningGenerator from "./components/OpeningGenerator"
import SnackbarProvider from "./components/SnackBarProvider"
import TutorialProvider from "./components/TutorialProvider"
import About from "./components/About"

function App() {
  return (
    <SnackbarProvider>
      <TutorialProvider>
        <Stack
          sx={{ padding: "0", width: "100vw", backgroundColor: "background.level1" }}
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={2}>
          <Navigation></Navigation>
          <Routes>
            <Route path="/" element={<OpeningGenerator />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Stack>
      </TutorialProvider>
    </SnackbarProvider>
  )
}

export default App
