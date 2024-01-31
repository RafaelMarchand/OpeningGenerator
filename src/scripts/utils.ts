export type Color = "b" | "w"

type MovesDatabase = {
  white: number
  black: number
  draws: number
  moves: [Move]
}

type Move = {
  uci: string
  san: string
  averageRaiting: number
  white: number
  black: number
  draws: number
}

const RAITING_RANGES = [0, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500]

export async function movesMaster(position: string): Promise<MovesDatabase> {
  const numberOfMoves = 2

  const params = new URLSearchParams()
  params.append("fen", position)
  params.append("moves", String(numberOfMoves))

  const result = await fetch(`https://explorer.lichess.ovh/masters?${params.toString()}`)
    .then((response) => response.json())
    .catch((error) => console.log(error))
  return result
}

export async function movesPlayers(): Promise<MovesDatabase> {
  const fen = "rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2"
  const numberOfMoves = 5
  const lowestRaiting = 1000
  const highestRaiting = 2000
  let raitingRange = ""

  RAITING_RANGES.forEach((range) => {
    if (range >= lowestRaiting && range < highestRaiting) {
      if (raitingRange != "") {
        raitingRange += ","
      }
      raitingRange += range
    }
  })

  const params = new URLSearchParams()
  params.append("variant", "standard")
  params.append("speeds", "blitz,rapid,classical")
  params.append("raitings", raitingRange)
  params.append("fen", fen)
  params.append("moves", String(numberOfMoves))

  const moves = await fetch(`https://explorer.lichess.ovh/lichess?${params.toString()}`).then(
    (response) => response.json()
  )

  return JSON.parse(JSON.stringify(moves))
}
