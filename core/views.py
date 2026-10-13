import urllib.parse
from pathlib import Path
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse, HttpResponse, FileResponse
from django.urls import reverse
from django.db.models import Q
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.models import User
from django.contrib.auth.forms import PasswordChangeForm
from .models import (
    Category, Service, Update, MembershipPlan, 
    ServiceRequest, ServiceRequestLog, FAQ, CustomerReview, 
    MembershipEnquiry, ContactEnquiry, Announcement, PwDRequest, ComplaintSuggestion
)
from .forms import (
    ServiceRequestForm, TrackRequestForm, MembershipEnquiryForm, 
    QuickContactForm, PwDRequestForm, ComplaintSuggestionForm,
    UserLoginForm, UserRegistrationForm, UserProfileForm, LinkRequestForm
)

def home_view(request):
    categories = Category.objects.prefetch_related('services').all()
    featured_services = Service.objects.filter(is_featured=True)[:8]
    featured_updates = Update.objects.filter(is_featured=True)[:4]
    membership_plans = MembershipPlan.objects.all()
    faqs = FAQ.objects.all()[:6]
    reviews = CustomerReview.objects.filter(is_verified=True)[:5]
    all_services = Service.objects.all()
    announcements = Announcement.objects.filter(is_active=True).order_by('order', '-created_at')
    
    initial_request = {}
    if request.user.is_authenticated:
        if request.user.first_name:
            initial_request['full_name'] = request.user.first_name
        if request.user.email:
            initial_request['email'] = request.user.email
    service_request_form = ServiceRequestForm(initial=initial_request if initial_request else None)
    track_form = TrackRequestForm()
    pwd_form = PwDRequestForm()
    complaint_form = ComplaintSuggestionForm()

    if request.method == 'POST':
        if 'submit_request' in request.POST:
            service_request_form = ServiceRequestForm(request.POST, request.FILES)
            if service_request_form.is_valid():
                req_obj = service_request_form.save(commit=False)
                if req_obj.service:
                    req_obj.service_charge = req_obj.service.homline_charge
                    req_obj.portal_fee = req_obj.service.third_party_fee
                if request.user.is_authenticated:
                    req_obj.user = request.user
                req_obj.save()
                
                # Create initial timeline log
                ServiceRequestLog.objects.create(
                    request=req_obj,
                    status='Pending',
                    title='Request Registered',
                    description='Your digital service request has been logged successfully into HOMline systems.'
                )
                
                messages.success(
                    request, 
                    f"Your request has been submitted successfully! Your Request ID is: {req_obj.request_id}. Please save this ID to track your request status."
                )
                return redirect('track_request_with_id', request_id=req_obj.request_id)
            else:
                messages.error(request, "There was an error in your submission. Please check the form details.")
        
        elif 'submit_pwd' in request.POST:
            pwd_form = PwDRequestForm(request.POST)
            if pwd_form.is_valid():
                pwd_obj = pwd_form.save()
                messages.success(request, f"Thank you {pwd_obj.name}! Your PwD-Friendly Assistance request has been registered. Our support desk will reach out via Call/WhatsApp shortly.")
                return redirect(f"{reverse('home')}#pwd-assistance")

        elif 'submit_complaint' in request.POST:
            complaint_form = ComplaintSuggestionForm(request.POST)
            if complaint_form.is_valid():
                c_obj = complaint_form.save()
                messages.success(request, f"Thank you {c_obj.name}! Your {c_obj.entry_type} has been registered and forwarded to AMDG management. Ref ID: HOM-{c_obj.entry_type[:3].upper()}-{c_obj.id}")
                return redirect('home')

    context = {
        'categories': categories,
        'featured_services': featured_services,
        'featured_updates': featured_updates,
        'membership_plans': membership_plans,
        'faqs': faqs,
        'reviews': reviews,
        'all_services': all_services,
        'announcements': announcements,
        'service_request_form': service_request_form,
        'track_form': track_form,
        'pwd_form': pwd_form,
        'complaint_form': complaint_form,
        'active_tab': 'home'
    }
    return render(request, 'core/home.html', context)


