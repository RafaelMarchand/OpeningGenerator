import Board from "./Board"
import { NodePosition } from "./Graph"
import GraphBuilder, { GraphType } from "./GraphBuilder"
import Observable from "./Observable"
import Graphology from "graphology"
import { OpeningData } from "./useSaveOpening"

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

  nodeHover(fen: string, position: NodePosition, event: MouseEvent) {
    this.notify("showPopUp", fen, position, event.type)
  }

  resetGraph() {
    this.graphBuilder = new GraphBuilder()
    this.boardPosition = Board.STARTING_POSITION
    this.updateUI()
  }

  playNextMove(fen: string) {
    this.boardPosition = fen
    this.updateUI()
  }

  loadOpening(opening: OpeningData) {
    this.graphBuilder.graph = new Graphology({ type: "directed" }).import(opening.graph) as GraphType
    this.updateUI()
  }

  updateUI() {
    this.graphBuilder.graph.setAttribute("focus", this.boardPosition)
    this.notify(
      "setState",
      this.boardPosition,
      this.graphBuilder.graph,
      this.graphBuilder.getNextMoves(this.boardPosition)
    )
  }
}
