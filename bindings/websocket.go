package bindings

import (
	"context"
	"frontend/ws"
	"log"

	"github.com/gorilla/websocket"
)

type readResult struct {
	msg []byte
	err error
}

func (a *app) readPump(ctx context.Context, commConn, tranConn *websocket.Conn) {
	msgCh := make(chan readResult, 2)

	go func() {
		for {
			_, msg, err := commConn.ReadMessage()
			if err != nil {
				msgCh <- readResult{nil, err}
				return
			}
			msgCh <- readResult{msg, nil}
		}
	}()

	go func() {
		for {
			_, msg, err := tranConn.ReadMessage()
			if err != nil {
				msgCh <- readResult{nil, err}
				return
			}
			msgCh <- readResult{msg, nil}
		}
	}()

	for {
		select {
		case data := <-msgCh:
			if data.err != nil {
				panic(data.err.Error())
			}

			ws.HandleEvent(&ws.EventData{
				Msg:        data.msg,
				Ctx:        ctx,
				IsHosting:  a.hosting.isHosting,
				BasePath:   a.hosting.basePath,
				WriteCh:    a.communicationChannel,
				GenerateID: a.generateMessageID,
			})
		}
	}
}

func writePump(ctx context.Context, ch <-chan ws.WriteMessage, commConn, tranConn *websocket.Conn) {
	defer commConn.Close()
	defer tranConn.Close()

	for {
		select {
		case msg, ok := <-ch:
			if !ok {
				commConn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			if err := commConn.WriteJSON(msg); err != nil {
				log.Println("WebSocket write error")
				return
			}
		case <-ctx.Done():
			return
		}
	}
}
