import Chessground from "@react-chess/chessground"
import { RefObject, useEffect, useReducer } from "react"
import { Button } from "@mui/joy"
import Board from "../common/Board"
import DelayHandler from "../common/DelayHandler"
import Mediator from "../common/Mediator"

interface Props {
  graphRef: RefObject<HTMLDivElement>
}

type Position = {
  x: number
  y: number
}

export interface DispatchGraphPopUp {
  type: reducerAction
  payload: any
}

export type reducerAction = "showButton" | "hideButton" | "showBoard" | "hideBoard"

export type GraphPopUpsState = {
  showBoard: boolean
  showRemoveButton: boolean
  fen: string
  position: Position
}

enum MouseEvents {
  MouseUp = "mouseup",
  MouseMove = "mousemove"
}
const OFFSET_NODE_POPUP = 15
const DELAY_HIDE_REMOVE_BUTTON = 1000

const DEFAULT_GRAPH_POPUPS: GraphPopUpsState = {
  showBoard: false,
  showRemoveButton: false,
  fen: Board.STARTING_POSITION,
  position: {
    x: 0,
    y: 0
  }
}

function reducer(prevState: GraphPopUpsState, action: DispatchGraphPopUp): GraphPopUpsState {
  const state = {
    ...prevState
  }
  switch (action.type) {
    case "showBoard":
      state.showBoard = true
      state.showRemoveButton = false
      state.fen = action.payload.fen
      state.position = action.payload.position
      break
    case "hideBoard":
      if (!prevState.showBoard) return prevState
      state.showBoard = false
      break
    case "showButton":
      state.showBoard = false
      state.showRemoveButton = true
      state.fen = action.payload.fen
      state.position = action.payload.position
      break
    case "hideButton":
      if (!prevState.showRemoveButton) return prevState
      state.showRemoveButton = false
      break
  }
  return state
}

function getPosition(position: Position, graphRef: RefObject<HTMLDivElement>): Position {
  if (!graphRef.current) return { x: 0, y: 0 }
  const { left, top } = graphRef.current!.getBoundingClientRect()
  return {
    x: left + position.x + OFFSET_NODE_POPUP,
    y: top + position.y + OFFSET_NODE_POPUP
  }
}

const buttonDelayHandler = new DelayHandler()

export default function GraphPopUps({ graphRef }: Props) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_GRAPH_POPUPS)
  const popUpPosition = getPosition(state.position, graphRef)
  const config = {
    fen: state.fen
  }

  function mouseHandler(fen: string, position: Position, mouseEvent: MouseEvents) {
    if (mouseEvent === MouseEvents.MouseUp && !state.showRemoveButton) {
      dispatch({ type: "showButton", payload: { fen, position } })
      buttonDelayHandler.cancle()
    }
    if (mouseEvent === MouseEvents.MouseMove && fen !== undefined) {
      dispatch({ type: "showBoard", payload: { fen, position } })
    }
    if (mouseEvent === MouseEvents.MouseMove && fen === undefined) {
      dispatch({ type: "hideBoard", payload: {} })
      buttonDelayHandler.setTimer(DELAY_HIDE_REMOVE_BUTTON, dispatch, {
        type: "hideButton",
        payload: {}
      })
    }
  }

  useEffect(() => {
    new Mediator().proxies.forEach((proxy) => proxy.listen("showPopUp", mouseHandler))
  }, [])

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
          {state.showBoard && <Chessground config={config} width={100} height={100} />}
          {state.showRemoveButton && (
            <Button
              color="danger"
              onMouseOver={() => buttonDelayHandler.cancle()}
              onMouseLeave={() =>
                buttonDelayHandler.setTimer(DELAY_HIDE_REMOVE_BUTTON, dispatch, {
                  type: "hideButton",
                  payload: {}
                })
              }
              onClick={() => {
                new Mediator().action("removePosition", state.fen)
                dispatch({
                  type: "hideButton",
                  payload: {}
                })
              }}>
              Remove Position
            </Button>
          )}
        </div>
      }
    </>
  )
}