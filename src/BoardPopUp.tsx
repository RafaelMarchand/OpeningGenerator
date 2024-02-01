import Chessground from "@react-chess/chessground"

interface Props {
  show: boolean
  config: any
}

export default function BoardPopUp({ show, config }: Props) {
  return (
    <>
      {show && (
        <div
          style={{
            position: "absolute",
            left: `${config.offsetX}px`,
            top: `${config.offsetY}px`,
            zIndex: "1"
          }}>
          <Chessground config={config.config} width={100} height={100}></Chessground>
        </div>
      )}
    </>
  )
}
