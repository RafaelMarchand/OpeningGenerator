import { DEFAULT_OPTIONS, Options } from "../components/Controls/Configuration"
import { NodePosition } from "./Graph"
import { MoveData } from "./GraphBuilder"
import Proxy from "./Proxy"
import { Result, nextMoves } from "./utils"

const MOUSE_LEFT = 0
const MOUSE_RIGHT = 2
const IDENTIFIER = "Generator"

export default class GeneratorProxy extends Proxy {
  countRequests: number
  countResults: number
  isGenerating: boolean
  requestQueue: Result[]
  options: Options
  constructor() {
    super(IDENTIFIER)
    this.countRequests = 0
    this.countResults = 0
    this.isGenerating = false
    this.requestQueue = []
    this.options = DEFAULT_OPTIONS
  }

  removePosition(fen: string) {
    this.boardPosition = this.graphBuilder.removeNode(fen)
    this.updateUI()
  }

  generate(options: Options = DEFAULT_OPTIONS) {
    this.isGenerating = true
    this.options = options
    this.handleResults([
      {
        fen: this.boardPosition,
        prevFen: this.boardPosition,
        moveData: null,
        depth: 0
      }
    ])
  }

  handleResults(results: Result[]) {
    for (const result of results) {
      if (result.moveData) {
        this.graphBuilder.addMove(result.moveData, result.prevFen)
        this.boardPosition = result.fen
        this.updateUI()
      }
      if (result.depth < this.options.depth) {
        this.countRequests++
        this.requestQueue.push({
          fen: result.fen,
          prevFen: result.prevFen,
          depth: ++result.depth,
          moveData: result.moveData
        })
      }
    }
    const request = this.requestQueue.pop()
    if (request) {
      nextMoves(request.fen, this.options, request.depth).then((results) => {
        this.handleResults(results)
        this.countResults++
        if (this.countRequests === this.countResults) {
          this.isGenerating = false
          this.countRequests = 0
          this.countResults = 0
        }
      })
    }
  }

  boardMove(moveData: MoveData, prevFen: string) {
    this.graphBuilder.addMove(moveData, prevFen)
    this.boardPosition = moveData.fen
    this.updateUI()
  }

  nodeClick(fen: string, position: NodePosition, event: MouseEvent) {
    if (event.button === MOUSE_LEFT) {
      this.boardPosition = fen
      this.notify(Proxy.SHOW_POPUP, fen, position, "click")
      this.updateUI()
    }
    if (event.button === MOUSE_RIGHT) {
      this.notify(Proxy.SHOW_POPUP, fen, position, event.type)
    }
  }
}
