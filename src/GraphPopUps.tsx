import Chessground from "@react-chess/chessground"
import { RefObject } from "react"
import Mediator from "./scripts/Mediator"
import { Button } from "@mui/joy"
import { GraphPopUpsState } from "./App"
import { NodePosition } from "./scripts/Graph"

export interface PositionPopUp {
  x: number
  y: number
}

interface Props {
  mediatorRef: RefObject<Mediator | null>
  graphRef: RefObject<HTMLDivElement>
  state: GraphPopUpsState
}

const OFFSET_NODE_POPUP = 15

function getPosition(position: NodePosition, graphRef: RefObject<HTMLDivElement>): NodePosition {
  if (!graphRef.current) return { x: 0, y: 0 }
  const { left, top } = graphRef.current!.getBoundingClientRect()
  return {
    x: left + position.x + OFFSET_NODE_POPUP,
    y: top + position.y + OFFSET_NODE_POPUP
  }
}

export default function GraphPopUps({ mediatorRef, graphRef, state }: Props) {
  const popUpPosition = getPosition(state.position, graphRef)
  const showBoard = state.showBoard && !state.showRemoveButton
  const config = {
    fen: state.fen
  }
  return (
    <>
      {
        <div
          style={{
            position: "absolute",
            left: `${popUpPosition.x}px`,
            top: `${popUpPosition.y}px`,
            zIndex: "2"
          }}>
          {showBoard && <Chessground config={config} width={100} height={100} />}
          {state.showRemoveButton && (
            <Button color="danger" onClick={() => mediatorRef.current?.removePosition(state.fen)}>
              Remove Position{" "}
            </Button>
          )}
        </div>
      }
    </>
  )
}