def about_view(request):
    return render(request, 'core/about.html', {'active_tab': 'about'})


def services_list_view(request):
    categories = Category.objects.all()
    selected_category_slug = request.GET.get('category', 'all')
    search_query = request.GET.get('q', '').strip()

    services = Service.objects.select_related('category').all()

    if selected_category_slug and selected_category_slug != 'all':
        services = services.filter(category__slug=selected_category_slug)

    if search_query:
        services = services.filter(
            Q(title__icontains=search_query) | 
            Q(short_summary__icontains=search_query) | 
            Q(description__icontains=search_query)
        )

    context = {
        'categories': categories,
        'services': services,
        'selected_category_slug': selected_category_slug,
        'search_query': search_query,
        'active_tab': 'services'
    }
    return render(request, 'core/services_list.html', context)


def service_detail_view(request, slug):
    service = get_object_or_404(Service, slug=slug)
    related_services = Service.objects.filter(category=service.category).exclude(id=service.id)[:3]
    request_form = ServiceRequestForm(initial={
        'service': service,
    })

    context = {
        'service': service,
        'related_services': related_services,
        'request_form': request_form,
        'active_tab': 'services'
    }
    return render(request, 'core/service_detail.html', context)


def how_it_works_view(request):
    return render(request, 'core/how_it_works.html', {'active_tab': 'how_it_works'})


def membership_view(request):
    plans = MembershipPlan.objects.all()
    initial_enquiry = {}
    if request.user.is_authenticated:
        if request.user.first_name:
            initial_enquiry['name'] = request.user.first_name
        if request.user.email:
            initial_enquiry['email'] = request.user.email
    enquiry_form = MembershipEnquiryForm(initial=initial_enquiry if initial_enquiry else None)
    checked_membership = None
    check_error = None
    check_query = request.GET.get('check_code', '').strip() or request.POST.get('check_code', '').strip()

    if check_query:
        checked_membership = MembershipEnquiry.objects.filter(
            Q(membership_code__iexact=check_query) | Q(mobile__iexact=check_query)
        ).first()
        if not checked_membership:
            check_error = f"No active membership record found for '{check_query}'. Please check your Membership Code or registered mobile number."

    if request.method == 'POST' and 'apply_membership' in request.POST:
        enquiry_form = MembershipEnquiryForm(request.POST)
        if enquiry_form.is_valid():
            enquiry = enquiry_form.save(commit=False)
            if request.user.is_authenticated:
                enquiry.user = request.user
            enquiry.save()
            messages.success(request, f"Thank you {enquiry.name}! Your membership request for {enquiry.preferred_plan.name if enquiry.preferred_plan else 'HOMline'} has been registered. Our admin team will verify details and send your Unique Membership Code to your WhatsApp.")
            return redirect('membership')

    context = {
        'plans': plans,
        'enquiry_form': enquiry_form,
        'checked_membership': checked_membership,
        'check_error': check_error,
        'check_query': check_query,
        'active_tab': 'membership'
    }
    return render(request, 'core/membership.html', context)


def membership_card_view(request, membership_code):
    membership = get_object_or_404(MembershipEnquiry, membership_code__iexact=membership_code)
    qr_code_url = f"https://api.qrserver.com/v1/create-qr-code/?size=140x140&data={urllib.parse.quote(request.build_absolute_uri(reverse('membership_card', kwargs={'membership_code': membership.membership_code})))}"
    return render(request, 'core/membership_card.html', {
        'membership': membership,
        'qr_code_url': qr_code_url,
    })


def check_membership_view(request):
    code = request.GET.get('code', '').strip()
    return redirect(f"{reverse('membership')}?check_code={urllib.parse.quote(code)}#check-membership")


