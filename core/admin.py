import csv
import urllib.parse
import secrets
from datetime import timedelta
from django.contrib import admin
from django.http import HttpResponse
from django.utils.html import format_html
from django.utils import timezone
from django.urls import reverse
from django import forms
from django.db import transaction
from django.db.models import Count, Q
from django.contrib.auth.models import User, Permission
from django.contrib.auth.admin import UserAdmin

from .models import (
    Category, Service, Update, MembershipPlan, 
    MembershipEnquiry, ContactEnquiry, ServiceRequest, ServiceRequestLog, 
    FAQ, CustomerReview, Announcement, PwDRequest, ComplaintSuggestion
)


# Admin Branding Configuration
admin.site.site_header = "HOMline DIGI seva — Operations Panel"
admin.site.site_title = "HOMline Admin"
admin.site.index_title = "Service Operations & Request Hub"

# Inject Custom Interactive KPI Dashboard Context into Admin Index
_orig_admin_index = admin.site.index

def custom_admin_index(request, extra_context=None):
    extra_context = extra_context or {}
    extra_context['total_requests'] = ServiceRequest.objects.count()
    extra_context['pending_requests'] = ServiceRequest.objects.filter(status='Pending').count()
    extra_context['processing_requests'] = ServiceRequest.objects.filter(status='Processing').count()
    extra_context['review_requests'] = ServiceRequest.objects.filter(status='Under Review').count()
    extra_context['completed_requests'] = ServiceRequest.objects.filter(status='Completed').count()
    extra_context['total_services'] = Service.objects.count()
    extra_context['total_categories'] = Category.objects.count()
    extra_context['total_enquiries'] = MembershipEnquiry.objects.count()
    extra_context['approved_memberships'] = MembershipEnquiry.objects.filter(status__in=['Approved', 'Active']).count()
    extra_context['total_contact_enquiries'] = ContactEnquiry.objects.count()
    extra_context['total_pwd_requests'] = PwDRequest.objects.count()
    extra_context['pending_pwd_requests'] = PwDRequest.objects.filter(status='Pending').count()
    extra_context['total_complaints'] = ComplaintSuggestion.objects.count()
    extra_context['pending_complaints'] = ComplaintSuggestion.objects.filter(status='Received').count()
    extra_context['total_announcements'] = Announcement.objects.count()

    recent_query = request.GET.get('request_search', '').strip()
    recent_requests = ServiceRequest.objects.select_related('service').order_by('-created_at')
    if recent_query:
        recent_requests = recent_requests.filter(
            Q(request_id__icontains=recent_query) |
            Q(full_name__icontains=recent_query) |
            Q(mobile__icontains=recent_query) |
            Q(service__title__icontains=recent_query) |
            Q(service_name_manual__icontains=recent_query)
        )
    extra_context['recent_query'] = recent_query
    extra_context['recent_requests'] = recent_requests[:8]
    return _orig_admin_index(request, extra_context=extra_context)

admin.site.index = custom_admin_index


# Custom User Admin for Seamless Staff Access & Role Management
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

@admin.register(User)
class HOMlineUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'login_access_badge', 'staff_role_tag', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    actions = ['grant_operations_staff_access', 'grant_superuser_admin_access', 'revoke_staff_access']

    def login_access_badge(self, obj):
        if obj.is_staff or obj.is_superuser:
            return format_html('<span style="background: #dcfce7; color: #15803d; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 11px;">{}</span>', '✅ Login Enabled')
        return format_html('<span style="background: #fee2e2; color: #b91c1c; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 11px;">{}</span>', '❌ No Login Access')
    login_access_badge.short_description = "Admin Access"

    def staff_role_tag(self, obj):
        if obj.is_superuser:
            return format_html('<span style="background: #ede9fe; color: #6d28d9; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 11px;">{}</span>', '👑 Superadmin')
        elif obj.is_staff:
            return format_html('<span style="background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 11px;">{}</span>', '⚡ Operations Staff')
        return '-'
    staff_role_tag.short_description = "Role"

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        # When user is saved as staff, grant core app permissions so they don't get permission errors
        if obj.is_staff and not obj.is_superuser:
            core_perms = Permission.objects.filter(content_type__app_label='core')
            obj.user_permissions.add(*core_perms)

    def grant_operations_staff_access(self, request, queryset):
        core_perms = Permission.objects.filter(content_type__app_label='core')
        count = 0
        for user in queryset:
            user.is_staff = True
            user.is_active = True
            user.save()
            user.user_permissions.add(*core_perms)
            count += 1
        self.message_user(request, f"{count} user(s) granted HOMline Operations Staff Access (Login enabled with full core permissions).")
    grant_operations_staff_access.short_description = "⚡ Grant Staff Login Access (Operations & Core Permissions)"

    def grant_superuser_admin_access(self, request, queryset):
        queryset.update(is_staff=True, is_superuser=True, is_active=True)
        self.message_user(request, "Selected user(s) granted Superuser Administrator status.")
    grant_superuser_admin_access.short_description = "👑 Grant Superuser Admin Access"

    def revoke_staff_access(self, request, queryset):
        queryset.update(is_staff=False, is_superuser=False)
        self.message_user(request, "Staff login access revoked for selected user(s).")
    revoke_staff_access.short_description = "🚫 Revoke Staff Login Access"


