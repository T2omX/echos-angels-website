#!/usr/bin/env bash
cd "$(dirname "$0")"
echo "Starting Echo's Angels website preview at http://localhost:8080"
if command -v python3 >/dev/null 2>&1; then
  (sleep 1; python3 -c "import webbrowser; webbrowser.open('http://localhost:8080')") &
  python3 -m http.server 8080
else
  echo "Python3 not found. Open index.html directly."
fi
