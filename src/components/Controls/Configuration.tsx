import { Button, Select, Stack, Switch, Typography, Option, Divider, Box } from "@mui/joy"
import { SyntheticEvent, useReducer } from "react"
import RaitingSlider from "./RaitingSlider"
import { Color } from "../../common/utils"
import Mediator, { ProxyIndex } from "../../common/Mediator"

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
  const [options, dispatchOptions] = useReducer(reducer, DEFAULT_OPTIONS)

  function onClickGenerate() {
    new Mediator().generatorProxy.generate(options)
  }

  return (
    <Stack
      className="configuration"
      direction="column"
      justifyContent="space-evenly"
      alignItems="stretcht"
      spacing={0}
      sx={{
        backgroundColor: "background.level2",
        px: 2,
        borderBottomLeftRadius: "0.3rem",
        borderBottomRightRadius: "0.3rem",
        height: "100%"
      }}>
      <Box className="depth">
        <Typography color="neutral" level="title-lg">
          Depth
        </Typography>
        <Select
          sx={{ mt: 0.5 }}
          defaultValue={DEFAULT_OPTIONS.depth}
          color="primary"
          variant="outlined"
          onChange={(_event: SyntheticEvent | null, value: number | null) => {
            dispatchOptions({ type: "depth", payload: value })
          }}>
          <Option disabled value={0}>
            auto
          </Option>
          <Option value={1}>1</Option>
          <Option value={2}>2</Option>
          <Option value={3}>3</Option>
          <Option value={4}>4</Option>
          <Option value={5}>5</Option>
        </Select>
      </Box>
      <Typography color="primary" level="title-lg">
        Responses
      </Typography>
      <Divider></Divider>
      <Box className="lineSpread">
        <Typography color="neutral" level="title-lg">
          Maximum considered moves
        </Typography>
        <Select
          sx={{ mt: 0.5 }}
          defaultValue={DEFAULT_OPTIONS.maxLineSpread}
          color="primary"
          variant="outlined"
          onChange={(_event: SyntheticEvent | null, value: number | null) => {
            dispatchOptions({ type: "maxLineSpread", payload: value })
          }}>
          <Option disabled value={0}>
            auto
          </Option>
          <Option value={1}>1</Option>
          <Option value={2}>2</Option>
          <Option value={3}>3</Option>
          <Option value={4}>4</Option>
          <Option value={5}>5</Option>
        </Select>
      </Box>
      <RaitingSlider
        className="raitingOpp"
        text="Raiting"
        dispatchOptions={dispatchOptions}
        action={"rangeOpponent"}
      />
      <Typography color="primary" level="title-lg">
        Repertoire
      </Typography>
      <Divider orientation="horizontal" />
      <Box className="color">
        <Typography color="neutral" level="title-lg">
          Color
        </Typography>
        <Select
          sx={{ mt: 0.5 }}
          defaultValue="w"
          color="primary"
          variant="outlined"
          onChange={(_event: SyntheticEvent | null, value: string | null) => {
            dispatchOptions({ type: "color", payload: value })
          }}>
          <Option value="w">white</Option>
          <Option value="b">black</Option>
        </Select>
      </Box>
      <RaitingSlider
        className="raitingRep"
        text="Raiting"
        dispatchOptions={dispatchOptions}
        action={"rangeOpeningMoves"}
      />
      <Stack className="rare" direction="row" justifyContent="space-between" alignItems="center" spacing={0}>
        <Typography color="neutral" level="title-lg">
          Rare
        </Typography>
        <Switch
          variant="solid"
          checked={options.rareRepertoire}
          onChange={(event) => {
            dispatchOptions({ type: "rareRepertoire", payload: event.target.checked })
          }}
        />
      </Stack>
      <Stack
        className="randomness"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}>
        <Typography color="neutral" level="title-lg">
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
      <Button className="generate" onClick={onClickGenerate} size="lg">
        Generate Opening
      </Button>
    </Stack>
  )
}