def export_requests_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="homline_service_requests.csv"'
    writer = csv.writer(response)
    writer.writerow(['Request ID', 'Full Name', 'Mobile', 'Email', 'Service', 'Service Charge', 'Govt Fee', 'Status', 'Preference', 'Created At'])
    for obj in queryset:
        writer.writerow([
            obj.request_id,
            obj.full_name,
            obj.mobile,
            obj.email or '',
            obj.get_service_title(),
            obj.service_charge,
            obj.portal_fee,
            obj.status,
            obj.contact_preference,
            obj.created_at.strftime('%Y-%m-%d %H:%M:%S')
        ])
    return response

export_requests_csv.short_description = "📊 Export Selected Requests to CSV"


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('badge_tag', 'message', 'link_url', 'is_active', 'order', 'created_at')
    list_editable = ('is_active', 'order')
    list_filter = ('is_active',)
    search_fields = ('message', 'badge_text')

    def badge_tag(self, obj):
        return format_html(
            '<span style="background: #fef3c7; color: #92400e; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 11px;">{}</span>',
            obj.badge_text
        )
    badge_tag.short_description = "Badge"


class ServiceRequestLogInline(admin.TabularInline):
    model = ServiceRequestLog
    extra = 0
    fields = ('status', 'title', 'description', 'created_at')
    readonly_fields = ('created_at',)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category_name', 'service_count_badge', 'order')
    list_display_links = ('category_name',)
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description', 'slug')
    list_editable = ('order',)
    list_per_page = 25
    ordering = ('order', 'name')
    fieldsets = (
        ('Category details', {'fields': ('name', 'slug', 'description')}),
        ('Appearance and order', {
            'fields': ('icon_class', 'order'),
            'description': 'Use a Bootstrap icon class, for example bi-shield-check or bi-mortarboard-fill.'
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_service_count=Count('services'))

    @admin.display(description='Category', ordering='name')
    def category_name(self, obj):
        return format_html(
            '<span class="admin-category-icon"><i class="bi {}" aria-hidden="true"></i></span><span class="admin-category-name">{}</span><span class="admin-category-slug">{}</span>',
            obj.icon_class, obj.name, obj.slug
        )

    @admin.display(description='Services', ordering='_service_count')
    def service_count_badge(self, obj):
        return format_html('<span class="admin-count-badge">{} service{}</span>', obj._service_count, '' if obj._service_count == 1 else 's')


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'category_badge', 'homline_charge', 'third_party_fee', 'badge_tag', 'is_featured')
    list_filter = ('category', 'is_featured')
    search_fields = ('title', 'short_summary', 'description')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('is_featured',)

    def category_badge(self, obj):
        return format_html(
            '<span style="background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 6px; font-weight: 600; font-size: 11px;">{}</span>',
            obj.category.name
        )
    category_badge.short_description = "Category"
    category_badge.admin_order_field = "category"

    def badge_tag(self, obj):
        if obj.badge:
            return format_html(
                '<span style="background: #fef3c7; color: #92400e; padding: 3px 8px; border-radius: 12px; font-weight: 700; font-size: 11px;">{}</span>',
                obj.badge
            )
        return '-'
    badge_tag.short_description = "Badge"


@admin.register(Update)
class UpdateAdmin(admin.ModelAdmin):
    list_display = ('title', 'tag_badge', 'published_at', 'is_featured')
    list_filter = ('category_tag', 'is_featured')
    search_fields = ('title', 'summary', 'content')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('is_featured',)

    def tag_badge(self, obj):
        colors = {
            'Service Update': ('#0d9488', '#ccfbf1'),
            'Important Notice': ('#dc2626', '#fee2e2'),
            'Service Availability Update': ('#d97706', '#fef3c7'),
            'General News': ('#475569', '#f1f5f9'),
        }
        fg, bg = colors.get(obj.category_tag, ('#0f172a', '#e2e8f0'))
        return format_html(
            '<span style="background: {}; color: {}; padding: 3px 8px; border-radius: 12px; font-weight: 600; font-size: 11px;">{}</span>',
            bg, fg, obj.category_tag
        )
    tag_badge.short_description = "Tag"


@admin.register(MembershipPlan)
class MembershipPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_popular', 'order')
    list_editable = ('is_popular', 'order')


@admin.register(MembershipEnquiry)
class MembershipEnquiryAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'place', 'contact_info', 'plan_badge', 
        'membership_code_badge', 'status_badge', 
        'quick_whatsapp_action', 'view_card_btn', 'valid_till', 'created_at'
    )
    list_filter = ('status', 'preferred_plan', 'created_at')
    search_fields = ('name', 'mobile', 'email', 'place', 'membership_code')
    readonly_fields = ('created_at',)
    actions = ['verify_and_approve_membership', 'mark_as_active', 'mark_as_closed']

    def contact_info(self, obj):
        email_line = format_html('<br><span style="color: #64748b; font-size: 11px;">{}</span>', obj.email) if obj.email else ''
        return format_html('<strong>{}</strong>{}', obj.mobile, email_line)
    contact_info.short_description = "Contact"

    def plan_badge(self, obj):
        if obj.preferred_plan:
            return format_html(
                '<span style="background: #ede9fe; color: #6d28d9; padding: 3px 8px; border-radius: 6px; font-weight: 600; font-size: 11px;">{}</span>',
                obj.preferred_plan.name
            )
        return '<span style="color: #94a3b8;">General</span>'
    plan_badge.short_description = "Preferred Plan"

    def membership_code_badge(self, obj):
        if obj.membership_code:
            return format_html(
                '<span style="font-family: monospace; font-weight: 700; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 3px 8px; border-radius: 6px; font-size: 11px;">{}</span>',
                obj.membership_code
            )
        return '<span style="color: #94a3b8; font-size: 11px;">Not Issued</span>'
    membership_code_badge.short_description = "Membership Code"

    def status_badge(self, obj):
        colors = {
            'Pending': ('#b45309', '#fef3c7'),
            'Processing': ('#0284c7', '#e0f2fe'),
            'Approved': ('#15803d', '#dcfce7'),
            'Active': ('#059669', '#d1fae5'),
            'Answered': ('#4f46e5', '#e0e7ff'),
            'Closed': ('#64748b', '#f1f5f9'),
        }
        fg, bg = colors.get(obj.status, ('#475569', '#f1f5f9'))
        return format_html(
            '<span style="background: {}; color: {}; padding: 3px 8px; border-radius: 12px; font-weight: 700; font-size: 11px;">{}</span>',
            bg, fg, obj.status
        )
    status_badge.short_description = "Status"

    def quick_whatsapp_action(self, obj):
        clean_mob = "".join([c for c in obj.mobile if c.isdigit()])
        if len(clean_mob) == 10:
            clean_mob = "91" + clean_mob
        plan_name = obj.preferred_plan.name if obj.preferred_plan else "HOMline Membership"
        
        if obj.status in ('Approved', 'Active') and obj.membership_code:
            valid_str = obj.valid_till.strftime('%d-%m-%Y') if obj.valid_till else "1 Year"
            msg = (
                f"Dear {obj.name}, Greetings from HOMline DIGI seva! "
                f"Your {plan_name} has been APPROVED! "
                f"Unique Membership Code: {obj.membership_code}. "
                f"Valid Till: {valid_str}. "
                f"Open Date: {obj.open_date.strftime('%d-%m-%Y') if obj.open_date else 'Today'}. "
                f"You can view and download your official Membership Card on our website. "
                f"Thank you for choosing HOMline!"
            )
            btn_label = "Send Approval"
            btn_color = "#16a34a"
        else:
            msg = f"Hi {obj.name}, HOMline support team here regarding your enquiry for {plan_name}."
            btn_label = "Chat"
            btn_color = "#0d9488"

        url = f"https://wa.me/{clean_mob}?text={urllib.parse.quote(msg)}"
        return format_html(
            '<a href="{}" target="_blank" style="display: inline-flex; align-items: center; gap: 4px; background: {}; color: white; padding: 4px 10px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: 700;">'
            '<i class="bi bi-whatsapp"></i> {}</a>',
            url, btn_color, btn_label
        )
    quick_whatsapp_action.short_description = "WhatsApp"

    def view_card_btn(self, obj):
        if obj.membership_code:
            url = reverse('membership_card', kwargs={'membership_code': obj.membership_code})
            return format_html(
                '<a href="{}" target="_blank" style="display: inline-flex; align-items: center; gap: 4px; background: #1e40af; color: white; padding: 4px 8px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: 600;">'
                '<i class="bi bi-person-badge"></i> Card</a>',
                url
            )
        return '-'
    view_card_btn.short_description = "Card"

    def verify_and_approve_membership(self, request, queryset):
        count = 0
        for obj in queryset:
            if not obj.membership_code:
                while True:
                    code = f"HOM-MBR-{timezone.localdate().year}-{secrets.token_hex(5).upper()}"
                    if not MembershipEnquiry.objects.filter(membership_code=code).exists():
                        break
                obj.membership_code = code
            obj.status = 'Approved'
            if not obj.open_date:
                obj.open_date = timezone.localdate()
            if not obj.valid_till:
                obj.valid_till = timezone.localdate() + timedelta(days=365)
            obj.save()
            count += 1
        self.message_user(request, f"{count} membership application(s) verified & approved with unique membership code.")
    verify_and_approve_membership.short_description = "✅ Verify & Approve (Generate Code & 1-Yr Validity)"

    def mark_as_active(self, request, queryset):
        queryset.update(status='Active')
        self.message_user(request, "Selected membership(s) marked as Active.")
    mark_as_active.short_description = "🌟 Mark as Active"

    def mark_as_closed(self, request, queryset):
        queryset.update(status='Closed')
        self.message_user(request, "Selected membership(s) marked as Closed.")
    mark_as_closed.short_description = "📁 Mark as Closed"


