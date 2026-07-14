package api

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
)

type ConnectToHostResponse struct {
	Ticket string `json:"ticket"`
}

func (a *API) ConnectToHost(hostID, token string) Response[ConnectToHostResponse] {
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

	req, err := http.NewRequest("POST", a.buildURL("/v1/sessions/connect-to-host"), bytes.NewBuffer(jsonData))

	if err != nil {
		return Response[ConnectToHostResponse]{
			Success: false,
			Message: "Failed to create connect to host request",
		}
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

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

	return apiResponse
}

func (a *API) ExitHostingSession(token string) Response[any] {
	req, err := http.NewRequest("DELETE", a.buildURL("/v1/sessions/exit-hosting-session"), nil)

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to create exit hosting session request",
		}
	}

	req.Header.Set("Authorization", "Bearer "+token)

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
