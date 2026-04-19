<img src=".github/banner.png" alt="EngramDesktopView" width="100%" />

# 🎩 EngramDesktopView

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/v/release/TatsumiDaku/engram-desktop-view)](https://github.com/TatsumiDaku/engram-desktop-view/releases)
[![Tauri v2](https://img.shields.io/badge/Tauri-2.0-?logo=tauri)](https://tauri.app)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org)

Desktop dashboard to monitor and explore Engram memory events in real-time with system tray support, multi-language interface, and dark/light theme.

<p align="center">
  🧔‍♂️ Made with ❤️ for the <a href="https://github.com/Gentleman-Programming/engram">Gentleman Programming</a> community
</p>

---

## ✨ Features

- 📊 **Sessions Dashboard** - View all agent sessions with date filters (Today/Week/Month/All)
- 🧠 **Memory Observations** - Browse and search through all memory entries
- 🏷️ **Topics Organization** - Observations grouped by topic keywords
- 📅 **Timeline View** - Chronological view of all memory events
- 💬 **Prompts History** - Access saved prompts from your agents
- 🗑️ **Empty Sessions Manager** - Verify and delete sessions with zero observations
- 🌐 **Multi-language** - English, Spanish, Portuguese support
- 🌓 **Theme Toggle** - Dark and Light mode with persistent preference
- 🔔 **System Tray** - Minimize to tray, quick access menu
- 💾 **Persistent Settings** - Your preferences are saved automatically

---

## 🚀 Quick Start

### Prerequisites

- [Engram](https://github.com/Gentleman-Programming/engram) running on `localhost:7437`
- Windows 10+ (for pre-built release)

### Installation

#### Option 1: Pre-built Release (Recommended)

1. Download the latest release from [Releases](https://github.com/TatsumiDaku/engram-desktop-view/releases)
2. Extract the ZIP file to your desired location
3. Run `EngramDesktopView.exe`

#### Option 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/TatsumiDaku/engram-desktop-view.git
cd engram-desktop-view

# Install dependencies
npm install

# Start development mode
npm run tauri dev

# Or build for production
npm run tauri build
```

---

## 🖥️ Screenshots

<details>
<summary>Click to view screenshots</summary>

### Home Dashboard
![Home](.github/screenshots/home.png)

### Sessions Tab
![Sessions](.github/screenshots/sessions.png)

### Dark Mode
![Dark Mode](.github/screenshots/dark-mode.png)

</details>

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript |
| Styling | TailwindCSS |
| Build Tool | Vite |
| Desktop | Tauri v2 (Rust) |
| State | Zustand |
| Data Fetching | TanStack Query |
| i18n | react-i18next |
| Memory Backend | [Engram](https://github.com/Gentleman-Programming/engram) |

---

## 📝 User Guide

### Navigation
- **Home** - Welcome page with app info
- **Sessions** - Browse all agent sessions
- **Memories** - View individual memory observations
- **Topics** - Grouped by topic keywords
- **Timeline** - Chronological event view
- **Prompts** - Saved prompts history
- **Empty Sessions** - Manage empty session cleanup

### Date Filters
In Sessions tab, filter by:
- **Today** - Sessions created today
- **This Week** - Sessions from the last 7 days
- **This Month** - Sessions from the last 30 days
- **All Time** - All sessions

### Theme & Language
Use the controls in the tab bar to:
- Toggle between Dark/Light mode
- Switch language (EN/ES/PT)

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is MIT licensed.

---

## 👤 Author

**TatsumiDaku** - [GitHub Profile](https://github.com/TatsumiDaku)

Full Stack Developer

---

<p align="center">
  🧔‍♂️ EngramDesktopView • Built for the Gentleman Programming Community
</p>