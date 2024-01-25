import { useEffect, useRef } from "react"
import Graphology from "graphology"
import Generator from "./Generator"
import GraphDrawer from "../node_modules/graph-drawer/src/main.js"

interface GraphMethods {
  getNodeKeys: (graph: Graphology) => string[]
  getOutEdgesKeys: (graph: Graphology, nodeKey: string) => string[]
  getDestNodeKey: (graph: Graphology, edgeKey: string) => string
  getNodeValue: (graph: Graphology, nodeKey: string) => number
  getNodeFocus: (graph: Graphology, nodeKey: string) => boolean
}

const GRAPH_DRAWR_OPTIONS = {
  width: 1000,
  height: 600,
  nodeRadius: 5,
  nodeRadiusHover: 10,
  nodeRadiusFocus: 10,
  style: {
    backgroundColor: "black",
    nodeBorder: "white",
    edgeWidth: 5, // first hsl value to determine color
    nodeColorPositive: 0,
    nodeColorNegative: 240,
    maxLightness: 4
  }
}

const GRAPH_METHODS: GraphMethods = {
  getNodeKeys: (graph: Graphology) => graph.mapNodes((key: string) => key),
  getOutEdgesKeys: (graph: Graphology, nodeKey: string) =>
    graph.mapOutEdges(nodeKey, (edge: any) => edge),
  getDestNodeKey: (graph: Graphology, edgeKey: string) => graph.target(edgeKey),
  getNodeValue: (graph: Graphology, nodeKey: string) =>
    graph.getNodeAttribute(nodeKey, "value").value,
  getNodeFocus: (graph: Graphology, nodeKey: string) => {
    if (nodeKey === graph.getAttribute("focus")) {
      return true
    }
    return false
  }
}

interface Props {
  generator: Generator
}

function Graph({ generator }: Props) {
  const container = useRef<HTMLDivElement>(null)

  function nodeOnClick(key: string) {
    generator.nodeOnClick(key)
  }

  function nodeOnHover(key: string) {
    //generator.hoverOnNode(key)
  }

  useEffect(() => {
    if (container && container.current) {
      generator.graphDrawer = new GraphDrawer(
        GRAPH_METHODS,
        container.current,
        GRAPH_DRAWR_OPTIONS,
        nodeOnClick,
        nodeOnHover
      )
    }
  }, [container])

  return <div ref={container} />
}
export default Graph
