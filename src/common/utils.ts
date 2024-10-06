import { Chess } from "chess.js"
import { Options } from "../components/Controls/Configuration"
import { DataBaseResult, Move as MoveResult, movesPlayers } from "./lichessAPI"
import { MoveData } from "./GraphBuilder"

export type Color = "black" | "white"

export type Result = {
  fen: string
  prevFen: string
  moveData: MoveData | null
  depth: number
}

export async function nextMoves(position: string, options: Options, depth: number): Promise<Result[]> {
  const colorToMove = position.split(" ")[1] === "w" ? "white" : "black"
  const repertoireMove = options.color === colorToMove
  const steps = []

  const result = await movesPlayers(position, options.rangeOpponent)

  steps.push(createPrepare())
  steps.push(createAddWinningChances(colorToMove))
  steps.push(createWeightFunction(repertoireMove, options.rareRepertoire))
  steps.push(repertoireMove ? candidateMovesRepertoire : candidateMovesOpponent)
  steps.push(createChooseMove(repertoireMove, options.randomness, options.maxLineSpread))
  steps.push(createMapToResults(position, depth))

  return steps.reduce((acc: any, fn: any) => {
    return fn(acc)
  }, result)
}

function createPrepare(): (result: DataBaseResult) => MoveResult[] {
  return function prepare(result: DataBaseResult): MoveResult[] {
    const gameCount = result.black + result.white + result.draws
    result.moves.forEach((move) => {
      let movesPlayed = move.white + move.black + move.draws
      move.popularity = Math.ceil((movesPlayed / gameCount) * 100)
    })
    return result.moves
  }
}

function createAddWinningChances(color: Color): (moves: MoveResult[]) => MoveResult[] {
  return function addWinningChances(moves: MoveResult[]): MoveResult[] {
    moves.forEach((move) => {
      let movesPlayed = move.white + move.black + move.draws
      move.winningChances = (move[color] / movesPlayed) * 100
    })
    return moves
  }
}

function createWeightFunction(repertoir: boolean, rare: boolean) {
  function weigthRepertoire(move: MoveResult) {
    move.weigth = move.winningChances
  }
  function weigthRareRepertoire(move: MoveResult) {
    const W_WINN = 4
    const W_RARITY = 1
    move.weigth = (move.winningChances! * W_WINN + (100 - move.popularity) * W_RARITY) / (W_WINN + W_RARITY)
  }
  function weigthResponses(move: MoveResult) {
    const W_WINN = 1
    const W_POPULARITY = 1
    move.weigth = (move.winningChances! * W_WINN + move.popularity * W_POPULARITY) / (W_WINN + W_POPULARITY)
  }

  let weightFunction = weigthResponses
  if (repertoir) {
    weightFunction = rare ? weigthRareRepertoire : weigthRepertoire
  }

  return function (moves: MoveResult[]) {
    moves.forEach((move) => {
      weightFunction(move)
    })
    return moves
  }
}

function createMapToResults(position: string, depth: number): (moves: MoveResult[]) => Result[] {
  return function mapToResults(moves: MoveResult[]): Result[] {
    return moves.map((move) => {
      const chess = new Chess()
      chess.load(position)
      chess.move(move.san)
      return {
        fen: chess.fen(),
        prevFen: position,
        moveData: {
          move: {
            san: move.san,
            uci: move.uci
          },
          fen: chess.fen()
        },
        depth: depth
      }
    })
  }
}

// prettier-ignore
function createChooseMove(repertoireMove: boolean, randomness: boolean, limit: number): (moves: MoveResult[]) => MoveResult[] {
  if (repertoireMove && randomness) {
    return function randomMove(moves: MoveResult[]): MoveResult[] {
      if (moves.length === 0) return []
      const index = Math.floor(Math.random() * moves.length)
      return [moves[index]]
    }
  }
  if (repertoireMove) limit = 1
  return function sortAndLimitMoves(moves: MoveResult[]): MoveResult[] {
    if (moves.length === 0) return []
    moves.sort((a: MoveResult, b: MoveResult) => b.weigth - a.weigth)
    if (moves.length > limit) {
      return moves.slice(0, limit)
    }
    return moves
  }
}

function candidateMovesRepertoire(moves: MoveResult[]): MoveResult[] {
  const THRESHOLD_FAKTOR = 10 // 10 %
  let bestValue = 0
  moves.forEach((move: MoveResult) => {
    if (move.weigth > bestValue) {
      bestValue = move.weigth
    }
  })
  const threshold = bestValue - bestValue / THRESHOLD_FAKTOR
  return moves.filter((move: MoveResult) => {
    return move.weigth > threshold
  })
}

function candidateMovesOpponent(moves: MoveResult[]): MoveResult[] {
  let bestValue = 0
  let sum = 0
  moves.forEach((move: MoveResult) => {
    sum += move.weigth
    if (move.weigth > bestValue) {
      bestValue = move.weigth
    }
  })
  const average = sum / moves.length
  return moves.filter((move: MoveResult) => {
    return move.weigth > average
  })
}
