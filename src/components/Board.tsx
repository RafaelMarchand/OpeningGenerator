import { RefObject, useEffect, useRef, useState } from "react"
import Stack from "@mui/joy/Stack"
// @ts-ignore
import { ResizableBox } from "react-resizable"

import "../assets/boardResize.css"
import "../../node_modules/react-resizable/css/styles.css"
import "../assets/chessground.base.css"
import "../../node_modules/chessground/assets/chessground.brown.css"
import "../../node_modules/chessground/assets/chessground.cburnett.css"

interface Props {
  boardRef: RefObject<HTMLDivElement>
}

function Board({ boardRef }: Props) {
  const boardAreaRef = useRef<HTMLDivElement>(null)
  const [maxSize, setMaxSize] = useState<number>(Infinity)

  useEffect(() => {
    if (boardAreaRef.current) {
      const { width } = boardAreaRef.current?.getBoundingClientRect()
      setMaxSize(width)
    }
  }, [])

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
        maxConstraints={[maxSize, maxSize]}
        resizeHandles={["se"]}
        transformScale={1}>
        <div
          className="T2-board"
          ref={boardRef}
          style={{ width: "100%", height: "100%", borderRadius: "2rem" }}></div>
      </ResizableBox>
    </Stack>
  )
}

export default Board
