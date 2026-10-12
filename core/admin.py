import csv
import urllib.parse
from django.contrib import admin
from django.http import HttpResponse
from django.utils.html import format_html
from django.urls import reverse
from django import forms
from django.db import transaction
from django.db.models import Count, Q
from .models import (
    Category, Service, Update, MembershipPlan, 
    MembershipEnquiry, ContactEnquiry, ServiceRequest, ServiceRequestLog, FAQ, CustomerReview
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
    extra_context['total_contact_enquiries'] = ContactEnquiry.objects.count()
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


def export_requests_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="homline_service_requests.csv"'
    writer = csv.writer(response)
    writer.writerow(['Request ID', 'Full Name', 'Mobile', 'Email', 'Service', 'Status', 'Preference', 'Created At'])
    for obj in queryset:
        writer.writerow([
            obj.request_id,
            obj.full_name,
            obj.mobile,
            obj.email or '',
            obj.get_service_title(),
            obj.status,
            obj.contact_preference,
            obj.created_at.strftime('%Y-%m-%d %H:%M:%S')
        ])
    return response

export_requests_csv.short_description = "📊 Export Selected Requests to CSV"


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
    list_display = ('name', 'contact_info', 'plan_badge', 'quick_whatsapp', 'created_at')
    list_filter = ('preferred_plan', 'created_at')
    search_fields = ('name', 'mobile', 'email')

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

    def quick_whatsapp(self, obj):
        clean_mob = "".join([c for c in obj.mobile if c.isdigit()])
        if len(clean_mob) == 10:
            clean_mob = "91" + clean_mob
        plan_name = obj.preferred_plan.name if obj.preferred_plan else "HOMline Membership"
        msg = f"Hi {obj.name}, HOMline support here regarding your enquiry for {plan_name}."
        url = f"https://wa.me/{clean_mob}?text={urllib.parse.quote(msg)}"
        return format_html(
            '<a href="{}" target="_blank" style="display: inline-flex; align-items: center; gap: 4px; background: #25d366; color: white; padding: 4px 10px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600;">'
            '<i class="bi bi-whatsapp"></i> Chat'
            '</a>',
            url
        )
    quick_whatsapp.short_description = "WhatsApp"


class ServiceRequestAdminForm(forms.ModelForm):
    class Meta:
        model = ServiceRequest
        fields = '__all__'
        widgets = {'document_upload': forms.FileInput(attrs={'accept': '.pdf,.doc,.docx,.jpg,.jpeg,.png'})}


@admin.register(ContactEnquiry)
class ContactEnquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'mobile', 'quick_actions', 'created_at')
    search_fields = ('name', 'mobile', 'message')
    list_filter = ('created_at',)
    readonly_fields = ('created_at',)
    fields = ('name', 'mobile', 'message', 'created_at')

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


@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    form = ServiceRequestAdminForm
    list_display = (
        'request_id_badge', 
        'customer_card', 
        'service_display', 
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
        ('System Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('request_id', 'created_at', 'updated_at', 'document_download')

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
