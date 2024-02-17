import { Chess } from "chess.js"
import { Options } from "../components/OpeningGenerator/Configuration"
import { DataBaseResult, Move, movesPlayers } from "./lichessAPI"

export type Color = "black" | "white"

export type Result = {
  fen: string
  move: string
}

export async function nextMoves(position: string, options: Options): Promise<Result[]> {
  const colorToMove = position.split(" ")[1] === "w" ? "white" : "black"
  const repertoireMove = options.color === colorToMove
  const steps = []

  const result = await movesPlayers(position, options.rangeOpponent)

  steps.push(createPrepare(repertoireMove, options.rareRepertoire))
  steps.push(createAddWinningChances(colorToMove))
  steps.push(createWeightFunction(repertoireMove, options.rareRepertoire))
  steps.push(repertoireMove ? candidateMovesRepertoire : candidateMovesOpponent)
  steps.push(createChooseMove(repertoireMove, options.randomness, options.maxLineSpread))
  steps.push(createMapToResults(position))

  return steps.reduce((acc: any, fn: any) => {
    return fn(acc)
  }, result)
}

function createPrepare(repertoireMove: boolean, rareRepertoire: boolean): (result: DataBaseResult) => Move[] {
  return function prepare(result: DataBaseResult): Move[] {
    if (repertoireMove && !rareRepertoire) return result.moves

    const gameCount = result.black + result.white + result.draws
    result.moves.forEach((move) => {
      let movesPlayed = move.white + move.black + move.draws
      move.popularity = Math.ceil((movesPlayed / gameCount) * 100)
    })
    return result.moves
  }
}

function createAddWinningChances(color: Color): (moves: Move[]) => Move[] {
  return function addWinningChances(moves: Move[]): Move[] {
    moves.forEach((move) => {
      let movesPlayed = move.white + move.black + move.draws
      move.winningChances = (move[color] / movesPlayed) * 100
    })
    return moves
  }
}

function createWeightFunction(repertoir: boolean, rare: boolean) {
  function weigthRepertoire(move: Move) {
    move.weigth = move.winningChances
  }
  function weigthRareRepertoire(move: Move) {
    const W_WINN = 4
    const W_RARITY = 1
    move.weigth = (move.winningChances! * W_WINN + (100 - move.popularity) * W_RARITY) / (W_WINN + W_RARITY)
  }
  function weigthResponses(move: Move) {
    const W_WINN = 1
    const W_POPULARITY = 1
    move.weigth = (move.winningChances! * W_WINN + move.popularity * W_POPULARITY) / (W_WINN + W_POPULARITY)
  }

  let weightFunction = weigthResponses
  if (repertoir) {
    weightFunction = rare ? weigthRareRepertoire : weigthRepertoire
  }

  return function (moves: Move[]) {
    moves.forEach((move) => {
      weightFunction(move)
    })
    return moves
  }
}

function createMapToResults(position: string): (moves: Move[]) => Result[] {
  return function mapToPositions(moves: Move[]): Result[] {
    return moves.map((move) => {
      const chess = new Chess()
      chess.load(position)
      chess.move(move.uci)
      return {
        fen: chess.fen(),
        move: move.san
      }
    })
  }
}

// prettier-ignore
function createChooseMove(repertoireMove: boolean, randomness: boolean, limit: number): (moves: Move[]) => Move[] {
  if (repertoireMove && randomness) {
    return function randomMove(moves: Move[]): Move[] {
      const index = Math.floor(Math.random() * moves.length)
      return [moves[index]]
    }
  }
  if (repertoireMove) limit = 1
  return function sortAndLimitMoves(moves: Move[]): Move[] {
    moves.sort((a: Move, b: Move) => b.weigth - a.weigth)
    if (moves.length > limit) {
      return moves.slice(0, limit)
    }
    return moves
  }
}

function candidateMovesRepertoire(moves: Move[]): Move[] {
  const THRESHOLD_FAKTOR = 10 // 10 %
  let bestValue = 0
  moves.forEach((move: Move) => {
    if (move.weigth > bestValue) {
      bestValue = move.weigth
    }
  })
  const threshold = bestValue - bestValue / THRESHOLD_FAKTOR
  return moves.filter((move: Move) => {
    return move.weigth > threshold
  })
}

function candidateMovesOpponent(moves: Move[]): Move[] {
  let bestValue = 0
  let sum = 0
  moves.forEach((move: Move) => {
    sum += move.weigth
    if (move.weigth > bestValue) {
      bestValue = move.weigth
    }
  })
  const average = sum / moves.length
  return moves.filter((move: Move) => {
    return move.weigth > average
  })
}
