package ws

import (
	"encoding/json"
	"fmt"
	"frontend/files"
)

type filesListRequest struct {
	BasePath string
	Payload  json.RawMessage
}

type filesListRequestPayload struct {
	HostID      string   `json:"hostId"`
	OperationID string   `json:"operationId"`
	Path        []string `json:"path"`
	UserID      string   `json:"userId"`
}

func handleFilesListRequest(req *filesListRequest) (sendFilesListData, error) {
	var payload filesListRequestPayload
	err := json.Unmarshal(req.Payload, &payload)

	if err != nil {
		return sendFilesListData{}, err
	}

	files, err := files.ListFiles(req.BasePath, payload.Path)

	if err != nil {
		fmt.Println("Error listing files:", err)
		return sendFilesListData{}, err
	}

	data := sendFilesListData{
		Files: files,
		Path:  payload.Path,
	}

	return data, nil
}
