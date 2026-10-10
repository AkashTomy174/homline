#!/usr/bin/env bash
# Exit on error
set -e

echo "[BUILD] Installing dependencies..."
python3 -m pip install -r requirements.txt

echo "[BUILD] Collecting static files..."
python3 manage.py collectstatic --noinput --clear

echo "[BUILD] Applying database migrations..."
python3 manage.py migrate --noinput || true

echo "[BUILD] Seeding initial data..."
python3 manage.py seed_data || true

echo "[BUILD] Completed successfully!"
