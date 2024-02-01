import { RefObject } from "react"
import GraphDrawer from "../../node_modules/graph-drawer/src/main.js"
//import GraphDrawer from "graph-drawer"
import Graphology from "graphology"
import Board from "./Board.js"
import { nextMoves } from "./utils.js"
import { Options } from "../Generator"

type NodeAttributes = {
  value: number
}

type GraphAttributes = {
  focus: string
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
  getOutEdgesKeys: (graph: Graphology, nodeKey: string) =>
    graph.mapOutEdges(nodeKey, (edge: any) => edge),
  getDestNodeKey: (graph: Graphology, edgeKey: string) => graph.target(edgeKey),
  getNodeValue: (graph: Graphology, nodeKey: string) => 0,
  getNodeFocus: (graph: Graphology, nodeKey: string) => {
    if (nodeKey === graph.getAttribute("focus")) {
      return true
    }
    return false
  }
}

export default class Graph {
  graph: Graphology<NodeAttributes, GraphAttributes>
  rootNodes: [string]
  graphDrawer: GraphDrawer

  constructor(
    ref: RefObject<HTMLDivElement>,
    nodeOnClick: (key: string) => void,
    nodeOnHover: (key: string, event: MouseEvent) => void
  ) {
    this.graph = new Graphology()
    this.graph.addNode(Board.STARTING_POSITION)
    this.rootNodes = [Board.STARTING_POSITION]
    this.graphDrawer = new GraphDrawer(
      GRAPH_METHODS,
      ref.current,
      GRAPH_DRAWR_OPTIONS,
      nodeOnClick,
      nodeOnHover
    )
  }

  addNode(position: string) {
    this.graph.mergeNode(position)
  }

  addEdge(position: string, lastPosition: string) {
    if (position !== lastPosition) {
      this.graph.mergeEdge(lastPosition, position)
    }
  }

  update(position: string, lastPosition: string) {
    this.addNode(position)
    this.addEdge(position, lastPosition)
    this.draw()
  }

  draw() {
    this.graphDrawer.drawGraph(this.graph, this.rootNodes)
  }

  setActiveNode(position: string) {
    this.graph.setAttribute("focus", position)
    this.draw()
  }

  generateOpening(position: string, options: Options) {
    const generate = (fens: string[], depth: number, lastPosition: string) => {
      for (const position of fens) {
        this.update(position, lastPosition)

        nextMoves(position, options).then((nextPositions) => {
          if (depth < options.depth) {
            generate(nextPositions, depth + 1, position)
          }
        })
      }
    }
    generate([position], 0, position)
  }
}
