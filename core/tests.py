from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.core.files.uploadedfile import SimpleUploadedFile
from core.models import Category, Service, Update, MembershipPlan, FAQ, CustomerReview, ServiceRequest, ContactEnquiry, ServiceRequestLog
from core.forms import ServiceRequestForm

import tempfile
from django.test import override_settings


@override_settings(MEDIA_ROOT=tempfile.mkdtemp(prefix='homline-test-media-'))
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
        self.assertContains(response, "Our Vision")
        self.assertContains(response, "To make digital services simple, accessible, and convenient for everyone.")
        self.assertContains(response, "Our Mission")
        self.assertContains(response, "HOMline Founder")
        self.assertContains(response, "founder.jpg")

    def test_about_page(self):
        response = self.client.get(reverse('about'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "HOMline")
        self.assertContains(response, "DIGI seva")
        self.assertContains(response, "Why to Choose HOMline?")
        self.assertContains(response, "What is HOMline?")
        self.assertContains(response, "AMDG Group")
        self.assertContains(response, "AMDG Media & Designs")
        self.assertContains(response, "EVARA Tours & Decorations")
        # Newly added brochure sections
        self.assertContains(response, "PHASE 3")
        self.assertContains(response, "HOMLINE ACROSS KERALA")
        self.assertContains(response, "PHASE 4")
        self.assertContains(response, "EXPANSION ACROSS INDIA")
        self.assertContains(response, "THE BIGGER VISION")
        self.assertContains(response, "Digital Assistance Ecosystem")
        self.assertContains(response, "YUVA Manass")
        self.assertContains(response, "FOUNDER’S MOTIVATION")
        self.assertContains(response, "Social Work + Technology + Creativity + Accessibility")
        self.assertContains(response, "WHAT HOMLINE ULTIMATELY STANDS FOR")
        self.assertContains(response, "https://www.amdgmedia.co.in/homline")
        self.assertContains(response, "homelinedigital@gmail.com")
        self.assertContains(response, "A Division Of AMDG MEDIA")
        self.assertContains(response, "Powered By AMDG GROUP")

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

    def test_receipt_requires_verified_access(self):
        url = reverse('receipt', kwargs={'request_id': 'HOM-2026-TEST'})
        self.assertEqual(self.client.get(url).status_code, 302)

    def test_membership_lookup_ignores_mobile_and_masks_phone(self):
        from core.models import MembershipEnquiry
        MembershipEnquiry.objects.create(name='A', mobile='9876543210', membership_code='HOM-MBR-2026-AAAAAAAAAA', status='Active')
        r = self.client.get(reverse('membership'), {'check_code': '9876543210'})
        self.assertNotContains(r, '3210</strong>')
        r = self.client.get(reverse('membership'), {'check_code': 'HOM-MBR-2026-AAAAAAAAAA'})
        self.assertContains(r, '******3210')
        self.assertNotContains(r, '9876543210')

    def test_logout_is_post_only(self):
        self.assertEqual(self.client.get(reverse('logout')).status_code, 405)

    def test_receipt_page(self):
        self.client.get(reverse('track_request_with_id', kwargs={'request_id': 'HOM-2026-TEST'}))
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
        self.assertContains(response, 'Contact messages')
        self.assertContains(response, 'Service dashboard')
        self.assertContains(response, 'HOM-2026-TEST')

    def test_admin_dashboard_searches_recent_requests(self):
        staff = get_user_model().objects.create_superuser(username='search-operator', email='search@example.com', password='Safe-test-password-274!')
        self.client.force_login(staff)
        response = self.client.get(reverse('admin:index'), {'request_search': 'HOM-2026-TEST'})
        self.assertContains(response, 'HOM-2026-TEST')
        response = self.client.get(reverse('admin:index'), {'request_search': 'no-match'})
        self.assertContains(response, 'No requests match')

    def test_category_admin_shows_service_count(self):
        staff = get_user_model().objects.create_superuser(username='category-operator', email='category@example.com', password='Safe-test-password-274!')
        self.client.force_login(staff)
        response = self.client.get(reverse('admin:core_category_changelist'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '1 service')

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

    def test_pwd_request_submission(self):
        response = self.client.post(reverse('pwd_request'), {
            'name': 'Ramesh Kumar',
            'mobile': '9847123456',
            'place': 'Aluva',
            'assistance_type': 'Doorstep Visit Assistance',
            'service_needed': 'Disability Certificate Renewal',
            'details': 'Wheelchair user, needs assistance at residence.'
        })
        self.assertEqual(response.status_code, 302)
        from core.models import PwDRequest
        self.assertTrue(PwDRequest.objects.filter(name='Ramesh Kumar').exists())

    def test_complaint_suggestion_submission(self):
        response = self.client.post(reverse('complaint_suggestion'), {
            'entry_type': 'Suggestion',
            'name': 'Anu Thomas',
            'mobile': '9847654321',
            'email': 'anu@example.com',
            'subject': 'Add more DTP font options',
            'details': 'Please add stylish Malayalam Unicode fonts.',
            'consent': 'on',
            'acknowledge': 'on',
        })
        from core.models import ComplaintSuggestion
        obj = ComplaintSuggestion.objects.get(name='Anu Thomas')
        self.assertRegex(obj.reference_no, r'^HOM-CMP-\d{8}-001$')
        self.assertEqual(obj.status, 'Received')
        self.assertRedirects(response, reverse('complaint_received', kwargs={'reference_no': obj.reference_no}))
        self.assertContains(self.client.get(response.url), obj.reference_no)

    def test_complaint_requires_consent_and_keeps_input(self):
        response = self.client.post(reverse('complaint_suggestion'), {
            'entry_type': 'Accessibility Concern', 'name': 'Anu', 'mobile': '9847654321',
            'subject': 'Ramp missing', 'details': 'No ramp at the desk.'})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Ramp missing')
        self.assertContains(response, 'Please confirm the declaration')
        from core.models import ComplaintSuggestion
        self.assertFalse(ComplaintSuggestion.objects.exists())

    def test_complaint_received_page_needs_own_session(self):
        from core.models import ComplaintSuggestion
        obj = ComplaintSuggestion.objects.create(name='A', mobile='9847654321', subject='s', details='d')
        self.assertEqual(self.client.get(reverse('complaint_received', kwargs={'reference_no': obj.reference_no})).status_code, 302)

    def test_membership_card_and_check(self):
        from core.models import MembershipEnquiry
        mem = MembershipEnquiry.objects.create(
            name='Joseph Paul',
            mobile='9447112233',
            place='Kochi',
            preferred_plan=self.plan,
            status='Active',
            membership_code='HOM-MBR-2026-TEST'
        )
        # Test direct card view
        card_res = self.client.get(reverse('membership_card', kwargs={'membership_code': 'HOM-MBR-2026-TEST'}))
        self.assertEqual(card_res.status_code, 200)
        self.assertContains(card_res, 'Joseph Paul')
        self.assertContains(card_res, 'HOM-MBR-2026-TEST')
        self.assertContains(card_res, 'AMDG MEDIA')

        # Test check membership query
        check_res = self.client.get(reverse('membership'), {'check_code': 'HOM-MBR-2026-TEST'})
        self.assertEqual(check_res.status_code, 200)
        self.assertContains(check_res, 'Joseph Paul')
        self.assertContains(check_res, 'HOM-MBR-2026-TEST')

    def test_track_fee_breakdown_and_qr(self):
        self.service_request.service_charge = "₹200.00"
        self.service_request.portal_fee = "₹107.00"
        self.service_request.save()
        response = self.client.get(reverse('track_request_with_id', kwargs={'request_id': self.service_request.request_id}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "₹200.00")
        self.assertContains(response, "₹107.00")
        self.assertContains(response, "api.qrserver.com")

    def test_homepage_accessible_without_login(self):
        # Visitor can access homepage without authentication
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Sign In")
        self.assertContains(response, "Sign Up")
        self.assertContains(response, "Explore Services")

    def test_services_browsing_without_login(self):
        # Visitor can browse services catalog and service detail without logging in
        res_list = self.client.get(reverse('services_list'))
        self.assertEqual(res_list.status_code, 200)
        self.assertContains(res_list, self.service.title)

        res_detail = self.client.get(reverse('service_detail', kwargs={'slug': self.service.slug}))
        self.assertEqual(res_detail.status_code, 200)
        self.assertContains(res_detail, self.service.title)
        self.assertContains(res_detail, self.service.homline_charge)

    def test_user_signup_login_logout_flow(self):
        # 1. Sign up new regular user
        signup_data = {
            'full_name': 'Meera Krishnan',
            'username': 'meerak',
            'email': 'meera@example.com',
            'password': 'SecurePassword123!',
            'confirm_password': 'SecurePassword123!'
        }
        res_signup = self.client.post(reverse('signup'), signup_data, follow=True)
        self.assertEqual(res_signup.status_code, 200)
        self.assertIn(reverse('dashboard'), [r[0] for r in res_signup.redirect_chain])
        
        # Verify user attributes
        user = get_user_model().objects.get(username='meerak')
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertEqual(user.first_name, 'Meera Krishnan')

        # Verify user is logged in and sees username on home
        res_home = self.client.get(reverse('home'))
        self.assertEqual(res_home.status_code, 200)
        self.assertContains(res_home, 'meerak')

        # 2. Logout
        res_logout = self.client.post(reverse('logout'))
        self.assertEqual(res_logout.status_code, 302)

        # 3. Log in with email identifier
        res_login = self.client.post(reverse('login'), {
            'username': 'meera@example.com',
            'password': 'SecurePassword123!',
            'remember_me': True
        }, follow=True)
        self.assertEqual(res_login.status_code, 200)
        self.assertIn(reverse('dashboard'), [r[0] for r in res_login.redirect_chain])

    def test_dashboard_requires_login(self):
        res = self.client.get(reverse('dashboard'))
        self.assertEqual(res.status_code, 302)
        self.assertIn(reverse('login'), res['Location'])

    def test_dashboard_authenticated_and_profile_actions(self):
        user = get_user_model().objects.create_user(
            username='arjun_client',
            email='arjun@example.com',
            password='InitialPassword123!',
            first_name='Arjun Nair'
        )
        self.client.force_login(user)

        # Create a service request for this user
        sr = ServiceRequest.objects.create(
            user=user,
            service=self.service,
            full_name='Arjun Nair',
            mobile='9846123456',
            email='arjun@example.com',
            requirement_details='Need PAN application assistance'
        )

        # 1. View dashboard
        res_dash = self.client.get(reverse('dashboard'))
        self.assertEqual(res_dash.status_code, 200)
        self.assertContains(res_dash, 'Arjun Nair')
        self.assertContains(res_dash, sr.request_id)
        self.assertContains(res_dash, 'My Service Requests')

        # 2. Update profile
        res_prof = self.client.post(reverse('dashboard'), {
            'action': 'update_profile',
            'first_name': 'Arjun V. Nair',
            'email': 'arjun.updated@example.com'
        }, follow=True)
        self.assertEqual(res_prof.status_code, 200)
        user.refresh_from_db()
        self.assertEqual(user.first_name, 'Arjun V. Nair')
        self.assertEqual(user.email, 'arjun.updated@example.com')

        # 3. Change password
        res_pwd = self.client.post(reverse('dashboard'), {
            'action': 'change_password',
            'old_password': 'InitialPassword123!',
            'new_password1': 'UpdatedSecret456#',
            'new_password2': 'UpdatedSecret456#'
        }, follow=True)
        self.assertEqual(res_pwd.status_code, 200)
        # Verify user still authenticated
        res_check = self.client.get(reverse('dashboard'))
        self.assertEqual(res_check.status_code, 200)

        # 4. Link an offline request
        offline_sr = ServiceRequest.objects.create(
            service=self.service,
            full_name='Walk-in Customer',
            mobile='9000000000',
            requirement_details='Offline ticket counter request'
        )
        res_link = self.client.post(reverse('dashboard'), {
            'action': 'link_request',
            'request_id': offline_sr.request_id
        }, follow=True)
        self.assertEqual(res_link.status_code, 200)
        offline_sr.refresh_from_db()
        self.assertEqual(offline_sr.user, user)



