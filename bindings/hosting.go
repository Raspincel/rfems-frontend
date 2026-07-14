package bindings

import (
	"fmt"
	"frontend/api"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type SelectedFolder struct {
	Path string `json:"path"`
}

func (a *app) ChooseFolder() api.Response[SelectedFolder] {
	selection, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title:                      "Select a folder to host",
		DefaultDirectory:           "",
		DefaultFilename:            "",
		ShowHiddenFiles:            true,
		CanCreateDirectories:       true,
		TreatPackagesAsDirectories: false,
	})

	if err != nil {
		return api.Response[SelectedFolder]{
			Success: false,
			Message: fmt.Sprintf("Failed to open folder selection dialog: %s", err.Error()),
		}
	}

	return api.Response[SelectedFolder]{
		Success: true,
		Data: SelectedFolder{
			Path: selection,
		},
		Message: "Folder selected successfully",
	}
}

func (a *app) StartHosting(request api.StartHostingRequest) api.Response[any] {
	response := a.api.StartHosting(request, a.token)

	if response.Success {
		a.hosting.isHosting = true
		a.hosting.basePath = request.FolderPath
	}

	return response
}

func (a *app) StopHosting(status string) api.Response[any] {
	response := a.api.StopHosting(status, a.token)

	if response.Success {
		a.hosting.isHosting = false
		a.hosting.basePath = ""
	}

	return response
}
