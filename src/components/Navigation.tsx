import { Home, Save, LibraryBooks } from "@mui/icons-material"
import { Box, List, ListItem, ListItemButton, ListItemDecorator } from "@mui/joy"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function Navigation() {
  const [selected, setSelected] = useState<number>(0)
  return (
    <Box
      sx={{
        boxSizing: "border-box",
        height: "100vh",
        width: "200px",
        backgroundColor: "background.level2"
      }}>
      <List size="lg" variant="plain">
        <ListItem>
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
    </Box>
  )
}
