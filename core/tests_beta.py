import os
import subprocess
import sys
import tempfile
from unittest import mock

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from django.test import TestCase, override_settings
from django.urls import reverse

from core.forms import ServiceRequestForm
from core.models import ServiceRequest, service_document_path

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROD_ENV = {'DEBUG': 'False', 'SECRET_KEY': 'x' * 50, 'DATABASE_URL': 'sqlite:///tmp.db',
            'DJANGO_SETTINGS_MODULE': 'homline_project.settings'}
CODE = "import django.conf as c; print(c.settings.STORAGES['default']['BACKEND'])"
PW = 'Safe-test-password-274!'


def load_settings(drop=(), **extra):
    env = {k: v for k, v in os.environ.items() if not k.startswith('R2_') and k not in drop}
    env.update(PROD_ENV, **extra)
    for k in drop:
        env.pop(k, None)
    return subprocess.run([sys.executable, '-c', CODE], env=env, cwd=BASE, capture_output=True, text=True)


class ProductionConfigTests(TestCase):
    def test_production_without_r2_refuses_to_start(self):
        r = load_settings()
        self.assertNotEqual(r.returncode, 0)
        self.assertIn('R2_', r.stderr)

    def test_partial_r2_config_refuses_to_start(self):
        r = load_settings(R2_BUCKET_NAME='b')
        self.assertNotEqual(r.returncode, 0)
        self.assertIn('R2_ENDPOINT_URL', r.stderr)

    def test_production_with_r2_uses_s3_storage(self):
        r = load_settings(R2_BUCKET_NAME='b', R2_ENDPOINT_URL='https://a.r2.cloudflarestorage.com',
                          R2_ACCESS_KEY_ID='k', R2_SECRET_ACCESS_KEY='s')
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn('storages.backends.s3.S3Storage', r.stdout)

    def test_missing_secret_key_refuses_to_start(self):
        r = load_settings(drop=('SECRET_KEY',), R2_BUCKET_NAME='b')
        # PROD_ENV re-adds SECRET_KEY, so drop afterwards explicitly
        env = {k: v for k, v in os.environ.items() if k != 'SECRET_KEY' and not k.startswith('R2_')}
        env.update({k: v for k, v in PROD_ENV.items() if k != 'SECRET_KEY'})
        r = subprocess.run([sys.executable, '-c', CODE], env=env, cwd=BASE, capture_output=True, text=True)
        self.assertNotEqual(r.returncode, 0)
        self.assertIn('SECRET_KEY', r.stderr)


class HealthTests(TestCase):
    def test_health_ok(self):
        r = self.client.get(reverse('health'))
        self.assertEqual((r.status_code, r.json()['status']), (200, 'ok'))

    def test_health_reports_db_failure_without_details(self):
        with mock.patch('django.db.backends.base.base.BaseDatabaseWrapper.ensure_connection',
                        side_effect=Exception('secret-dsn')):
            r = self.client.get(reverse('health'))
        self.assertEqual(r.status_code, 503)
        self.assertNotIn('secret-dsn', r.content.decode())


@override_settings(MEDIA_ROOT=tempfile.mkdtemp(prefix='homline-beta-'))
class UploadAndDownloadTests(TestCase):
    def form(self, upload):
        data = {'full_name': 'A', 'mobile': '9876543210', 'requirement_details': 'x', 'contact_preference': 'Call'}
        return ServiceRequestForm(data, {'document_upload': upload})

    def test_empty_file_rejected(self):
        self.assertFalse(self.form(SimpleUploadedFile('a.pdf', b'')).is_valid())

    def test_mime_mismatch_rejected(self):
        f = self.form(SimpleUploadedFile('evil.pdf', b'<html><script>alert(1)</script>'))
        self.assertIn('document_upload', f.errors)

    def test_bad_extension_and_oversize_rejected(self):
        self.assertFalse(self.form(SimpleUploadedFile('a.exe', b'MZ....')).is_valid())
        self.assertFalse(self.form(SimpleUploadedFile('a.pdf', b'%PDF' + b'0' * (10 * 1024 * 1024))).is_valid())

    def test_valid_pdf_accepted(self):
        self.assertTrue(self.form(SimpleUploadedFile('a.pdf', b'%PDF-1.4 data')).is_valid())

    def test_storage_name_is_random_and_traversal_safe(self):
        p = service_document_path(None, '../../etc/passwd.pdf')
        self.assertRegex(p, r'^service_docs/\d{4}/\d{2}/[0-9a-f]{32}\.pdf$')

    def _request_with_doc(self):
        r = ServiceRequest.objects.create(
            full_name='A', mobile='9876543210', requirement_details='x',
            document_upload=SimpleUploadedFile('x.pdf', b'%PDF-secret'),
            document_original_name='My Aadhaar.pdf')
        return r, reverse('private_request_document', kwargs={'request_id': r.request_id})

    def test_anonymous_and_plain_user_cannot_download(self):
        r, url = self._request_with_doc()
        self.assertEqual(self.client.get(url).status_code, 302)
        get_user_model().objects.create_user('u', password=PW)
        self.client.login(username='u', password=PW)
        self.assertEqual(self.client.get(url).status_code, 302)  # not staff -> site login

    def test_staff_permission_required_then_allowed(self):
        r, url = self._request_with_doc()
        s = get_user_model().objects.create_user('s', password=PW, is_staff=True)
        self.client.login(username='s', password=PW)
        self.assertEqual(self.client.get(url).status_code, 403)
        s.user_permissions.add(Permission.objects.get(codename='view_servicerequest'))
        res = self.client.get(url)
        self.assertEqual(res.status_code, 200)
        self.assertIn('My Aadhaar.pdf', res['Content-Disposition'])
        self.assertIn('attachment', res['Content-Disposition'])
        self.assertEqual(b''.join(res.streaming_content), b'%PDF-secret')

    def test_media_url_is_not_served(self):
        r, _ = self._request_with_doc()
        self.assertEqual(self.client.get('/media/' + r.document_upload.name).status_code, 404)

    def test_storage_failure_returns_503_without_leak(self):
        r, url = self._request_with_doc()
        self.client.force_login(get_user_model().objects.create_superuser('root', 'r@x.com', PW))
        with mock.patch('django.db.models.fields.files.FieldFile.open', side_effect=OSError('bucket-secret')):
            res = self.client.get(url)
        self.assertEqual(res.status_code, 503)
        self.assertNotIn('bucket-secret', res.content.decode())


