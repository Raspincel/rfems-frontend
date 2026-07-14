# RFEMS Client

Desktop client for **RFEMS** (Remote File Exchange Management System) — a peer-to-peer file sharing application built with [Wails v2](https://wails.io).

## Capabilities

- **Host folders** — share local directories with other users (public or private with approval)
- **Browse remote folders** — explore files shared by other users in real time
- **Download files** — transfer files with live progress tracking
- **User directory** — discover other users and their hosting status
- **Real-time updates** — live status, hosting, and transfer events via WebSocket
- **Persistent sessions** — auth tokens stored in OS keyring

## Stack

| Layer | Technology |
|---|---|
| Desktop framework | [Wails v2](https://github.com/wailsapp/wails) |
| Backend runtime | Go 1.25 |
| UI | React 19 + TypeScript |
| State management | Redux Toolkit |
| Routing | React Router v7 |
| Styling | Tailwind CSS |
| Build tool | Vite |
| WebSocket | gorilla/websocket |
| Credential storage | go-keyring (OS-native) |

## Getting Started

### Prerequisites

- Go 1.25+
- Node.js 20+
- npm
- Wails CLI (`go install github.com/wailsapp/wails/v2/cmd/wails@latest`)
- A running [RFEMS backend](../backend)

### Setup

1. Copy `.env.example` to `.env` and set `API_URL` to the backend address:
   ```
   API_URL=http://localhost:8080
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend && npm install
   ```

### Development

```bash
wails dev
```

### Build

```bash
wails build
```

For macOS ARM:
```bash
./scripts/build-macos-arm.sh
```

## Architecture

- **Dual WebSocket** — communication channel (JSON messages) + transference channel (binary file chunks)
- **Custom binary protocol** — 48-bit per-chunk header: `[4-bit version][20-bit transfer ID][23-bit part index][1-bit isLast]` followed by 16 KB payload
- **Path sandboxing** — `os.OpenRoot` prevents directory traversal on hosted folders
- **Transfer throttling** — stop-and-wait ACK every 10 chunks for flow control
