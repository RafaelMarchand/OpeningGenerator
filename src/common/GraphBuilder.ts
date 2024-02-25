import Graphology from "graphology"
import Board from "./Board.js"
import { Move } from "./lichessAPI.js"

type NodeAttributes = {
  value: number
  moves: Move[]
}

type EdgeAttributes = {
  move: string
}

type GraphAttributes = {
  focus: string
}

export type MoveData = {
  move: string
  fen: string
}

export type GraphType = Graphology<NodeAttributes, EdgeAttributes, GraphAttributes>

export default class GraphBuilder {
  graph: GraphType
  saved: boolean

  constructor() {
    this.graph = new Graphology({ type: "directed" })
    this.graph.addNode(Board.STARTING_POSITION)
    this.saved = true
  }

  addNode(fen: string) {
    this.graph.mergeNode(fen)
  }

  addEdge(move: string, fen: string, prevFen: string) {
    if (fen !== prevFen) {
      this.graph.mergeEdge(prevFen, fen, { move: move })
    }
  }

  addMove(move: string, fen: string, prevFen: string): string {
    this.saved = false
    this.addNode(fen)
    this.addEdge(move, fen, prevFen)
    return fen
  }

  removeNode(fen: string): string {
    let parentNode = Board.STARTING_POSITION
    this.graph.forEachInEdge(fen, (_edge, _attr, source) => {
      parentNode = source
    })
    this.removeNodesRec(fen)
    return parentNode
  }

  removeNodesRec(node: string) {
    this.graph.forEachOutEdge(node, (_edge, _attr, _source, target) => {
      this.removeNodesRec(target)
    })
    if (node !== Board.STARTING_POSITION) {
      this.graph.dropNode(node)
    }
  }

  getNextMoves(fen: string): MoveData[] {
    const moves: MoveData[] = []
    this.graph.forEachOutEdge(fen, (_edge, attributes, _source, target) => {
      moves.push({ move: attributes.move, fen: target })
    })
    return moves
  }
}
