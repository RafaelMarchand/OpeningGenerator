import Board from "./Board"
import { NodePosition } from "./Graph"
import GraphBuilder, { GraphType, MoveData } from "./GraphBuilder"
import Observable from "./Observable"
import Graphology from "graphology"
import { OpeningData } from "./useSaveOpening"

export type ProxyIdentifier = "Generator" | "Library"

export type State = {
  fen: string
  graph: GraphType
  nextMoves: MoveData[]
  currentProxy: ProxyIdentifier
}

export default class Proxy extends Observable {
  static SHOW_POPUP = Symbol("showPopUp")
  static STATE_CHANGE = Symbol("stateChange")
  graphBuilder: GraphBuilder
  boardPosition: string
  identifier: ProxyIdentifier

  constructor(identifier: ProxyIdentifier) {
    super()
    this.graphBuilder = new GraphBuilder()
    this.boardPosition = Board.STARTING_POSITION
    this.identifier = identifier
  }
  // @ts-ignore
  boardMove(move: string, fen: string, prevFen: string) {}
  // @ts-ignore
  nodeClick(fen: string, _position: NodePosition, event: MouseEvent) {}

  nodeHover(fen: string, position: NodePosition, event: MouseEvent) {
    this.notify(Proxy.SHOW_POPUP, fen, position, event.type)
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
    this.boardPosition = Board.STARTING_POSITION
    this.updateUI()
  }

  updateUI() {
    this.graphBuilder.graph.setAttribute("focus", this.boardPosition)
    const state: State = {
      fen: this.boardPosition,
      graph: this.graphBuilder.graph,
      nextMoves: this.graphBuilder.getNextMoves(this.boardPosition),
      currentProxy: this.identifier
    }
    this.notify(Proxy.STATE_CHANGE, state)
  }
}