def pwd_request_view(request):
    if request.method == 'POST':
        form = PwDRequestForm(request.POST)
        if form.is_valid():
            obj = form.save()
            if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.GET.get('json') == '1':
                return JsonResponse({
                    'success': True,
                    'name': obj.name,
                    'id': obj.id,
                    'message': 'Your PwD-Friendly Assistance request has been registered! Dedicated caseworkers are ready to assist you.'
                })
            messages.success(request, f"Thank you {obj.name}. Your PwD-Friendly Assistance request has been registered. You can also connect directly via WhatsApp or Call below.")
            return redirect(f"{reverse('home')}#pwd-assistance")
        else:
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'errors': form.errors}, status=400)
            messages.error(request, "Please check the form entries and submit again.")
    return redirect('home')


def complaint_suggestion_view(request):
    if request.method == 'POST':
        form = ComplaintSuggestionForm(request.POST)
        if form.is_valid():
            obj = form.save()
            if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.GET.get('json') == '1':
                return JsonResponse({
                    'success': True,
                    'entry_type': obj.entry_type,
                    'ref_id': f"HOM-{obj.entry_type[:3].upper()}-{obj.id}",
                    'message': f'Thank you {obj.name}. Your {obj.entry_type} has been noted and submitted to AMDG management.'
                })
            messages.success(request, f"Thank you {obj.name}! Your {obj.entry_type} has been received. Reference ID: HOM-{obj.entry_type[:3].upper()}-{obj.id}.")
            return redirect('home')
        else:
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'errors': form.errors}, status=400)
            messages.error(request, "Please fill in all required fields.")
    return redirect('home')


def updates_list_view(request):
    updates = Update.objects.all()
    tag_filter = request.GET.get('tag', 'all')
    if tag_filter and tag_filter != 'all':
        updates = updates.filter(category_tag=tag_filter)

    context = {
        'updates': updates,
        'tag_filter': tag_filter,
        'active_tab': 'updates'
    }
    return render(request, 'core/updates_list.html', context)


def update_detail_view(request, slug):
    update_item = get_object_or_404(Update, slug=slug)
    recent_updates = Update.objects.exclude(id=update_item.id)[:4]

    context = {
        'update_item': update_item,
        'recent_updates': recent_updates,
        'active_tab': 'updates'
    }
    return render(request, 'core/update_detail.html', context)


def faqs_view(request):
    category_filter = request.GET.get('cat', 'all')
    search_q = request.GET.get('q', '').strip()

    faqs = FAQ.objects.all()
    if category_filter and category_filter != 'all':
        faqs = faqs.filter(category=category_filter)
    if search_q:
        faqs = faqs.filter(Q(question__icontains=search_q) | Q(answer__icontains=search_q))

    categories = [choice[0] for choice in FAQ.CATEGORY_CHOICES]

    context = {
        'faqs': faqs,
        'categories': categories,
        'category_filter': category_filter,
        'search_q': search_q,
        'active_tab': 'faqs'
    }
    return render(request, 'core/faqs.html', context)


def contact_view(request):
    form = QuickContactForm()
    if request.method == 'POST':
        form = QuickContactForm(request.POST)
        if form.is_valid():
            ContactEnquiry.objects.create(**form.cleaned_data)
            messages.success(request, "Thank you. Your message has been received, and the HOMline team will follow up by Call / WhatsApp.")
            return redirect('contact')

    return render(request, 'core/contact.html', {'form': form, 'active_tab': 'contact'})


