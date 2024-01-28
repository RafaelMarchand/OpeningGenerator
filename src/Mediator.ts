import { RefObject } from "react"
import Board from "./Board"
import Graph from "./Graph"
import openingGenerator from "./openingGenerator"

export default class Mediator {
  board: Board
  graph: Graph
  constructor(boardRef: RefObject<HTMLDivElement>, graphRef: RefObject<HTMLDivElement>) {
    this.board = new Board(boardRef)
    this.graph = new Graph(graphRef)
  }

  generate() {
    this.graph.draw()
  }
}
