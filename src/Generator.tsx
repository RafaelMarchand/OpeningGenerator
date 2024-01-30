import { Box, Button, Slider, Stack, Typography } from "@mui/joy"
import React, { useState } from "react"

const RAITING_RANGES = [0, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500, 3000]
const RATITNG_LABELS = [0, 1000, 1600, 2000, 2500, 3000]

export default function Generator() {
  const [range, setRange] = useState<number[]>([RAITING_RANGES[2], RAITING_RANGES[5]])

  function handleRaitingRange(event: Event, range: number | number[], activeThumb: number) {
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
  }

  return (
    <Stack direction="column" justifyContent="space-evenly" alignItems="stretcht" spacing={2}>
      <Box sx={{ width: 300, pr: 2.5, pl: 2.5 }}>
        <Typography color="primary" level="h4">
          Raiting Range
        </Typography>
        <Slider
          getAriaLabel={() => "Temperature range"}
          value={range}
          onChange={handleRaitingRange}
          valueLabelDisplay="auto"
          min={RAITING_RANGES[0]}
          max={RAITING_RANGES[RAITING_RANGES.length - 1]}
          step={null}
          disableSwap
          marks={RAITING_RANGES.map((range, index) => {
            if (RATITNG_LABELS.includes(range)) {
              return { value: range, label: `${range}` }
            }
            return { value: range }
          })}
        />
      </Box>
      <Button disabled={false} onClick={function () {}} size="lg">
        Generate Opening
      </Button>
    </Stack>
  )
}
