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
  proxy!: Proxy

  constructor() {
    if (Mediator.instance) return Mediator.instance
    super()
    Mediator.instance = this
    this.board = undefined
    this.graph = undefined
    this.proxies = [new GeneratorProxy(), new LibraryProxy()]
    this.proxy = this.proxies[0]
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

    this.proxies.forEach((proxy: Proxy) => {
      proxy.listen("setState", (fen: string, graph: GraphType, nextMoves: MoveData[]) => {
        this.board!.setPosition(fen)
        this.graph!.draw(graph)
        this.notify("positionChange", nextMoves)
      })
    })

    this.proxies.forEach((proxy: Proxy) => {
      proxy.listen("editOpening", (opening: OpeningData) => {
        this.switchProxy("generator")
        this.proxy.loadOpening(opening)
      })
    })

    this.proxies.forEach((proxy: Proxy) => {
      proxy.listen("reset", () => {
        this.proxy.resetGraph()
      })
    })
  }

  switchProxy(identifier: ProxyIdentifier) {
    if (identifier === "generator") {
      this.proxy = this.proxies[0]
    } else {
      this.proxy = this.proxies[1]
      this.proxy.resetGraph()
    }
  }

  action(action: any, payload: any) {
    this.proxy.action(action, payload)
  }
}
