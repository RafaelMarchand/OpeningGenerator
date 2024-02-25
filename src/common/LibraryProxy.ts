import Proxy from "./Proxy.js"
import GraphBuilder, { GraphType, MoveData } from "./GraphBuilder.js"
import { NodePosition } from "./Graph.js"
import { OpeningData } from "./useSaveOpening.js"

const MOUSE_LEFT = 0

export default class LibraryProxy extends Proxy {
  constructor() {
    super()
  }

  editOpening(opening: OpeningData) {
    this.notify("editOpening", opening)
  }

  boardMove(move: string, fen: string, prevFen: string) {
    const nextMoves = this.graphBuilder.getNextMoves(prevFen)
    const match = nextMoves.find((moveData: MoveData) => moveData.move === move)
    console.log(fen, prevFen)
    if (match) {
      this.boardPosition = fen
    } else {
      this.boardPosition = prevFen
    }
    this.updateUI()
  }

  nodeClick(fen: string, _position: NodePosition, event: MouseEvent) {
    if (event.button === MOUSE_LEFT) {
      this.boardPosition = fen
      this.updateUI()
    }
  }
}
