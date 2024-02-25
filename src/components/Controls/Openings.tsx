import { Button, IconButton, Modal, ModalClose, Sheet, Stack, ToggleButtonGroup, Typography } from "@mui/joy"
import { OpeningData, useOpeningsActions } from "../../common/useSaveOpening"
import { Delete, Edit } from "@mui/icons-material"
import Mediator from "../../common/Mediator"
import { DispatchController } from "./Controls"
import { Dispatch, useRef, useState } from "react"

interface Props {
  dispatch: Dispatch<DispatchController>
  setOpenings: (action: useOpeningsActions, opening: OpeningData) => void
  openings: OpeningData[]
}

const mediator = new Mediator()

export default function Openings({ dispatch, openings, setOpenings }: Props) {
  const currentOpening = useRef<OpeningData | null>(null)
  const [openModal, setOpenModal] = useState<boolean>(false)

  function handleEdit(opening: OpeningData) {
    currentOpening.current = opening
    if (!mediator.generatorProxy.graphBuilder.saved) {
      setOpenModal(true)
      return
    }
    mediator.libraryProxy.loadOpening(opening)
    dispatch({ type: "edit", payload: { name: opening.name, index: opening.index } })
  }

  function handleContinue() {
    setOpenModal(false)
    mediator.generatorProxy.graphBuilder.saved = true
    handleEdit(currentOpening.current!)
  }

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="stretcht"
      spacing={1}
      sx={{
        backgroundColor: "background.level2",
        p: 2,
        borderRadius: "0.3rem",
        width: "100%",
        height: "100%"
      }}>
      <Typography color="primary" level="title-lg" sx={{ pb: 1 }}>
        Openings
      </Typography>
      {openings.map((opening: OpeningData) => {
        return (
          <ToggleButtonGroup variant="outlined" key={opening.index}>
            <Button
              value="default"
              fullWidth
              sx={{ justifyContent: "flex-start" }}
              onClick={() => {
                mediator.proxy.loadOpening(opening)
                dispatch({ type: "setOpening", payload: { name: opening.name, index: opening.index } })
              }}>
              {opening.name}
            </Button>
            <IconButton
              onClick={() => {
                handleEdit(opening)
              }}>
              <Edit />
            </IconButton>
            <IconButton
              size="sm"
              sx={{ borderColor: "neutral.outlinedBorder" }}
              color="danger"
              onClick={() => {
                setOpenings("remove", opening)
              }}>
              <Delete />
            </IconButton>
          </ToggleButtonGroup>
        )
      })}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Sheet
          variant="soft"
          color="danger"
          sx={{
            maxWidth: 500,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg"
          }}>
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography component="h2" id="modal-title" level="h4" textColor="inherit" fontWeight="lg" mb={1}>
            Current opening not saved
          </Typography>
          <Typography id="modal-desc" textColor="text.tertiary">
            Loading this opening will discard the changes on the opening that is currently beeing edited
          </Typography>
          <Button color="neutral" sx={{ mt: 2, mr: 2, width: "25%" }} size="lg" onClick={handleContinue}>
            Continue
          </Button>
          <Button
            color="neutral"
            sx={{ mt: 2, mr: 2, width: "25%" }}
            onClick={() => setOpenModal(false)}
            size="lg">
            Cancle
          </Button>
        </Sheet>
      </Modal>
    </Stack>
  )
}
