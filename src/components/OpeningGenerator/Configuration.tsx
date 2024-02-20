import { Button, Select, Stack, Switch, Typography, Option, Input, Divider } from "@mui/joy"
import { SyntheticEvent, useContext, useReducer } from "react"
import RaitingSlider from "./RaitingSlider"
import { Color } from "../../scripts/utils"
import { MediatorContext } from "./OpeningGenerator"
import Save from "./Save"

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

export default function Configuration() {
  const mediator = useContext(MediatorContext)
  const [options, dispatchOptions] = useReducer(reducer, DEFAULT_OPTIONS)

  function onClickGenerate() {
    //mediator?.generate(options)
    mediator?.action("generate", options)
  }

  return (
    <Stack
      direction="column"
      justifyContent="space-evenly"
      alignItems="stretcht"
      spacing={2}
      sx={{
        backgroundColor: "background.level2",
        p: 2,
        borderBottomLeftRadius: "0.3rem",
        borderBottomRightRadius: "0.3rem",
        height: "1000%"
      }}>
      <Typography color="primary" level="title-lg">
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
      <Typography color="primary" level="title-lg">
        Depth
      </Typography>
      <Select
        defaultValue={DEFAULT_OPTIONS.depth}
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
      <Typography color="primary" level="title-lg">
        Max line spread
      </Typography>
      <Select
        defaultValue={DEFAULT_OPTIONS.maxLineSpread}
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
        <Typography color="primary" level="title-lg">
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
        <Typography color="primary" level="title-lg">
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
      <Divider />
      <Save />
    </Stack>
  )
}
