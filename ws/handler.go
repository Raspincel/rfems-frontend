package ws

import (
	"context"
	"encoding/json"
	"fmt"
	"frontend/files"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type EventData struct {
	Msg        []byte
	GenerateID func() string
	Ctx        context.Context
	IsHosting  bool
	BasePath   string
	WriteCh    chan<- WriteMessage
}

type statusUpdate struct {
	UserID       string    `json:"userId,omitzero"`
	Status       string    `json:"status"`
	LastActiveAt time.Time `json:"lastActiveAt,omitzero"`
}

type messageEnvelope struct {
	ID      string          `json:"id"`
	Ticket  string          `json:"ticket"`
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
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

type receivedFilesList struct {
	Path  []string     `json:"path"`
	Files []files.File `json:"files"`
}

func HandleEvent(event *EventData) {
	var envelope messageEnvelope

	err := json.Unmarshal([]byte(event.Msg), &envelope)

	if err != nil {
		fmt.Println("Error unmarshaling message envelope:", err)
		return
	}

	switch envelope.Type {
	case "status_update":
		var status statusUpdate
		err := json.Unmarshal(envelope.Payload, &status)

		if err != nil {
			fmt.Println("Error unmarshaling status update:", err)
			return
		}

		runtime.EventsEmit(event.Ctx, "user:status_update", status)
	case "hosting_update":
		var hosting hostingUpdate
		err := json.Unmarshal(envelope.Payload, &hosting)

		if err != nil {
			fmt.Println("Error unmarshaling hosting update:", err)
			return
		}

		runtime.EventsEmit(event.Ctx, "user:hosting_update", hosting)
	case "connected_user_update":
		var user connectedUserUpdate

		err := json.Unmarshal(envelope.Payload, &user)

		if err != nil {
			fmt.Println("Error unmarshaling connected user update:", err)
			return
		}

		runtime.EventsEmit(event.Ctx, "user:connected_user_update", user)
	case "kicked_by_host":
		var kicked kickedByHost

		err := json.Unmarshal(envelope.Payload, &kicked)

		if err != nil {
			fmt.Println("Error unmarshaling kicked by host:", err)
			return
		}

		runtime.EventsEmit(event.Ctx, "user:kicked_by_host", kicked)
	case "request_files_list":
		if !event.IsHosting {
			return
		}

		data, err := handleFilesListRequest(&filesListRequest{
			Payload:  envelope.Payload,
			BasePath: event.BasePath,
		})

		if err != nil {
			fmt.Println("Error handling files list request:", err)
			return
		}

		sendFilesList(data, GenerateBaseWriteData(envelope.Ticket, event))
	case "send_files_list":
		var filesListPayload receivedFilesList

		err := json.Unmarshal(envelope.Payload, &filesListPayload)

		if err != nil {
			fmt.Println("Error unmarshaling received files list:", err)
			return
		}

		runtime.EventsEmit(event.Ctx, "files:received_files_list", filesListPayload)
	}
}

func GenerateBaseWriteData(ticket string, data *EventData) *baseWriteData {
	return &baseWriteData{
		Ch:     data.WriteCh,
		ID:     data.GenerateID(),
		Ticket: ticket,
	}
}
