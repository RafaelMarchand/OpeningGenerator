import { RefObject } from "react"
import Board from "./Board"
import Graph from "./Graph"
import * as cg from "chessground/types"

export default class Mediator {
  board: Board
  graph: Graph
  graphClick: (key: string) => void
  graphHover: (key: string, event: MouseEvent) => void

  constructor(
    boardRef: RefObject<HTMLDivElement>,
    graphRef: RefObject<HTMLDivElement>,
    nodeHoverHandler: any
  ) {
    this.graphClick = (position: string) => {
      this.board.setPosition(position)
    }
    this.graphHover = (position: string, nodePos: any) => {
      nodeHoverHandler(position, nodePos)
    }
    this.board = new Board(boardRef, (orig: cg.Key, dest: cg.Key) => this.boardMove(orig, dest))
    this.graph = new Graph(graphRef, this.graphClick, this.graphHover)
  }

  generate() {
    this.graph.generateOpening(this.board.getPosition(), "w")
  }

  boardMove(orig: cg.Key, dest: cg.Key) {
    const lastPosition = this.board.getPosition()
    this.board.move(orig, dest)
    const position = this.board.getPosition()
    this.graph.update(position, lastPosition)
  }
}
