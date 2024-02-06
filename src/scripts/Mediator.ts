import { Dispatch, RefObject } from "react"
import Board from "./Board"
import Graph, { NodePosition } from "./Graph"
import * as cg from "chessground/types"
import { Options } from "../Generator"
import { DispatchGraphPopUp } from "../App"

const MOUSE_LEFT = 0
const MOUSE_RIGHT = 2

type Ref = RefObject<HTMLDivElement>

export default class Mediator {
  board: Board
  graph: Graph
  dispatchGraphPopUps: Dispatch<DispatchGraphPopUp>

  constructor(boardRef: Ref, graphRef: Ref, dispatchGraphPopUps: Dispatch<DispatchGraphPopUp>) {
    this.board = new Board(boardRef, (orig: cg.Key, dest: cg.Key) => this.boardMove(orig, dest))
    this.graph = new Graph(graphRef)
    this.dispatchGraphPopUps = dispatchGraphPopUps

    this.setUpListeners()
  }

  setUpListeners() {
    this.graph.listen("nodeClick", (fen: string, position: NodePosition, event: MouseEvent) => {
      if (event.button === MOUSE_LEFT) {
        this.board.setPosition(fen)
      } else if (event.button === MOUSE_RIGHT) {
        this.dispatchGraphPopUps({ type: "showButton", payload: { fen, position } })
      }
    })
    this.graph.listen("nodeHover", (fen: string, position: NodePosition) => {
      if (fen !== undefined) {
        this.dispatchGraphPopUps({ type: "showBoard", payload: { fen, position } })
      } else {
        this.dispatchGraphPopUps({ type: "hideBoard", payload: {} })
      }
    })
  }

  generate(options: Options) {
    this.graph.generateOpening(this.board.getPosition(), options)
  }

  boardMove(orig: cg.Key, dest: cg.Key) {
    const lastPosition = this.board.getPosition()
    this.board.move(orig, dest)
    const position = this.board.getPosition()
    this.graph.update(position, lastPosition)
  }

  removeNode(fen: string) {
    this.graph.removeNode(fen)
    this.dispatchGraphPopUps({ type: "hideButton", payload: {} })
  }
}
