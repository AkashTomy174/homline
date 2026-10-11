from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.core.files.uploadedfile import SimpleUploadedFile
from core.models import Category, Service, Update, MembershipPlan, FAQ, CustomerReview, ServiceRequest, ContactEnquiry, ServiceRequestLog
from core.forms import ServiceRequestForm

class HOMlineProjectTests(TestCase):
    def setUp(self):
        self.client = Client()

        self.category = Category.objects.create(
            name="Government & Identity",
            slug="government-identity",
            description="Gov services",
            icon_class="bi-card-heading",
            order=1
        )

        self.service = Service.objects.create(
            category=self.category,
            title="PAN Card New",
            slug="pan-card-new",
            short_summary="Apply for PAN",
            description="Detailed description for PAN card",
            required_documents="Aadhaar, Photo",
            homline_charge="₹150",
            third_party_fee="₹107",
            processing_time="2-3 days",
            is_featured=True,
            badge="Popular",
            icon_class="bi-credit-card"
        )

        self.update = Update.objects.create(
            title="Service Launch Notice",
            slug="service-launch-notice",
            category_tag="Service Update",
            summary="New features online",
            content="Full update notice text",
            is_featured=True
        )

        self.plan = MembershipPlan.objects.create(
            name="Basic Member",
            tagline="Essential support",
            price="₹299 / year",
            is_popular=True,
            features="Feature 1\nFeature 2",
            welcome_benefits="Benefit 1",
            order=1
        )

        self.faq = FAQ.objects.create(
            question="What is HOMline?",
            answer="Digital service assistance platform.",
            category="General",
            order=1
        )

        self.review = CustomerReview.objects.create(
            customer_name="Test Customer",
            location="Kochi",
            rating=5,
            service_used="PAN Card",
            review_text="Great service!",
            is_verified=True
        )

        self.service_request = ServiceRequest.objects.create(
            request_id="HOM-2026-TEST",
            full_name="Test User",
            mobile="6282268453",
            email="test@example.com",
            service=self.service,
            requirement_details="Needs PAN card",
            contact_preference="WhatsApp",
            status="Processing",
            admin_notes="Assigned to agent"
        )

    def test_homepage(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Your digital tasks,")
        self.assertContains(response, reverse('admin:login'))
        self.assertContains(response, "6282268453")

    def test_about_page(self):
        response = self.client.get(reverse('about'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "About HOMline DIGI seva")

    def test_services_list_page(self):
        response = self.client.get(reverse('services_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "PAN Card New")

    def test_services_search_and_empty_state(self):
        response = self.client.get(reverse('services_list'), {'q': 'PAN'})
        self.assertContains(response, "PAN Card New")
        response = self.client.get(reverse('services_list'), {'q': 'no-such-service'})
        self.assertContains(response, "No matches in this view")

    def test_service_detail_page(self):
        response = self.client.get(reverse('service_detail', kwargs={'slug': self.service.slug}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "PAN Card New")
        self.assertContains(response, "Service note")
        self.assertContains(response, f"service_id={self.service.id}")

    def test_how_it_works_page(self):
        response = self.client.get(reverse('how_it_works'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "How HOMline Works")

    def test_membership_page(self):
        response = self.client.get(reverse('membership'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Basic Member")

    def test_updates_list_page(self):
        response = self.client.get(reverse('updates_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Service Launch Notice")

    def test_update_detail_page(self):
        response = self.client.get(reverse('update_detail', kwargs={'slug': self.update.slug}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Service Launch Notice")

    def test_faqs_page(self):
        response = self.client.get(reverse('faqs'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "What is HOMline?")

    def test_contact_page(self):
        response = self.client.get(reverse('contact'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "6282268453")

    def test_track_request_page(self):
        response = self.client.get(reverse('track_request_with_id', kwargs={'request_id': 'HOM-2026-TEST'}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "HOM-2026-TEST")

    def test_track_request_ajax(self):
        response = self.client.get(reverse('track_request_with_id', kwargs={'request_id': 'HOM-2026-TEST'}), HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertTrue(json_data['found'])
        self.assertEqual(json_data['request_id'], 'HOM-2026-TEST')
        self.assertNotIn('name', json_data)
        self.assertNotIn('mobile', json_data)
        self.assertNotIn('notes', json_data)

    def test_receipt_page(self):
        response = self.client.get(reverse('receipt', kwargs={'request_id': 'HOM-2026-TEST'}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "VERIFIED ACKNOWLEDGEMENT")

    def test_policy_page(self):
        response = self.client.get(reverse('policy', kwargs={'policy_name': 'disclaimer'}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Official Notice & Disclaimer")

    def test_admin_login_is_available(self):
        response = self.client.get(reverse('admin:login'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Operations sign in")
        self.assertContains(response, 'id_password')

    def test_admin_dashboard_requires_login(self):
        response = self.client.get(reverse('admin:index'))
        self.assertEqual(response.status_code, 302)
        self.assertIn('/admin/login/', response.url)

    def test_admin_dashboard_loads_for_staff(self):
        staff = get_user_model().objects.create_superuser(username='operator', email='operator@example.com', password='Safe-test-password-274!')
        self.client.force_login(staff)
        response = self.client.get(reverse('admin:index'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Contact Messages')

    def test_admin_bulk_status_action_adds_public_timeline_event(self):
        staff = get_user_model().objects.create_superuser(username='status-operator', email='status@example.com', password='Safe-test-password-274!')
        self.client.force_login(staff)
        response = self.client.post(reverse('admin:core_servicerequest_changelist'), {
            'action': 'mark_as_completed',
            '_selected_action': [self.service_request.pk],
            'index': 0,
        }, follow=True)
        self.assertEqual(response.status_code, 200)
        self.service_request.refresh_from_db()
        self.assertEqual(self.service_request.status, 'Completed')
        self.assertTrue(ServiceRequestLog.objects.filter(request=self.service_request, status='Completed').exists())

    def test_admin_uploaded_document_requires_permission(self):
        staff = get_user_model().objects.create_user(username='staff', password='Safe-test-password-274!', is_staff=True)
        self.client.force_login(staff)
        response = self.client.get(reverse('private_request_document', kwargs={'request_id': self.service_request.request_id}))
        self.assertEqual(response.status_code, 403)

    def test_admin_with_request_view_permission_can_open_private_file_route(self):
        staff = get_user_model().objects.create_user(username='request-viewer', password='Safe-test-password-274!', is_staff=True)
        staff.user_permissions.add(Permission.objects.get(codename='view_servicerequest'))
        self.client.force_login(staff)
        response = self.client.get(reverse('private_request_document', kwargs={'request_id': self.service_request.request_id}))
        self.assertEqual(response.status_code, 404)

    def test_contact_enquiry_is_saved(self):
        response = self.client.post(reverse('contact'), {
            'name': 'New Enquiry',
            'mobile': '6282268453',
            'message': 'Please call me about PAN assistance.',
        })
        self.assertEqual(response.status_code, 302)
        self.assertTrue(ContactEnquiry.objects.filter(name='New Enquiry').exists())

    def test_service_request_submission_creates_timeline(self):
        response = self.client.post(reverse('home'), {
            'submit_request': '1',
            'full_name': 'New Customer',
            'mobile': '6282268453',
            'service': self.service.pk,
            'requirement_details': 'Please help with a PAN application.',
            'contact_preference': 'WhatsApp',
        })
        self.assertEqual(response.status_code, 302)
        created = ServiceRequest.objects.get(full_name='New Customer')
        self.assertTrue(ServiceRequestLog.objects.filter(request=created, status='Pending').exists())
        self.assertIn(created.request_id, response.url)

    def test_request_service_form_is_available(self):
        response = self.client.get(reverse('request_service'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Request Digital Service Assistance')

    def test_uploaded_documents_are_not_public(self):
        response = self.client.get(reverse('private_request_document', kwargs={'request_id': self.service_request.request_id}))
        self.assertEqual(response.status_code, 302)
        self.assertIn('/admin/login/', response.url)

    def test_document_upload_type_and_size_are_validated(self):
        invalid = ServiceRequestForm(data={
            'full_name': 'New Customer',
            'mobile': '6282268453',
            'service': self.service.pk,
            'requirement_details': 'Help with application',
            'contact_preference': 'WhatsApp',
        }, files={'document_upload': SimpleUploadedFile('script.exe', b'bad')})
        self.assertFalse(invalid.is_valid())
        self.assertIn('document_upload', invalid.errors)

    def test_generated_request_ids_have_long_random_suffix(self):
        created = ServiceRequest.objects.create(
            full_name='ID Test', mobile='6282268453', service=self.service,
            requirement_details='ID check'
        )
        self.assertEqual(len(created.request_id.rsplit('-', 1)[-1]), 16)

