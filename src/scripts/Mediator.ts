import { RefObject } from "react"
import Board from "./Board"
import Graph, { NodePosition } from "./Graph"
import * as cg from "chessground/types"
import { Options } from "../Generator"
import Observable from "./Observable"

const MOUSE_LEFT = 0
const MOUSE_RIGHT = 2
const DELAY_HIDE_REMOVE_BUTTON = 2000

type Ref = RefObject<HTMLDivElement>

export default class Mediator extends Observable {
  board: Board
  graph: Graph
  hideButtonTimeOutID: number | null

  constructor(boardRef: Ref, graphRef: Ref) {
    super()
    this.board = new Board(boardRef, (orig: cg.Key, dest: cg.Key) => this.boardMove(orig, dest))
    this.graph = new Graph(graphRef)
    this.hideButtonTimeOutID = null

    this.setUpListeners()
  }

  setUpListeners() {
    this.graph.listen("nodeClick", (fen: string, position: NodePosition, event: MouseEvent) => {
      if (event.button === MOUSE_LEFT) {
        this.board.setPosition(fen)
      } else if (event.button === MOUSE_RIGHT) {
        super.notify("dspatchGraphPopUp", { type: "showButton", payload: { fen, position } })
      }
    })
    this.graph.listen("nodeHover", (fen: string, position: NodePosition) => {
      if (fen !== undefined) {
        super.notify("dspatchGraphPopUp", { type: "showBoard", payload: { fen, position } })
        if (this.hideButtonTimeOutID) {
          super.notify("dspatchGraphPopUp", { type: "hideButton", payload: {} })
          clearTimeout(this.hideButtonTimeOutID)
        }
      } else {
        super.notify("dspatchGraphPopUp", { type: "hideBoard", payload: {} })
        this.hideButtonTimeOutID = setTimeout(() => {
          this.hideButtonTimeOutID = null
          super.notify("dspatchGraphPopUp", {
            type: "hideButton",
            payload: {}
          })
        }, DELAY_HIDE_REMOVE_BUTTON)
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

  removePosition(fen: string) {
    this.graph.removeNode(fen)
    super.notify("dspatchGraphPopUp", { type: "hideButton", payload: {} })
  }
}
