package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type Session struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

var sessions []Session = []Session{
	Session{Id: "one", Name: "Foo "},
	Session{Id: "two", Name: "Bar "},
}

func main() {
	fmt.Println("Retro-Board Backend in Go!")

	db, err := gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=retroboard password=postgres sslmode=disable")
	defer db.Close()

	if err != nil {
		fmt.Println("Error while opening database", err)
		return
	}

	http.HandleFunc("/echo", func(w http.ResponseWriter, r *http.Request) {
		upgrader.CheckOrigin = func(r *http.Request) bool { return true }
		conn, err := upgrader.Upgrade(w, r, nil) // error ignored for sake of simplicity

		if err != nil {
			fmt.Println("Error on upgrade", err)
			return
		}

		for {
			// Read message from browser
			msgType, msg, err := conn.ReadMessage()
			if err != nil {
				return
			}

			// Print the message to the console
			fmt.Printf("%s sent: %s\n", conn.RemoteAddr(), string(msg))

			// Write message back to browser
			if err = conn.WriteMessage(msgType, msg); err != nil {
				return
			}
		}
	})

	http.HandleFunc("/api/ping", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(sessions)
		// fmt.Fprintf(w, "pong")
	})

	http.ListenAndServe("localhost:8080", nil)
}
