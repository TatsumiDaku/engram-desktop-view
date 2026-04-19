# EngramDesktopView

Desktop dashboard to monitor and explore Engram memory events with system tray and native notifications.

## Tech Stack

- **Frontend**: React + TypeScript + TailwindCSS + Vite
- **Desktop**: Tauri v2 (Rust)
- **API**: Engram HTTP server (localhost:7437)
- **State**: Zustand + TanStack Query

## Features

- Sessions tab - View all agent sessions
- Memories tab - View individual observations
- Topics tab - Observations grouped by topic_key
- Timeline tab - Chronological view by day
- Prompts tab - Saved user prompts list
- Settings modal - Export/Import JSON, merge projects
- System tray - Minimize to tray, see status
- Auto-start Engram - Start Engram server automatically
- Native notifications - System alerts
- Dark/Light theme - Theme toggle

## Development

```bash
# Install dependencies
pnpm install

# Start Engram + dev server
pnpm dev

# Build for production
pnpm build

# Build Tauri app
pnpm tauri build
```

## License

MIT