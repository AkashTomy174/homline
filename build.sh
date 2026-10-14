#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install python dependencies
pip install -r requirements.txt

# Build the React app into static/app (served by Django/WhiteNoise)
if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required to build the frontend (set a Node version on the host)" >&2
  exit 1
fi
(cd frontend && npm ci && npm run build)

# Collect static files into STATIC_ROOT
python manage.py collectstatic --no-input

# Apply database migrations
python manage.py migrate

# Ensure initial services, categories, FAQs are populated
python manage.py seed_data

# Optionally create superuser if environment variables are present
if [[ -n "$DJANGO_SUPERUSER_USERNAME" && -n "$DJANGO_SUPERUSER_PASSWORD" ]]; then
  python manage.py createsuperuser --noinput || echo 'superuser already exists'
fi