def track_request_view(request, request_id=None):
    tracked_request = None
    searched_id = request_id or request.GET.get('request_id', '').strip()
    error_message = None
    timeline_logs = []
    qr_code_url = None

    if searched_id:
        try:
            tracked_request = ServiceRequest.objects.get(request_id__iexact=searched_id)
            timeline_logs = tracked_request.timeline_logs.all()
            track_url = request.build_absolute_uri(reverse('track_request_with_id', kwargs={'request_id': tracked_request.request_id}))
            qr_code_url = f"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={urllib.parse.quote(track_url)}"
        except ServiceRequest.DoesNotExist:
            error_message = f"No service request found with ID '{searched_id}'. Please verify your reference number."

    if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.GET.get('json') == '1':
        if tracked_request:
            logs_data = [{
                'status': log.status,
                'date': log.created_at.strftime('%d %b %Y, %I:%M %p')
            } for log in timeline_logs]

            return JsonResponse({
                'found': True,
                'request_id': tracked_request.request_id,
                'service': tracked_request.get_service_title(),
                'service_charge': tracked_request.service_charge or '₹150',
                'portal_fee': tracked_request.portal_fee or 'As per Govt portal',
                'status': tracked_request.status,
                'qr_code_url': qr_code_url,
                'created_at': tracked_request.created_at.strftime('%d %b %Y, %I:%M %p'),
                'updated_at': tracked_request.updated_at.strftime('%d %b %Y, %I:%M %p'),
                'timeline': logs_data
            })
        return JsonResponse({'found': False, 'error': error_message or 'Invalid Request ID'})

    context = {
        'tracked_request': tracked_request,
        'timeline_logs': timeline_logs,
        'searched_id': searched_id,
        'error_message': error_message,
        'qr_code_url': qr_code_url,
        'active_tab': 'track'
    }
    return render(request, 'core/track_request.html', context)


def request_service_view(request):
    service_id = request.GET.get('service_id')
    initial_service = None
    if service_id:
        initial_service = Service.objects.filter(id=service_id).first()

    initial_data = {}
    if initial_service:
        initial_data['service'] = initial_service
    if request.user.is_authenticated:
        if request.user.first_name:
            initial_data['full_name'] = request.user.first_name
        if request.user.email:
            initial_data['email'] = request.user.email

    form = ServiceRequestForm(initial=initial_data if initial_data else None)

    if request.method == 'POST':
        form = ServiceRequestForm(request.POST, request.FILES)
        if form.is_valid():
            req_obj = form.save(commit=False)
            if req_obj.service:
                req_obj.service_charge = req_obj.service.homline_charge
                req_obj.portal_fee = req_obj.service.third_party_fee
            if request.user.is_authenticated:
                req_obj.user = request.user
            req_obj.save()
            
            # Create initial timeline log
            ServiceRequestLog.objects.create(
                request=req_obj,
                status='Pending',
                title='Request Form Submitted',
                description='Your online application request has been received by HOMline support team.'
            )
            
            messages.success(
                request, 
                f"Your request has been registered! Request ID: {req_obj.request_id}."
            )
            return redirect('track_request_with_id', request_id=req_obj.request_id)

    return render(request, 'core/request_service.html', {'form': form, 'selected_service': initial_service})


def receipt_view(request, request_id):
    req_obj = get_object_or_404(ServiceRequest, request_id__iexact=request_id)
    track_url = request.build_absolute_uri(reverse('track_request_with_id', kwargs={'request_id': req_obj.request_id}))
    qr_code_url = f"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={urllib.parse.quote(track_url)}"
    return render(request, 'core/receipt.html', {
        'req_obj': req_obj,
        'qr_code_url': qr_code_url,
    })


@staff_member_required(login_url='admin:login')
def private_request_document_view(request, request_id):
    req_obj = get_object_or_404(ServiceRequest, request_id__iexact=request_id)
    if not request.user.has_perm('core.view_servicerequest'):
        raise PermissionDenied
    if not req_obj.document_upload:
        from django.http import Http404
        raise Http404('No document was uploaded for this request.')
    return FileResponse(
        req_obj.document_upload.open('rb'),
        as_attachment=True,
        filename=Path(req_obj.document_upload.name).name,
    )


