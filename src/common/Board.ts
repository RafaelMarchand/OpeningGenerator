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

  config: Config | undefined
  chessground: any

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

  setPosition(position: string) {
    this.config!.fen = position
    this.chessground.set(this.config)
  }

  getPosition(): string {
    return this.config!.fen!
  }

  validateMove(move: string): string[] {
    const currentPosition = this.getPosition()
    try {
      const chess = new Chess()
      chess.load(currentPosition)
      const { san } = chess.move(move)
      return [chess.fen(), san]
    } catch (error) {
      return [currentPosition, move]
    }
  }

  handleMove(move: string) {
    const [position, san] = this.validateMove(move)
    if (position !== this.getPosition()) {
      this.notify("boardMove", san, position, this.getPosition())
    } else {
      this.setPosition(position)
    }
  }

  executeMove(orig: cg.Key, dest: cg.Key) {
    this.chessground.move(orig, dest)
  }
}
