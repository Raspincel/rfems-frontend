package bindings

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"time"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Handle   string `json:"handle"`
}

type LoginResponse struct {
	AccessToken string `json:"accessToken"`
}

func (a *app) IsLoggedIn() bool {
	return a.token != ""
}

func (a *app) Login(data LoginRequest) Response[LoginResponse] {
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

	req, err := http.NewRequest("POST", a.buildApiUrl("/v1/users/login"), bytes.NewBuffer(jsonData))

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

	if loginResponse.Success {
		err := a.storeUserSession(loginResponse.Data.AccessToken)

		if err != nil {
			return Response[LoginResponse]{
				Success: false,
				Message: "Failed to store user session: " + err.Error(),
			}
		}

		// Clear data field to avoid returning sensitive info
	}

	loginResponse.Data = LoginResponse{}

	return loginResponse
}

func (a *app) Logout() Response[any] {
	err := a.endUserSession()

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to end session: " + err.Error(),
		}
	}

	return Response[any]{
		Success: true,
		Message: "Logged out successfully",
	}
}

type UserBasicInfo struct {
	Name              string `json:"name"`
	ID                string `json:"id"`
	LastActiveAt      string `json:"lastActiveAt"`
	Status            string `json:"status"`
	FolderBeingHosted string `json:"folderBeingHosted"`
	FullFolderPath    string `json:"fullFolderPath"`
	IsPublic          bool   `json:"isPublic"`
}

func (a *app) GetUsersList() Response[[]UserBasicInfo] {
	req, err := http.NewRequest("GET", a.buildApiUrl("/v1/users/list-basic-infos"), nil)

	if err != nil {
		return Response[[]UserBasicInfo]{
			Success: false,
			Message: "Failed to create request: " + err.Error(),
		}
	}

	req.Header.Set("Authorization", "Bearer "+a.token)

	resp, err := a.client.Do(req)

	if err != nil {
		return Response[[]UserBasicInfo]{
			Success: false,
			Message: "Failed to perform request: " + err.Error(),
		}
	}

	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var usersResponse Response[[]UserBasicInfo]

	err = json.Unmarshal(body, &usersResponse)

	if err != nil {
		return Response[[]UserBasicInfo]{
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

func (a *app) Me() Response[Me] {
	req, err := http.NewRequest("GET", a.buildApiUrl("/v1/users/me"), nil)

	if err != nil {
		return Response[Me]{
			Success: false,
			Message: "Failed to create request: " + err.Error(),
		}
	}

	req.Header.Set("Authorization", "Bearer "+a.token)

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
