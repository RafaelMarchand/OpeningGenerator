import Graphology from "graphology"
import Proxy from "./Proxy.js"
import { GraphType } from "./GraphBuilder.js"
import { NodePosition } from "./Graph.js"

const MOUSE_LEFT = 0

export default class LibraryProxy extends Proxy {
  constructor() {
    super()
  }

  action(action: any, payload: any): void {
    switch (action) {
      case "loadOpening":
        this.loadGraph(payload.graph)
        break
    }
  }

  boardMove(move: string, fen: string, prevFen: string) {}

  nodeClick(fen: string, position: NodePosition, event: MouseEvent) {
    if (event.button === MOUSE_LEFT) {
      this.boardPosition = fen
      this.updateUI()
    }
  }

  nodeHover(fen: string, position: NodePosition, event: MouseEvent) {
    this.notify("showPopUp", fen, position, event.type)
  }

  loadGraph(graph: GraphType) {
    this.graphBuilder.graph = new Graphology({ type: "directed" }).import(graph) as GraphType
    this.updateUI()
  }
}
