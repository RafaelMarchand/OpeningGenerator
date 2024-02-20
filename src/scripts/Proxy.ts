import Board from "./Board"
import { NodePosition } from "./Graph"
import GraphBuilder from "./GraphBuilder"
import Observable from "./Observable"

export default class Proxy extends Observable {
  graphBuilder: GraphBuilder
  boardPosition: string
  constructor() {
    super()
    this.graphBuilder = new GraphBuilder()
    this.boardPosition = Board.STARTING_POSITION
  }

  action(action: any, payload: any) {}

  boardMove(move: string, fen: string, prevFen: string) {}

  nodeClick(fen: string, position: NodePosition, event: MouseEvent) {}

  nodeHover(fen: string, position: NodePosition, event: MouseEvent) {}

  updateUI() {
    this.graphBuilder.graph.setAttribute("focus", this.boardPosition)
    this.notify("setState", this.boardPosition, this.graphBuilder.graph)
  }
}
