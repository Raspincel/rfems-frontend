package api

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/gorilla/websocket"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Handle   string `json:"handle"`
}

type LoginResponse struct {
	AccessToken string `json:"accessToken"`
}

func (a API) Login(data LoginRequest) Response[LoginResponse] {
	values := map[string]string{
		"handle":   data.Handle,
		"email":    data.Email,
		"password": data.Password,
	}

	jsonData, err := json.Marshal(values)

	if err != nil {
		return Response[LoginResponse]{
			Success: false,
			Message: "Failed to marshal login data",
		}
	}

	req, err := http.NewRequest("POST", a.buildURL("/v1/users/login"), bytes.NewBuffer(jsonData))

	if err != nil {
		return Response[LoginResponse]{
			Success: false,
			Message: "Failed to create login request",
		}
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := a.client.Do(req)
	if err != nil {
		return Response[LoginResponse]{
			Success: false,
			Message: "Failed to perform login request: " + err.Error(),
		}
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)

	if err != nil {
		return Response[LoginResponse]{
			Success: false,
			Message: "Failed to read login response: " + err.Error(),
		}
	}

	var loginResponse Response[LoginResponse]

	err = json.Unmarshal(body, &loginResponse)

	if err != nil {
		return Response[LoginResponse]{
			Success: false,
			Message: "Failed to parse login response: " + err.Error(),
			Errors: []Error{
				{
					Message: err.Error(),
					Code:    "unmarshal_error",
				},
			},
		}
	}

	return loginResponse
}

func (a *API) Connect(path, token string) (*websocket.Conn, error) {
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: path}

	conn, res, err := websocket.DefaultDialer.Dial(u.String(), http.Header{
		"Authorization": []string{"Bearer " + token},
	})

	if err != nil {
		if res != nil && res.StatusCode > 400 && res.StatusCode < 500 {
			defer res.Body.Close()
			body, _ := io.ReadAll(res.Body)

			var response Response[any]

			err = json.Unmarshal(body, &response)

			if err != nil {
				return nil, fmt.Errorf("Failed to parse error response: %s", err.Error())
			}

			return nil, fmt.Errorf("WebSocket connection failed: %s", response.Message)
		}

		return nil, errors.New("Error connecting to WebSocket:" + err.Error())
	}

	if res.StatusCode != http.StatusSwitchingProtocols {
		defer res.Body.Close()

		body, _ := io.ReadAll(res.Body)

		var response Response[any]

		err = json.Unmarshal(body, &response)

		if err != nil {
			return nil, fmt.Errorf("Failed to parse error response: %s", err.Error())
		}

		return nil, fmt.Errorf("WebSocket connection failed: %s", response.Message)
	}

	return conn, nil
}

type UserInfoResponse struct {
	Name              string `json:"name"`
	ID                string `json:"id"`
	LastActiveAt      string `json:"lastActiveAt"`
	Status            string `json:"status"`
	FolderBeingHosted string `json:"folderBeingHosted"`
	FullFolderPath    string `json:"fullFolderPath"`
	IsPublic          bool   `json:"isPublic"`
}

func (a *API) GetUsersList(token string) Response[[]UserInfoResponse] {
	req, err := http.NewRequest("GET", a.buildURL("/v1/users/list-basic-infos"), nil)

	if err != nil {
		return Response[[]UserInfoResponse]{
			Success: false,
			Message: "Failed to create request: " + err.Error(),
		}
	}

	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := a.client.Do(req)

	if err != nil {
		return Response[[]UserInfoResponse]{
			Success: false,
			Message: "Failed to perform request: " + err.Error(),
		}
	}

	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var usersResponse Response[[]UserInfoResponse]

	err = json.Unmarshal(body, &usersResponse)

	if err != nil {
		return Response[[]UserInfoResponse]{
			Success: false,
			Message: "Failed to parse response: " + err.Error(),
			Errors: []Error{
				{
					Message: err.Error(),
					Code:    "unmarshal_error",
				},
			},
		}
	}

	return usersResponse
}

type Me struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	IsAdmin   bool      `json:"isAdmin"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func (a *API) Me(token string) Response[Me] {
	req, err := http.NewRequest("GET", a.buildURL("/v1/users/me"), nil)

	if err != nil {
		return Response[Me]{
			Success: false,
			Message: "Failed to create request: " + err.Error(),
		}
	}

	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := a.client.Do(req)

	if err != nil {
		return Response[Me]{
			Success: false,
			Message: "Failed to perform request: " + err.Error(),
		}
	}

	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var meResponse Response[Me]

	err = json.Unmarshal(body, &meResponse)

	if err != nil {
		return Response[Me]{
			Success: false,
			Message: "Failed to parse response: " + err.Error(),
			Errors: []Error{
				{
					Message: err.Error(),
					Code:    "unmarshal_error",
				},
			},
		}
	}

	return meResponse
}
