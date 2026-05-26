@echo off
title Echo's Angels Website Preview
cd /d "%~dp0"
echo Starting Echo's Angels website preview...
echo.
echo If your browser does not open automatically, go to: http://localhost:8080
echo Close this window when you are done previewing the site.
echo.
where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8080
  python -m http.server 8080
  goto end
)
where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8080
  py -m http.server 8080
  goto end
)
echo Python was not found. Opening index.html directly instead.
echo The site includes an offline fallback, so it should still display.
start "" "%~dp0index.html"
pause
:end
