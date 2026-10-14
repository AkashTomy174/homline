# HOMline DIGI seva

## Run locally

From the project folder, activate the virtual environment and start Django:

```powershell
.\venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

The site is a React app (`frontend/`, Vite + TypeScript) on a Django REST API (`/api/`). Build it once so Django can serve it:

```powershell
cd frontend; npm ci; npm run build; cd ..
```

Open `http://127.0.0.1:8000/`. For live frontend editing run `npm run dev` in `frontend/` and open `http://localhost:5173/` (it proxies `/api` to Django on port 8000). Staff and admins use the panel at `/panel` after signing in. Create an administrator account once with:

```powershell
python manage.py createsuperuser
```

Then sign in at `http://127.0.0.1:8000/login` (staff and admins land in `/panel`).

## Production setup

Set `DEBUG=False`, a private `SECRET_KEY`, `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, and a persistent `DATABASE_URL` in the hosting provider. The included Render blueprint prompts for `DATABASE_URL`; use a managed database and back it up. Do not commit production secrets or customer data.

Uploaded customer documents are stored under `MEDIA_ROOT` and served only through the staff-authorized download view. Configure persistent private file storage (or a persistent disk) before accepting real uploads on hosts with ephemeral filesystems. Restrict admin accounts to trusted staff and assign only the permissions each role needs.

## Checks

```powershell
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test core
```

## Deployment

See [DEPLOY.md](DEPLOY.md) (Render Free + Neon + Cloudflare R2). Env vars: `.env.example`.
