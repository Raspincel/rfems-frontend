package bindings

import (
	"frontend/api"
	"frontend/ws"
)

func (a *app) ConnectToHost(hostID string) api.Response[api.ConnectToHostResponse] {
	response := a.api.ConnectToHost(hostID, a.token)

	a.ticket = response.Data.Ticket

	// Clear the ticket in the response for security
	response.Data.Ticket = ""

	return response
}

func (a *app) RequestFilesList(path []string) api.Response[any] {
	if a.ticket == "" {
		return api.Response[any]{
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
		return api.Response[any]{
			Success: false,
			Message: "Failed to request files list: " + err.Error(),
		}
	}

	return api.Response[any]{
		Success: true,
		Message: "Files list request sent",
	}
}

func (a *app) ExitHostingSession() api.Response[any] {
	response := a.api.ExitHostingSession(a.token)

	return response
}

func (a *app) SendUpdateOnClientPath(path []string) {
	ws.SendClientPathUpdate(path, ws.GenerateBaseWriteData(a.ticket, &ws.EventData{
		WriteCh:    a.communicationChannel,
		GenerateID: a.generateMessageID,
	}))
}
