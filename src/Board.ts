import { RefObject } from "react"
import { Chessground } from "chessground"
import { Config } from "chessground/config"
import { Chess } from "chess.js"
import * as cg from "chessground/types"

export default class Board {
  config: Config
  chessground: any
  game: Chess
  constructor(ref: RefObject<HTMLDivElement>) {
    this.game = new Chess()
    this.config = {
      fen: this.game.fen(),
      events: {
        move: (orig: cg.Key, dest: cg.Key) => {
          this.validateMove(orig, dest)
        }
      }
    }
    this.chessground = Chessground(ref.current!, this.config)
  }

  validateMove(orig: cg.Key, dest: cg.Key) {
    try {
      this.game.move({ from: orig, to: dest })
      this.setBoardPosition()
    } catch {
      this.setBoardPosition()
    }
  }

  setBoardPosition() {
    this.config.fen = this.game.fen()
    this.chessground.set(this.config)
  }
}
