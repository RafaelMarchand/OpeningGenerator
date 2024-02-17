import { RefObject, useRef } from "react"
import Stack from "@mui/joy/Stack"
import { ResizableBox } from "react-resizable"
import { Box } from "@mui/joy"

import "./boardResize.css"
import "../../../node_modules/react-resizable/css/styles.css"
import "../../assets/chessground.base.css"
import "../../../node_modules/chessground/assets/chessground.brown.css"
import "../../../node_modules/chessground/assets/chessground.cburnett.css"

interface Props {
  boardRef: RefObject<HTMLDivElement>
}

function Board({ boardRef }: Props) {
  const boardAreaRef = useRef<HTMLDivElement>(null)

  function getMaxSize() {
    if (boardAreaRef.current) {
      const { width } = boardAreaRef.current?.getBoundingClientRect()
      return width
    }
    return Infinity
  }

  return (
    <Stack
      sx={{ width: "80%" }}
      ref={boardAreaRef}
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={2}>
      <ResizableBox
        className="box hover-handles"
        lockAspectRatio={true}
        width={400}
        height={400}
        minConstraints={[300, 300]}
        maxConstraints={[getMaxSize(), getMaxSize()]}
        resizeHandles={["se"]}>
        <Box ref={boardRef} sx={{ width: "100%", height: "100%", borderRadius: "2rem" }} />
      </ResizableBox>
    </Stack>
  )
}

export default Board
