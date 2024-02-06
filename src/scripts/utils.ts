import { Options } from "../Generator"
import DatabaseResult, { Move, MovesDatabase } from "./DatabaseResult"

const RAITING_RANGES = [0, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500]

export async function nextMoves(position: string, options: Options): Promise<string[]> {
  return await movesPlayers(position, options.rangeOpponent).then((result) => {
    const databaseResult = new DatabaseResult(result)
    return databaseResult.getMoves(position, options)
  })
}

async function movesMaster(position: string): Promise<MovesDatabase> {
  const numberOfMoves = 12

  const params = new URLSearchParams()
  params.append("fen", position)
  params.append("moves", String(numberOfMoves))

  const result = await fetch(`https://explorer.lichess.ovh/masters?${params.toString()}`)
    .then((response) => response.json())
    .catch((error) => console.log(error))
  return result
}

async function movesPlayers(position: string, range: number[]): Promise<MovesDatabase> {
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
  return result
}
