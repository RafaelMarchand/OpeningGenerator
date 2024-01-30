import { RefObject, VoidFunctionComponent } from "react"
import GraphDrawer from "../../node_modules/graph-drawer/src/main.js"
import Graphology from "graphology"
import Board from "./Board.js"

type NodeAttributes = {
  value: number
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
  getNodeValue: (graph: Graphology, nodeKey: string) => 0,
  getNodeFocus: (graph: Graphology, nodeKey: string) => {
    if (nodeKey === graph.getAttribute("focus")) {
      return true
    }
    return false
  }
}

type callbacks = (key: string) => void

export default class Graph {
  graph: Graphology<NodeAttributes>
  rootNodes: [string]
  graphDrawer: GraphDrawer

  constructor(ref: RefObject<HTMLDivElement>, nodeOnClick: callbacks, nodeOnHover: callbacks) {
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
    const nodeKey: string | undefined = this.graph.findNode((key: string) => {
      return key === position
    })
    if (!nodeKey) {
      this.graph.addNode(position)
    }
  }

  addEdge(position: string, lastPosition: string) {
    if (position !== lastPosition && !this.graph.hasEdge(position, lastPosition)) {
      this.graph.addEdge(lastPosition, position)
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
}
