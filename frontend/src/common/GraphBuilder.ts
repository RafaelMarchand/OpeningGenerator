import Graphology from "graphology"
import Board from "./Board.js"

type NodeAttributes = {
  value: number
  moves: MoveData[]
}

type EdgeAttributes = {
  moveData: MoveData
}

type GraphAttributes = {
  focus: string
}

type Move = {
  uci: string
  san: string
}

export type MoveData = {
  move: Move
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

  addEdge(moveData: MoveData, prevFen: string) {
    if (moveData.fen !== prevFen) {
      this.graph.mergeEdge(prevFen, moveData.fen, { moveData })
    }
  }

  addMove(moveData: MoveData, prevFen: string): string {
    this.saved = false
    this.addNode(moveData.fen)
    this.addEdge(moveData, prevFen)
    return moveData.fen
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
      moves.push({ move: attributes.moveData.move, fen: target })
    })
    return moves
  }

  getPreviousPosition(fen: string) {
    let previousPosition = undefined
    this.graph.forEachInEdge(fen, (_edge, _attributes, source, _target) => {
      previousPosition = source
    })
    return previousPosition
  }
}
