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
	ctx    context.Context
	client *http.Client
	apiURL string
	token  string
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
	}
}

func (a app) buildApiUrl(path string) string {
	return a.apiURL + path
}

// startup is called at application startup
func (a *app) Startup(ctx context.Context) {
	a.ctx = ctx
	token, err := keyring.Get(serviceName, userKey)

	if err == nil {
		a.token = token
	}
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
