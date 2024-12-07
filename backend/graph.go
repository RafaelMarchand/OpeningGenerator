package main

import "fmt"

type Edge[N, E any] struct {
	SrcNode    Node[N, E] `json:"srcNode"`
	DestNode   Node[N, E] `json:"destNode"`
	Attributes E          `json:"attributes"`
}

type Node[N, E any] struct {
	Key        string       `json:"key"`
	Edges      []Edge[N, E] `json:"edges"`
	InEdges    []Edge[N, E] `json:"inEdges"`
	Attributes N            `json:"attributes"`
}

type Graph[N, E any] struct {
	Nodes map[string]Node[N, E] `json:"graph"`
}

func NewGraph[N, E any]() *Graph[N, E] {
	graph := Graph[N, E]{make(map[string]Node[N, E])}
	return &graph
}

func AddNode[N, E any](graph *Graph[N, E], key string, attributes N) {
	graph.Nodes[key] = Node[N, E]{Key: key, Edges: []Edge[N, E]{}, InEdges: []Edge[N, E]{}, Attributes: attributes}
}

func AddEdge[N, E any](graph *Graph[N, E], srcNodeKey string, destNodeKey string, attributes E) {
	srcNode, hasSrcNode := graph.Nodes[srcNodeKey]
	destNode, hasDestNode := graph.Nodes[destNodeKey]

	if !hasSrcNode || !hasDestNode {
		fmt.Println("A node is missing")
		return
	}

	srcNode.Edges = append(srcNode.Edges, Edge[N, E]{SrcNode: srcNode, DestNode: destNode, Attributes: attributes})
	destNode.InEdges = append(destNode.InEdges, Edge[N, E]{SrcNode: srcNode, DestNode: destNode, Attributes: attributes})
}

func TestGraph() {
	var graph = NewGraph[int, int]()
	AddNode(graph, "1", 5)
	AddNode(graph, "2", 5)
	AddNode(graph, "3", 5)

	AddEdge(graph, "1", "2", 3)

	for key, node := range graph.Nodes {
		fmt.Printf("Key: %s, Value: %d\n", key, node.Attributes)
	}
}
