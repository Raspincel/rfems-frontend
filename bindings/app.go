package bindings

import (
	"context"
	"net/http"
	"os"
	"time"

	"github.com/zalando/go-keyring"
)

// app struct
type app struct {
	ctx                  context.Context
	communicationChannel chan []byte
	client               *http.Client
	apiURL               string
	token                string
}

type Response[T any] struct {
	Success bool    `json:"success"`
	Message string  `json:"message"`
	Data    T       `json:"data"`
	Meta    Meta    `json:"meta"`
	Errors  []Error `json:"errors,omitempty"`
}

type Meta struct {
	TraceID   string    `json:"trace_id"`
	Timestamp time.Time `json:"timestamp"`
}

type Error struct {
	Code    string `json:"code"`
	Field   string `json:"field,omitempty"`
	Message string `json:"message"`
}

func NewApp() *app {
	return &app{
		apiURL: os.Getenv("API_URL"),
		client: &http.Client{
			Timeout: 90 * time.Second,
		},
		communicationChannel: make(chan []byte),
	}
}

func (a app) buildApiUrl(path string) string {
	return a.apiURL + path
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
func (a app) domReady(ctx context.Context) {}

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

	a.token = token
	err = a.connect(a.apiURL, "/api/v1/ws/connect", a.token, a.client, a.communicationChannel)

	if err != nil {
		panic(err)
	}
}

func (a *app) storeUserSession(token string) {
	keyring.Set(serviceName, userKey, token)
	a.token = token

	err := a.connect(a.apiURL, "/api/v1/ws/connect", a.token, a.client, a.communicationChannel)

	if err != nil {
		panic(err)
	}
}

func (a *app) endUserSession() error {
	err := keyring.Delete(serviceName, userKey)

	if err != nil {
		return err
	}

	a.token = ""

	return nil
}
