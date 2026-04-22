<img src=".github/BannerEngramDesktop.png" alt="EngramDesktopView" width="100%" />

# 🎩 EngramDesktopView

> Real-time dashboard for monitoring your Engram memory agent. Built with Electron.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-33.4-?logo=electron)](https://electronjs.org)

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

## 📥 Installation

### Prerequisites

Ensure Engram is running at `localhost:7437` before launching the app.

---

### 🪟 Windows

#### Option 1: Installer (Recommended)

1. Download `EngramDesktopView-Setup-1.1.0.exe` from [Releases](https://github.com/TatsumiDaku/engram-desktop-view/releases/latest)
2. Run the installer
3. Follow the installation wizard
4. Launch from Start Menu or Desktop shortcut

#### Option 2: Portable (ZIP)

1. Download `EngramDesktopView-1.1.0-win.zip` from [Releases](https://github.com/TatsumiDaku/engram-desktop-view/releases/latest)
2. Extract to any folder (e.g., `C:\Programs\EngramDesktopView`)
3. Run `EngramDesktopView.exe`
4. (Optional) Create a shortcut manually

#### Windows Store (Scoop)

```powershell
scoop bucket add extras
scoop install engram-desktop-view
```

---

### 🍎 macOS

#### Intel & Apple Silicon

1. Download `EngramDesktopView-1.1.0.dmg` from [Releases](https://github.com/TatsumiDaku/engram-desktop-view/releases/latest)
2. Open the DMG file
3. Drag `EngramDesktopView.app` to Applications
4. Eject the DMG
5. Launch from Applications (first launch may require right-click → Open)

#### Homebrew (Coming Soon)

```bash
brew install --cask engram-desktop-view
```

---

### 🐧 Linux

#### Ubuntu / Debian (deb)

```bash
# Download the .deb package
wget https://github.com/TatsumiDaku/engram-desktop-view/releases/download/v1.1.0/EngramDesktopView-1.1.0.amd64.deb

# Install
sudo dpkg -i EngramDesktopView-1.1.0.amd64.deb

# Install dependencies if needed
sudo apt-get install -f

# Launch
engram-desktop-view
```

#### Fedora / RHEL / CentOS (rpm)

```bash
# Download the .rpm package
wget https://github.com/TatsumiDaku/engram-desktop-view/releases/download/v1.1.0/EngramDesktopView-1.1.0.x86_64.rpm

# Install
sudo rpm -i EngramDesktopView-1.1.0.x86_64.rpm

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

#### AppImage (Universal)

```bash
# Download AppImage
wget https://github.com/TatsumiDaku/engram-desktop-view/releases/download/v1.1.0/EngramDesktopView-1.1.0.AppImage

# Make executable
chmod +x EngramDesktopView-1.1.0.AppImage

# Run
./EngramDesktopView-1.1.0.AppImage
```

#### openSUSE

```bash
# Download rpm
sudo zypper install EngramDesktopView-1.1.0.x86_64.rpm
```

#### Flatpak

```bash
flatpak install flathub com.engram.DesktopView
flatpak run com.engram.DesktopView
```

---

### 📦 Portable Linux AppImage Instructions

AppImage is a portable format that works on most distributions without installation:

```bash
# 1. Download the AppImage
wget https://github.com/TatsumiDaku/engram-desktop-view/releases/download/v1.1.0/EngramDesktopView-1.1.0.AppImage

# 2. Make it executable
chmod +x EngramDesktopView-1.1.0.AppImage

# 3. Run it (no installation needed)
./EngramDesktopView-1.1.0.AppImage

# Optional: Create a desktop shortcut
cat > ~/.local/share/applications/engram-desktop-view.desktop << EOF
[Desktop Entry]
Name=EngramDesktopView
Exec=/path/to/EngramDesktopView-1.1.0.AppImage
Type=Application
EOF
```

---

## 🔧 Troubleshooting

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
./EngramDesktopView-1.1.0.AppImage --no-sandbox
```

### macOS: "App is damaged"

```bash
xattr -cr /Applications/EngramDesktopView.app
```

---

## Fixing Electron "failed to install correctly"

If you encounter the "Electron failed to install correctly" error:

1. Clear Electron cache:
   ```bash
   pnpm exec electron-builder install-app-deps
   # OR manually (PowerShell):
   Remove-Item -Recurse -Force $env:APPDATA\electron\Cache
   Remove-Item -Recurse -Force $env:LOCALAPPDATA\electron\Cache
   ```

2. Reinstall electron:
   ```bash
   Remove-Item -Recurse -Force node_modules\electron
   pnpm add -D electron@33.4.11
   ```

---

## 🏗️ Build from Source

### Prerequisites

- Node.js 20+
- pnpm 9+
- Git

### Clone & Build

```bash
# Clone the repository
git clone https://github.com/TatsumiDaku/engram-desktop-view.git
cd engram-desktop-view

# Install dependencies
pnpm install

# Development mode
pnpm run dev

# In another terminal, run Electron
pnpm run build:electron && electron .
```

### Production Build

```bash
# Windows
pnpm run electron:build:win

# Linux
pnpm run electron:build:linux

# macOS
pnpm run electron:build:mac
```

The executable will be in `release/` directory.

---

## 🏗️ Architecture & Technologies

| Layer | Technology |
|-------|------------|
| **Frontend** | React + TypeScript + TailwindCSS |
| **Desktop Runtime** | Electron 33 |
| **State Management** | Zustand + TanStack Query |
| **Memory Backend** | [Engram](https://github.com/Gentleman-Programming/engram) |
| **Internationalization** | react-i18next (ES/EN/PT) |
| **Build Tool** | Vite + electron-builder |

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