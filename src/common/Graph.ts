import { RefObject } from "react"
import GraphDrawer from "../../node_modules/graph-drawer/src/main.js"
//import GraphDrawer from "graph-drawer"
import Graphology from "graphology"
import Board from "./Board.js"
import Observable from "./Observable.js"
import { GraphType } from "./GraphBuilder.js"

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
  getNodeFocus: (graph: Graphology, nodeKey: string) => nodeKey === graph.getAttribute("focus")
}

export default class Graph extends Observable {
  static instance: Graph | null = null
  graphDrawer: GraphDrawer

  constructor(ref: RefObject<HTMLDivElement>) {
    if (Graph.instance) return Graph.instance
    super()
    Graph.instance = this
    this.graphDrawer = new GraphDrawer(
      GRAPH_METHODS,
      ref.current,
      GRAPH_DRAWR_OPTIONS,
      (key: string, nodePosition: NodePosition, event: MouseEvent) =>
        this.notify("nodeClick", key, nodePosition, event),
      (key: string, nodePosition: NodePosition, event: MouseEvent) =>
        this.notify("nodeHover", key, nodePosition, event)
    )
  }

  draw(graph: GraphType, rootNodes: string[] = [Board.STARTING_POSITION]) {
    this.graphDrawer.drawGraph(graph, rootNodes)
  }
}