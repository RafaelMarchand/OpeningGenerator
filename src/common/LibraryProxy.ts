import Proxy from "./Proxy.js"
import { GraphType, MoveData } from "./GraphBuilder.js"
import { NodePosition } from "./Graph.js"

const MOUSE_LEFT = 0

export default class LibraryProxy extends Proxy {
  constructor() {
    super()
  }

  action(action: any, payload: any): void {
    switch (action) {
      case "loadOpening":
        this.loadOpening(payload)
        break
      case "editOpening":
        this.notify("editOpening", payload)
        break
    }
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
