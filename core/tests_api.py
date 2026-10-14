from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.cache import cache
from rest_framework.test import APIClient
from django.test import TestCase

from .models import Category, Service, ServiceRequest, ServiceRequestLog, FAQ, Update, MembershipPlan, MembershipEnquiry


class ApiTests(TestCase):
    def setUp(self):
        cache.clear()
        self.c = APIClient()
        cat = Category.objects.create(name='Gov', slug='gov')
        self.svc = Service.objects.create(category=cat, title='PAN', slug='pan', short_summary='s', description='d',
                                          required_documents='x', is_featured=True)
        FAQ.objects.create(question='Q?', answer='A')
        Update.objects.create(title='U', slug='u', summary='s', content='c')
        MembershipPlan.objects.create(name='Gold', tagline='t', price='1', features='f', welcome_benefits='w')

    def test_public_reads(self):
        for url in ['/api/bootstrap/', '/api/home/', '/api/services/', '/api/services/pan/', '/api/updates/',
                    '/api/updates/u/', '/api/faqs/', '/api/plans/']:
            self.assertEqual(self.c.get(url).status_code, 200, url)
        self.assertEqual(self.c.get('/api/services/?q=nomatch').json()['services'], [])
        self.assertEqual(self.c.get('/api/services/nope/').status_code, 404)

    def test_request_create_track_receipt_session_guard(self):
        pdf = SimpleUploadedFile('a.pdf', b'%PDF-1.4 x', content_type='application/pdf')
        r = self.c.post('/api/requests/', {'full_name': 'A', 'mobile': '9876543210', 'requirement_details': 'r',
                                           'contact_preference': 'WhatsApp', 'service': self.svc.id, 'document_upload': pdf},
                        format='multipart')
        self.assertEqual(r.status_code, 201, r.content)
        rid = r.json()['request_id']
        self.assertEqual(self.c.get(f'/api/receipt/{rid}/').status_code, 200)          # same session
        self.assertEqual(self.c.get(f'/api/track/{rid}/').json()['request']['timeline'][0]['status'], 'Pending')
        self.assertEqual(APIClient().get(f'/api/receipt/{rid}/').status_code, 403)     # other browser
        self.assertEqual(APIClient().get('/api/track/NOPE/').status_code, 404)

    def test_validation_errors_shape(self):
        r = self.c.post('/api/requests/', {'full_name': '', 'mobile': '1', 'requirement_details': ''}, format='json')
        self.assertEqual(r.status_code, 400)
        self.assertIn('mobile', r.json()['errors'])

    def test_contact_pwd_membership(self):
        self.assertEqual(self.c.post('/api/contact/', {'name': 'A', 'mobile': '9876543210', 'message': 'hi'}, format='json').status_code, 201)
        self.assertEqual(self.c.post('/api/pwd/', {'name': 'A', 'mobile': '9876543210', 'place': 'p', 'assistance_type': 'General Assistance',
                                                    'service_needed': 's'}, format='json').status_code, 201)
        self.assertEqual(self.c.post('/api/membership/', {'name': 'A', 'mobile': '9876543210', 'place': 'p'}, format='json').status_code, 201)
        m = MembershipEnquiry.objects.first()
        m.membership_code = 'HOM-MBR-1'
        m.save()
        self.assertEqual(self.c.get('/api/membership/?code=hom-mbr-1').json()['masked_mobile'], '******3210')
        self.assertEqual(self.c.get('/api/membership/card/HOM-MBR-1/').status_code, 200)

    def test_complaint_confirmation_needs_session(self):
        r = self.c.post('/api/complaints/', {'entry_type': 'Complaint', 'name': 'A', 'mobile': '9876543210', 'subject': 's',
                                             'details': 'd', 'consent': True, 'acknowledge': True}, format='json')
        self.assertEqual(r.status_code, 201, r.content)
        ref = r.json()['reference_no']
        self.assertEqual(self.c.get(f'/api/complaints/received/{ref}/').status_code, 200)
        self.assertEqual(APIClient().get(f'/api/complaints/received/{ref}/').status_code, 403)

    def test_auth_flow_and_dashboard(self):
        r = self.c.post('/api/auth/signup/', {'full_name': 'Bob', 'username': 'bob', 'email': 'b@x.com',
                                              'password': 'Str0ngPass!9', 'confirm_password': 'Str0ngPass!9'}, format='json')
        self.assertEqual(r.status_code, 201, r.content)
        self.assertEqual(self.c.get('/api/auth/me/').json()['user']['role'], 'customer')
        self.assertEqual(self.c.get('/api/me/dashboard/').json()['counts']['total'], 0)
        self.c.post('/api/auth/logout/')
        self.assertEqual(self.c.get('/api/me/dashboard/').status_code, 403)
        self.assertEqual(self.c.post('/api/auth/login/', {'username': 'b@x.com', 'password': 'bad'}, format='json').status_code, 400)
        self.assertEqual(self.c.post('/api/auth/login/', {'username': 'b@x.com', 'password': 'Str0ngPass!9'}, format='json').status_code, 200)

    def test_csrf_enforced_for_anonymous_posts(self):
        strict = APIClient(enforce_csrf_checks=True)
        self.assertEqual(strict.post('/api/contact/', {'name': 'A', 'mobile': '9876543210', 'message': 'x'}, format='json').status_code, 403)
        strict.get('/api/bootstrap/')
        tok = strict.cookies['csrftoken'].value
        r = strict.post('/api/contact/', {'name': 'A', 'mobile': '9876543210', 'message': 'x'}, format='json', HTTP_X_CSRFTOKEN=tok)
        self.assertEqual(r.status_code, 201)

    def test_panel_api_roles(self):
        staff = User.objects.create_user('st', password='x', is_staff=True)
        adm = User.objects.create_user('ad', password='x', is_staff=True, is_superuser=True)
        req = ServiceRequest.objects.create(full_name='A', mobile='9', requirement_details='r')
        self.c.force_authenticate(staff)
        self.assertEqual(self.c.get('/api/panel/meta/').json()['sections'][0]['key'], 'requests')
        self.assertEqual(self.c.get('/api/panel/requests/').json()['count'], 1)
        d = self.c.get(f'/api/panel/requests/{req.pk}/').json()
        self.assertIn('status', [f['name'] for f in d['fields']])
        body = {f['name']: f['value'] for f in d['fields']}
        body['status'] = 'Processing'
        self.assertEqual(self.c.patch(f'/api/panel/requests/{req.pk}/', body, format='json').status_code, 200)
        self.assertEqual(req.timeline_logs.count(), 1)
        self.assertEqual(self.c.delete(f'/api/panel/requests/{req.pk}/').status_code, 403)
        self.assertEqual(self.c.get('/api/panel/services/').status_code, 403)
        self.assertEqual(self.c.get('/api/panel/users/').status_code, 403)
        self.c.force_authenticate(adm)
        self.assertEqual(self.c.get('/api/panel/services/').status_code, 200)
        self.assertEqual(self.c.get('/api/panel/users/').status_code, 200)
        r = self.c.post('/api/panel/users/', {'username': 'n', 'email': 'n@x.com', 'role': 'staff', 'password': 'pw12345!', 'is_active': True}, format='json')
        self.assertEqual(r.status_code, 201, r.content)
        self.assertEqual(self.c.delete(f'/api/panel/requests/{req.pk}/').status_code, 204)
        self.c.force_authenticate(None)
        self.assertEqual(self.c.get('/api/panel/meta/').status_code, 403)


