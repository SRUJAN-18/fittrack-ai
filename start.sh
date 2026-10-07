#!/bin/bash
# FitTrack AI - One-command startup script

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║           FitTrack AI - Startup Script              ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# ── 1. Load .env if present ──────────────────────────────────
if [ -f "$SCRIPT_DIR/backend/.env" ]; then
  set -a
  source "$SCRIPT_DIR/backend/.env"
  set +a
  echo "✅  Loaded backend/.env"
fi

# ── 2. Default DB creds if not set ───────────────────────────
export SPRING_DATASOURCE_URL="${SPRING_DATASOURCE_URL:-jdbc:mysql://localhost:3306/fittrack_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}"
export SPRING_DATASOURCE_USERNAME="${SPRING_DATASOURCE_USERNAME:-root}"
export SPRING_DATASOURCE_PASSWORD="${SPRING_DATASOURCE_PASSWORD:-root}"

# ── 3. Kill any existing processes on 8080 and 5173 ──────────
echo "🔄  Stopping any existing servers..."
lsof -ti :8080 | xargs kill -9 2>/dev/null || true
lsof -ti :5173 | xargs kill -9 2>/dev/null || true
sleep 1

# ── 4. Start Spring Boot backend ──────────────────────────────
echo "🚀  Starting Spring Boot backend on port 8080..."
mvn -f "$SCRIPT_DIR/backend/pom.xml" spring-boot:run -q > /tmp/fittrack-backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID (logs: /tmp/fittrack-backend.log)"

# Wait for backend
echo "⏳  Waiting for backend to start..."
for i in {1..30}; do
  if curl -s http://localhost:8080/api/auth/register -X POST \
    -H "Content-Type: application/json" -d '{}' 2>/dev/null | grep -q '"success"'; then
    break
  fi
  if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌  Backend failed to start. Check /tmp/fittrack-backend.log"
    exit 1
  fi
  sleep 1
done

echo "✅  Backend is running at http://localhost:8080"

# ── 5. Install frontend deps if needed ───────────────────────
if [ ! -d "$SCRIPT_DIR/frontend/node_modules" ]; then
  echo "📦  Installing frontend dependencies..."
  (cd "$SCRIPT_DIR/frontend" && npm install --silent)
fi

# ── 6. Start React frontend ───────────────────────────────────
echo "🌐  Starting React frontend on port 5173..."
(cd "$SCRIPT_DIR/frontend" && npm run dev) &
FRONTEND_PID=$!

sleep 2
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✅  FitTrack AI is running!                        ║"
echo "║                                                      ║"
echo "║  Frontend  →  http://localhost:5173                 ║"
echo "║  Backend   →  http://localhost:8080                 ║"
echo "║                                                      ║"
echo "║  Demo login:                                         ║"
echo "║    Email:    athlete@fittrack.com                    ║"
echo "║    Password: fitness123                              ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "Press Ctrl+C to stop all servers."

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo '🛑  Servers stopped.'; exit 0" SIGINT
wait
