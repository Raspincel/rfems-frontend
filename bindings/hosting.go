package bindings

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type SelectedFolder struct {
	Path string `json:"path"`
}

func (a *app) ChooseFolder() Response[SelectedFolder] {
	selection, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title:                      "Select a folder to host",
		DefaultDirectory:           "",
		DefaultFilename:            "",
		ShowHiddenFiles:            true,
		CanCreateDirectories:       true,
		TreatPackagesAsDirectories: false,
	})

	if err != nil {
		return Response[SelectedFolder]{
			Success: false,
			Message: fmt.Sprintf("Failed to open folder selection dialog: %s", err.Error()),
		}
	}

	return Response[SelectedFolder]{
		Success: true,
		Data: SelectedFolder{
			Path: selection,
		},
		Message: "Folder selected successfully",
	}
}

type StartHostingRequest struct {
	FolderName string `json:"folderName"`
	IsPublic   bool   `json:"isPublic"`
}

func (a *app) StartHosting(request StartHostingRequest) Response[any] {
	values := map[string]any{
		"folderName": request.FolderName,
		"isPublic":   request.IsPublic,
	}

	jsonData, err := json.Marshal(values)

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to marshal start hosting data",
		}
	}

	req, err := http.NewRequest("PUT", a.buildApiUrl("/v1/sessions/start-hosting"), bytes.NewBuffer(jsonData))

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to create start hosting request",
		}
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+a.token)

	resp, err := a.client.Do(req)

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to perform start hosting request: " + err.Error(),
		}
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to read start hosting response body",
		}
	}

	var apiResponse Response[any]

	err = json.Unmarshal(body, &apiResponse)

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to parse start hosting response: " + err.Error(),
		}
	}

	return apiResponse
}

func (a *app) StopHosting() Response[any] {
	req, err := http.NewRequest("PUT", a.buildApiUrl("/v1/sessions/stop-hosting"), nil)

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to create stop hosting request",
		}
	}

	req.Header.Set("Authorization", "Bearer "+a.token)

	resp, err := a.client.Do(req)

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to perform stop hosting request: " + err.Error(),
		}
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to read stop hosting response body",
		}
	}

	var apiResponse Response[any]

	err = json.Unmarshal(body, &apiResponse)

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to parse stop hosting response: " + err.Error(),
		}
	}

	return apiResponse
}
