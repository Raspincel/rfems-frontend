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
	Msg             []byte
	GenerateID      func() string
	Ctx             context.Context
	IsHosting       bool
	BasePath        string
	WriteCh         chan<- WriteMessage
	WriteTransferCh chan<- []byte
	AddUpload       func(id int, cancelCh chan TransferenceStatus)
	RemoveUpload    func(id int)
	UploadExists    func(id int) bool
	GetUpload       func(id int) (chan<- TransferenceStatus, bool)
	GetDownload     func(id int) (chan<- Download, bool)
}

type BinaryEventData struct {
	Msg         []byte
	GetDownload func(id int) (chan<- Download, bool)
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
	FullFolderPath      string `json:"fullFolderPath"`
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

type clientLeftSession struct {
	UserID string `json:"userId"`
}

type clientChangedPath struct {
	Path     string `json:"path"`
	ClientID string `json:"clientId"`
}

type requestedFilePath struct {
	Path string `json:"path"`
}

type TransferenceStatus string

// "TSC" stands for "Transference Status: Cancelled"
const (
	TSCByHost   TransferenceStatus = "By host"
	TSCByClient                    = "By client"
	TSCByServer                    = "By server"
	TSCByError                     = "By error"
	TSContinue                     = "Continue"
	TSConcluded                    = "Concluded"
)

type fileTransference struct {
	IsLast bool   `json:"isLast"`
	Bytes  []byte `json:"bytes"`
	Part   int    `json:"part"`
}

type continueFileTransference struct {
	ID uint32 `json:"id"`
}

type Download struct {
	Data   []byte
	Status TransferenceStatus
	// Part   uint32
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
	case "client_left_session":
		var clientLeft clientLeftSession

		err := json.Unmarshal(envelope.Payload, &clientLeft)

		if err != nil {
			fmt.Println("Error unmarshaling client left session:", err)
			return
		}

		runtime.EventsEmit(event.Ctx, "session:client_left_session", clientLeft)
	case "update_client_path":
		var updatePath clientChangedPath

		err := json.Unmarshal(envelope.Payload, &updatePath)

		if err != nil {
			fmt.Println("Error unmarshaling client updated path:", err)
			return
		}

		runtime.EventsEmit(event.Ctx, "session:client_updated_path", updatePath)
	case "request_file_download":
		var payload fileRequestPayload

		err := json.Unmarshal(envelope.Payload, &payload)

		if err != nil {
			fmt.Println("Failed to unmarshal file request payload")
			return
		}

		if event.UploadExists(payload.ID) {
			// TODO: SEND UPLOAD ALREADY IN PROGRESS MESSAGE
			return
		}

		go sendRequestedFile(&envelope, &payload, event)
		// TODO: implement this case on backend
	case "cancel_upload_to_client":
		// id := envelope.ID + envelope.Ticket + "upload"
		// if ch, exists := event.GetUpload(id); exists {
		// 	ch <- TSCByClient
		// }
	case "continue_transfer_file":
		var payload continueFileTransference

		err := json.Unmarshal(envelope.Payload, &payload)

		if err != nil {
			fmt.Println("Failed to unmarshal continue transfer file payload")
			return
		}

		// todo: make all "id" uint32
		if ch, exists := event.GetUpload(int(payload.ID)); exists {
			ch <- TSContinue
		}
	}
}

func HandleBinaryEvent(event *BinaryEventData) {
	if len(event.Msg) == 0 {
		fmt.Println("Received empty binary message")
		return
	}

	version := uint8(event.Msg[0] >> 4)

	switch version {
	case 1:
		id := uint32((event.Msg[0]&0x0F)<<16) |
			uint32(event.Msg[1]<<8) |
			uint32(event.Msg[2])

		dw, ok := event.GetDownload(int(id))

		if !ok {
			fmt.Println("No download channel found for ID", id)
			return
		}

		isLast := event.Msg[5]&0x01 == 1
		var status TransferenceStatus = TSContinue

		if isLast {
			status = TSConcluded
		}

		dw <- Download{
			Data:   event.Msg[6:],
			Status: status,
		}
	default:
		fmt.Println("Error: version not recognized")
	}
}

func GenerateBaseWriteData(ticket string, data *EventData) *baseWriteData {
	return &baseWriteData{
		Ch:     data.WriteCh,
		ID:     data.GenerateID(),
		Ticket: ticket,
	}
}
