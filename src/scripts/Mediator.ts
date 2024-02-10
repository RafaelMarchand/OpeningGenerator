import { RefObject } from "react"
import Board from "./Board"
import Graph, { NodePosition } from "./Graph"
import * as cg from "chessground/types"
import { Options } from "../Generator"
import Observable from "./Observable"

const MOUSE_LEFT = 0
const MOUSE_RIGHT = 2

type Ref = RefObject<HTMLDivElement>

export default class Mediator extends Observable {
  board: Board
  graph: Graph

  constructor(boardRef: Ref, graphRef: Ref) {
    super()
    this.board = new Board(boardRef)
    this.graph = new Graph(graphRef)

    this.setUpListeners()
  }

  setUpListeners() {
    this.board.listen("boardMove", (orig: cg.Key, dest: cg.Key) => {
      const lastPosition = this.board.getPosition()
      this.board.move(orig, dest)
      const position = this.board.getPosition()
      this.graph.update(position, lastPosition)
    })
    this.graph.listen("nodeClick", (fen: string, position: NodePosition, event: MouseEvent) => {
      if (event.button === MOUSE_LEFT) {
        this.board.setPosition(fen)
      } else if (event.button === MOUSE_RIGHT) {
        this.notify("mouseEvent", fen, position, event.type)
      }
    })
    this.graph.listen("nodeHover", (fen: string, position: NodePosition, event: MouseEvent) => {
      this.notify("mouseEvent", fen, position, event.type)
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