@admin.register(PwDRequest)
class PwDRequestAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'place', 'mobile', 'assistance_type_badge', 
        'service_needed', 'status_badge', 'quick_actions', 'created_at'
    )
    list_filter = ('status', 'assistance_type', 'created_at')
    search_fields = ('name', 'mobile', 'place', 'service_needed', 'details', 'admin_notes')
    readonly_fields = ('created_at',)
    actions = ['mark_as_processing', 'mark_as_answered', 'mark_as_closed']

    def assistance_type_badge(self, obj):
        return format_html(
            '<span style="background: #e0e7ff; color: #3730a3; padding: 3px 8px; border-radius: 6px; font-weight: 600; font-size: 11px;">'
            '<i class="bi bi-universal-access"></i> {}'
            '</span>',
            obj.assistance_type
        )
    assistance_type_badge.short_description = "Assistance Type"

    def status_badge(self, obj):
        colors = {
            'Pending': ('#b45309', '#fef3c7'),
            'Processing': ('#0284c7', '#e0f2fe'),
            'Answered': ('#15803d', '#dcfce7'),
            'Closed': ('#64748b', '#f1f5f9'),
        }
        fg, bg = colors.get(obj.status, ('#475569', '#f1f5f9'))
        return format_html(
            '<span style="background: {}; color: {}; padding: 3px 8px; border-radius: 12px; font-weight: 700; font-size: 11px;">{}</span>',
            bg, fg, obj.status
        )
    status_badge.short_description = "Status"

    def quick_actions(self, obj):
        clean_mob = "".join([c for c in obj.mobile if c.isdigit()])
        if len(clean_mob) == 10:
            clean_mob = "91" + clean_mob
        msg = f"Hi {obj.name}, HOMline PwD-Friendly Assistance Desk here regarding your request for {obj.service_needed}. How can we support you best?"
        wa_url = f"https://wa.me/{clean_mob}?text={urllib.parse.quote(msg)}"
        return format_html(
            '<a href="tel:{}" style="margin-right: 6px; display: inline-flex; align-items: center; gap: 3px; background: #1e293b; color: white; padding: 4px 8px; border-radius: 6px; text-decoration: none; font-size: 11px;"><i class="bi bi-telephone-fill"></i> Call</a>'
            '<a href="{}" target="_blank" style="display: inline-flex; align-items: center; gap: 3px; background: #22c55e; color: white; padding: 4px 8px; border-radius: 6px; text-decoration: none; font-size: 11px;"><i class="bi bi-whatsapp"></i> WhatsApp</a>',
            obj.mobile, wa_url
        )
    quick_actions.short_description = "Follow up"

    def mark_as_processing(self, request, queryset):
        queryset.update(status='Processing')
        self.message_user(request, "Selected PwD request(s) marked as Processing.")
    mark_as_processing.short_description = "Status ➔ Processing"

    def mark_as_answered(self, request, queryset):
        queryset.update(status='Answered')
        self.message_user(request, "Selected PwD request(s) marked as Answered.")
    mark_as_answered.short_description = "Status ➔ Answered"

    def mark_as_closed(self, request, queryset):
        queryset.update(status='Closed')
        self.message_user(request, "Selected PwD request(s) marked as Closed.")
    mark_as_closed.short_description = "Status ➔ Closed"


