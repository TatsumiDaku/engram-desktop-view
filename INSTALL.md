# 📥 Guia de Instalacion

## Windows

### Opcion 1: Descargar el .exe (Recomendado)

1. Descarga `EngramDesktopView-1.0.0-win.zip` desde [Releases](https://github.com/TatsumiDaku/engram-desktop-view/releases/latest)
2. Extrae el ZIP en cualquier carpeta
3. Abre `EngramDesktopView.exe`
4. Listo!

### Opcion 2: Compilar tu mismo

```bash
git clone https://github.com/TatsumiDaku/engram-desktop-view.git
cd engram-desktop-view
npm install
npm run tauri build
```

El .exe estará en `src-tauri/target/release/bundle/`

---

## 🐧 Linux

### Compilar desde codigo

```bash
# Instala Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Dependencias del sistema
# Ubuntu/Debian:
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf

# Fedora:
sudo dnf install webkit2gtk4.1-devel libappindicator-gtk3-devel librsvg2-devel patchelf

# Compila
git clone https://github.com/TatsumiDaku/engram-desktop-view.git
cd engram-desktop-view
npm install
npm run tauri build
```

El AppImage estará en `src-tauri/target/release/bundle/appimage/`

---

## ✅ Requisitos

| Requisito | Minimo |
|-----------|--------|
| OS | Windows 10+ / Ubuntu 20.04+ / Fedora 34+ |
| RAM | 4 GB |
| Espacio | 100 MB |
| Engram | Corriendo en localhost:7437 |

---

## 🚀 Primer inicio

1. Asegurate de que Engram esté corriendo: `npx engram`
2. Abre `EngramDesktopView.exe`
3. Listo!

---

## ❓ Problemas?

- **"Engram esta offline"** - Verifica que Engram esté corriendo en `localhost:7437`
- **La app no abre** - Espera unos segundos, es normal
- **UI rota** - Descarga la ultima version

---

## 🔄 Actualizar

1. Descarga el nuevo release
2. Cierra la app
3. Reemplaza los archivos viejos
4. Listo!

## 🗑️ Desinstalar

Borra la carpeta. No modifica nada del sistema.

---

<p align="center">
🧔‍♂️ EngramDesktopView • TatsumiDaku
</p>
