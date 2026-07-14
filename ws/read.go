package ws

import (
	"encoding/json"
	"errors"
	"fmt"
	"frontend/files"
	"os"
	"strings"
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

type fileRequestPayload struct {
	Path []string
	ID   int
}

type fileRequestData struct {
	file *os.File
	id   int
}

func (f *fileRequestData) close() {
	f.file.Close()
}

// TODO: centralize errors?
var ErrFileIsDirectory = errors.New("Target file is a directory")

func prepareRequestedFile(basePath string, payload *fileRequestPayload) (*os.File, error) {
	root, err := os.OpenRoot(basePath)

	if err != nil {
		return nil, err
	}

	defer root.Close()

	sep := string(os.PathSeparator)

	f, err := root.Open("." + sep + strings.Join(payload.Path, sep))

	if err != nil {
		return nil, err
	}

	s, err := f.Stat()

	if s.IsDir() {
		f.Close()
		return nil, ErrFileIsDirectory
	}

	return f, nil
}
