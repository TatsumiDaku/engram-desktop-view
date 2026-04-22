; NSIS Template for EngramDesktopView
; Dark Neon Purple Theme
; Uses MUI2.nsh for Modern UI 2

!include "MUI2.nsh"

; ============================================
; COLORS & THEMING
; ============================================
; Dark background: #0a0a0f
; Neon purple accent: #a855f7
; Purple glow effects on UI elements

; --------------------------------------------
; Custom Colors
; --------------------------------------------
!define MUI_BGCOLOR "0a0a0f"
!define MUI_TEXTCOLOR "ffffff"
!define MUI_ACCENTCOLOR "a855f7"

; --------------------------------------------
; Header Bitmap (150x57 pixels, 24-bit BMP)
; Placeholder: electron-builder will use default if not provided
; --------------------------------------------
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Header\nsis3-bg.bmp"
!define MUI_HEADERIMAGE_WIDTH 150
!define MUI_HEADERIMAGE_HEIGHT 57

; --------------------------------------------
; Welcome/Finish Page Graphics
; --------------------------------------------
!define MUI_WELCOMEFINISHPAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Wizard\win.bmp"

; ============================================
; INTERFACE SETTINGS
; ============================================
!define MUI_ABORTWARNING
!define MUI_ICON "${BUILD_DIR}\icon.ico"
!define MUI_UNICON "${BUILD_DIR}\icon.ico"

; --------------------------------------------
;Installer attributes
; --------------------------------------------
Name "EngramDesktopView"
OutFile "EngramDesktopView-Setup.exe"
InstallDir "$PROGRAMFILES64\EngramDesktopView"
InstallDirRegKey HKLM "Software\EngramDesktopView" "InstallDir"
RequestExecutionLevel admin

; ============================================
; PAGES
; ============================================

; --------------------------------------------
; License Page (uncomment when LICENSE available)
; --------------------------------------------
; !insertmacro MUI_PAGE_LICENSE "LICENSE.txt"

; --------------------------------------------
; Directory Selection Page
; (not one-click installer)
; --------------------------------------------
!insertmacro MUI_PAGE_DIRECTORY

; --------------------------------------------
; Install Files Page
; --------------------------------------------
!insertmacro MUI_PAGE_INSTFILES

; --------------------------------------------
; Finish Page
; --------------------------------------------
!insertmacro MUI_PAGE_FINISH

; --------------------------------------------
; Uninstaller Pages
; --------------------------------------------
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; ============================================
; LANGUAGES
; ============================================
!insertmacro MUI_LANGUAGE "English"

; ============================================
; INSTALLATION SECTION
; ============================================
Section "Install" SecInstall
	SetOutPath $INSTDIR

	; Copy all files from build output
	File /r "release\win-unpacked\*.*"

	; Create uninstaller
	WriteUninstaller "$INSTDIR\Uninstall.exe"

	; Create Start Menu shortcuts
	CreateDirectory "$SMPROGRAMS\EngramDesktopView"
	CreateShortcut "$SMPROGRAMS\EngramDesktopView\EngramDesktopView.lnk" "$INSTDIR\EngramDesktopView.exe"
	CreateShortcut "$SMPROGRAMS\EngramDesktopView\Uninstall.lnk" "$INSTDIR\Uninstall.exe"

	; Create Desktop shortcut
	CreateShortcut "$DESKTOP\EngramDesktopView.lnk" "$INSTDIR\EngramDesktopView.exe"

	; Write registry keys for uninstaller
	WriteRegStr HKLM "Software\EngramDesktopView" "InstallDir" "$INSTDIR"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\EngramDesktopView" "DisplayName" "EngramDesktopView"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\EngramDesktopView" "UninstallString" '"$INSTDIR\Uninstall.exe"'
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\EngramDesktopView" "DisplayIcon" "$INSTDIR\EngramDesktopView.exe"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\EngramDesktopView" "Publisher" "TatsumiDaku"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\EngramDesktopView" "DisplayVersion" "${APP_VERSION}"

SectionEnd

; ============================================
; UNINSTALLATION SECTION
; ============================================
Section "Uninstall"
	; Remove files
	Delete "$INSTDIR\*.*"
	RMDir /r "$INSTDIR"

	; Remove Start Menu shortcuts
	Delete "$SMPROGRAMS\EngramDesktopView\*.*"
	RMDir "$SMPROGRAMS\EngramDesktopView"

	; Remove Desktop shortcut
	Delete "$DESKTOP\EngramDesktopView.lnk"

	; Remove registry keys
	DeleteRegKey HKLM "Software\EngramDesktopView"
	DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\EngramDesktopView"
SectionEnd

; ============================================
; CUSTOM FUNCTIONS
; ============================================
Function .onInit
	; Ensure dark theme is applied
	System::Call 'user32::SetLayeredWindowAttribute(i $HWNDPARENT, 0, i 0x0a0a0f, 0x1)'
FunctionEnd

Function un.onInit
	; Same for uninstaller
	System::Call 'user32::SetLayeredWindowAttribute(i $HWNDPARENT, 0, i 0x0a0a0f, 0x1)'
FunctionEnd