class S3StorageAdapterTests(TestCase):
    """Offline check of signed, short-lived URLs. A real R2 round trip needs credentials and is not covered here."""

    def test_private_urls_are_signed_and_expiring(self):
        from storages.backends.s3 import S3Storage
        st = S3Storage(bucket_name='b', endpoint_url='https://a.r2.cloudflarestorage.com', access_key='k',
                       secret_key='s', region_name='auto', querystring_auth=True, file_overwrite=False)
        url = st.url('service_docs/2026/10/abc.pdf')
        self.assertIn('X-Amz-Signature', url)
        self.assertIn('X-Amz-Expires', url)


@override_settings(MEDIA_ROOT=tempfile.mkdtemp(prefix='homline-complaint-'))
class ComplaintDocumentTests(TestCase):
    def post(self, upload=None, **extra):
        data = {'entry_type': 'Complaint', 'name': 'A', 'mobile': '9876543210', 'subject': 's', 'details': 'd',
                'consent': 'on', 'acknowledge': 'on', **extra}
        if upload:
            data['supporting_document'] = upload
        return APIClient().post('/api/complaints/', data, format='multipart')

    def test_upload_stored_privately_and_staff_only(self):
        from core.models import ComplaintSuggestion
        self.assertEqual(self.post(SimpleUploadedFile('shot.png', bytes([0x89]) + b'PNG....')).status_code, 201)
        c = ComplaintSuggestion.objects.get()
        self.assertEqual(c.document_original_name, 'shot.png')
        self.assertRegex(c.supporting_document.name, r'^complaint_docs/\d{4}/\d{2}/[0-9a-f]{32}\.png$')
        url = reverse('private_complaint_document', kwargs={'reference_no': c.reference_no})
        anon = self.client.__class__()
        self.assertEqual(anon.get(url).status_code, 302)
        s = get_user_model().objects.create_user('st', password=PW, is_staff=True)
        anon.login(username='st', password=PW)
        self.assertEqual(anon.get(url).status_code, 403)
        s.user_permissions.add(Permission.objects.get(codename='view_complaintsuggestion'))
        res = anon.get(url)
        self.assertEqual(res.status_code, 200)
        self.assertIn('shot.png', res['Content-Disposition'])

    def test_bad_uploads_rejected(self):
        from core.models import ComplaintSuggestion
        self.assertEqual(self.post(SimpleUploadedFile('x.exe', b'MZ')).status_code, 400)
        self.assertEqual(self.post(SimpleUploadedFile('x.doc', b'abcdefgh')).status_code, 400)  # doc not allowed here
        self.assertEqual(self.post(SimpleUploadedFile('x.pdf', b'not a pdf')).status_code, 400)
        self.assertFalse(ComplaintSuggestion.objects.exists())

    def test_reference_numbers_increment_per_day(self):
        from core.models import ComplaintSuggestion
        self.post(); self.post()
        refs = list(ComplaintSuggestion.objects.order_by('id').values_list('reference_no', flat=True))
        self.assertEqual([r[-3:] for r in refs], ['001', '002'])
