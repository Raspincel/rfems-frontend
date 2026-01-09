package api

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"
)

type SelectedFolder struct {
	Path string `json:"path"`
}

type StartHostingRequest struct {
	FolderPath string `json:"folderPath"`
	IsPublic   bool   `json:"isPublic"`
}

func (a API) StartHosting(request StartHostingRequest, token string) Response[any] {
	values := map[string]any{
		"folderPath": request.FolderPath,
		"isPublic":   request.IsPublic,
		"separator":  string(os.PathSeparator),
	}

	jsonData, err := json.Marshal(values)

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to marshal start hosting data",
		}
	}

	req, err := http.NewRequest("PUT", a.buildURL("/v1/sessions/start-hosting"), bytes.NewBuffer(jsonData))

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to create start hosting request",
		}
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

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

func (a API) StopHosting(status, token string) Response[any] {
	values := map[string]string{
		"status": status,
	}

	jsonData, err := json.Marshal(values)

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to marshal stop hosting data",
		}
	}

	req, err := http.NewRequest("DELETE", a.buildURL("/v1/sessions/stop-hosting"), bytes.NewBuffer(jsonData))

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to create stop hosting request",
		}
	}

	req.Header.Set("Authorization", "Bearer "+token)

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