def policy_view(request, policy_name):
    policies = {
        'terms': {
            'title': 'Terms & Conditions',
            'content': '''
            <h3>1. Introduction</h3>
            <p>Welcome to HOMline DIGI seva ("HOMline"). By accessing or using our services, website, and support channels (Call, WhatsApp, Email), you agree to comply with and be bound by these Terms & Conditions.</p>

            <h3>2. Nature of Service</h3>
            <p>HOMline DIGI seva is an independent digital service assistance platform that guides and assists users with online form submissions, portal registrations, documentation, and digital application processes. <strong>HOMline is NOT a government agency or official department.</strong></p>

            <h3>3. Service Disclaimer & Decision Authority</h3>
            <p>HOMline provides technical and operational assistance for supported online applications. Final approval, eligibility determination, issuance, timelines, and legal validity of any document or service remain exclusively with the respective official government authority, educational institution, or third-party service provider.</p>
            '''
        },
        'privacy': {
            'title': 'Privacy Policy',
            'content': '''
            <h3>1. Data Collection</h3>
            <p>HOMline DIGI seva collects personal details such as name, contact number, email address, and uploaded documents strictly for fulfilling your requested online service.</p>
            <h3>2. Data Confidentiality</h3>
            <p>We treat all customer documents and sensitive information with high confidentiality and appropriate security measures.</p>
            '''
        },
        'refund': {
            'title': 'Refund Policy',
            'content': '''
            <h3>1. Service Charge Refund</h3>
            <p>HOMline service fees cover assistance and processing work. If a request is cancelled before processing has initiated, a refund may be granted.</p>
            '''
        },
        'cancellation': {
            'title': 'Cancellation Policy',
            'content': '''
            <h3>1. Request Cancellation</h3>
            <p>Customers can request cancellation by calling 6282268453 or via WhatsApp before application submission.</p>
            '''
        },
        'data-protection': {
            'title': 'Data Protection & Confidentiality',
            'content': '''
            <h3>1. Security Practices</h3>
            <p>HOMline employs encrypted digital transmission and verified support staff for identity protection.</p>
            '''
        },
        'disclaimer': {
            'title': 'Service Disclaimer',
            'content': '''
            <div class="alert alert-warning p-4 rounded-3">
                <h5 class="fw-bold mb-2"><i class="bi bi-exclamation-triangle-fill me-2"></i>Official Notice & Disclaimer</h5>
                <p class="mb-0">HOMline DIGI seva provides digital assistance and guidance for supported online services. Availability, processing time, eligibility, approval and final decisions are determined solely by the respective government authority, board, institution or third-party service provider.</p>
            </div>
            '''
        }
    }

    policy_data = policies.get(policy_name, policies['disclaimer'])
    return render(request, 'core/policy.html', {'policy': policy_data, 'policy_name': policy_name})


def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    next_url = request.GET.get('next') or request.POST.get('next') or 'dashboard'
    form = UserLoginForm()

    if request.method == 'POST':
        form = UserLoginForm(request.POST)
        if form.is_valid():
            username_or_email = form.cleaned_data['username'].strip()
            password = form.cleaned_data['password']
            remember_me = form.cleaned_data.get('remember_me', True)

            # Check if user entered an email instead of username
            user_obj = None
            if '@' in username_or_email:
                user_match = User.objects.filter(email__iexact=username_or_email).first()
                if user_match:
                    user_obj = authenticate(request, username=user_match.username, password=password)
            if not user_obj:
                user_obj = authenticate(request, username=username_or_email, password=password)

            if user_obj is not None:
                if user_obj.is_active:
                    login(request, user_obj)
                    if remember_me:
                        request.session.set_expiry(1209600)  # 2 weeks
                    else:
                        request.session.set_expiry(0)  # expires on browser close

                    # Auto-link any previous guest service requests or memberships matching email
                    if user_obj.email:
                        ServiceRequest.objects.filter(email__iexact=user_obj.email, user__isnull=True).update(user=user_obj)
                        MembershipEnquiry.objects.filter(email__iexact=user_obj.email, user__isnull=True).update(user=user_obj)

                    messages.success(request, f"Welcome back, {user_obj.first_name or user_obj.username}!")
                    if next_url and next_url != 'dashboard' and next_url.startswith('/') and not next_url.startswith('//'):
                        return redirect(next_url)
                    return redirect('dashboard')
                else:
                    messages.error(request, "This account is currently inactive. Please contact support.")
            else:
                messages.error(request, "Invalid username or password. Please try again.")

    return render(request, 'core/login.html', {'form': form, 'next': next_url, 'active_tab': 'login'})


