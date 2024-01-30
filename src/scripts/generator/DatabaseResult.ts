import { Color } from "../../Generator"

type MovesDatabase = {
  white: number
  black: number
  draws: number
  moves: [Move]
}

type Move = {
  uci: string
  san: string
  averageRaiting: number
  white: number
  black: number
  draws: number
}

type Chances = null | {
  white: number
  black: number
  draw: number
}

export default class DatabaseResult {
  movesDatabase: MovesDatabase
  gameCount: number

  constructor(movesDatabase: MovesDatabase) {
    this.movesDatabase = movesDatabase
    this.gameCount = this.movesDatabase.black + this.movesDatabase.white + this.movesDatabase.draws
    //console.log(movesDatabase)
  }

  mostFrequentMoves(minFrequency: number): Move[] {
    const moves: Move[] = []
    this.movesDatabase.moves.forEach((move) => {
      let movesPlayed = move.white + move.black + move.draws
      if (movesPlayed / this.gameCount >= minFrequency) {
        moves.push(move)
      }
    })
    //console.log(moves.length)
    return moves
  }

  bestMoveByWinningPercentage(color: Color): Move {
    let bestMove: Move = this.movesDatabase.moves[0]
    let winCount = 0
    this.movesDatabase.moves.forEach((move) => {
      if (color === "w" && move.white > winCount) {
        bestMove = move
        winCount = move.white
      }
      if (color === "b" && move.black > winCount) {
        bestMove = move
        winCount = move.black
      }
    })
    return bestMove
  }
}
