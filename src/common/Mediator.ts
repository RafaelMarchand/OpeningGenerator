import { RefObject } from "react"
import Board from "./Board"
import Observable from "./Observable"
import Graph, { NodePosition } from "./Graph"
import GeneratorProxy from "./GeneratorProxy"
import Proxy, { State } from "./Proxy"
import LibraryProxy from "./LibraryProxy"
import { OpeningData } from "./useSaveOpening"

export type Ref = RefObject<HTMLDivElement>

export default class Mediator extends Observable {
  static instance: Mediator | null = null
  static STATE_CHANGE = Symbol("stateChange")
  board: Board | undefined
  graph: Graph | undefined
  libraryProxy!: LibraryProxy
  generatorProxy!: GeneratorProxy
  proxy!: Proxy

  constructor() {
    if (Mediator.instance) return Mediator.instance
    super()
    Mediator.instance = this
    this.board = undefined
    this.graph = undefined
    this.libraryProxy = new LibraryProxy()
    this.generatorProxy = new GeneratorProxy()
    this.proxy = this.generatorProxy
  }

  initialize(boardRef: Ref, graphRef: Ref) {
    this.libraryProxy.resetGraph()
    this.generatorProxy.resetGraph()
    this.board = new Board(boardRef)
    this.graph = new Graph(graphRef)

    this.board.listen(Board.BOARD_MOVE, (move: string, fen: string, prevFen: string) => {
      this.proxy.boardMove(move, fen, prevFen)
    })

    this.graph.listen(Graph.NODE_CLICK, (fen: string, position: NodePosition, event: MouseEvent) => {
      this.proxy.nodeClick(fen, position, event)
    })

    this.graph.listen(Graph.NODE_HOVER, (fen: string, position: NodePosition, event: MouseEvent) => {
      this.proxy.nodeHover(fen, position, event)
    })
    new Array<Proxy>(this.generatorProxy, this.libraryProxy).forEach((proxy: Proxy) => {
      proxy.listen(Proxy.STATE_CHANGE, (state: State) => {
        this.board!.setPosition(state.fen)
        this.graph!.draw(state.graph)
        this.notify(Mediator.STATE_CHANGE, state)
      })
    })

    this.libraryProxy.listen(LibraryProxy.EDIT_OPENING, (opening: OpeningData) => {
      this.switchProxy()
      this.proxy.loadOpening(opening)
    })
  }

  switchProxy() {
    if (this.proxy === this.libraryProxy) {
      this.proxy = this.generatorProxy
    } else {
      this.proxy = this.libraryProxy
      this.proxy.resetGraph()
    }
  }
}
