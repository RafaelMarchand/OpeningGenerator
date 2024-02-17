import { List, ListItem, ListItemButton } from "@mui/joy"
import useSaveOpening from "../scripts/useSaveOpening"

export default function Openings() {
  const [_save, getAll, remove] = useSaveOpening()

  return (
    <List variant="outlined">
      {getAll().map((opening) => {
        return (
          <ListItem>
            <ListItemButton>{opening.name}</ListItemButton>
          </ListItem>
        )
      })}
    </List>
  )
}
