import { RefObject } from "react"
import Board from "./Board"
import Observable from "./Observable"
import { GraphType, MoveData } from "./GraphBuilder"
import Graph, { NodePosition } from "./Graph"
import GeneratorProxy from "./GeneratorProxy"
import Proxy from "./Proxy"
import LibraryProxy from "./LibraryProxy"
import { OpeningData } from "./useSaveOpening"

export type Ref = RefObject<HTMLDivElement>
export type ProxyIdentifier = "generator" | "library"

export default class Mediator extends Observable {
  static instance: Mediator | null = null
  board: Board | undefined
  graph: Graph | undefined
  proxies!: Proxy[]
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
    this.board = new Board(boardRef)
    this.graph = new Graph(graphRef)

    this.board.listen("boardMove", (move: string, fen: string, prevFen: string) => {
      this.proxy.boardMove(move, fen, prevFen)
    })

    this.graph.listen("nodeClick", (fen: string, position: NodePosition, event: MouseEvent) => {
      this.proxy.nodeClick(fen, position, event)
    })

    this.graph.listen("nodeHover", (fen: string, position: NodePosition, event: MouseEvent) => {
      this.proxy.nodeHover(fen, position, event)
    })

    new Array<Proxy>(this.generatorProxy, this.libraryProxy).forEach((proxy: Proxy) => {
      proxy.listen("setState", (fen: string, graph: GraphType, nextMoves: MoveData[]) => {
        this.board!.setPosition(fen)
        this.graph!.draw(graph)
        this.notify("positionChange", nextMoves)
      })
    })

    this.libraryProxy.listen("editOpening", (opening: OpeningData) => {
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
