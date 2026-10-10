#!/usr/bin/env bash
# Exit on error
set -e

# Prevent PEP 668 externally-managed-environment error in Vercel build container
export PIP_BREAK_SYSTEM_PACKAGES=1

echo "[BUILD] Installing dependencies..."
if command -v uv &> /dev/null; then
    uv pip install -r requirements.txt --system || python3 -m pip install --break-system-packages -r requirements.txt
else
    python3 -m pip install --break-system-packages -r requirements.txt
fi

echo "[BUILD] Collecting static files..."
python3 manage.py collectstatic --noinput --clear

echo "[BUILD] Applying database migrations..."
python3 manage.py migrate --noinput || true

echo "[BUILD] Seeding initial data..."
python3 manage.py seed_data || true

echo "[BUILD] Completed successfully!"
