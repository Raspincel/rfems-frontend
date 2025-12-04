package bindings

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/gorilla/websocket"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *app) connect(apiURL, path, token string, client *http.Client, ch chan []byte) error {
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/api/v1/ws/connect"}

	conn, res, err := websocket.DefaultDialer.Dial(u.String(), http.Header{
		"Authorization": []string{"Bearer " + token},
	})

	if err != nil {
		panic(err)
	}

	if res.StatusCode != http.StatusSwitchingProtocols {
		defer res.Body.Close()

		body, _ := io.ReadAll(res.Body)

		var response Response[any]

		err = json.Unmarshal(body, &response)

		if err != nil {
			return fmt.Errorf("Failed to parse error response: %s", err.Error())
		}

		return fmt.Errorf("WebSocket connection failed: %s", response.Message)
	}

	go func(conn *websocket.Conn, ch chan []byte) {
		defer func() {
			conn.Close()
			close(ch)
		}()

		for {
			_, m, err := conn.ReadMessage()

			if err != nil {
				panic(err.Error())
			}

			ch <- m
		}
	}(conn, ch)

	go readPump(a.ctx, ch)

	return nil
}

type messageEnvelope struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

type statusUpdate struct {
	UserID       string    `json:"userId"`
	Status       string    `json:"status"`
	LastActiveAt time.Time `json:"lastActiveAt,omitzero"`
}

func readPump(ctx context.Context, ch <-chan []byte) {
	for msg := range ch {
		var envelope messageEnvelope
		err := json.Unmarshal([]byte(msg), &envelope)

		if err != nil {
			fmt.Println("Error unmarshaling message envelope:", err)
			continue
		}

		switch envelope.Type {
		case "status_update":
			var status statusUpdate
			err := json.Unmarshal(envelope.Payload, &status)

			if err != nil {
				fmt.Println("Error unmarshaling status update:", err)
				continue
			}

			runtime.EventsEmit(ctx, "user:status_update", status)
		}

	}
}
