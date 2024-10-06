import { RefObject } from "react"
import { Chessground } from "chessground"
import { Config } from "chessground/config"
import { Chess } from "chess.js"
import * as cg from "chessground/types"
import Observable from "./Observable"
import { Api } from "chessground/api"
import { MoveData } from "./GraphBuilder"

export default class Board extends Observable {
  static BOARD_MOVE = Symbol("boardMove")
  static STARTING_POSITION: string = (() => {
    const chess = new Chess()
    return chess.fen()
  })()

  config: Config
  chessground: Api

  constructor(ref: RefObject<HTMLDivElement>) {
    super()
    this.config = {
      fen: Board.STARTING_POSITION,
      events: {
        move: (orig: cg.Key, dest: cg.Key) => {
          this.handleMove(orig + dest)
        }
      }
    }
    this.chessground = Chessground(ref.current!, this.config)
  }

  showArrow(move: MoveData) {
    this.chessground.setShapes([
      {
        brush: "blue",
        orig: move.move.uci.slice(0, 2) as cg.Key,
        dest: move.move.uci.slice(2, 4) as cg.Key
      }
    ])
  }

  setPosition(position: string) {
    this.config!.fen = position
    this.chessground.set(this.config)
  }

  getPosition(): string {
    return this.config!.fen!
  }

  validateMove(move: string): MoveData {
    const currentPosition = this.getPosition()
    try {
      const chess = new Chess()
      chess.load(currentPosition)
      const { san, from, to } = chess.move(move)
      return { fen: chess.fen(), move: { san: san, uci: from + to } }
    } catch (error) {
      return { fen: currentPosition, move: { san: "", uci: "" } }
    }
  }

  handleMove(uci: string) {
    const moveData = this.validateMove(uci)
    if (moveData.fen !== this.getPosition()) {
      this.notify(Board.BOARD_MOVE, moveData, this.getPosition())
    } else {
      this.setPosition(moveData.fen)
    }
  }

  executeMove(orig: cg.Key, dest: cg.Key) {
    this.chessground.move(orig, dest)
  }
}
