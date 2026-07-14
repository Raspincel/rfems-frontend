package bindings

import (
	"fmt"
	"frontend/api"
	"frontend/ws"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type RequestFileResponse struct {
	ID              string `json:"id"`
	DestinationPath string `json:"destinationPath"`
	OriginPath      string `json:"originPath"`
}

func (a *app) RequestFileDownload(filePath []string) api.Response[RequestFileResponse] {
	originPath := strings.Join(filePath, string(os.PathSeparator))
	ext := filepath.Ext(originPath)

	destinationPath, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		DefaultFilename:      filePath[len(filePath)-1],
		Title:                "Download file",
		CanCreateDirectories: true,
		Filters: []runtime.FileFilter{
			{Pattern: "*." + ext},
		},
	})

	if err != nil {
		return api.Response[RequestFileResponse]{
			Success: false,
			Message: "Failed to prepare download",
		}
	}

	// TODO: do something with ID
	id := a.generateMessageID()
	idRequest := a.api.RequestTransferID(a.token, a.ticket, id)

	if !idRequest.Success {
		return api.Response[RequestFileResponse]{
			Success: false,
			Message: "Failed to prepare download: " + idRequest.Message,
		}
	}

	err = ws.RequestFileDownload(filePath, idRequest.Data.ID, id, a.ticket, a.communicationChannel)

	if err != nil {
		return api.Response[RequestFileResponse]{
			Success: false,
			Message: "Failed to prepare download",
		}
	}

	go a.downloadFile(destinationPath, id, idRequest.Data.ID)

	data := api.Response[RequestFileResponse]{
		Success: true,
		Message: "Preparing download",
		Data: RequestFileResponse{
			ID:              id,
			OriginPath:      originPath,
			DestinationPath: destinationPath,
		},
	}

	return data
}

type downloadUpdate struct {
	ID       string `json:"id"`
	Progress int    `json:"progress"`
	Status   string `json:"status"`
}

func (a *app) downloadFile(path, id string, downloadID int) {
	ch := make(chan ws.Download, 4096)

	a.downloads.addDownload(downloadID, ch)
	defer a.downloads.removeDownload(downloadID)

	pr, pw := io.Pipe()
	defer pw.Close()

	file, err := os.Create(path)

	if err != nil {
		// TODO: Send cancel transference message
		fmt.Println("Failed to create file")
		return
	}

	defer file.Close()

	go func(pw *io.PipeWriter) {
		// pending := map[uint32]ws.Download{}
		du := downloadUpdate{
			ID:       id,
			Progress: 0,
			Status:   "downloading",
		}

		// expected := uint32(0)

		// fmt.Println("initial pending len", len(pending))
		start := time.Now()
		defer func(start time.Time) {
			fmt.Println("ended in", time.Now().Sub(start).Milliseconds(), "Ms")
		}(start)

		for {
			select {
			case dw := <-ch:
				switch dw.Status {
				case ws.TSContinue, ws.TSConcluded:
					du.Progress += len(dw.Data)
					if len(dw.Data) > 0 {
						runtime.EventsEmit(a.ctx, "transference:file-download-update", du)
						pw.Write(dw.Data)
					}

					if dw.Status == ws.TSConcluded {
						runtime.EventsEmit(a.ctx, "transference:file-download-completed", du)
						return
					}
				// TODO: handle other status
				// TODO: close download channel
				case ws.TSCByError, ws.TSCByServer, ws.TSCByHost, ws.TSCByClient:
					fmt.Println("whaaat")
					return
				default:
					fmt.Println("unknown status", dw.Status)
					return
				}
			}
		}
	}(pw)

	w, err := io.Copy(file, pr)

	if err != nil {
		fmt.Println("oxi, error", err.Error())
	}

	fmt.Println("ended", w)
}
