import { RefObject } from "react"
import GraphDrawer from "../../node_modules/graph-drawer/src/main.js"
//import GraphDrawer from "graph-drawer"
import Graphology from "graphology"
import Board from "./Board.js"
import { nextMoves } from "./utils.js"
import { Options } from "../Generator"
import Observable from "./Observable.js"

type NodeAttributes = {
  value: number
}

type GraphAttributes = {
  focus: string
}

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
  graph: Graphology<NodeAttributes, GraphAttributes>
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

  addEdge(fen: string, prevFen: string) {
    if (fen !== prevFen) {
      this.graph.mergeEdge(prevFen, fen)
    }
  }

  update(fen: string, prevFen: string) {
    this.addNode(fen)
    this.addEdge(fen, prevFen)
    this.draw()
  }

  removeNode(fen: string): string {
    let parentNode = Board.STARTING_POSITION
    this.graph.forEachInEdge(fen, (_edge, _attr, source) => {
      parentNode = source
    })
    this.removeNodesRec(fen)
    this.draw()
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

  setActiveNode(fen: string) {
    //this.graph.setAttribute("focus", fen)
    this.draw()
  }

  generateOpening(fen: string, options: Options) {
    console.log(options)
    const generate = (fens: string[], depth: number, prevFen: string) => {
      for (const fen of fens) {
        this.update(fen, prevFen)

        nextMoves(fen, options).then((nextPositions) => {
          if (depth < options.depth) {
            generate(nextPositions, depth + 1, fen)
          }
        })
      }
    }
    generate([fen], 0, fen)
    console.log(this.graph)
  }
}
