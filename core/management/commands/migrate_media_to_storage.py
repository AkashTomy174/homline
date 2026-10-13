from pathlib import Path

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand, CommandError

from core.models import ServiceRequest


class Command(BaseCommand):
    help = "Copy documents from the local MEDIA_ROOT into the configured default storage. Never deletes originals."

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true')

    def handle(self, *args, dry_run=False, **opts):
        storage = ServiceRequest._meta.get_field('document_upload').storage
        for req in ServiceRequest.objects.exclude(document_upload='').exclude(document_upload__isnull=True):
            name = req.document_upload.name
            local = Path(settings.BASE_DIR / 'media') / name
            if storage.exists(name):
                self.stdout.write(f'ok (already in storage): {name}')
                continue
            if not local.is_file():
                self.stderr.write(f'MISSING locally and in storage: {name} ({req.request_id})')
                continue
            data = local.read_bytes()
            if dry_run:
                self.stdout.write(f'would copy: {name}')
                continue
            storage.save(name, ContentFile(data))
            with storage.open(name, 'rb') as f:
                if f.read() != data:
                    raise CommandError(f'Verification failed for {name}')
            self.stdout.write(f'copied + verified: {name}')
