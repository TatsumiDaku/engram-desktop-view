# 📥 EngramDesktopView Installation Guide

This file contains detailed installation instructions for Linux distributions.

---

## 🐧 Ubuntu / Debian

### Using .deb package

```bash
# Download the latest release
wget https://github.com/TatsumiDaku/engram-desktop-view/releases/download/v1.1.0/EngramDesktopView-1.1.0.amd64.deb

# Install the package
sudo dpkg -i EngramDesktopView-1.1.0.amd64.deb

# If you get dependency errors, fix them with:
sudo apt-get install -f

# Launch the app
engram-desktop-view
```

### Using AppImage (No installation required)

```bash
# Download AppImage
wget https://github.com/TatsumiDaku/engram-desktop-view/releases/download/v1.1.0/EngramDesktopView-1.1.0.AppImage

# Make executable
chmod +x EngramDesktopView-1.1.0.AppImage

# Run directly
./EngramDesktopView-1.1.0.AppImage
```

---

## 🔴 Fedora / RHEL / CentOS

### Using .rpm package

```bash
# Download the latest release
wget https://github.com/TatsumiDaku/engram-desktop-view/releases/download/v1.1.0/EngramDesktopView-1.1.0.x86_64.rpm

# Install with dnf (recommended)
sudo dnf install EngramDesktopView-1.1.0.x86_64.rpm

# Or with rpm
sudo rpm -i EngramDesktopView-1.1.0.x86_64.rpm

# Launch
engram-desktop-view
```

---

## 🟢 openSUSE

```bash
# Download rpm
wget https://github.com/TatsumiDaku/engram-desktop-view/releases/download/v1.1.0/EngramDesktopView-1.1.0.x86_64.rpm

# Install
sudo zypper install EngramDesktopView-1.1.0.x86_64.rpm

# Launch
engram-desktop-view
```

---

## 🔵 Arch Linux

### Using AUR (with yay/paru)

```bash
# Using yay
yay -S engram-desktop-view

# Or using paru
paru -S engram-desktop-view
```

### Manual AUR installation

```bash
# Clone the AUR repository
git clone https://aur.archlinux.org/engram-desktop-view.git
cd engram-desktop-view

# Build and install
makepkg -si

# Launch
engram-desktop-view
```

---

## 📦 AppImage (All Distributions)

AppImage is a portable format that works on virtually any Linux distribution without installation or root privileges.

### Installation

```bash
# Download the AppImage
wget https://github.com/TatsumiDaku/engram-desktop-view/releases/download/v1.1.0/EngramDesktopView-1.1.0.AppImage

# Make it executable
chmod +x EngramDesktopView-1.1.0.AppImage
```

### Running

```bash
# Run directly from terminal
./EngramDesktopView-1.1.0.AppImage
```

### Creating a desktop shortcut

```bash
# Create application entry
cat > ~/.local/share/applications/engram-desktop-view.desktop << 'EOF'
[Desktop Entry]
Name=EngramDesktopView
Comment=Real-time dashboard for Engram memory agent
Exec=/path/to/EngramDesktopView-1.1.0.AppImage
Type=Application
Categories=Utility;
Icon=utilities-system-monitor
Terminal=false
EOF
```

---

## 🐧 Common Linux Issues

### Missing dependencies

If the app won't start due to missing libraries:

```bash
# Ubuntu/Debian
sudo apt install libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 libasound2

# Fedora
sudo dnf install gtk3 libnotify nss-libs libXScrnSaver alsa-lib

# Arch
sudo pacman -S gtk3 libnotify nss libxss alsa-lib
```

### AppImage FUSE issues

If AppImage fails to mount:

```bash
# Install FUSE
sudo apt install fuse

# If still failing, try with --no-sandbox flag
./EngramDesktopView-1.1.0.AppImage --no-sandbox
```

### Wayland display issues

If using Wayland and the app shows a blank window:

```bash
# Run with X11
ELECTRON_OZONE_PLATFORM_HINT=auto ./EngramDesktopView-1.1.0.AppImage
```

---

## 🔧 Build from Source

### Prerequisites

- Node.js 20+
- pnpm 9+
- Git

```bash
git clone https://github.com/TatsumiDaku/engram-desktop-view.git
cd engram-desktop-view
pnpm install
pnpm run electron:build:linux
```

The output will be in `release/`.

---

For other issues, please open an issue on GitHub: https://github.com/TatsumiDaku/engram-desktop-view/issues