@admin.register(ComplaintSuggestion)
class ComplaintSuggestionAdmin(admin.ModelAdmin):
    list_display = (
        'reference_no', 'type_badge', 'subject', 'name', 'mobile', 'priority',
        'status_badge', 'quick_actions', 'created_at'
    )
    list_filter = ('entry_type', 'status', 'priority', 'is_member', 'assigned_to', 'created_at')
    search_fields = ('reference_no', 'name', 'mobile', 'email', 'subject', 'details', 'admin_notes', 'membership_id', 'related_reference')
    readonly_fields = ('reference_no', 'created_at', 'document_download', 'document_original_name')
    fieldsets = (
        ('Submission', {'fields': ('reference_no', 'created_at', 'entry_type', 'subject', 'details', 'consent')}),
        ('Customer', {'fields': ('name', 'mobile', 'email', 'is_member', 'membership_id')}),
        ('Related service', {'fields': ('related_to_service', 'service_name', 'related_reference')}),
        ('Supporting document (private)', {'fields': ('document_download', 'document_original_name')}),
        ('Preferred response', {'fields': ('preferred_response', 'preferred_time')}),
        ('Internal tracking', {'fields': ('status', 'priority', 'assigned_to', 'action_taken', 'response_date', 'resolution', 'admin_notes')}),
    )
    actions = ['mark_as_under_review', 'mark_as_action_required', 'mark_as_escalated', 'mark_as_resolved', 'mark_as_closed']

    def document_download(self, obj):
        if not obj or not obj.supporting_document:
            return 'No document uploaded'
        url = reverse('private_complaint_document', kwargs={'reference_no': obj.reference_no})
        return format_html('<a href="{}">Download supporting document</a>', url)
    document_download.short_description = 'Supporting document'

    def type_badge(self, obj):
        return format_html('<span style="background: #e0f2fe; color: #0c4a6e; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 11px;">{}</span>', obj.entry_type)
    type_badge.short_description = "Type"

    def status_badge(self, obj):
        colors = {
            'Received': ('#b45309', '#fef3c7'),
            'Under Review': ('#0284c7', '#e0f2fe'),
            'Action Required': ('#9a3412', '#ffedd5'),
            'Escalated': ('#b91c1c', '#fee2e2'),
            'Resolved': ('#15803d', '#dcfce7'),
            'Closed': ('#64748b', '#f1f5f9'),
        }
        fg, bg = colors.get(obj.status, ('#475569', '#f1f5f9'))
        return format_html(
            '<span style="background: {}; color: {}; padding: 3px 8px; border-radius: 12px; font-weight: 700; font-size: 11px;">{}</span>',
            bg, fg, obj.status
        )
    status_badge.short_description = "Status"

    def quick_actions(self, obj):
        clean_mob = "".join([c for c in obj.mobile if c.isdigit()])
        if len(clean_mob) == 10:
            clean_mob = "91" + clean_mob
        msg = f"Hi {obj.name}, HOMline management team following up on your {obj.entry_type} ({obj.reference_no})."
        wa_url = f"https://wa.me/{clean_mob}?text={urllib.parse.quote(msg)}"
        return format_html(
            '<a href="tel:{}" style="margin-right: 6px; display: inline-flex; align-items: center; gap: 3px; background: #1e293b; color: white; padding: 4px 8px; border-radius: 6px; text-decoration: none; font-size: 11px;"><i class="bi bi-telephone-fill"></i> Call</a>'
            '<a href="{}" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 3px; background: #22c55e; color: white; padding: 4px 8px; border-radius: 6px; text-decoration: none; font-size: 11px;"><i class="bi bi-whatsapp"></i> WhatsApp</a>',
            obj.mobile, wa_url
        )
    quick_actions.short_description = "Follow up"

    def _set_status(self, request, queryset, status):
        queryset.update(status=status)
        self.message_user(request, f"Selected item(s) marked as {status}.")

    def mark_as_under_review(self, request, queryset):
        self._set_status(request, queryset, 'Under Review')
    mark_as_under_review.short_description = "Status ➔ Under Review"

    def mark_as_action_required(self, request, queryset):
        self._set_status(request, queryset, 'Action Required')
    mark_as_action_required.short_description = "Status ➔ Action Required"

    def mark_as_escalated(self, request, queryset):
        self._set_status(request, queryset, 'Escalated')
    mark_as_escalated.short_description = "Status ➔ Escalated"

    def mark_as_resolved(self, request, queryset):
        self._set_status(request, queryset, 'Resolved')
    mark_as_resolved.short_description = "Status ➔ Resolved"

    def mark_as_closed(self, request, queryset):
        self._set_status(request, queryset, 'Closed')
    mark_as_closed.short_description = "Status ➔ Closed"


