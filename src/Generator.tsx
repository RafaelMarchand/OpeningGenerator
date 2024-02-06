import { Button, Select, Stack, Switch, Typography, Option } from "@mui/joy"
import { RefObject, SyntheticEvent, useReducer } from "react"
import Mediator from "./scripts/Mediator"
import RaitingSlider from "./RaitingSlider"
import { Color } from "./scripts/DatabaseResult"

interface Props {
  mediatorRef: RefObject<Mediator | null>
}

export type Options = {
  color: Color
  depth: number
  maxLineSpread: number
  randomness: boolean
  rareRepertoire: boolean
  rangeOpeningMoves: number[]
  rangeOpponent: number[]
}

export type reducerAction =
  | "color"
  | "depth"
  | "maxLineSpread"
  | "lineSpreadAuto"
  | "randomness"
  | "rangeOpeningMoves"
  | "rangeOpponent"
  | "rareRepertoire"

export interface DispatchParams {
  type: reducerAction
  payload: any
}

export const RAITING_RANGES = [0, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500, 3000]

export const DEFAULT_OPTIONS: Options = {
  color: "white",
  depth: 4,
  maxLineSpread: 3,
  randomness: true,
  rareRepertoire: false,
  rangeOpeningMoves: [RAITING_RANGES[4], RAITING_RANGES[6]],
  rangeOpponent: [RAITING_RANGES[4], RAITING_RANGES[6]]
}

function reducer(state: Options, action: DispatchParams): Options {
  return {
    ...state,
    [action.type]: action.payload
  }
}

export default function Generator({ mediatorRef }: Props) {
  const [options, dispatchOptions] = useReducer(reducer, DEFAULT_OPTIONS)

  function onClickGenerate() {
    mediatorRef?.current?.generate(options)
  }

  return (
    <Stack direction="column" justifyContent="space-evenly" alignItems="stretcht" spacing={2}>
      <Typography color="primary" level="h4">
        Color
      </Typography>
      <Select
        defaultValue="w"
        color="primary"
        variant="outlined"
        onChange={(_event: SyntheticEvent | null, value: string | null) => {
          dispatchOptions({ type: "color", payload: value })
        }}>
        <Option value="w">white</Option>
        <Option value="b">black</Option>
      </Select>
      <Typography color="primary" level="h4">
        Depth
      </Typography>
      <Select
        defaultValue={0}
        color="primary"
        variant="outlined"
        onChange={(_event: SyntheticEvent | null, value: number | null) => {
          dispatchOptions({ type: "depth", payload: value })
        }}>
        <Option value={0}>auto</Option>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
        <Option value={3}>3</Option>
        <Option value={4}>4</Option>
        <Option value={5}>5</Option>
      </Select>
      <Typography color="primary" level="h4">
        Max line spread
      </Typography>
      <Select
        defaultValue={0}
        color="primary"
        variant="outlined"
        onChange={(_event: SyntheticEvent | null, value: number | null) => {
          dispatchOptions({ type: "maxLineSpread", payload: value })
        }}>
        <Option value={0}>auto</Option>
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
        <Option value={3}>3</Option>
        <Option value={4}>4</Option>
        <Option value={5}>5</Option>
      </Select>

      <RaitingSlider text="Raiting Opponents" dispatchOptions={dispatchOptions} action={"rangeOpponent"} />
      <RaitingSlider text="Raiting Repetoir" dispatchOptions={dispatchOptions} action={"rangeOpeningMoves"} />
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0}>
        <Typography color="primary" level="h4">
          Rare Repertoire
        </Typography>
        <Switch
          variant="solid"
          checked={options.rareRepertoire}
          onChange={(event) => {
            dispatchOptions({ type: "rareRepertoire", payload: event.target.checked })
          }}
        />
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0}>
        <Typography color="primary" level="h4">
          Randomness
        </Typography>
        <Switch
          variant="solid"
          checked={options.randomness}
          onChange={(event) => {
            dispatchOptions({ type: "randomness", payload: event.target.checked })
          }}
        />
      </Stack>
      <Button disabled={false} onClick={onClickGenerate} size="lg">
        Generate Opening
      </Button>
    </Stack>
  )
}
