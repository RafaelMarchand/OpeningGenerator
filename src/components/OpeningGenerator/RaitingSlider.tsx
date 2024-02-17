import { Box, Slider, Typography } from "@mui/joy"
import { Dispatch, useState } from "react"
import { DEFAULT_OPTIONS, DispatchParams, RAITING_RANGES, reducerAction } from "./Configuration"

const RATITNG_LABELS = [0, 1000, 1600, 2000, 2500, 3000]

interface Props {
  text: string
  dispatchOptions: Dispatch<DispatchParams>
  action: reducerAction
}

function RaitingSlider({ text, dispatchOptions, action }: Props) {
  const [range, setRange] = useState<number[]>([
    DEFAULT_OPTIONS.rangeOpponent[0],
    DEFAULT_OPTIONS.rangeOpponent[1]
  ])

  function handleRaitingRange(_event: Event, range: number | number[], activeThumb: number) {
    setRange(range as number[])

    if (activeThumb === 0) {
      if (Array.isArray(range)) {
        if (range[0] === range[1]) {
          const index = RAITING_RANGES.indexOf(range[0]) - 1
          if (index >= 0) {
            setRange([RAITING_RANGES[index], range[1]])
          }
        }
      }
    } else {
      if (Array.isArray(range)) {
        if (range[0] === range[1]) {
          const index = RAITING_RANGES.indexOf(range[0]) + 1
          if (index < RAITING_RANGES.length) {
            setRange([range[0], RAITING_RANGES[index]])
          }
        }
      }
    }
    dispatchOptions({ type: action, payload: range })
  }
  return (
    <>
      <Typography color="primary" level="h4">
        {text}
      </Typography>
      <Box sx={{ width: 300, pr: 2.5, pl: 1 }}>
        <Slider
          getAriaLabel={() => "Temperature range"}
          value={range}
          onChange={handleRaitingRange}
          valueLabelDisplay="auto"
          min={RAITING_RANGES[0]}
          max={RAITING_RANGES[RAITING_RANGES.length - 1]}
          step={null}
          disableSwap
          marks={RAITING_RANGES.map((range) => {
            if (RATITNG_LABELS.includes(range)) {
              return { value: range, label: `${range}` }
            }
            return { value: range }
          })}
        />
      </Box>
    </>
  )
}

export default RaitingSlider
