package bindings

import (
	"bytes"
	"encoding/json"
	"frontend/ws"
	"io"
	"net/http"
)

func (a *app) ConnectToHost(hostID string) Response[ConnectToHostResponse] {
	rawBody := map[string]string{
		"hostID": hostID,
	}

	jsonData, err := json.Marshal(rawBody)

	if err != nil {
		return Response[ConnectToHostResponse]{
			Success: false,
			Message: "Failed to marshal connect to host data",
		}
	}

	req, err := http.NewRequest("POST", a.buildApiUrl("/v1/sessions/connect-to-host"), bytes.NewBuffer(jsonData))

	if err != nil {
		return Response[ConnectToHostResponse]{
			Success: false,
			Message: "Failed to create connect to host request",
		}
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+a.token)

	resp, err := a.client.Do(req)

	if err != nil {
		return Response[ConnectToHostResponse]{
			Success: false,
			Message: "Failed to perform connect to host request: " + err.Error(),
		}
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)

	if err != nil {
		return Response[ConnectToHostResponse]{
			Success: false,
			Message: "Failed to read connect to host response body",
		}
	}

	var apiResponse Response[ConnectToHostResponse]

	err = json.Unmarshal(body, &apiResponse)

	if err != nil {
		return Response[ConnectToHostResponse]{
			Success: false,
			Message: "Failed to parse connect to host response: " + err.Error(),
		}
	}

	a.ticket = apiResponse.Data.Ticket

	// Clear the ticket in the response for security
	apiResponse.Data.Ticket = ""

	return apiResponse
}

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

func (a *app) ExitHostingSession() Response[any] {
	req, err := http.NewRequest("DELETE", a.buildApiUrl("/v1/sessions/exit-hosting-session"), nil)

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to create exit hosting session request",
		}
	}

	req.Header.Set("Authorization", "Bearer "+a.token)

	res, err := a.client.Do(req)

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to perform exit hosting session request: " + err.Error(),
		}
	}

	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to read exit hosting session response body",
		}
	}

	var apiResponse Response[any]

	err = json.Unmarshal(body, &apiResponse)

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to parse exit hosting session response: " + err.Error(),
		}
	}

	return apiResponse
}

func (a *app) SendUpdateOnClientPath(path []string) {
	ws.SendClientPathUpdate(path, ws.GenerateBaseWriteData(a.ticket, &ws.EventData{
		WriteCh:    a.communicationChannel,
		GenerateID: a.generateMessageID,
	}))
}
