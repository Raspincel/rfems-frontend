package ws

import (
	"encoding/json"
	"frontend/files"
	util "frontend/utils"
)

type WriteMessage struct {
	ID         string          `json:"id"`
	Type       string          `json:"type"`
	Ticket     string          `json:"ticket"`
	RawPayload json.RawMessage `json:"payload"`
}

type baseWriteData struct {
	Ch     chan<- WriteMessage
	ID     string
	Ticket string
}

type RequestFilesListData struct {
	Path []string
}

func RequestFilesList(data RequestFilesListData, base *baseWriteData) error {
	payload, err := util.ToRawMessage(map[string]any{
		"path": data.Path,
	})

	if err != nil {
		return err
	}

	message := WriteMessage{
		ID:         base.ID,
		Ticket:     base.Ticket,
		Type:       "request_files_list",
		RawPayload: payload,
	}

	base.Ch <- message

	return nil
}

type sendFilesListData struct {
	Files []files.File
	Path  []string
}

func sendFilesList(data sendFilesListData, base *baseWriteData) {
	payload, err := util.ToRawMessage(map[string]any{
		"files": data.Files,
		"path":  data.Path,
	})

	if err != nil {
		return
	}

	message := WriteMessage{
		ID:         base.ID,
		Ticket:     base.Ticket,
		Type:       "send_files_list",
		RawPayload: payload,
	}

	base.Ch <- message
}
