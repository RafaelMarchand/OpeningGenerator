import Chessground from "@react-chess/chessground"
import { RefObject, useEffect, useReducer } from "react"
import { Button } from "@mui/joy"
import Board from "../common/Board"
import DelayHandler from "../common/DelayHandler"
import Mediator from "../common/Mediator"
import Proxy from "../common/Proxy"
import { GRAPH_SIZE } from "../common/Graph"
import { Config } from "@react-chess/chessground/node_modules/chessground/config"

interface Props {
  graphRef: RefObject<HTMLDivElement>
}

type Position = {
  x: number
  y: number
}

type DispatchGraphPopUp =
  | { type: "showButton"; payload: { fen: string; position: Position | null } }
  | { type: "hideButton"; payload: {} }
  | { type: "showBoard"; payload: { fen: string; position: Position | null } }
  | { type: "hideBoard"; payload: {} }

type GraphPopUpsState = {
  showBoard: boolean
  showRemoveButton: boolean
  fen: string
  position: Position
}

enum MouseEvents {
  MouseUp = "mouseup",
  MouseMove = "mousemove",
  Click = "click"
}

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
      state.position = action.payload.position ?? prevState.position
      break
    case "hideBoard":
      if (!prevState.showBoard) return prevState
      state.showBoard = false
      break
    case "showButton":
      state.showBoard = false
      state.showRemoveButton = true
      state.fen = action.payload.fen
      state.position = action.payload.position ?? prevState.position
      break
    case "hideButton":
      if (!prevState.showRemoveButton) return prevState
      state.showRemoveButton = false
      break
  }
  return state
}

const OFFSET_NODE_POPUP = 15
const BOARD_SIZE = 120
const REMOVE_BUTTON_HEIGHT = 40

function getPosition(state: GraphPopUpsState, graphRef: RefObject<HTMLDivElement>): Position {
  if (!graphRef.current) return { x: 0, y: 0 }
  let posX = state.position.x + OFFSET_NODE_POPUP
  let posY = state.position.y + OFFSET_NODE_POPUP

  if (state.position.x + OFFSET_NODE_POPUP + BOARD_SIZE > GRAPH_SIZE.width!) {
    posX = state.position.x - OFFSET_NODE_POPUP - BOARD_SIZE
  }
  if (state.position.y + OFFSET_NODE_POPUP + BOARD_SIZE > GRAPH_SIZE.height!) {
    if (state.showRemoveButton) {
      posY = state.position.y - OFFSET_NODE_POPUP - REMOVE_BUTTON_HEIGHT
    } else {
      posY = state.position.y - OFFSET_NODE_POPUP - BOARD_SIZE
    }
  }
  return {
    x: posX,
    y: posY
  }
}

const mediator = new Mediator()
const buttonDelayHandler = new DelayHandler()

export default function GraphPopUps({ graphRef }: Props) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_GRAPH_POPUPS)
  const popUpPosition = getPosition(state, graphRef)
  const config: Config = {
    fen: state.fen,
    coordinates: false,
    viewOnly: true
  }

  function mouseHandler(fen: string | null, position: Position | null, mouseEvent: MouseEvents) {
    if (mouseEvent === MouseEvents.MouseUp && !state.showRemoveButton && fen) {
      dispatch({ type: "showButton", payload: { fen, position } })
      buttonDelayHandler.cancle()
    }
    if (mouseEvent === MouseEvents.MouseMove && fen !== null) {
      dispatch({ type: "showBoard", payload: { fen, position } })
    }
    if ((mouseEvent === MouseEvents.MouseMove && fen === null) || mouseEvent === MouseEvents.Click) {
      dispatch({ type: "hideBoard", payload: {} })
      buttonDelayHandler.setTimer(DELAY_HIDE_REMOVE_BUTTON, dispatch, {
        type: "hideButton",
        payload: {}
      })
    }
  }

  useEffect(() => {
    const proxies = new Array<Proxy>(mediator.generatorProxy, mediator.libraryProxy)
    proxies.forEach((proxy) => proxy.listen(Proxy.SHOW_POPUP, mouseHandler))
    return () => {
      proxies.forEach((proxy) => proxy.remove(Proxy.SHOW_POPUP))
    }
  }, [])

  return (
    <>
      {
        <div
          style={{
            position: "absolute",
            left: `${popUpPosition.x}px`,
            top: `${popUpPosition.y}px`,
            zIndex: "1",
            overflow: "hidden"
          }}>
          {state.showBoard && <Chessground config={config} width={BOARD_SIZE} height={BOARD_SIZE} />}
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
                mediator.generatorProxy.removePosition(state.fen)
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
