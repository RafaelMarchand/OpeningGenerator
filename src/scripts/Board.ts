import { RefObject } from "react"
import { Chessground } from "chessground"
import { Config } from "chessground/config"
import { Chess } from "chess.js"
import * as cg from "chessground/types"
import Observable from "./Observable"

export default class Board extends Observable {
  static STARTING_POSITION: string = (() => {
    const chess = new Chess()
    return chess.fen()
  })()

  config: Config
  chessground: any

  constructor(ref: RefObject<HTMLDivElement>) {
    super()
    this.config = {
      fen: Board.STARTING_POSITION,
      events: {
        move: (orig: cg.Key, dest: cg.Key) => {
          const newPosition = this.validateMove(orig + dest)
          if (newPosition !== this.getPosition()) {
            this.notify("boardMove", orig + dest, newPosition, this.getPosition())
            this.setPosition(newPosition)
          }
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

  validateMove(move: string): string {
    const currentPosition = this.getPosition()
    try {
      const chess = new Chess()
      chess.load(currentPosition)
      chess.move(move)
      return chess.fen()
    } catch (error) {
      return currentPosition
    }
  }
}
