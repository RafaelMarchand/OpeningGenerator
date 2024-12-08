import Proxy from "./Proxy.js"
import { MoveData } from "./GraphBuilder.js"
import { NodePosition } from "./Graph.js"
import { OpeningData } from "./useSaveOpening.js"

const IDENTIFIER = "Library"

export default class LibraryProxy extends Proxy {
  static EDIT_OPENING = Symbol("editOpening")
  static NEW_MOVE_NOTIFICATION = Symbol("newMoveNotification")
  constructor() {
    super(IDENTIFIER)
  }

  editOpening(opening: OpeningData) {
    this.notify(LibraryProxy.EDIT_OPENING, opening)
  }

  boardMove(moveData: MoveData, prevFen: string) {
    const nextMoves = this.graphBuilder.getNextMoves(prevFen)
    const match = nextMoves.find((nextMoveData: MoveData) => nextMoveData.move.san === moveData.move.san)
    if (match) {
      this.boardPosition = moveData.fen
    } else {
      this.notify(LibraryProxy.NEW_MOVE_NOTIFICATION)
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
