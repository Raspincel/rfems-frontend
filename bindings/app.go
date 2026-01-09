package bindings

import (
	"context"
	"errors"
	"fmt"
	"frontend/api"
	"frontend/ws"
	"os"
	"strconv"
	"sync/atomic"

	"github.com/zalando/go-keyring"
)

type hosting struct {
	isHosting bool
	basePath  string
}

type download struct {
	path   string
	status string
}

type app struct {
	ctx                  context.Context
	communicationChannel chan ws.WriteMessage
	api                  api.API
	token                string
	ticket               string
	hosting              hosting
	messagesQueue        []message
	totalMessages        atomic.Int32
	downloads            map[string]download
}

type message struct {
	ID   string
	Type string
}

func NewApp() *app {
	return &app{
		communicationChannel: make(chan ws.WriteMessage),
		downloads:            map[string]download{},
		messagesQueue:        []message{},
		api:                  api.NewAPI(),
	}
}

// startup is called at application startup
func (a *app) Startup(ctx context.Context) {
	a.ctx = ctx

	if len(os.Args) < 2 {
		userKey = "user-auth-token"
	} else {
		// Use a different key to be able to run multiple instances in development
		userKey = "user-auth-token-" + os.Args[1]
	}

	a.restoreUserSession()
}

// domReady is called after front-end resources have been loaded
func (a *app) domReady(ctx context.Context) {}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *app) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

// shutdown is called at application termination
func (a *app) shutdown(ctx context.Context) {}

const serviceName = "rfems-desktop-app"

var userKey string

func (a *app) restoreUserSession() {
	token, err := keyring.Get(serviceName, userKey)

	if err != nil {
		return
	}

	commConn, err := a.api.Connect("/api/v1/sessions/connect", token)

	if err != nil {
		return
	}

	tranConn, err := a.api.Connect("/api/v1/transference/connect", token)

	if err != nil {
		return
	}

	a.token = token
	go a.readPump(a.ctx, commConn, tranConn)
	go writePump(a.ctx, a.communicationChannel, commConn, tranConn)

}

func (a *app) storeUserSession(token string) error {
	commConn, err := a.api.Connect("/api/v1/sessions/connect", token)

	if err != nil {
		return errors.New("Failed to connect communication WebSocket: " + err.Error())
	}

	tranConn, err := a.api.Connect("/api/v1/transference/connect", token)

	if err != nil {
		return errors.New("Failed to connect transference WebSocket: " + err.Error())
	}

	go a.readPump(a.ctx, commConn, tranConn)
	go writePump(a.ctx, a.communicationChannel, commConn, tranConn)

	err = keyring.Set(serviceName, userKey, token)

	if err != nil {
		fmt.Println("Warning: Failed to store token in keyring:", err.Error())
	}

	a.token = token
	return nil
}

func (a *app) endUserSession() error {
	err := keyring.Delete(serviceName, userKey)

	if err != nil {
		return err
	}

	a.token = ""

	return nil
}

func (a *app) generateMessageID() string {
	return strconv.Itoa(int(a.totalMessages.Add(1)))
}
