# 📥 Installation Guide

## Windows

### Option 1: Download the Binary (Recommended)

1. Download `EngramDesktopView-1.0.0-win.zip` from [Releases](https://github.com/TatsumiDaku/engram-desktop-view/releases/latest)
2. Extract the ZIP to any folder
3. Run `EngramDesktopView.exe`
4. Done!

### Option 2: Build from Source

```bash
git clone https://github.com/TatsumiDaku/engram-desktop-view.git
cd engram-desktop-view
npm install
npm run tauri build
```

The executable will be in `src-tauri/target/release/bundle/`

---

## 🐧 Linux

### Build from Source

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# System dependencies
# Ubuntu/Debian:
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf

# Fedora:
sudo dnf install webkit2gtk4.1-devel libappindicator-gtk3-devel librsvg2-devel patchelf

# Build
git clone https://github.com/TatsumiDaku/engram-desktop-view.git
cd engram-desktop-view
npm install
npm run tauri build
```

The AppImage will be in `src-tauri/target/release/bundle/appimage/`

---

## ✅ Requirements

| Requirement | Minimum |
|-------------|---------|
| OS | Windows 10+ / Ubuntu 20.04+ / Fedora 34+ |
| RAM | 4 GB |
| Disk Space | 100 MB |
| Engram | Running at localhost:7437 |

---

## 🚀 First Launch

1. Make sure Engram is running: `npx engram`
2. Open `EngramDesktopView.exe`
3. Done!

---

## ❓ Troubleshooting

- **"Engram is offline"** - Verify Engram is running at `localhost:7437`
- **App doesn't open** - Wait a few seconds, it's normal
- **UI looks broken** - Download the latest release

---

## 🔄 Updating

1. Download the new release
2. Close the app
3. Replace the old files
4. Done!

---

## 🗑️ Uninstalling

Simply delete the folder. No system modifications are made.

---

<p align="center">
🧔 EngramDesktopView • TatsumiDaku
</p>
