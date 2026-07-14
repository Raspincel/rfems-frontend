package bindings

import (
	"errors"
	"frontend/ws"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

type readResult struct {
	msg []byte
	err error
}

func (a *app) readPump(conn *websocket.Conn) {
	// TODO: deal with conection being closed
	ch := make(chan readResult)

	go func(conn *websocket.Conn) {
		for {
			_, msg, err := conn.ReadMessage()
			if err != nil {
				ch <- readResult{nil, err}
				return
			}
			ch <- readResult{msg, nil}
		}
	}(conn)

	for {
		select {
		case <-a.ctx.Done():
			return
		case result := <-ch:
			if result.err != nil {
				panic(result.err.Error())
			}

			ws.HandleEvent(&ws.EventData{
				Msg:             result.msg,
				Ctx:             a.ctx,
				IsHosting:       a.hosting.isHosting,
				BasePath:        a.hosting.basePath,
				WriteCh:         a.communicationChannel,
				GenerateID:      a.generateMessageID,
				WriteTransferCh: a.transferenceChannel,
				AddUpload:       a.uploads.addUpload,
				RemoveUpload:    a.uploads.removeUpload,
				UploadExists:    a.uploads.uploadExists,
				GetDownload:     a.downloads.getDownload,
				GetUpload:       a.uploads.getUpload,
			})
		}
	}
}

func (a *app) binaryReadPump(conn *websocket.Conn) {
	// TODO: deal with conection being closed
	ch := make(chan readResult)

	go func(conn *websocket.Conn) {
		for {
			mt, msg, err := conn.ReadMessage()

			if err != nil {
				ch <- readResult{nil, err}
				return
			}

			if mt != websocket.BinaryMessage {
				ch <- readResult{nil, errors.New("Non-binary message received")}
				return
			}
			ch <- readResult{msg, nil}
		}
	}(conn)

	for {
		select {
		case <-a.ctx.Done():
			return
		case result := <-ch:
			if result.err != nil {
				panic(result.err.Error())
			}

			ws.HandleBinaryEvent(&ws.BinaryEventData{
				Msg:         result.msg,
				GetDownload: a.downloads.getDownload,
			})
		}
	}
}

func (a *app) writePump(ch <-chan ws.WriteMessage, conn *websocket.Conn) {
	defer conn.Close()

	for {
		select {
		case msg, ok := <-ch:
			if !ok {
				conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			conn.SetWriteDeadline(time.Now().Add(10 * time.Second))

			if err := conn.WriteJSON(msg); err != nil {
				log.Println("WebSocket write error")
				return
			}
		case <-a.ctx.Done():
			return
		}
	}
}

func (a *app) binaryWritePump(ch <-chan []byte, conn *websocket.Conn) {
	defer conn.Close()

	for {
		select {
		case msg, ok := <-ch:
			if !ok {
				conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			conn.SetWriteDeadline(time.Now().Add(10 * time.Second))

			if err := conn.WriteMessage(websocket.BinaryMessage, msg); err != nil {
				log.Println("WebSocket write error")
				return
			}
		case <-a.ctx.Done():
			return
		}
	}
}
