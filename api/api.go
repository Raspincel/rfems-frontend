package api

import (
	"net/http"
	"os"
	"time"
)

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

type API struct {
	url    string
	client *http.Client
}

func NewAPI() API {
	return API{
		url: os.Getenv("API_URL"),
		client: &http.Client{
			Timeout: 90 * time.Second,
		},
	}
}

func extractBody[T any]() {

}

func (c API) buildURL(path string) string {
	return c.url + path
}
