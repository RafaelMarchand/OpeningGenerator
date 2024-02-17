import { RefObject } from "react"
import GraphDrawer from "../../node_modules/graph-drawer/src/main.js"
//import GraphDrawer from "graph-drawer"
import Graphology from "graphology"
import Board from "./Board.js"
import Observable from "./Observable.js"
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

export type GraphType = Graphology<NodeAttributes, EdgeAttributes, GraphAttributes>

export type NodePosition = {
  x: number
  y: number
}

interface GraphMethods {
  getNodeKeys: (graph: Graphology) => string[]
  getOutEdgesKeys: (graph: Graphology, nodeKey: string) => string[]
  getDestNodeKey: (graph: Graphology, edgeKey: string) => string
  getNodeValue: (graph: Graphology, nodeKey: string) => number
  getNodeFocus: (graph: Graphology, nodeKey: string) => boolean
}

const GRAPH_DRAWR_OPTIONS = {
  width: 1000,
  height: 500,
  nodeRadius: 5,
  nodeRadiusHover: 10,
  nodeRadiusFocus: 10,
  style: {
    borderRadius: "0.3rem",
    backgroundColor: "black",
    nodeBorder: "white",
    edgeWidth: 5, // first hsl value to determine color
    nodeColorPositive: 0,
    nodeColorNegative: 240,
    maxLightness: 4
  }
}

const GRAPH_METHODS: GraphMethods = {
  getNodeKeys: (graph: Graphology) => graph.mapNodes((key: string) => key),
  getOutEdgesKeys: (graph: Graphology, nodeKey: string) => graph.mapOutEdges(nodeKey, (edge: any) => edge),
  getDestNodeKey: (graph: Graphology, edgeKey: string) => graph.target(edgeKey),
  getNodeValue: (graph: Graphology, nodeKey: string) => 0,
  getNodeFocus: (graph: Graphology, nodeKey: string) => {
    if (nodeKey === graph.getAttribute("focus")) {
      return true
    }
    return false
  }
}

export default class Graph extends Observable {
  graph: GraphType
  rootNodes: [string]
  graphDrawer: GraphDrawer

  constructor(ref: RefObject<HTMLDivElement>) {
    super()
    this.graph = new Graphology({ type: "directed" })
    this.rootNodes = [Board.STARTING_POSITION]
    this.graphDrawer = new GraphDrawer(
      GRAPH_METHODS,
      ref.current,
      GRAPH_DRAWR_OPTIONS,
      (key: string, nodePosition: NodePosition, event: MouseEvent) =>
        this.notify("nodeClick", key, nodePosition, event),
      (key: string, nodePosition: NodePosition, event: MouseEvent) =>
        this.notify("nodeHover", key, nodePosition, event)
    )

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
    this.update(fen)
    return fen
  }

  removeNode(fen: string): string {
    let parentNode = Board.STARTING_POSITION
    this.graph.forEachInEdge(fen, (_edge, _attr, source) => {
      parentNode = source
    })
    this.removeNodesRec(fen)
    this.update(parentNode)
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

  draw() {
    this.graphDrawer.drawGraph(this.graph, this.rootNodes)
  }

  update(fen: string) {
    const moves = this.graph.mapOutEdges(fen, (_edge, attributes, _source, target) => {
      return { move: attributes.move, fen: target }
    })
    this.notify("positionChange", moves)
    this.graph.setAttribute("focus", fen)
    this.draw()
  }
}
