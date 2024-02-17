import { RefObject } from "react"
import Board from "./Board"
import Graph, { NodePosition } from "./Graph"
import { Options } from "../components/OpeningGenerator/Configuration"
import Observable from "./Observable"
import { Result, nextMoves } from "./utils"

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
    this.board.listen("boardMove", (move: string, fen: string, prevFen: string) => {
      this.graph.addMove(move, fen, prevFen)
    })
    this.graph.listen("nodeClick", (fen: string, position: NodePosition, event: MouseEvent) => {
      if (event.button === MOUSE_LEFT) {
        this.setPosition(fen)
      } else if (event.button === MOUSE_RIGHT) {
        this.notify("mouseEvent", fen, position, event.type)
      }
    })
    this.graph.listen("nodeHover", (fen: string, position: NodePosition, event: MouseEvent) => {
      this.notify("mouseEvent", fen, position, event.type)
    })
    this.graph.listen("positionChange", (moves: string[]) => {
      this.notify("positionChange", moves)
    })
  }

  generate(options: Options) {
    const fen = this.board.getPosition()

    const generate = (results: Result[], depth: number, prevFen: string) => {
      for (const result of results) {
        if (result.move !== "") {
          this.graph.addMove(result.move, result.fen, prevFen)
        }
        nextMoves(result.fen, options).then((nextPositions) => {
          if (depth < options.depth) {
            generate(nextPositions, depth + 1, result.fen)
          }
        })
      }
    }

    generate([{ fen: fen, move: "" }], 0, fen)
  }

  removePosition(fen: string) {
    const parentNode = this.graph.removeNode(fen)
    this.board.setPosition(parentNode)
  }

  setPosition(fen: string) {
    this.board.setPosition(fen)
    this.graph.update(fen)
  }

  saveOpening(name: string) {
    console.log(name)
  }
}
