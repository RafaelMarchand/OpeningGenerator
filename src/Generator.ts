import Moves from "./DatabaseResult"
import Graph from "graphology"
import Attributes from "graphology"
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
const STARTING_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

export default class Generator {
  graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes>
  minFrequency: number
  maxDepth: number
  currentNodeKey: number
  graphDrawer: any
  dispatch: any
  setBoard: any
  side: Color
  constructor(fen: string, dispatch: any, setBoard: any, side: Color) {
    this.minFrequency = 80
    this.maxDepth = 2
    this.currentNodeKey = 0
    this.graph = new Graph()
    this.graphDrawer = null
    this.dispatch = dispatch
    this.setBoard = setBoard
    this.side = side
    this.generate([fen], 0, -1)

    console.log(this.graph)
  }

  generate(fens: string[], depth: number, parentNodeKey: number) {
    const nextParentNodeKey = this.currentNodeKey
    // console.log(depth)
    // console.log("parent key", parentNodeKey)
    // console.log("current", this.currentNodeKey)
    for (const position of fens) {
      const colorToMove = position.split(" ")[1]
      // add node and edge
      this.graph.addNode(String(this.currentNodeKey), { position: position, value: 0 })
      if (parentNodeKey != -1) {
        this.graph.addEdge(parentNodeKey, this.currentNodeKey)
      }
      this.currentNodeKey++

      //drawing
      if (this.graphDrawer) this.graphDrawer.drawGraph(this.graph, ["0"])

      // fetch new mvoes
      this.movesMaster(position).then((result) => {
        const moves = new Moves(result)
        //console.log(moves.mostFrequentMoves(0.4))
        const resultingPositions = moves.mostFrequentMoves(0.001).map((move) => {
          const chess = new Chess()
          chess.load(position)
          chess.move(move.uci)
          return chess.fen()
        })
        if (depth < this.maxDepth) {
          this.generate(resultingPositions, depth + 1, nextParentNodeKey)
        }
      })
    }
  }

  nodeOnClick(key: string) {
    const position = this.graph.getNodeAttribute(key, "position")

    this.setBoard(position)
    this.dispatch(position)
  }

  async movesMaster(position: string): Promise<MovesDatabase> {
    const numberOfMoves = 12

    const params = new URLSearchParams()
    params.append("fen", position)
    params.append("moves", String(numberOfMoves))

    const result = await fetch(`https://explorer.lichess.ovh/masters?${params.toString()}`).then(
      (response) => response.json()
    )
    return result
  }
  async movesPlayers(): Promise<MovesDatabase> {
    const fen = "rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2"
    const numberOfMoves = 12
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
}
