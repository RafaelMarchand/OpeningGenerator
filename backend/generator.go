package main

import (
	"strings"

	"github.com/notnil/chess"
)


type MoveData struct {
	Uci           string  `json:"uci"`
	San           string  `json:"san"`
	AverageRating float64 `json:"averageRaiting"`
	White         int     `json:"white"`
	Black         int     `json:"black"`
	Draws         int     `json:"draws"`
  WinningChances float64 `json:"winningChances"`
  Popularity     float64 `json:"popularity"`
  Weight         float64 `json:"weigth"`
}

type Options struct {
	color             string
	depth             int
	maxLineSpread     int
	randomness        bool
	rareRepertoire    bool
	rangeOpeningMoves []int
	rangeOpponent     []int
}

type Result struct {
    fen string
    prevFen string
    uci string
    san string
    depth number
}

type EdgeAttributes struct {
  uci string
  san string
}

type NodeAttributes struct {
  winningChances float32
  popularity float32
}

var isGenerating = false
var graph = NewGraph[NodeAttributes,EdgeAttributes]()
var requestQueue = []Result{}
var countRequests = 0
var countResults = 0

const MoveCount = 12

func Generate(options Options, fen string) {
  isGenerating = true
  graph = &NewGraph[NodeAttributes,EdgeAttributes]()

  handleResults([1]Result {Result{fen: fen, prevFen: fen, uci: "", san: "", depth: 0 }})
}


func nextMoves(fen string, options Options, depth int) {
  colorToMove := string.Split(fen, "")[1]
  result, err := MovesPlayers(position, options.rangeOpponent, MoveCount)

	if err != nil {
		fmt.Println("Error fetching data:", err)
		return
	}



  // steps.push(createPrepare())
  // steps.push(createAddWinningChances(colorToMove))
  // steps.push(createWeightFunction(repertoireMove, options.rareRepertoire))
  // steps.push(repertoireMove ? candidateMovesRepertoire : candidateMovesOpponent)
  // steps.push(createChooseMove(repertoireMove, options.randomness, options.maxLineSpread))
  // steps.push(createMapToResults(position, depth))
}


func prepare(result DataBaseResult) ([]MoveData)  {
  moveInfos := []MoveData{}
  gameCount := result.Black + result.White + result.Draws
  for i, move := range result.Moves {
    movesPlayed :=  move.White + move.Black + move.Draws
    moveInfos = append(moveInfos, MoveData{	Uci: move.Uci, 
    San: move.San,
    AverageRating: move.AverageRating,
    White: move.White,
    Black: move.Black,
    Draws: move.Draws
    WinningChances float64 `json:"winningChances"`
    Popularity     float64 `json:"popularity"`
    Weight         float64 `json:"weigth"`})
  }


  result.moves.forEach((move) => {
    let movesPlayed = move.white + move.black + move.draws
    move.popularity = Math.ceil((movesPlayed / gameCount) * 100)
  })
  return result.moves
}


function createAddWinningChances(color: Color): (moves: MoveResult[]) => MoveResult[] {
  return function addWinningChances(moves: MoveResult[]): MoveResult[] {
    moves.forEach((move) => {
      let movesPlayed = move.white + move.black + move.draws
      move.winningChances = (move[color] / movesPlayed) * 100
    })
    return moves
  }
}

function createWeightFunction(repertoir: boolean, rare: boolean) {
  function weigthRepertoire(move: MoveResult) {
    move.weigth = move.winningChances
  }
  function weigthRareRepertoire(move: MoveResult) {
    const W_WINN = 4
    const W_RARITY = 1
    move.weigth = (move.winningChances! * W_WINN + (100 - move.popularity) * W_RARITY) / (W_WINN + W_RARITY)
  }
  function weigthResponses(move: MoveResult) {
    const W_WINN = 1
    const W_POPULARITY = 1
    move.weigth = (move.winningChances! * W_WINN + move.popularity * W_POPULARITY) / (W_WINN + W_POPULARITY)
  }

  let weightFunction = weigthResponses
  if (repertoir) {
    weightFunction = rare ? weigthRareRepertoire : weigthRepertoire
  }

  return function (moves: MoveResult[]) {
    moves.forEach((move) => {
      weightFunction(move)
    })
    return moves
  }
}

function createMapToResults(position: string, depth: number): (moves: MoveResult[]) => Result[] {
  return function mapToResults(moves: MoveResult[]): Result[] {
    return moves.map((move) => {
      const chess = new Chess()
      chess.load(position)
      chess.move(move.san)
      return {
        fen: chess.fen(),
        prevFen: position,
        moveData: {
          move: {
            san: move.san,
            uci: move.uci
          },
          fen: chess.fen()
        },
        depth: depth
      }
    })
  }
}

// prettier-ignore
function createChooseMove(repertoireMove: boolean, randomness: boolean, limit: number): (moves: MoveResult[]) => MoveResult[] {
  if (repertoireMove && randomness) {
    return function randomMove(moves: MoveResult[]): MoveResult[] {
      if (moves.length === 0) return []
      const index = Math.floor(Math.random() * moves.length)
      return [moves[index]]
    }
  }
  if (repertoireMove) limit = 1
  return function sortAndLimitMoves(moves: MoveResult[]): MoveResult[] {
    if (moves.length === 0) return []
    moves.sort((a: MoveResult, b: MoveResult) => b.weigth - a.weigth)
    if (moves.length > limit) {
      return moves.slice(0, limit)
    }
    return moves
  }
}

function candidateMovesRepertoire(moves: MoveResult[]): MoveResult[] {
  const THRESHOLD_FAKTOR = 10 // 10 %
  let bestValue = 0
  moves.forEach((move: MoveResult) => {
    if (move.weigth > bestValue) {
      bestValue = move.weigth
    }
  })
  const threshold = bestValue - bestValue / THRESHOLD_FAKTOR
  return moves.filter((move: MoveResult) => {
    return move.weigth > threshold
  })
}

function candidateMovesOpponent(moves: MoveResult[]): MoveResult[] {
  let bestValue = 0
  let sum = 0
  moves.forEach((move: MoveResult) => {
    sum += move.weigth
    if (move.weigth > bestValue) {
      bestValue = move.weigth
    }
  })
  const average = sum / moves.length
  return moves.filter((move: MoveResult) => {
    return move.weigth > average
  })
}





  func handleResults(results []Result) {
    for i, result := range result {
      AddNode(graph, result.fen, NodeAttributes{winningChances: 3.2, popularity: 2.2})

      if result.uci != ""{
        AddEdge(graph, result.prevFen, result.fen, EdgeAttributes{uci: result.uci, san: result.san})
      }

      if result.depth < options.depth {
        countRequests++
        result.depth ++
        requestQueue = append(requestQueue, result)
      }
    }

    const request = popRequestQueue()

    if request != nil {
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

  func popRequest()(Result){
    if len(requestQueue) == 0 {
      return nil
    }
    top := requestQueue[len(requestQueue)-1]
    requestQueue = requestQueue[:len(requestQueue)-1]
    return top
  }