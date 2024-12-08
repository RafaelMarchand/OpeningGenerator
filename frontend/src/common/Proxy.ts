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
  static SELECT_MOVE = Symbol("selectMove")
  graphBuilder: GraphBuilder
  boardPosition: string
  selectedMove: number
  nextMoves: MoveData[]
  identifier: ProxyIdentifier

  constructor(identifier: ProxyIdentifier) {
    super()
    this.graphBuilder = new GraphBuilder()
    this.boardPosition = Board.STARTING_POSITION
    this.selectedMove = 0
    this.nextMoves = []
    this.identifier = identifier
  }
  // @ts-ignore
  boardMove(moveData: MoveData, prevFen: string) {}
  // @ts-ignore
  nodeClick(fen: string, _position: NodePosition, event: MouseEvent) {}

  nodeHover(fen: string | null, position: NodePosition | null, event: MouseEvent) {
    this.notify(Proxy.SHOW_POPUP, fen, position, event.type)
  }

  keyStroke(_event: "down" | "up", key: string) {
    const RIGHT = "ArrowRight"
    const LEFT = "ArrowLeft"
    const DOWN = "ArrowDown"
    const UP = "ArrowUp"
    const ENTER = "Enter"

    if (key === LEFT) {
      const previousPosition = this.graphBuilder.getPreviousPosition(this.boardPosition)
      if (previousPosition) {
        this.boardPosition = previousPosition
        this.updateUI()
      }
    }

    if (key === DOWN) {
      this.selectedMove = (this.selectedMove + 1) % this.nextMoves.length
      this.notify(Proxy.SELECT_MOVE, this.selectedMove)
    }
    if (key === UP) {
      this.selectedMove--
      if (this.selectedMove < 0) {
        this.selectedMove = this.nextMoves.length - 1
      }
      this.notify(Proxy.SELECT_MOVE, this.selectedMove)
    }

    if (key === ENTER || key === RIGHT) {
      if (this.nextMoves.length > 0) {
        this.playNextMove(this.nextMoves[this.selectedMove].fen)
      }
    }
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
    this.nextMoves = this.graphBuilder.getNextMoves(this.boardPosition)

    const state: State = {
      fen: this.boardPosition,
      graph: this.graphBuilder.graph,
      nextMoves: this.nextMoves,
      currentProxy: this.identifier
    }
    this.notify(Proxy.STATE_CHANGE, state)
  }
}
