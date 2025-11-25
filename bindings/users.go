package bindings

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"

	"github.com/zalando/go-keyring"
)

const (
	serviceName = "rfems-desktop-app"
	userKey     = "user-auth-token"
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
			Message: "Failed to perform login request",
		}
	}

	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var loginResponse Response[LoginResponse]

	err = json.Unmarshal(body, &loginResponse)

	if err != nil {
		return Response[LoginResponse]{
			Success: false,
			Message: "Failed to parse login response",
			Errors: []Error{
				{
					Message: err.Error(),
					Code:    "unmarshal_error",
				},
			},
		}
	}

	keyring.Set(serviceName, userKey, loginResponse.Data.AccessToken)
	a.token = loginResponse.Data.AccessToken

	// Clear data field to avoid returning sensitive info
	loginResponse.Data = LoginResponse{}

	return loginResponse
}

func (a *app) Logout() Response[any] {
	err := keyring.Delete(serviceName, userKey)

	if err != nil {
		return Response[any]{
			Success: false,
			Message: "Failed to delete auth token",
		}
	}

	a.token = ""

	return Response[any]{
		Success: true,
		Message: "Logged out successfully",
	}
}
