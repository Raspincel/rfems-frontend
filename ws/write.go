package ws

import (
	"encoding/json"
	"errors"
	"fmt"
	"frontend/files"
	util "frontend/utils"
	"io"
	"os"
	"time"
)

type WriteMessage struct {
	ID         string          `json:"id"`
	Type       string          `json:"type"`
	Ticket     string          `json:"ticket"`
	RawPayload json.RawMessage `json:"payload"`
}

type baseWriteData struct {
	Ch     chan<- WriteMessage
	ID     string
	Ticket string
}

type RequestFilesListData struct {
	Path []string
}

func RequestFilesList(data RequestFilesListData, base *baseWriteData) error {
	payload, err := util.ToRawMessage(map[string]any{
		"path": data.Path,
	})

	if err != nil {
		return err
	}

	message := WriteMessage{
		ID:         base.ID,
		Ticket:     base.Ticket,
		Type:       "request_files_list",
		RawPayload: payload,
	}

	base.Ch <- message

	return nil
}

type sendFilesListData struct {
	Files []files.File
	Path  []string
}

func sendFilesList(data sendFilesListData, base *baseWriteData) {
	payload, err := util.ToRawMessage(map[string]any{
		"files": data.Files,
		"path":  data.Path,
	})

	if err != nil {
		return
	}

	message := WriteMessage{
		ID:         base.ID,
		Ticket:     base.Ticket,
		Type:       "send_files_list",
		RawPayload: payload,
	}

	base.Ch <- message
}

func SendClientPathUpdate(path []string, base *baseWriteData) {
	payload, err := util.ToRawMessage(map[string]any{
		"path": path,
	})

	if err != nil {
		return
	}

	message := WriteMessage{
		ID:         base.ID,
		Type:       "update_client_path",
		Ticket:     base.Ticket,
		RawPayload: payload,
	}

	base.Ch <- message
}

func RequestFileDownload(path []string, transferID int, id, ticket string, ch chan<- WriteMessage) error {
	payload, err := util.ToRawMessage(map[string]any{
		"path":       path,
		"transferID": transferID,
	})

	if err != nil {
		return err
	}

	message := WriteMessage{
		ID:         id,
		Type:       "request_file_download",
		Ticket:     ticket,
		RawPayload: payload,
	}

	ch <- message

	return nil
}

func sendRequestedFile(envelope *messageEnvelope, payload *fileRequestPayload, event *EventData) {
	f, err := prepareRequestedFile(event.BasePath, payload)

	if err != nil {
		fmt.Println(err.Error())
		// TODO: Make file transfer stop when receives this here
		sendFileTransferenceFailed(&baseWriteData{
			ID:     envelope.ID,
			Ticket: envelope.Ticket,
			Ch:     event.WriteCh,
		})
		return
	}

	defer f.Close()

	ch := make(chan TransferenceStatus)
	event.AddUpload(payload.ID, ch)
	defer event.RemoveUpload(payload.ID)

	status, err := sendFile(f, payload, event.WriteTransferCh, ch)

	if err != nil {
		fmt.Println(err.Error())
	}

	switch status {
	case TSConcluded:
		sendFileTransferenceSuccess(&baseWriteData{
			ID:     envelope.ID,
			Ticket: envelope.Ticket,
			Ch:     event.WriteCh,
		})
	case TSCByError, TSCByHost:
		sendFileTransferenceFailed(&baseWriteData{
			ID:     envelope.ID,
			Ticket: envelope.Ticket,
			Ch:     event.WriteCh,
		})
	default:
		fmt.Println("Transference error", status)
	}
}

func sendFile(f *os.File, payload *fileRequestPayload, tranCh chan<- []byte, cancelCh <-chan TransferenceStatus) (TransferenceStatus, error) {
	info, err := f.Stat()

	if err != nil {
		return TSCByError, errors.New("Failed to get file info")
	}

	packetSize := int64(1024 * 16)
	size := info.Size()
	parts := (size + packetSize - 1) / packetSize
	bytes := make([]byte, packetSize)

	fmt.Println("parts", parts)

	start := time.Now()
	defer func(start time.Time) {
		fmt.Println("time elapsed:", time.Now().Sub(start).Milliseconds())
	}(start)

	version := uint64(0b0001) // 4 bits
	id := uint64(payload.ID)  // 20 bits

	var idx uint64    // 23 bits
	var isLast uint64 // 1 bit

	for i := range parts {
		// sends 10 parts, stops at the first of the next 10-parts-batch
		if (i+1)%11 == 0 {
			cancel := <-cancelCh

			if cancel != TSContinue {
				fmt.Println("Transference cancelled")
				return cancel, nil
			}
		}

		n, err := f.Read(bytes)

		if err != nil && err != io.EOF {
			fmt.Println("Error reading file", err.Error())
			return TSCByError, errors.New("Error reading file")
		}

		idx = uint64(i)
		if i == parts-1 {
			isLast = 1
		}

		var header uint64 = (version << 44) |
			(id << 24) |
			(idx << 1) |
			isLast

		// 4 bits (version) | 20 bits (id) | 23 bits (part) | 1 bit (is last) | 16kb (data)
		buf := make([]byte, 6+n)
		// write 48-bit header (big-endian)
		buf[0] = byte(header >> 40)
		buf[1] = byte(header >> 32)
		buf[2] = byte(header >> 24)
		buf[3] = byte(header >> 16)
		buf[4] = byte(header >> 8)
		buf[5] = byte(header)

		copy(buf[6:], bytes)

		tranCh <- buf
	}

	return TSConcluded, nil
}

func sendFileTransferenceSuccess(base *baseWriteData) {
	message := WriteMessage{
		ID:         base.ID,
		Ticket:     base.Ticket,
		Type:       "file_transference_success",
		RawPayload: nil,
	}

	base.Ch <- message
}

func sendFileTransferenceFailed(base *baseWriteData) {
	message := WriteMessage{
		ID:         base.ID,
		Ticket:     base.Ticket,
		Type:       "file_transference_failed",
		RawPayload: nil,
	}

	base.Ch <- message
}
