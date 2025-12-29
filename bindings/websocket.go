package bindings

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"frontend/ws"
	"io"
	"log"
	"net/http"
	"net/url"

	"github.com/gorilla/websocket"
)

func (a *app) connect(apiURL, path, token string, client *http.Client) error {
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

	go a.readPump(a.ctx, conn)
	go writePump(a.ctx, a.communicationChannel, conn)

	return nil
}

func (a *app) readPump(ctx context.Context, conn *websocket.Conn) {
	for {
		_, msg, err := conn.ReadMessage()

		if err != nil {
			panic(err.Error())
		}

		ws.HandleEvent(&ws.EventData{
			Msg:        msg,
			Ctx:        ctx,
			IsHosting:  a.hosting.isHosting,
			BasePath:   a.hosting.basePath,
			WriteCh:    a.communicationChannel,
			GenerateID: a.generateMessageID,
		})
	}
}

func writePump(ctx context.Context, ch <-chan ws.WriteMessage, conn *websocket.Conn) {
	defer conn.Close()

	for {
		select {
		case msg, ok := <-ch:
			if !ok {
				conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			if err := conn.WriteJSON(msg); err != nil {
				log.Println("WebSocket write error")
				return
			}
		case <-ctx.Done():
			return
		}
	}
}
