import { nextMoves } from "./utils.ts"

onmessage = function (e) {
  const [position, options] = e.data
  nextMoves(position, options).then((result) => {
    postMessage(result)
  })
}
