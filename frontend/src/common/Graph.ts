import { RefObject } from "react"
import Graphology from "graphology"
import Board from "./Board.js"
import Observable from "./Observable.js"
import GraphDrawer, { GraphMethods, Config } from "graph-drawer"
import { State } from "./Proxy.js"
import { blue, green, grey } from "@mui/material/colors"

export const GRAPH_SIZE = {
  width: 1000,
  height: 500
}

export type NodePosition = {
  x: number
  y: number
}

const graphMethods: GraphMethods<Graphology, null> = {
  getNodeKeys: (graph) => graph.mapNodes((key) => key),
  getDestNodeKeys: (graph, nodeKey) => graph.mapOutEdges(nodeKey, (_edge, _attributes, _source, target) => target),
  getNodeAttribute: (_graph, _nodeKey) => null
}

export default class Graph extends Observable {
  static NODE_CLICK = Symbol("nodeClick")
  static NODE_HOVER = Symbol("nodeHover")
  graphDrawer: GraphDrawer<Graphology, null>
  config: Config<null>
  fen: string

  constructor(ref: RefObject<HTMLDivElement>) {
    super()
    this.config = {
      width: GRAPH_SIZE.width,
      height: GRAPH_SIZE.height,
      backgroundColor: "black",
      edgeWidth: 5,
      nodeHasText: false,
      maxArrangements: 50,
      paddingGraph: 30,
      nodeBorderColor: "white",
      nodeColor: (key, attributes, clicked, mouseOver) => {
        if (key === this.fen) {
          return blue[700]
        }
        return grey[700]
      },
      nodeRadius: (key, _attributes, _clicked, mouseOver) => {
        if (key === this.fen) {
          return 10
        }
        return 7
      },
      nodeBorderWidth: (key, _attributes, _clicked, mouseOver) => {
        if (key === "3" && mouseOver) {
          return 10
        }
        return 2
      },
      edgeColor(srcNodeKey, destNodeKey, srcAttribute, destNodeAttribute, clicked, mouseOver) {
        return "white"
      },
      nodeClick: (key, position, event) => {
        this.notify(Graph.NODE_CLICK, key, position, event)
        //draw()
      },
      edgeClick(key, destNodeKey, event) {
        //draw()
      },
      nodeHover: (key, position, event) => {
        this.notify(Graph.NODE_HOVER, key, position, event)
        //draw()
      },
      edgeHover(key, destNodeKey, event) {
        //draw()
      },
      styleCanvas: {
        borderRadius: "0.3rem"
      }
    }
    this.graphDrawer = new GraphDrawer(graphMethods, ref.current!, this.config)
    this.fen = Board.STARTING_POSITION
  }

  draw(state: State, rootNodes: string[] = [Board.STARTING_POSITION]) {
    this.fen = state.fen
    this.graphDrawer.update(state.graph, rootNodes)
  }
}