def signup_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    form = UserRegistrationForm()

    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.first_name = form.cleaned_data.get('full_name', '')
            user.is_staff = False
            user.is_superuser = False
            user.save()

            # Auto-link any prior guest requests with this email
            if user.email:
                ServiceRequest.objects.filter(email__iexact=user.email, user__isnull=True).update(user=user)
                MembershipEnquiry.objects.filter(email__iexact=user.email, user__isnull=True).update(user=user)

            authenticated_user = authenticate(
                request, 
                username=form.cleaned_data['username'], 
                password=form.cleaned_data['password']
            )
            if authenticated_user:
                login(request, authenticated_user)

            messages.success(
                request, 
                f"Welcome to HOMline, {user.first_name or user.username}! Your account has been created."
            )
            return redirect('dashboard')

    return render(request, 'core/signup.html', {'form': form, 'active_tab': 'signup'})


def logout_view(request):
    if request.user.is_authenticated:
        logout(request)
        messages.info(request, "You have been signed out safely. Come back anytime!")
    return redirect('home')


@login_required(login_url='login')
def dashboard_view(request):
    user = request.user

    # Auto-link any unassociated requests or memberships matching user's email
    if user.email:
        ServiceRequest.objects.filter(email__iexact=user.email, user__isnull=True).update(user=user)
        MembershipEnquiry.objects.filter(email__iexact=user.email, user__isnull=True).update(user=user)

    profile_form = UserProfileForm(instance=user)
    password_form = PasswordChangeForm(user=user)
    link_form = LinkRequestForm()

    if request.method == 'POST':
        action = request.POST.get('action')

        if action == 'update_profile':
            profile_form = UserProfileForm(request.POST, instance=user)
            if profile_form.is_valid():
                profile_form.save()
                messages.success(request, "Your profile information has been updated successfully.")
                return redirect('dashboard')
            else:
                messages.error(request, "Please correct the errors in your profile form.")

        elif action == 'change_password':
            password_form = PasswordChangeForm(user=user, data=request.POST)
            if password_form.is_valid():
                updated_user = password_form.save()
                update_session_auth_hash(request, updated_user)
                messages.success(request, "Your password has been changed successfully.")
                return redirect('dashboard')
            else:
                messages.error(request, "Failed to update password. Please check the error details below.")

        elif action == 'link_request':
            link_form = LinkRequestForm(request.POST)
            if link_form.is_valid():
                req_id = link_form.cleaned_data['request_id'].strip().upper()
                req_obj = ServiceRequest.objects.filter(request_id__iexact=req_id).first()
                if not req_obj:
                    messages.error(request, f"No service request found with ID '{req_id}'.")
                elif req_obj.user == user:
                    messages.info(request, f"Request {req_id} is already linked to your account.")
                elif req_obj.user is not None and req_obj.user != user:
                    messages.error(request, f"Request {req_id} is associated with another account.")
                else:
                    req_obj.user = user
                    req_obj.save(update_fields=['user'])
                    messages.success(request, f"Service Request {req_id} ({req_obj.get_service_title()}) successfully linked to your account!")
                    return redirect('dashboard')

    # Fetch user requests
    user_requests = ServiceRequest.objects.filter(user=user).select_related('service').order_by('-created_at')

    # Summary statistics
    total_requests = user_requests.count()
    pending_count = user_requests.filter(status='Pending').count()
    processing_count = user_requests.filter(status='Processing').count()
    completed_count = user_requests.filter(status='Completed').count()

    # Fetch user memberships
    user_memberships = MembershipEnquiry.objects.filter(user=user).select_related('preferred_plan').order_by('-created_at')
    active_membership = user_memberships.filter(status__in=['Active', 'Approved']).first() or user_memberships.first()

    context = {
        'user_requests': user_requests,
        'user_memberships': user_memberships,
        'active_membership': active_membership,
        'total_requests': total_requests,
        'pending_count': pending_count,
        'processing_count': processing_count,
        'completed_count': completed_count,
        'profile_form': profile_form,
        'password_form': password_form,
        'link_form': link_form,
        'active_tab': 'dashboard',
    }
    return render(request, 'core/dashboard.html', context)


