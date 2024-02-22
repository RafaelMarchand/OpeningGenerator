import { Options } from "../components/Controls/Configuration"
import { NodePosition } from "./Graph"
import Proxy from "./Proxy"
import { OpeningData } from "./useSaveOpening"
import { Result, nextMoves } from "./utils"

const MOUSE_LEFT = 0
const MOUSE_RIGHT = 2

export default class GeneratorProxy extends Proxy {
  constructor() {
    super()
  }

  action(action: any, payload: any) {
    switch (action) {
      case "generate":
        this.generate(this.boardPosition, payload)
        break
      case "removePosition":
        this.boardPosition = this.graphBuilder.removeNode(payload)
        this.updateUI()
    }
  }

  generate(fen: string, options: Options) {
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

    generate([{ fen: fen, move: "" }], 0, fen)
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