class PanelFeatureTests(TestCase):
    def setUp(self):
        self.c = APIClient()
        self.staff = User.objects.create_user('st', password='x', is_staff=True)
        self.adm = User.objects.create_user('ad', password='x', is_staff=True, is_superuser=True)
        cat = Category.objects.create(name='G', slug='g')
        self.svc = Service.objects.create(category=cat, title='PAN', slug='pan', short_summary='s', description='d', required_documents='x')
        self.r1 = ServiceRequest.objects.create(full_name='=HYPERLINK("x")', mobile='9876543210', requirement_details='r', service=self.svc)
        self.r2 = ServiceRequest.objects.create(full_name='B', mobile='9876543211', requirement_details='r', contact_preference='Call')

    def test_filters_search_dates_and_links(self):
        self.c.force_authenticate(self.staff)
        d = self.c.get('/api/panel/requests/', {'contact_preference': 'Call'}).json()
        self.assertEqual([r['id'] for r in d['rows']], [self.r2.id])
        self.assertEqual(self.c.get('/api/panel/requests/', {'service': self.svc.id}).json()['count'], 1)
        self.assertEqual(self.c.get('/api/panel/requests/', {'date_from': '2999-01-01'}).json()['count'], 0)
        row = self.c.get('/api/panel/requests/').json()['rows'][0]
        self.assertIn('wa.me/919876543', row['links']['wa'])
        self.assertTrue(row['links']['track'].startswith('/track/HOM-'))
        self.assertEqual([f['name'] for f in d['filters']], ['status', 'contact_preference', 'service'])

    def test_bulk_status_logs_and_staff_cannot_delete(self):
        self.c.force_authenticate(self.staff)
        r = self.c.post('/api/panel/requests/bulk/', {'ids': [self.r1.id, self.r2.id], 'action': 'status:Completed'}, format='json')
        self.assertEqual(r.json()['count'], 2)
        self.r1.refresh_from_db()
        self.assertEqual(self.r1.status, 'Completed')
        self.assertTrue(ServiceRequestLog.objects.filter(request=self.r1, status='Completed').exists())
        self.assertEqual(self.c.post('/api/panel/requests/bulk/', {'ids': [self.r1.id], 'action': 'delete'}, format='json').status_code, 403)
        self.assertEqual(self.c.post('/api/panel/requests/bulk/', {'ids': [self.r1.id], 'action': 'status:Bogus'}, format='json').status_code, 400)
        self.c.force_authenticate(self.adm)
        self.assertEqual(self.c.post('/api/panel/requests/bulk/', {'ids': [self.r1.id], 'action': 'delete'}, format='json').json()['count'], 1)

    def test_membership_approve_generates_code_and_validity(self):
        m = MembershipEnquiry.objects.create(name='M', mobile='9876543210')
        self.c.force_authenticate(self.staff)
        self.c.post('/api/panel/membership/bulk/', {'ids': [m.id], 'action': 'approve'}, format='json')
        m.refresh_from_db()
        self.assertRegex(m.membership_code, r'^HOM-MBR-\d{4}-[0-9A-F]{10}$')
        self.assertEqual((m.status, (m.valid_till - m.open_date).days), ('Approved', 365))

    def test_csv_export_respects_filters_and_neutralises_formulas(self):
        self.c.force_authenticate(self.staff)
        r = self.c.get('/api/panel/requests/export/')
        body = r.content.decode()
        self.assertEqual(r['Content-Type'], 'text/csv')
        self.assertIn("'=HYPERLINK", body)
        self.assertNotIn('\n=HYPERLINK', body)
        only = self.c.get('/api/panel/requests/export/', {'contact_preference': 'Call'}).content.decode()
        self.assertEqual(len(only.strip().splitlines()), 2)
        self.assertEqual(self.c.get('/api/panel/services/export/').status_code, 403)

    def test_staff_can_create_request_and_add_timeline_admin_deletes_entry(self):
        self.c.force_authenticate(self.staff)
        r = self.c.post('/api/panel/requests/', {'full_name': 'Walk In', 'mobile': '9000000000', 'requirement_details': 'counter',
                                                 'contact_preference': 'Call', 'status': 'Pending', 'service_charge': '1', 'portal_fee': '2'}, format='multipart')
        self.assertEqual(r.status_code, 201, r.content)
        pk = r.json()['id']
        self.assertEqual(ServiceRequestLog.objects.filter(request_id=pk).count(), 1)
        t = self.c.post(f'/api/panel/requests/{pk}/timeline/', {'title': 'Documents verified', 'status': 'Processing'}, format='json')
        self.assertEqual(t.status_code, 201)
        log = ServiceRequestLog.objects.filter(request_id=pk, title='Documents verified').get()
        self.assertEqual(self.c.delete(f'/api/panel/requests/{pk}/timeline/{log.id}/').status_code, 403)
        self.assertEqual(self.c.post('/api/panel/services/', {}, format='json').status_code, 403)
        self.c.force_authenticate(self.adm)
        self.assertEqual(self.c.delete(f'/api/panel/requests/{pk}/timeline/{log.id}/').status_code, 204)
        self.assertEqual(self.c.post('/api/panel/services/', {}, format='json').status_code, 400)  # admin may create content

    def test_staff_edit_is_limited_admin_edit_is_full(self):
        self.c.force_authenticate(self.staff)
        self.c.patch(f'/api/panel/requests/{self.r2.id}/', {'status': 'Processing', 'service_charge': '9', 'portal_fee': '9',
                                                            'admin_notes': '', 'full_name': 'HACKED'}, format='json')
        self.r2.refresh_from_db()
        self.assertEqual((self.r2.status, self.r2.full_name), ('Processing', 'B'))
        self.c.force_authenticate(self.adm)
        fields = [f['name'] for f in self.c.get(f'/api/panel/requests/{self.r2.id}/').json()['fields']]
        self.assertIn('full_name', fields)

    def test_panel_upload_validation(self):
        from django.core.files.uploadedfile import SimpleUploadedFile
        self.c.force_authenticate(self.staff)
        r = self.c.post('/api/panel/requests/', {'full_name': 'W', 'mobile': '9000000000', 'requirement_details': 'x', 'contact_preference': 'Call',
                                                 'status': 'Pending', 'service_charge': '1', 'portal_fee': '2',
                                                 'document_upload': SimpleUploadedFile('a.exe', b'MZ')}, format='multipart')
        self.assertEqual(r.status_code, 400)
        self.assertIn('document_upload', r.json()['errors'])

    def test_user_filters(self):
        self.c.force_authenticate(self.adm)
        self.assertEqual(self.c.get('/api/panel/users/', {'role': 'staff'}).json()['count'], 1)
        self.assertEqual(self.c.get('/api/panel/users/', {'role': 'admin'}).json()['count'], 1)


class StaffRoleTests(TestCase):
    def test_role_set_in_panel_grants_and_revokes_document_permissions(self):
        adm = User.objects.create_user('ad', password='x', is_staff=True, is_superuser=True)
        c = APIClient()
        c.force_authenticate(adm)
        r = c.post('/api/panel/users/', {'username': 'newstaff', 'email': 'n@x.com', 'role': 'staff', 'password': 'pw12345!', 'is_active': True}, format='json')
        self.assertEqual(r.status_code, 201, r.content)
        u = User.objects.get(username='newstaff')
        self.assertTrue(u.has_perm('core.view_servicerequest') and u.has_perm('core.change_servicerequest'))
        self.assertFalse(u.has_perm('core.delete_servicerequest') or u.has_perm('core.change_service'))
        c.patch(f'/api/panel/users/{u.pk}/', {'username': 'newstaff', 'email': 'n@x.com', 'role': 'customer', 'is_active': True}, format='json')
        u = User.objects.get(pk=u.pk)
        self.assertFalse(u.is_staff or u.has_perm('core.view_servicerequest'))

    def test_django_admin_is_gone(self):
        r = APIClient().get('/admin/login/')
        self.assertNotIn(b'Django administration', r.content)
