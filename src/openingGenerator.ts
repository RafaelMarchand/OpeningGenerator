import Moves from "./DatabaseResult"
import Graph from "graphology"
import { Chess } from "chess.js"

export type Color = "b" | "w"

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

type GraphType = Graph<NodeAttributes, EdgeAttributes, GraphAttributes>

export type NodeAttributes = {
  position: string
  value: number
}

type EdgeAttributes = {
  weight: number
}

type GraphAttributes = {
  name?: string
}

const RAITING_RANGES = [0, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500]

function openingGenerator(fen: string, side: Color, maxDepth: number = 5): GraphType {
  const graph: GraphType = new Graph()
  let currentNodeKey = 0
  generate([fen], 0, -1)

  function generate(fens: string[], depth: number, parentNodeKey: number) {
    for (const position of fens) {
      const nextParentNodeKey = currentNodeKey

      const colorToMove = position.split(" ")[1]
      // add node and edge
      graph.addNode(String(currentNodeKey), { position: position, value: 0 })
      if (parentNodeKey != -1) {
        graph.addEdge(parentNodeKey, currentNodeKey)
      }
      currentNodeKey++

      //drawing
      //if (graphDrawer) graphDrawer.drawGraph(this.graph, ["0"])

      // fetch new mvoes
      movesMaster(position).then((result) => {
        const moves = new Moves(result)
        let resultingPositions = []

        if (colorToMove === side) {
          resultingPositions.push(moves.bestMoveByWinningPercentage(side))
        } else {
          resultingPositions = moves.mostFrequentMoves(0)
        }

        resultingPositions = resultingPositions.map((move) => {
          const chess = new Chess()
          chess.load(position)
          chess.move(move.uci)
          return chess.fen()
        })

        if (depth < maxDepth) {
          generate(resultingPositions, depth + 1, nextParentNodeKey)
        }
      })
    }
  }
  return graph
}

async function movesMaster(position: string): Promise<MovesDatabase> {
  const numberOfMoves = 2

  const params = new URLSearchParams()
  params.append("fen", position)
  params.append("moves", String(numberOfMoves))

  const result = await fetch(`https://explorer.lichess.ovh/masters?${params.toString()}`).then(
    (response) => response.json()
  )
  return result
}

async function movesPlayers(): Promise<MovesDatabase> {
  const fen = "rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2"
  const numberOfMoves = 5
  const lowestRaiting = 1000
  const highestRaiting = 2000
  let raitingRange = ""

  RAITING_RANGES.forEach((range) => {
    if (range >= lowestRaiting && range < highestRaiting) {
      if (raitingRange != "") {
        raitingRange += ","
      }
      raitingRange += range
    }
  })

  const params = new URLSearchParams()
  params.append("variant", "standard")
  params.append("speeds", "blitz,rapid,classical")
  params.append("raitings", raitingRange)
  params.append("fen", fen)
  params.append("moves", String(numberOfMoves))

  const moves = await fetch(`https://explorer.lichess.ovh/lichess?${params.toString()}`).then(
    (response) => response.json()
  )

  return JSON.parse(JSON.stringify(moves))
}

export default openingGenerator