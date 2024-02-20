import { RefObject } from "react"
import Board from "./Board"
import Observable from "./Observable"
import { GraphType } from "./GraphBuilder"
import Graph, { NodePosition } from "./Graph"
import GeneratorProxy from "./GeneratorProxy"
import LibraryProxy from "./LibraryProxy"
import { ProxyIdentifier } from "../components/OpeningGenerator/ViewToggler"
import Proxy from "./Proxy"

export type Ref = RefObject<HTMLDivElement>

export default class Mediator extends Observable {
  board: Board
  graph: Graph
  proxies: Proxy[]
  proxy: Proxy

  constructor(boardRef: Ref, graphRef: Ref) {
    super()
    this.board = new Board(boardRef)
    this.graph = new Graph(graphRef)
    this.proxies = [new GeneratorProxy(), new LibraryProxy()]
    this.proxy = this.proxies[0]

    this.setUpListeners()
  }

  setUpListeners() {
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
      proxy.listen("setState", (fen: string, graph: GraphType) => {
        this.board.setPosition(fen)
        this.graph.draw(graph)
      })
    })
  }

  switchProxy(identifier: ProxyIdentifier) {
    if (identifier === "generator") {
      this.proxy = this.proxies[0]
    } else {
      this.proxy = this.proxies[1]
    }
    this.proxy.updateUI()
  }

  action(action: any, payload: any) {
    this.proxy.action(action, payload)
  }
}
