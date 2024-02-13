import { Chess } from "chess.js"
import { Options } from "../Generator"

export default class DatabaseResult {
  movesDatabase: DataBaseResult
  gameCount: number

  constructor(movesDatabase: DataBaseResult) {
    this.movesDatabase = movesDatabase
    this.gameCount = this.movesDatabase.black + this.movesDatabase.white + this.movesDatabase.draws
  }

  setWinningChances(color: Color) {
    this.movesDatabase.moves.forEach((move) => {
      let movesPlayed = move.white + move.black + move.draws

      move.popularity = Math.ceil((movesPlayed / this.gameCount) * 100)
      move.winningChances = (move[color] / movesPlayed) * 100
    })
  }

  getMoves(position: string, options: Options): string[] {
    const colorToMove = position.split(" ")[1] === "w" ? "white" : "black"
    let moves: Move[] = []
    if (options.color === colorToMove) {
      moves.push(this.getRepertoireMove(options.randomness, options.rareRepertoire, options.color))
    } else {
      moves = this.getOpponentMoves(colorToMove)
    }

    return moves.map((move) => {
      const chess = new Chess()
      chess.load(position)
      chess.move(move.uci)
      return chess.fen()
    })
  }

  getOpponentMoves(color: Color): Move[] {
    this.setWinningChances(color)
    const candidateMoves = this.candidateMovesOpponent()
    if (candidateMoves.length === 0) {
      throw new Error("unknown Position")
    }
    return candidateMoves.sort((a: Move, b: Move) => b.weigth - a.weigth)
  }

  getRepertoireMove(randomness: boolean, rare: boolean, color: Color): Move {
    this.setWinningChances(color)
    const property = rare ? "weigth" : "winningChances"
    const candidateMoves = this.candidateMovesRepertoire(rare)
    if (candidateMoves.length === 0) {
      throw new Error("unknown Position")
    }
    if (randomness) {
      const index = Math.floor(Math.random() * candidateMoves.length)
      return candidateMoves[index]
    }
    return candidateMoves.sort((a: Move, b: Move) => b[property] - a[property])[0]
  }

  candidateMovesRepertoire(rare: boolean): Move[] {
    const W_WINN = 4
    const W_RARE = 1
    const THRESHOLD_FAKTOR = 10 // 10 %
    const property = rare ? "weigth" : "winningChances"
    let bestValue = 0
    //console.log("repetoir", this.movesDatabase.moves)
    this.movesDatabase.moves.forEach((move: Move) => {
      if (rare) {
        move.weigth = (move.winningChances! * W_WINN + (100 - move.popularity) * W_RARE) / (W_WINN + W_RARE)
      }
      if (move[property] > bestValue) {
        bestValue = move[property]
      }
    })
    const threshold = bestValue - bestValue / THRESHOLD_FAKTOR
    return this.movesDatabase.moves.filter((move: Move) => {
      return move[property] > threshold
    })
  }

  candidateMovesOpponent(): Move[] {
    const W_WINN = 1
    const W_POPULARITY = 1
    const THRESHOLD_FAKTOR = 10 // 10 %
    let bestValue = 0
    let sum = 0
    this.movesDatabase.moves.forEach((move: Move) => {
      move.weigth = (move.winningChances! * W_WINN + move.popularity * W_POPULARITY) / (W_WINN + W_POPULARITY)
      sum += move.weigth
      if (move.weigth > bestValue) {
        bestValue = move.weigth
      }
    })
    const average = sum / this.movesDatabase.moves.length
    const threshold = bestValue - bestValue / THRESHOLD_FAKTOR
    return this.movesDatabase.moves.filter((move: Move) => {
      return move.weigth > average
    })
  }

  bestMoveByWinningPercentage(color: Color): Move {
    let bestMove: Move = this.movesDatabase.moves[0]
    let winCount = 0
    this.movesDatabase.moves.forEach((move) => {
      if (color === "white" && move.white > winCount) {
        bestMove = move
        winCount = move.white
      }
      if (color === "black" && move.black > winCount) {
        bestMove = move
        winCount = move.black
      }
    })
    return bestMove
  }
}
