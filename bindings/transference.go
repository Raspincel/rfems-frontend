package bindings

import (
	"frontend/api"
	"frontend/ws"
	"os"
	"path/filepath"
	"strings"

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
		DefaultFilename: filePath[len(filePath)-1],
		Title:           "Download file",
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

	id, err := ws.RequestFileDownload(filePath, ws.GenerateBaseWriteData(a.ticket, &ws.EventData{
		GenerateID: a.generateMessageID,
		WriteCh:    a.communicationChannel,
	}))

	if err != nil {
		return api.Response[RequestFileResponse]{
			Success: false,
			Message: "Failed to prepare download",
		}
	}

	a.downloads[id] = download{
		path:   destinationPath,
		status: "preparing",
	}

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
