# 📥 Installation Guide

## Windows

### Option 1: Pre-built Release (Recommended)

1. Go to the [Releases](https://github.com/TatsumiDaku/engram-desktop-view/releases) page
2. Download `EngramDesktopView-x.x.x-win.zip` (latest version)
3. Extract the ZIP file to any folder, for example:
   - `C:\Programs\EngramDesktopView`
   - `C:\Users\YourName\Desktop\EngramDesktopView`
4. Make sure [Engram](https://github.com/Gentleman-Programming/engram) is running on your computer
5. Double-click `EngramDesktopView.exe` to launch

### Option 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/TatsumiDaku/engram-desktop-view.git
cd engram-desktop-view

# Install dependencies
npm install

# Build the application
npm run tauri build

# Find the executable in:
# src-tauri/target/release/bundle/
```

---

## System Requirements

| Requirement | Minimum |
|-------------|---------|
| OS | Windows 10 or later |
| RAM | 4 GB |
| Disk Space | 100 MB |
| Engram | Running on localhost:7437 |

---

## First Launch

1. **Start Engram** - Make sure the Engram server is running:
   ```bash
   npx engram
   # or
   engram run
   ```

2. **Launch EngramDesktopView** - Double-click the executable

3. **Verify Connection** - You should see the Home tab with "🧔‍♂️ Built for the Gentleman Community"

---

## Troubleshooting

### "Engram is offline" message
- Make sure Engram is running: `npx engram`
- Check that Engram is accessible at `http://127.0.0.1:7437`

### App doesn't start
- Check Windows SmartScreen settings
- The app may need a few seconds to initialize
- Try running as Administrator if you encounter permission issues

### Icons or UI look broken
- Make sure you're using the latest release
- Try clearing localStorage if settings seem corrupted

---

## Updating

To update to a new version:
1. Download the new release ZIP
2. Close the current running application
3. Extract the new ZIP, replacing the old files
4. Launch `EngramDesktopView.exe`

---

## Uninstallation

Simply delete the folder where you extracted the ZIP. No system files are modified.

---

## Support

- 🐛 [Report bugs](https://github.com/TatsumiDaku/engram-desktop-view/issues)
- 💬 [Discussions](https://github.com/TatsumiDaku/engram-desktop-view/discussions)
- 📖 [Documentation](README.md)

---

<p align="center">
  🧔‍♂️ EngramDesktopView • Made for the Gentleman Programming Community
</p>