import { RefObject } from "react"
import Board from "./Board"
import Graph from "./Graph"
import Generator from "./generator/openingGenerator"
import * as cg from "chessground/types"

export default class Mediator {
  board: Board
  graph: Graph
  graphClick: (key: string) => void
  graphHover: (key: string) => void

  constructor(boardRef: RefObject<HTMLDivElement>, graphRef: RefObject<HTMLDivElement>) {
    this.graphClick = (position: string) => {
      this.board.setPosition(position)
    }
    this.graphHover = (position: string) => {}
    this.board = new Board(boardRef, (orig: cg.Key, dest: cg.Key) => this.boardMove(orig, dest))
    this.graph = new Graph(graphRef, this.graphClick, this.graphHover)
  }

  generate() {
    this.graph.draw(...Generator(board.getPosition()))
  }

  boardMove(orig: cg.Key, dest: cg.Key) {
    const lastPosition = this.board.getPosition()
    this.board.move(orig, dest)
    const position = this.board.getPosition()
    this.graph.update(position, lastPosition)
  }
}
