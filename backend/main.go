package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/notnil/chess"
)

// album represents data about a record album.
type album struct {
	ID     string  `json:"id"`
	Title  string  `json:"title"`
	Artist string  `json:"artist"`
	Price  float64 `json:"price"`
}

var albums = []album{
	{ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
	{ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
	{ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
}

func main() {
	TestGraph()
	Test()

	username := "redSn0wM8"
	go downloadPGNs(username, DownloadDate{year: 2023, month: 11}, DownloadDate{year: 2024, month: 2})

	router := gin.Default()
	router.GET("/", getAlbums)
	// router.GET("/albums/:id", getAlbumByID)
	// router.POST("/albums", postAlbums)

	// Use the PORT environment variable (Render sets this automatically)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default to 8080 if no PORT is set
	}
	router.Run(":" + port)
}

func getAlbums(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, gin.H{
		"message": "Hello, Opening Generator",
	})
}

func readPGN(fileName string) {
	// Open the PGN file
	file, err := os.Open(fileName)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	// Create a PGN reader
	// pgn, err := chess.PGN(file)
	// if err != nil {
	// 	fmt.Println("Error reading PGN:", err)
	// 	return
	// }

	scanner := chess.NewScanner(file)
	for scanner.Scan() {
		game := scanner.Next()
		fmt.Println(game.GetTagPair("Site"), game.GetTagPair("Date"), game.GetTagPair("TimeControl"))
		fmt.Println()
	}

	// Print moves
	// fmt.Println("Moves:")
	// for _, move := range game.Moves() {
	// 	fmt.Println(move)
	// }
}

type DownloadDate struct {
	year  int
	month int
}

func downloadPGNs(username string, startDate DownloadDate, endDate DownloadDate) {
	var wg sync.WaitGroup
	var channelFileNames = make(chan string)

	currentYear := startDate.year
	currentMonth := startDate.month

	for currentYear < endDate.year || (currentYear == endDate.year && currentMonth <= endDate.month) {
		wg.Add(1)

		go downloadPGNChessCom(username, currentYear, currentMonth, &wg, channelFileNames)

		currentMonth++
		if currentMonth > 12 {
			currentMonth = 1
			currentYear++
		}
	}

	go func() {
		wg.Wait()
		close(channelFileNames)
	}()

	for filename := range channelFileNames {
		fmt.Println("Downloaded file:", filename)
	}
}

func downloadPGNChessCom(username string, year int, month int, wg *sync.WaitGroup, channel chan string) {
	defer wg.Done()

	url := fmt.Sprintf("https://api.chess.com/pub/player/%s/games/%d/%d/pgn", username, year, month)
	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("Error fetching PGN")
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Println("Failed to fetch PGN for")
		return
	}

	filename := fmt.Sprintf("%s_%d%d.pgn", username, year, month)
	file, err := os.Create(filename)
	if err != nil {
		fmt.Printf("Error creating file %s: %v\n", filename, err)
		return
	}
	defer file.Close()

	_, err = io.Copy(file, resp.Body)
	if err != nil {
		fmt.Printf("Error writing to file")
		return
	}
	channel <- filename
}
