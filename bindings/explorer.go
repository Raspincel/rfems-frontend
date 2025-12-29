package bindings

import (
	"frontend/ws"
)

func (a *app) RequestFilesList(path []string) Response[any] {
	if a.ticket == "" {
		return Response[any]{
			Success: false,
			Message: "Not connected to a host",
		}
	}

	err := ws.RequestFilesList(ws.RequestFilesListData{
		Path: path,
	}, ws.GenerateBaseWriteData(
		a.ticket,
		&ws.EventData{
			WriteCh:    a.communicationChannel,
			GenerateID: a.generateMessageID,
		},
	))

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to request files list: " + err.Error(),
		}
	}

	return Response[any]{
		Success: true,
		Message: "Files list request sent",
	}
}
