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

  constructor() {
    this.graph = new Graphology({ type: "directed" })
    this.graph.addNode(Board.STARTING_POSITION)
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
    const moves = this.graph.mapOutEdges(fen, (_edge, attributes, _source, target) => {
      return { move: attributes.move, fen: target }
    })
    return moves
  }

  loadGraph(graph: GraphType): string {
    console.log(graph)
    this.graph = new Graphology({ type: "directed" }).import(graph) as GraphType
    //this.draw()
    this.notify("graphChange", this.graph)
    return this.graph.getAttribute("focus")
  }
}
