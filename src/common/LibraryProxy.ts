import Proxy from "./Proxy.js"
import { MoveData } from "./GraphBuilder.js"
import { NodePosition } from "./Graph.js"
import { OpeningData } from "./useSaveOpening.js"

const IDENTIFIER = "Library"

export default class LibraryProxy extends Proxy {
  static EDIT_OPENING = Symbol("editOpening")
  constructor() {
    super(IDENTIFIER)
  }

  editOpening(opening: OpeningData) {
    this.notify(LibraryProxy.EDIT_OPENING, opening)
  }

  boardMove(move: string, fen: string, prevFen: string) {
    const nextMoves = this.graphBuilder.getNextMoves(prevFen)
    const match = nextMoves.find((moveData: MoveData) => moveData.move === move)
    if (match) {
      this.boardPosition = fen
    } else {
      this.boardPosition = prevFen
    }
    this.updateUI()
  }

  nodeClick(fen: string, _position: NodePosition, event: MouseEvent) {
    const MOUSE_LEFT = 0
    if (event.button === MOUSE_LEFT) {
      this.boardPosition = fen
      this.updateUI()
    }
  }
}
