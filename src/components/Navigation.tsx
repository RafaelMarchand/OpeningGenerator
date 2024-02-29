import { Home, Save, LibraryBooks, Info } from "@mui/icons-material"
import { Box, Button, List, ListItem, ListItemButton, ListItemDecorator, Stack } from "@mui/joy"
import { useTour } from "@reactour/tour"
import { useContext, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import Mediator from "../common/Mediator"
import { SnackBarContext } from "./SnackBarProvider"

const mediator = new Mediator()

export default function Navigation() {
  const [selected, setSelected] = useState<number>(0)
  const setSnackBar = useContext(SnackBarContext)!
  const { setIsOpen, currentStep, steps } = useTour()
  const location = useLocation()

  useEffect(() => {
    if (steps.length - 1 === currentStep) {
      setIsOpen(false)
    }
  }, [currentStep])

  function handleOpenTour() {
    if (mediator.proxy === mediator.libraryProxy) {
      setSnackBar({
        color: "danger",
        open: true,
        message: "Switch to Create Opening to use tutorial"
      })
      return
    }

    if (location.pathname !== "/") {
      setSnackBar({
        color: "danger",
        open: true,
        message: "Can only be used on the main page"
      })
      return
    }
    setIsOpen(true)
  }

  return (
    <Box
      sx={{
        p: 2,
        height: "100vh",
        width: "200px",
        backgroundColor: "background.level2"
      }}>
      <List size="lg" variant="plain">
        <ListItem sx={{ p: 0 }}>
          <Link
            style={{
              textDecoration: "none",
              width: "100%"
            }}
            to={"/"}>
            <ListItemButton selected={selected === 0} onClick={() => setSelected(0)}>
              <ListItemDecorator>
                <Home />
              </ListItemDecorator>
              Generator
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
      <Button fullWidth onClick={handleOpenTour}>
        Tutorial
      </Button>
      <Stack
        direction="column"
        justifyContent="flex-end"
        alignItems="flex-start"
        spacing={0}
        sx={{ height: "90%" }}>
        <Link
          style={{
            textDecoration: "none",
            width: "100%"
          }}
          to={"/about"}>
          <ListItemButton selected={selected === 0} onClick={() => setSelected(0)}>
            About
          </ListItemButton>
        </Link>
      </Stack>
    </Box>
  )
}