@admin.register(ContactEnquiry)
class ContactEnquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'mobile', 'status_badge', 'quick_actions', 'created_at')
    search_fields = ('name', 'mobile', 'message')
    list_filter = ('status', 'created_at')
    readonly_fields = ('created_at',)
    fields = ('name', 'mobile', 'message', 'status', 'admin_notes', 'created_at')
    actions = ['mark_as_processing', 'mark_as_answered', 'mark_as_closed']

    def status_badge(self, obj):
        colors = {
            'Pending': ('#b45309', '#fef3c7'),
            'Processing': ('#0284c7', '#e0f2fe'),
            'Answered': ('#15803d', '#dcfce7'),
            'Closed': ('#64748b', '#f1f5f9'),
        }
        fg, bg = colors.get(obj.status, ('#475569', '#f1f5f9'))
        return format_html(
            '<span style="background: {}; color: {}; padding: 3px 8px; border-radius: 12px; font-weight: 700; font-size: 11px;">{}</span>',
            bg, fg, obj.status
        )
    status_badge.short_description = "Status"

    def quick_actions(self, obj):
        digits = ''.join(character for character in obj.mobile if character.isdigit())
        if len(digits) == 10:
            digits = '91' + digits
        message = urllib.parse.quote(f'Hi {obj.name}, HOMline is following up on your contact enquiry.')
        return format_html(
            '<a href="tel:{}">Call</a> &nbsp; <a href="https://wa.me/{}?text={}" target="_blank" rel="noopener">WhatsApp</a>',
            obj.mobile, digits, message
        )
    quick_actions.short_description = 'Follow up'

    def mark_as_processing(self, request, queryset):
        queryset.update(status='Processing')
        self.message_user(request, "Selected enquiry(ies) marked as Processing.")
    mark_as_processing.short_description = "Status ➔ Processing"

    def mark_as_answered(self, request, queryset):
        queryset.update(status='Answered')
        self.message_user(request, "Selected enquiry(ies) marked as Answered.")
    mark_as_answered.short_description = "Status ➔ Answered"

    def mark_as_closed(self, request, queryset):
        queryset.update(status='Closed')
        self.message_user(request, "Selected enquiry(ies) marked as Closed.")
    mark_as_closed.short_description = "Status ➔ Closed"


