import { Button, Input, Modal, ModalClose, Sheet, Stack, Textarea, Typography } from "@mui/joy"
import { Dispatch, useContext, useEffect, useState } from "react"
import { OpeningData, useOpeningsActions } from "../../common/useSaveOpening"
import Mediator from "../../common/Mediator"
import { ControllerState, DispatchController, NO_OPENING_SELECTED } from "./Controls"
import { SnackBarContext } from "../SnackBarProvider"
import LibraryProxy from "../../common/LibraryProxy"

interface Props {
  state: ControllerState
  dispatch: Dispatch<DispatchController>
  openings: OpeningData[]
  setOpenings: (action: useOpeningsActions, opening: OpeningData) => void
}

const mediator = new Mediator()

export default function ManageOpening({ state, dispatch, setOpenings }: Props) {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [pgn, setPgn] = useState<string>("")
  const setSnackBar = useContext(SnackBarContext)!

  useEffect(() => {
    mediator.libraryProxy.listen(LibraryProxy.NEW_MOVE_NOTIFICATION, () => {
      setSnackBar({
        color: "warning",
        open: true,
        message: "Can not add new moves in library, to do so edit this opening",
        duration: 6000
      })
    })
    return () => {
      mediator.libraryProxy.remove(LibraryProxy.NEW_MOVE_NOTIFICATION)
    }
  }, [])

  function getOpeningData(): OpeningData {
    const opening = {
      name: state.inputName,
      index: state.openingIndex,
      graph: mediator.proxy.graphBuilder.graph
    }
    return opening
  }

  function handleSave() {
    if (state.inputName === "") {
      setSnackBar({
        color: "danger",
        open: true,
        message: "Please provide a name"
      })
      return
    }
    setOpenings("save", getOpeningData())
    dispatch({ type: "setInputName", payload: "" })
    mediator.proxy.graphBuilder.saved = true
    mediator.proxy.resetGraph()
    setSnackBar({
      color: "success",
      open: true,
      message: "Opening saved to Library"
    })
  }

  function handleRename() {
    if (state.openingIndex === NO_OPENING_SELECTED) {
      setSnackBar({
        color: "primary",
        open: true,
        message: "No opening selected"
      })
      return
    }
    setOpenings("edit", getOpeningData())
    setSnackBar({
      color: "success",
      open: true,
      message: `Opening renamed to ${state.inputName}`
    })
  }

  function handleReset() {
    mediator.proxy.resetGraph()
    dispatch({ type: "setOpening", payload: { index: -1, name: "" } })
  }

  function handleSaveChanges() {
    setOpenings("edit", getOpeningData())
    dispatch({ type: "saveChanges", payload: "" })
    setSnackBar({
      color: "success",
      open: true,
      message: "Opening saved"
    })
  }

  function handlePGNExport() {
    setSnackBar({
      color: "primary",
      open: true,
      message: "Not supported yet"
    })
  }

  function handlePGNImport() {
    setOpenModal(false)
    setPgn("")
    mediator.proxy.importPGN(pgn)
  }

  return (
    <Stack
      direction="column"
      justifyContent="space-evenly"
      alignItems="stretcht"
      spacing={2}
      sx={{
        backgroundColor: "background.level2",
        p: 2,
        borderRadius: "0.3rem",
        height: "20%"
      }}>
      <Typography color="primary" level="title-lg">
        Manage Openings
      </Typography>
      <Input
        id="OpeningName"
        value={state.inputName}
        color="primary"
        placeholder="Opening Name"
        variant="outlined"
        onChange={(event) => dispatch({ type: "setInputName", payload: event.target.value })}
      />
      <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
        {state.currentView === "Library" ? (
          <>
            <Button onClick={handleRename} fullWidth>
              Rename
            </Button>
            <Button onClick={handlePGNExport} fullWidth>
              Export PNG
            </Button>
          </>
        ) : (
          <>
            {state.openingIndex !== NO_OPENING_SELECTED ? (
              <>
                <Button color="success" onClick={handleSaveChanges} sx={{ fontSize: "sm" }} fullWidth>
                  Save Changes
                </Button>
                <Button color="neutral" onClick={handleReset} fullWidth>
                  Cancle
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleSave} fullWidth>
                  Save
                </Button>
                <Button onClick={handleReset} fullWidth>
                  Reset
                </Button>
                <Button sx={{ whiteSpace: "nowrap" }} onClick={() => setOpenModal(true)} fullWidth>
                  Import PGN
                </Button>
              </>
            )}
          </>
        )}
      </Stack>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Sheet
          variant="soft"
          color="neutral"
          sx={{
            borderRadius: "md",
            p: 3,
            boxShadow: "lg"
          }}>
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography component="h2" id="modal-title" level="h4" textColor="inherit" fontWeight="lg" mb={1}>
            Load PGN
          </Typography>
          {!mediator.proxy.graphBuilder.saved && (
            <Typography sx={{ mb: 1 }} color="danger" level="title-lg">
              Current graph is not saved and will be lost
            </Typography>
          )}
          <Textarea
            value={pgn}
            color="primary"
            variant="outlined"
            minRows={10}
            maxRows={10}
            sx={{ width: "30rem" }}
            onChange={(event) => setPgn(event.target.value)}
            onKeyDown={(event) => {
              event.stopPropagation()
            }}
          />
          <Button color="primary" sx={{ mt: 2, mr: 2 }} size="lg" onClick={handlePGNImport}>
            Load
          </Button>
          <Button
            color="neutral"
            sx={{ mt: 2, mr: 2 }}
            onClick={() => {
              setOpenModal(false)
              setPgn("")
            }}
            size="lg">
            Cancle
          </Button>
        </Sheet>
      </Modal>
    </Stack>
  )
}
