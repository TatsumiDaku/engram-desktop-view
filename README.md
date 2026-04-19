<img src=".github/BannerEngramDesktop.png" alt="EngramDesktopView" width="100%" />

# 🎩 EngramDesktopView

> Real-time dashboard for monitoring your Engram memory agent.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tauri v2](https://img.shields.io/badge/Tauri-2.0-?logo=tauri)](https://tauri.app)

🧔‍♂️ Made with ❤️ for the [Gentleman Programming](https://github.com/Gentleman-Programming/engram) community

---

## ✨ Features

### 📑 Eight Powerful Tabs

| Tab | Description |
|-----|-------------|
| **Home** | Dashboard with hero section, live stats (sessions, observations, projects), and feature cards |
| **Sessions** | Grid view of all sessions with project colors, observation counts, and date info |
| **Memories** | All observations with full-text search and detailed inline editing |
| **Topics** | Observations grouped and expandable by topic keys |
| **Timeline** | Chronological view of all events grouped by day |
| **Prompts** | Browse and delete saved prompts |
| **Empty Sessions** | Manage sessions without observations with bulk delete |
| **Compare** | Side-by-side comparison of two sessions |

### 🔍 Advanced Filtering & Search

- **Full-text search** across titles, content, and projects
- **Type filters** with emojis: 🐛 bugfix, 📋 decision, 🏗️ architecture, 💡 discovery, ♻️ pattern, ⚙️ config, ❤️ preference, 📚 learning
- **Scope filters**: shared (project), user (personal)
- **Project filter** dropdown in header with color-coded badges
- **Date range filters**: Today, This Week, This Month, All Time, or pick a Specific Date
- **Search within sessions** for specific observations

### ✏️ Inline Editing

Edit any observation directly from the Memories, Topics, or Timeline tabs:
- **Title** - rename observations
- **Content** - update the markdown content
- **Type** - change the observation type
- **Scope** - switch between shared/user
- **Topic** - assign or change topic keys

### 🎛️ Header Controls

- **Health Indicator** - real-time Engram connection status (green pulse = online, red = offline)
- **Auto-refresh Toggle** - enable/disable automatic data refresh
- **Project Filter** - quickly filter any tab by specific project
- **Language Selector** - switch between Spanish, English, Portuguese
- **Theme Toggle** - dark/light mode

### ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `?` | Show keyboard shortcuts help |
| `/` | Focus search input |
| `Esc` | Close modals |

### 📊 Enhanced API Logs Panel

- **Collapsible panel** (click to show/hide)
- **Color-coded entries**: blue for requests, green for responses, red for errors
- **Method highlighting**: GET (green), POST (yellow), PATCH/PUT (orange), DELETE (red)
- **Status badges** with semantic coloring
- **Duration tracking** for each request
- **Data preview** for request/response bodies
- **Clear logs** button
- **Auto-scroll** to latest entries
- **100 entry limit** with count display

### 💾 Data Management

- **Export Data** - download all observations as JSON or Markdown
- **Import Data** - restore from previously exported JSON files
- **Merge Projects** - move observations from one project to another
- **Session Comparison** - find shared and unique observations between any two sessions

---

## 🚀 Getting Started

### Prerequisites

Ensure Engram is running at `localhost:7437`

### Option 1: Download Pre-built Binary (Recommended)

1. Download `EngramDesktopView-1.0.0-win.zip` from [Releases](https://github.com/TatsumiDaku/engram-desktop-view/releases/latest)
2. Extract the ZIP to any folder
3. Run `EngramDesktopView.exe`
4. Done!

### Option 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/TatsumiDaku/engram-desktop-view.git
cd engram-desktop-view

# Install dependencies
npm install

# Build
npm run tauri build
```

The executable will be in `src-tauri/target/release/bundle/`

---

## 🐧 Linux

See [INSTALL.md](INSTALL.md) for Linux installation instructions.

---

## 🏗️ Architecture & Technologies

| Layer | Technology |
|-------|------------|
| **Frontend** | React + TypeScript + TailwindCSS |
| **Desktop Runtime** | Tauri v2 (Rust) |
| **State Management** | Zustand + TanStack Query |
| **Memory Backend** | [Engram](https://github.com/Gentleman-Programming/engram) |
| **Internationalization** | react-i18next (ES/EN/PT) |

---

## 🤝 Contributing

Issues and pull requests are welcome!

---

## 📄 License

MIT

---

<p align="center">
🎩 EngramDesktopView • TatsumiDaku
</p>