class ServiceRequestAdminForm(forms.ModelForm):
    class Meta:
        model = ServiceRequest
        fields = '__all__'
        widgets = {'document_upload': forms.FileInput(attrs={'accept': '.pdf,.doc,.docx,.jpg,.jpeg,.png'})}


@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    form = ServiceRequestAdminForm
    list_display = (
        'request_id_badge', 
        'customer_card', 
        'service_display', 
        'pricing_display',
        'status_badge', 
        'quick_actions', 
        'contact_preference', 
        'created_at'
    )
    list_filter = ('status', 'contact_preference', 'service', 'created_at')
    search_fields = ('request_id', 'full_name', 'mobile', 'email', 'requirement_details', 'admin_notes')
    date_hierarchy = 'created_at'
    inlines = [ServiceRequestLogInline]
    actions = [
        export_requests_csv,
        'mark_as_under_review',
        'mark_as_processing',
        'mark_as_information_required',
        'mark_as_completed',
        'mark_as_cancelled',
    ]

    fieldsets = (
        ('Request Reference & Status', {
            'fields': ('request_id', 'status', 'admin_notes')
        }),
        ('Customer Information', {
            'fields': ('full_name', 'mobile', 'email', 'contact_preference')
        }),
        ('Service Details', {
            'fields': ('service', 'service_name_manual', 'requirement_details', 'document_upload', 'document_download')
        }),
        ('Service Pricing & Charges (Editable by Admin)', {
            'fields': ('service_charge', 'portal_fee'),
            'description': 'These charges are visible to the client when they track status or download the receipt.'
        }),
        ('System Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('request_id', 'created_at', 'updated_at', 'document_download')

    def pricing_display(self, obj):
        return format_html(
            '<div style="font-size: 11px;"><strong>HOM:</strong> {}<br><span style="color: #64748b;"><strong>Govt:</strong> {}</span></div>',
            obj.service_charge or '₹150', obj.portal_fee or '₹0'
        )
    pricing_display.short_description = "Rates (Admin Set)"

    def document_download(self, obj):
        if not obj or not obj.document_upload:
            return 'No document uploaded'
        return format_html('<a href="{}">Download uploaded document</a>', reverse('private_request_document', kwargs={'request_id': obj.request_id}))
    document_download.short_description = 'Private document download'

    def save_model(self, request, obj, form, change):
        old_status = None
        if change:
            old_status = ServiceRequest.objects.filter(pk=obj.pk).values_list('status', flat=True).first()
        super().save_model(request, obj, form, change)
        if not change or old_status != obj.status:
            ServiceRequestLog.objects.create(
                request=obj,
                status=obj.status,
                title='Request registered' if not change else f'Status changed to {obj.status}',
                description='Request updated by HOMline support.'
            )

    def request_id_badge(self, obj):
        return format_html(
            '<span style="font-family: \'Plus Jakarta Sans\', monospace; font-weight: 700; color: #1d4ed8; background: #eff6ff; padding: 5px 10px; border-radius: 8px; font-size: 12px; border: 1px solid #bfdbfe; display: inline-block;">{}</span>',
            obj.request_id
        )
    request_id_badge.short_description = "Request ID"
    request_id_badge.admin_order_field = "request_id"

    def customer_card(self, obj):
        email_line = format_html('<div style="font-size: 12px; color: #64748b; margin-top: 2px;">{}</div>', obj.email) if obj.email else ''
        return format_html(
            '<div><strong style="color: #1e293b; font-size: 14px;">{}</strong><div style="font-size: 12px; color: #475569; margin-top: 2px;">📞 {}</div>{}</div>',
            obj.full_name, obj.mobile, email_line
        )
    customer_card.short_description = "Customer"
    customer_card.admin_order_field = "full_name"

    def service_display(self, obj):
        cat_badge = ''
        if obj.service and obj.service.category:
            cat_badge = format_html('<span style="font-size: 11px; background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 6px; display: inline-block; margin-top: 4px; font-weight: 600;">{}</span>', obj.service.category.name)
        return format_html(
            '<div><strong style="color: #1e293b; font-size: 13px;">{}</strong><br>{}</div>',
            obj.get_service_title(),
            cat_badge
        )
    service_display.short_description = "Service"

    def status_badge(self, obj):
        colors = {
            'Pending': ('#b45309', '#fef3c7', '#fde68a', '⏳'),
            'Under Review': ('#7e22ce', '#f3e8ff', '#e9d5ff', '🔍'),
            'Processing': ('#0284c7', '#e0f2fe', '#bae6fd', '⚙️'),
            'Information Required': ('#c2410c', '#ffedd5', '#fed7aa', '⚠️'),
            'Completed': ('#15803d', '#dcfce7', '#bbf7d0', '✅'),
            'Cancelled': ('#b91c1c', '#fee2e2', '#fecaca', '❌'),
        }
        fg, bg, border, icon = colors.get(obj.status, ('#475569', '#f1f5f9', '#e2e8f0', '📋'))
        return format_html(
            '<span style="display: inline-flex; align-items: center; gap: 5px; font-weight: 700; font-size: 12px; color: {}; background: {}; border: 1px solid {}; padding: 4px 12px; border-radius: 20px;">'
            '{} {}'
            '</span>',
            fg, bg, border, icon, obj.status
        )
    status_badge.short_description = "Status"
    status_badge.admin_order_field = "status"

    def quick_actions(self, obj):
        clean_mob = "".join([c for c in obj.mobile if c.isdigit()])
        if len(clean_mob) == 10:
            clean_mob = "91" + clean_mob
        wa_msg = f"Hi {obj.full_name}, HOMline support here regarding your Service Request #{obj.request_id} ({obj.get_service_title()}). Current Status: {obj.status}."
        wa_url = f"https://wa.me/{clean_mob}?text={urllib.parse.quote(wa_msg)}"
        receipt_url = reverse('receipt', kwargs={'request_id': obj.request_id})
        track_url = reverse('track_request_with_id', kwargs={'request_id': obj.request_id})

        return format_html(
            '<div style="display: flex; gap: 6px; align-items: center;">'
            '<a href="{}" target="_blank" title="Chat on WhatsApp" style="display: inline-flex; align-items: center; justify-content: center; background: #22c55e; color: white; width: 30px; height: 30px; border-radius: 8px; text-decoration: none; font-size: 14px; box-shadow: 0 2px 6px rgba(34,197,94,0.3);">'
            '<i class="bi bi-whatsapp"></i></a>'
            '<a href="{}" target="_blank" title="View Official Receipt PDF" style="display: inline-flex; align-items: center; justify-content: center; background: #2563eb; color: white; width: 30px; height: 30px; border-radius: 8px; text-decoration: none; font-size: 14px; box-shadow: 0 2px 6px rgba(37,99,235,0.3);">'
            '<i class="bi bi-file-earmark-text"></i></a>'
            '<a href="{}" target="_blank" title="Open Tracking Page" style="display: inline-flex; align-items: center; justify-content: center; background: #0d9488; color: white; width: 30px; height: 30px; border-radius: 8px; text-decoration: none; font-size: 14px; box-shadow: 0 2px 6px rgba(13,148,136,0.3);">'
            '<i class="bi bi-box-arrow-up-right"></i></a>'
            '</div>',
            wa_url, receipt_url, track_url
        )
    quick_actions.short_description = "Quick Actions"

    # Status Bulk Actions
    def mark_as_under_review(self, request, queryset):
        self._set_status(request, queryset, 'Under Review')
    mark_as_under_review.short_description = "Status ➔ Mark as Under Review"

    def mark_as_processing(self, request, queryset):
        self._set_status(request, queryset, 'Processing')
    mark_as_processing.short_description = "Status ➔ Mark as Processing"

    def mark_as_completed(self, request, queryset):
        self._set_status(request, queryset, 'Completed')
    mark_as_completed.short_description = "Status ➔ Mark as Completed"

    def mark_as_cancelled(self, request, queryset):
        self._set_status(request, queryset, 'Cancelled')
    mark_as_cancelled.short_description = "Status ➔ Mark as Cancelled"

    def mark_as_information_required(self, request, queryset):
        self._set_status(request, queryset, 'Information Required')
    mark_as_information_required.short_description = "Mark as Information Required"

    def _set_status(self, request, queryset, status):
        updated = 0
        with transaction.atomic():
            for obj in queryset.select_for_update().iterator():
                if obj.status == status:
                    continue
                obj.status = status
                obj.save(update_fields=['status', 'updated_at'])
                ServiceRequestLog.objects.create(
                    request=obj,
                    status=status,
                    title=f'Status changed to {status}',
                    description='Status updated by HOMline support.'
                )
                updated += 1
        self.message_user(request, f"{updated} request(s) updated to {status}.")


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'category_badge', 'order')
    list_filter = ('category',)
    search_fields = ('question', 'answer')
    list_editable = ('order',)

    def category_badge(self, obj):
        return format_html(
            '<span style="background: #f1f5f9; color: #334155; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">{}</span>',
            obj.category
        )
    category_badge.short_description = "Category"


@admin.register(CustomerReview)
class CustomerReviewAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'service_used', 'star_rating', 'is_verified', 'created_at')
    list_filter = ('rating', 'is_verified')
    list_editable = ('is_verified',)

    def star_rating(self, obj):
        stars = "★" * obj.rating + "☆" * (5 - obj.rating)
        return format_html('<span style="color: #f59e0b; font-size: 15px; letter-spacing: 2px;">{}</span>', stars)
    star_rating.short_description = "Rating"
