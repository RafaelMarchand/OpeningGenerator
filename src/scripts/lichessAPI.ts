export type DataBaseResult = {
  white: number
  black: number
  draws: number
  moves: [Move]
}

export type Move = {
  uci: string
  san: string
  averageRaiting: number
  white: number
  black: number
  draws: number
  winningChances: number
  popularity: number
  weigth: number
}

const RAITING_RANGES = [0, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500]

export async function movesMaster(position: string): Promise<DataBaseResult> {
  const numberOfMoves = 12

  const params = new URLSearchParams()
  params.append("fen", position)
  params.append("moves", String(numberOfMoves))

  const result = await fetch(`https://explorer.lichess.ovh/masters?${params.toString()}`)
    .then((response) => response.json())
    .catch((error) => console.log(error))
  return result
}

export async function movesPlayers(position: string, range: number[]): Promise<DataBaseResult> {
  const lowestRaiting = range[0]
  const highestRaiting = range[1]

  let raitingRange = ""
  RAITING_RANGES.forEach((range) => {
    if (range >= lowestRaiting && range < highestRaiting) {
      if (raitingRange != "") {
        raitingRange += ","
      }
      raitingRange += range
    }
  })
  const numberOfMoves = 12

  const params = new URLSearchParams()
  params.append("variant", "standard")
  params.append("speeds", "blitz,rapid,classical")
  params.append("raitings", raitingRange)
  params.append("fen", position)
  params.append("moves", String(numberOfMoves))

  const result = await fetch(`https://explorer.lichess.ovh/lichess?${params.toString()}`)
    .then((response) => response.json())
    .catch((error) => console.log(error))
  //console.log(result)
  return result
}
