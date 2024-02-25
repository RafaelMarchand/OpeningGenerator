import { Options } from "../components/Controls/Configuration"
import { NodePosition } from "./Graph"
import Proxy from "./Proxy"
import { Result, nextMoves } from "./utils"

const MOUSE_LEFT = 0
const MOUSE_RIGHT = 2

export default class GeneratorProxy extends Proxy {
  constructor() {
    super()
  }

  removePosition(fen: string) {
    this.boardPosition = this.graphBuilder.removeNode(fen)
    this.updateUI()
  }

  generate(options: Options) {
    const generate = (results: Result[], depth: number, prevFen: string) => {
      for (const result of results) {
        if (result.move !== "") {
          this.graphBuilder.addMove(result.move, result.fen, prevFen)
          this.boardPosition = result.fen
          this.updateUI()
        }
        nextMoves(result.fen, options).then((nextPositions) => {
          if (depth < options.depth) {
            generate(nextPositions, depth + 1, result.fen)
          }
        })
      }
    }

    generate([{ fen: this.boardPosition, move: "" }], 0, this.boardPosition)
  }

  boardMove(move: string, fen: string, prevFen: string) {
    this.graphBuilder.addMove(move, fen, prevFen)
    this.boardPosition = fen
    this.updateUI()
  }

  nodeClick(fen: string, position: NodePosition, event: MouseEvent) {
    if (event.button === MOUSE_LEFT) {
      this.boardPosition = fen
      this.updateUI()
    }
    if (event.button === MOUSE_RIGHT) {
      this.notify("showPopUp", fen, position, event.type)
    }
  }
}
