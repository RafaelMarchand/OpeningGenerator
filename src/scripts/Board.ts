import { RefObject } from "react"
import { Chessground } from "chessground"
import { Config } from "chessground/config"
import { Chess } from "chess.js"
import * as cg from "chessground/types"

type BoardMove = (orig: cg.Key, dest: cg.Key) => void

export default class Board {
  static STARTING_POSITION: string = (() => {
    const chess = new Chess()
    return chess.fen()
  })()

  config: Config
  chessground: any

  constructor(ref: RefObject<HTMLDivElement>, boardMove: BoardMove) {
    this.config = {
      fen: Board.STARTING_POSITION,
      events: {
        move: (orig: cg.Key, dest: cg.Key) => {
          boardMove(orig, dest)
        }
      }
    }
    this.chessground = Chessground(ref.current!, this.config)
  }

  setPosition(position: string) {
    this.config.fen = position
    this.chessground.set(this.config)
  }

  getPosition(): string {
    return this.config.fen!
  }

  validateMove(orig: cg.Key, dest: cg.Key): string {
    const currentPosition = this.getPosition()
    try {
      const chess = new Chess()
      chess.load(currentPosition)
      chess.move({ from: orig, to: dest })
      return chess.fen()
    } catch (error) {
      return currentPosition
    }
  }

  move(orig: cg.Key, dest: cg.Key) {
    const position = this.validateMove(orig, dest)
    this.setPosition(position)
  }
}
