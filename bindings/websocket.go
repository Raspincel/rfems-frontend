package bindings

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/gorilla/websocket"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *app) connect(apiURL, path, token string, client *http.Client, ch chan []byte) error {
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/api/v1/sessions/connect"}

	conn, res, err := websocket.DefaultDialer.Dial(u.String(), http.Header{
		"Authorization": []string{"Bearer " + token},
	})

	if err != nil {
		if res.StatusCode > 400 && res.StatusCode < 500 {
			defer res.Body.Close()
			body, _ := io.ReadAll(res.Body)

			var response Response[any]

			err = json.Unmarshal(body, &response)

			if err != nil {
				return fmt.Errorf("Failed to parse error response: %s", err.Error())
			}

			return fmt.Errorf("WebSocket connection failed: %s", response.Message)
		}

		return errors.New("Error connecting to WebSocket:" + err.Error())
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
	UserID  string          `json:"user_id"`
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

type statusUpdate struct {
	UserID       string    `json:"userId,omitzero"`
	Status       string    `json:"status"`
	LastActiveAt time.Time `json:"lastActiveAt,omitzero"`
}

type hostingUpdate struct {
	UserID              string `json:"userId,omitzero"`
	Status              string `json:"status"`
	Folder              string `json:"folder"`
	IsPublic            bool   `json:"isPublic"`
	ActiveTransferences int    `json:"activeTransferences"`
}

type connectedUserUpdate struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	Email         string `json:"email"`
	Approved      bool   `json:"approved"`
	CurrentFolder string `json:"currentFolder"`
}

type kickedByHost struct {
	HostID string `json:"hostId"`
	Reason string `json:"reason"`
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

			status.UserID = envelope.UserID
			runtime.EventsEmit(ctx, "user:status_update", status)
		case "hosting_update":
			var hosting hostingUpdate
			err := json.Unmarshal(envelope.Payload, &hosting)

			if err != nil {
				fmt.Println("Error unmarshaling hosting update:", err)
				continue
			}

			hosting.UserID = envelope.UserID
			runtime.EventsEmit(ctx, "user:hosting_update", hosting)
		case "connected_user_update":
			var user connectedUserUpdate

			err := json.Unmarshal(envelope.Payload, &user)

			if err != nil {
				fmt.Println("Error unmarshaling connected user update:", err)
				continue
			}

			runtime.EventsEmit(ctx, "user:connected_user_update", user)
		case "kicked_by_host":
			var kicked kickedByHost

			err := json.Unmarshal(envelope.Payload, &kicked)

			if err != nil {
				fmt.Println("Error unmarshaling kicked by host:", err)
				continue
			}

			runtime.EventsEmit(ctx, "user:kicked_by_host", kicked)
		}
	}
}

}
