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

const RATING_RANGES = [0, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500]

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

// prettier-ignore
export async function movesPlayers(position: string, range: number[], moveCount: number = 12): Promise<DataBaseResult> {
  const lowestRating = range[0]
  const highestRating = range[1]

  let ratingRange = ""
  RATING_RANGES.forEach((range) => {
    if (range >= lowestRating && range < highestRating) {
      if (ratingRange != "") {
        ratingRange += ","
      }
      ratingRange += range
    }
  })

  const params = new URLSearchParams()
  params.append("variant", "standard")
  params.append("speeds", "blitz,rapid,classical")
  params.append("ratings", ratingRange)
  params.append("fen", position)
  params.append("moves", String(moveCount))
  //console.log("start")
  const result = await fetch(`https://explorer.lichess.ovh/lichess?${params.toString()}`, {method: "GET"})
    .then((response) => response.json())
    .catch((error) => console.log(error))
  return result
}

//window.movesPlayers = movesPlayers
