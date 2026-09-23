@echo off
REM ============================================================
REM  Desktop build inside a proper MSVC developer environment.
REM  vcvars64 puts link.exe + LIB/INCLUDE at the FRONT of PATH,
REM  which also fixes Git Bash's GNU link.exe shadowing rustc.
REM  Usage: scripts\build-desktop.cmd  (extra args pass to tauri)
REM ============================================================
setlocal enabledelayedexpansion

for /f "usebackq tokens=*" %%i in (`"C:\Program Files (x86)\Microsoft Visual Studio\Installer\vswhere.exe" -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath`) do set "VSROOT=%%i"

if not defined VSROOT (
  echo [build-desktop] VS Build Tools with C++ workload not found.
  echo Install: winget install --id Microsoft.VisualStudio.2019.BuildTools -e --override "--add Microsoft.VisualStudio.Component.VC.Tools.x86.x64"
  exit /b 1
)

call "!VSROOT!\VC\Auxiliary\Build\vcvars64.bat" >nul
if errorlevel 1 exit /b 1

set "PATH=%PATH%;%USERPROFILE%\.cargo\bin"
cd /d "%~dp0.."

npx tauri build %*
exit /b %errorlevel%
