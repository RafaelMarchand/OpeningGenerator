import { Snackbar } from "@mui/joy"
import { Dispatch, createContext, useState } from "react"

interface Props {
  children: any
}

type SnackBarState = {
  message: string
  color: any
  open: boolean
}

export const SnackBarContext = createContext<Dispatch<React.SetStateAction<SnackBarState>> | null>(null)

function SnackbarProvider({ children }: Props) {
  const [snackBar, setSnackBar] = useState<SnackBarState>({
    message: "",
    color: "neutral",
    open: false
  })

  function closeSnackBar() {
    setSnackBar({
      message: "",
      color: "neutral",
      open: false
    })
  }

  return (
    <SnackBarContext.Provider value={setSnackBar}>
      {children}
      <Snackbar
        color={snackBar.color}
        variant="solid"
        autoHideDuration={3000}
        open={snackBar.open}
        onClose={closeSnackBar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        {snackBar.message}
      </Snackbar>
    </SnackBarContext.Provider>
  )
}

export default SnackbarProvider
