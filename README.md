<img src=".github/BannerEngramDesktop.png" alt="EngramDesktopView" width="100%" />

# 🎩 EngramDesktopView

> Real-time dashboard for monitoring your Engram memory agent. Built with Electron.

[![Version](https://img.shields.io/badge/version-v1.2.3-blue.svg)](https://github.com/TatsumiDaku/engram-desktop-view/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-33.4-?logo=electron)](https://electronjs.org)
[![Auto-Update](https://img.shields.io/badge/Auto--Update-electron--updater-green.svg)](https://github.com/electron/electron-updater)

🧔‍♂️ Made with ❤️ for the [Gentleman Programming](https://github.com/Gentleman-Programming/engram) community

---

## ✨ Features

### 🚀 Auto-Update System

Never miss a release. EngramDesktopView automatically checks for updates and lets you install with one click via the **UpdateDropdown** UI:

- 🔍 Automatic update checks on startup
- 📥 Download progress with real-time percentage
- ⬇️ Manual "Check for Updates" option in the UI
- 🔄 Install & Restart — updates are applied on the next launch

> Built with [electron-updater](https://www.electron.build/auto-update) for seamless GitHub releases.

### 🖥️ System Tray Integration

EngramDesktopView lives in your system tray for quick access:

- **Minimize to tray** — closing the window keeps the app running in the background
- **Tray menu** — right-click for quick actions (Show, Quit)
- **Double-click tray icon** — restore the window
- **Persistent** — app continues running even when all windows are closed

### 🌍 Multi-Language Support (i18n)

Your memory dashboard speaks your language:

| Language | Code |
|----------|------|
| 🇪🇸 Español | `es` |
| 🇬🇧 English | `en` |
| 🇧🇷 Português | `pt` |

Switch languages instantly from the header selector. All UI strings, dates, and formats adapt to your locale.

### 🎨 Dark & Light Theme

Two beautiful themes to match your workflow:

- **Dark mode** (default) — deep navy tones for low-light environments
- **Light mode** — clean whites for bright setups

Toggle with a single click in the header. Theme preference is persisted.

### 💚 Health Indicator

Real-time connection status to your Engram backend:

- 🟢 **Green pulse** — Engram is connected and healthy
- 🔴 **Red indicator** — connection lost or Engram unreachable

The health indicator polls `localhost:7437` and updates automatically. No more guessing if your memory agent is running.

---

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

## 📥 Installation

### Prerequisites

Ensure Engram is running at `localhost:7437` before launching the app.

---

### 🪟 Windows

#### Option 1: NSIS Installer (Recommended)

1. Download `EngramDesktopView Setup 1.2.3.exe` from [Releases](https://github.com/TatsumiDaku/engram-desktop-view/releases/download/v1.2.3/EngramDesktopView.Setup.1.2.3.exe)
2. Run the installer
3. Follow the installation wizard
4. Launch from Start Menu or Desktop shortcut

#### Option 2: Portable (ZIP)

1. Download `EngramDesktopView-1.2.3-win.zip` from [Releases](https://github.com/TatsumiDaku/engram-desktop-view/releases/latest)
2. Extract to any folder (e.g., `C:\Programs\EngramDesktopView`)
3. Run `EngramDesktopView.exe`
4. (Optional) Create a shortcut manually

#### Option 3: Scoop

```powershell
# Add your own bucket (required for this app)
scoop bucket add engram-desktop https://github.com/TatsumiDaku/engram-desktop-view
scoop install engram-desktop-view
```

---

### 🍎 macOS

#### Intel & Apple Silicon

1. Download `EngramDesktopView-1.2.3-mac.zip` from [Releases](https://github.com/TatsumiDaku/engram-desktop-view/releases/latest)
2. Extract the ZIP
3. Drag `EngramDesktopView.app` to Applications
4. Launch from Applications (first launch may require right-click → Open)

> **Note:** macOS may show "App is damaged" — run: `xattr -cr /Applications/EngramDesktopView.app`

---

### 🐧 Linux

#### AppImage (Universal)

```bash
# Download AppImage
wget https://github.com/TatsumiDaku/engram-desktop-view/releases/download/v1.2.3/EngramDesktopView-1.2.3.AppImage

# Make executable
chmod +x EngramDesktopView-1.2.3.AppImage

# Run (no installation needed)
./EngramDesktopView-1.2.3.AppImage

# Optional: Create a desktop shortcut
cat > ~/.local/share/applications/engram-desktop-view.desktop << 'EOF'
[Desktop Entry]
Name=EngramDesktopView
Exec=/path/to/EngramDesktopView-1.2.3.AppImage
Type=Application
EOF
```

#### Ubuntu / Debian (deb)

```bash
# Download the .deb package
wget https://github.com/TatsumiDaku/engram-desktop-view/releases/download/v1.2.3/EngramDesktopView-1.2.3.amd64.deb

# Install
sudo dpkg -i EngramDesktopView-1.2.3.amd64.deb

# Install dependencies if needed
sudo apt-get install -f

# Launch
engram-desktop-view
```

#### Fedora / RHEL / CentOS (rpm)

```bash
# Download the .rpm package
wget https://github.com/TatsumiDaku/engram-desktop-view/releases/download/v1.2.3/EngramDesktopView-1.2.3.x86_64.rpm

# Install
sudo rpm -i EngramDesktopView-1.2.3.x86_64.rpm

# Launch
engram-desktop-view
```

#### Arch Linux (AUR)

```bash
# Using yay or paru
yay -S engram-desktop-view

# Or manual installation from AUR
git clone https://aur.archlinux.org/engram-desktop-view.git
cd engram-desktop-view
makepkg -si
```

#### openSUSE

```bash
sudo zypper install EngramDesktopView-1.2.3.x86_64.rpm
```

#### Flatpak

```bash
flatpak install flathub com.engram.DesktopView
flatpak run com.engram.DesktopView
```

---

## 🔧 Development

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start Vite frontend dev server (localhost:5173) |
| `pnpm run dev:electron` | Full dev mode: Vite + Electron running concurrently |
| `pnpm run build` | Production build: Vite + Electron bundled |
| `pnpm run electron:build:win` | Build Windows executable |
| `pnpm run electron:build:mac` | Build macOS app |
| `pnpm run electron:build:linux` | Build Linux packages |
| `pnpm run test` | Run Vitest unit tests |
| `pnpm run test:watch` | Watch mode for tests |

### Recommended Dev Workflow

```bash
# Start full Electron dev mode with hot-reload
pnpm run dev:electron
```

This uses `concurrently` to run Vite and Electron together with hot-reload.

> ⚠️ `pnpm run electron:dev` is deprecated — it builds the production bundle first. Use `pnpm run dev:electron` instead.

---

## 🏗️ Build from Source

### Prerequisites

- **Node.js** 20+
- **pnpm** 9+
- **Git**

### Clone & Build

```bash
# Clone the repository
git clone https://github.com/TatsumiDaku/engram-desktop-view.git
cd engram-desktop-view

# Install dependencies
pnpm install

# Production build for your platform
pnpm run build && pnpm run electron:build
```

### Platform-Specific Builds

```bash
# Windows (NSIS installer + ZIP)
pnpm run electron:build:win

# macOS (ZIP)
pnpm run electron:build:mac

# Linux (AppImage + deb)
pnpm run electron:build:linux
```

The executables will be in the `release/` directory.

---

## 🔍 Troubleshooting

### Linux: "Unable to find suitable destination"

```bash
# If dpkg fails with this error, run:
sudo apt-get install -f
```

### Linux: Missing libgtk

```bash
# Ubuntu/Debian
sudo apt install libgtk-3-0 libnotify4 libnss3 libxss1

# Fedora
sudo dnf install gtk3 libnotify nss-libs
```

### Linux: AppImage won't run

```bash
# Install FUSE (Filesystem in Userspace)
sudo apt install fuse

# If still failing, try with --no-sandbox
./EngramDesktopView-1.2.3.AppImage --no-sandbox
```

### macOS: "App is damaged"

```bash
xattr -cr /Applications/EngramDesktopView.app
```

### pnpm v10: Build Scripts Blocked

If you see an `approve-builds` error with pnpm v10:

```bash
# Run the installer without prompts
pnpm install --approve-builds

# Or approve globally
pnpm approve-builds --global
```

### Fixing Electron "failed to install correctly"

If you encounter the "Electron failed to install correctly" error:

1. Clear Electron cache:
   ```bash
   pnpm exec electron-builder install-app-deps
   ```

2. Or manually (PowerShell):
   ```powershell
   Remove-Item -Recurse -Force $env:APPDATA\electron\Cache
   Remove-Item -Recurse -Force $env:LOCALAPPDATA\electron\Cache
   ```

---

## 📋 System Requirements

| Requirement | Value |
|-------------|-------|
| **Engram Backend** | Must be running at `localhost:7437` |
| **Operating System** | Windows 10+, macOS 10.15+, Linux (glibc 2.31+) |
| **RAM** | 4GB minimum |
| **Disk Space** | 200MB for installation |

---

## 🏗️ Architecture & Technologies

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | UI components and state |
| **Styling** | TailwindCSS | Utility-first styling |
| **Desktop Runtime** | Electron 33 | Cross-platform desktop shell |
| **State Management** | Zustand + TanStack Query | Client state + server caching |
| **Memory Backend** | [Engram](https://github.com/Gentleman-Programming/engram) | Persistent memory storage |
| **i18n** | react-i18next | Multi-language (ES/EN/PT) |
| **Auto-Update** | electron-updater | GitHub release updates |
| **Build Tool** | Vite + electron-builder | Fast dev + cross-platform builds |
| **Testing** | Vitest + Playwright | Unit + E2E tests |

---

## 🤝 Contributing

Issues and pull requests are welcome!

---

## 📄 License

MIT

---

<p align="center">
🎩 EngramDesktopView • TatsumiDaku • v1.2.3
</p>
