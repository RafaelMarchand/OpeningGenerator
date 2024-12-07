package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"
)

type DataBaseResult struct {
	White int    `json:"white"`
	Black int    `json:"black"`
	Draws int    `json:"draws"`
	Moves []Move `json:"moves"`
}

type Move struct {
	Uci           string  `json:"uci"`
	San           string  `json:"san"`
	AverageRating float64 `json:"averageRaiting"`
	White         int     `json:"white"`
	Black         int     `json:"black"`
	Draws         int     `json:"draws"`
}

var RATING_RANGES = []int{0, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500}

// Function to fetch moves from Lichess Masters API
func MovesMaster(position string) (DataBaseResult, error) {
	numberOfMoves := 12
	params := url.Values{}
	params.Add("fen", position)
	params.Add("moves", strconv.Itoa(numberOfMoves))

	url := fmt.Sprintf("https://explorer.lichess.ovh/masters?%s", params.Encode())

	// Send HTTP request
	resp, err := http.Get(url)
	if err != nil {
		return DataBaseResult{}, err
	}
	defer resp.Body.Close()

	var result DataBaseResult
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return DataBaseResult{}, err
	}

	return result, nil
}

// Function to fetch moves from Lichess Players API with rating range
func MovesPlayers(position string, eloRange []int, moveCount int) (DataBaseResult, error) {
	lowestRating := eloRange[0]
	highestRating := eloRange[1]

	var ratingRange []string
	for _, rating := range RATING_RANGES {
		if rating >= lowestRating && rating < highestRating {
			ratingRange = append(ratingRange, strconv.Itoa(rating))
		}
	}

	params := url.Values{}
	params.Add("variant", "standard")
	params.Add("speeds", "blitz,rapid,classical")
	params.Add("ratings", strings.Join(ratingRange, ","))
	params.Add("fen", position)
	params.Add("moves", strconv.Itoa(moveCount))

	url := fmt.Sprintf("https://explorer.lichess.ovh/lichess?%s", params.Encode())

	// Send HTTP request
	resp, err := http.Get(url)
	if err != nil {
		return DataBaseResult{}, err
	}
	defer resp.Body.Close()

	var result DataBaseResult
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return DataBaseResult{}, err
	}

	return result, nil
}

func Test() {
	// Example usage of movesMaster and movesPlayers functions
	position := "r1bqkbnr/pp1ppppp/2n5/2p5/1P2P3/P7/2PP1PPP/RNBQKBNR b KQkq - 0 3"

	// Calling movesMaster
	resultMaster, err := MovesMaster(position)
	if err != nil {
		log.Fatalf("Error fetching data from movesMaster: %v", err)
	}
	fmt.Println("MovesMaster Result:", resultMaster)

	// Calling movesPlayers with a rating range
	range_ := []int{1800, 2000}
	resultPlayers, err := MovesPlayers(position, range_, 12)
	if err != nil {
		log.Fatalf("Error fetching data from movesPlayers: %v", err)
	}
	fmt.Println("MovesPlayers Result:", resultPlayers.Moves)
}
