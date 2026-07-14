package bindings

import (
	"frontend/api"
)

func (a *app) IsLoggedIn() bool {
	return a.token != ""
}

func (a *app) Login(data api.LoginRequest) api.Response[api.LoginResponse] {
	response := a.api.Login(data)

	if response.Success {
		err := a.storeUserSession(response.Data.AccessToken)

		if err != nil {
			return api.Response[api.LoginResponse]{
				Success: false,
				Message: "Failed to store user session: " + err.Error(),
			}
		}

		// Clear data field to avoid returning sensitive info
		response.Data = api.LoginResponse{}
	}

	return response
}

func (a *app) Logout() api.Response[any] {
	err := a.endUserSession()

	if err != nil {
		return api.Response[any]{
			Success: false,
			Message: "Failed to end session: " + err.Error(),
		}
	}

	return api.Response[any]{
		Success: true,
		Message: "Logged out successfully",
	}
}

func (a *app) GetUsersList() api.Response[[]api.UserInfoResponse] {
	response := a.api.GetUsersList(a.token)

	return response
}

func (a *app) Me() api.Response[api.Me] {
	response := a.api.Me(a.token)

	return response
}
