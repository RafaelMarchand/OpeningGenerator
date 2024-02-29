import { Stack, Typography } from "@mui/joy"
import { TourProvider } from "@reactour/tour"
import Mediator from "../common/Mediator"
import Board from "../common/Board"

const mediator = new Mediator()

const steps = [
  {
    selector: ".T1-createTab",
    content: "Select this tab to create and modify openings"
  },
  {
    selector: ".T2-board",
    content: "The board shows the current positon"
  },
  {
    selector: ".T2-board",
    content: "Moves made on the board will be added to the opening",
    action: () => {
      mediator.board?.executeMove("e2", "e4")
      mediator.board?.executeMove("c7", "c6")
    }
  },
  {
    selector: ".T3-graph",
    content: "The graph shows the moves and positions that the opening contains "
  },
  {
    selector: ".T3-graph",
    content: "Click to select position/Right click to remove position",
    action: () => {
      mediator.proxy.boardPosition = Board.STARTING_POSITION
      mediator.proxy.updateUI()
    }
  },
  {
    selector: ".T4-info",
    content: "The information section shows the opening moves of the current position"
  },
  {
    selector: ".T5-nextMoves",
    content: "Click to execute",
    action: () => {
      const nextMoves = mediator.proxy.graphBuilder.getNextMoves(mediator.proxy.boardPosition)
      if (nextMoves.length > 0) {
        mediator.proxy.playNextMove(nextMoves[0].fen)
      }
    }
  },
  {
    selector: ".configuration",
    content: "Settings fo the opening generator based on the lichess player data"
  },
  {
    selector: ".depth",
    content: "One depth unit referes to a move from either color"
  },
  {
    selector: ".lineSpread",
    content: "Limits respones for each position."
  },
  {
    selector: ".raitingOpp",
    content: "Raiting range of lichss data that is considered for respondses"
  },
  {
    selector: ".color",
    content: "Color to generate repertoir for "
  },
  {
    selector: ".raitingRep",
    content: "Raiting range of lichss data that is considered for reprtoir"
  },
  {
    selector: ".rare",
    content: "This will try to include moves, which aren't played frequnetly"
  },
  {
    selector: ".randomness",
    content: "Move will be choosen at random from a selection of promising moves."
  },
  {
    selector: ".generate",
    content: "Generates an opening from the current position.",
    action: () => {
      mediator.generatorProxy.generate()
    }
  }
]

interface ContentProps {
  content: string
}

function Content({ content }: ContentProps) {
  const lines = content.split("/")
  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0.5}>
      {lines.map((line: string, index: number) => {
        return (
          <Typography key={index} level="body-md">
            {line}
          </Typography>
        )
      })}
    </Stack>
  )
}

interface Props {
  children: any
}

export default function TutorialProvider({ children }: Props) {
  return (
    <TourProvider
      steps={steps}
      components={{ Content }}
      styles={{
        popover: (base) => ({
          ...base,
          "--reactour-accent": "#0B6BCB",
          borderRadius: "0.3rem"
        })
      }}>
      {children}
    </TourProvider>
  )
}
