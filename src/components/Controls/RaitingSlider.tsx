import { Box, Slider, StyledEngineProvider, Typography } from "@mui/joy"
import { Dispatch, useState } from "react"
import { DEFAULT_OPTIONS, DispatchParams, RAITING_RANGES, reducerAction } from "./Configuration"
import "../../assets/sliderOverride.css"

const RATITNG_LABELS = [0, 1000, 1600, 2000, 2500, 3000]

interface Props {
  text: string
  dispatchOptions: Dispatch<DispatchParams>
  action: reducerAction
  className: string
}

function RaitingSlider({ text, dispatchOptions, action, className }: Props) {
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
    <StyledEngineProvider injectFirst>
      <Box>
        <Typography color="neutral" level="title-lg">
          {text}
        </Typography>
        <Box className={className} sx={{ width: 300, pr: 2.5, pl: 1, m: 0 }}>
          <Slider
            sx={{ m: 0 }}
            value={range}
            variant="solid"
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
      </Box>
    </StyledEngineProvider>
  )
}

export default RaitingSlider
