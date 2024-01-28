import { RefObject } from "react"
import GraphDrawer from "../node_modules/graph-drawer/src/main.js"
import Graphology from "graphology"

interface GraphMethods {
  getNodeKeys: (graph: Graphology) => string[]
  getOutEdgesKeys: (graph: Graphology, nodeKey: string) => string[]
  getDestNodeKey: (graph: Graphology, edgeKey: string) => string
  getNodeValue: (graph: Graphology, nodeKey: string) => number
  getNodeFocus: (graph: Graphology, nodeKey: string) => boolean
}

const GRAPH_DRAWR_OPTIONS = {
  width: 1000,
  height: 600,
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
  getNodeValue: (graph: Graphology, nodeKey: string) =>
    graph.getNodeAttribute(nodeKey, "value").value,
  getNodeFocus: (graph: Graphology, nodeKey: string) => {
    if (nodeKey === graph.getAttribute("focus")) {
      return true
    }
    return false
  }
}

export default class Graph {
  config: any
  graphDrawer: any
  graph: Graphology

  constructor(ref: RefObject<HTMLDivElement>) {
    this.graph = new Graphology()
    this.graphDrawer = new GraphDrawer(
      GRAPH_METHODS,
      ref.current,
      GRAPH_DRAWR_OPTIONS,
      this.nodeOnClick,
      this.nodeOnHover
    )
  }

  draw(graph: Graphology, rootNodes: [String]) {
    this.graphDrawer.drawGraph(graph, rootNodes)
  }

  nodeOnClick(key: string) {
    //generator.nodeOnClick(key)
  }

  nodeOnHover(key: string) {
    //generator.hoverOnNode(key)
  }
}
