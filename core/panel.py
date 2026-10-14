"""Section config and form helpers shared by the panel API (core/api.py).

Staff: work the request/enquiry queues (create, edit status/notes, bulk status actions, export; no delete).
Admin (superuser): everything staff can, plus delete, site content and user management.
"""
from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission

from .models import (
    Announcement, Category, ContactEnquiry, ComplaintSuggestion, CustomerReview, FAQ,
    MembershipEnquiry, MembershipPlan, PwDRequest, Service, ServiceRequest, Update,
)

User = get_user_model()

# key -> config. queue=True: staff may list/edit; otherwise admin only.
# edit: fields staff may change on a queue item. done: statuses that count as closed.
SECTIONS = {
    'requests': dict(model=ServiceRequest, title='Service requests', icon='bi-folder2-open', queue=True,
                     cols=['request_id', 'full_name', 'get_service_title', 'mobile', 'status', 'created_at'],
                     search=['request_id', 'full_name', 'mobile', 'email', 'requirement_details'],
                     edit=['status', 'service_charge', 'portal_fee', 'admin_notes'],
                     done=['Completed', 'Cancelled'], doc='private_request_document', doc_arg='request_id',
                     filters=['status', 'contact_preference', 'service'], date=True, exclude=['request_id'],
                     actions=[('status:Under Review', 'Mark as Under Review'), ('status:Processing', 'Mark as Processing'),
                              ('status:Information Required', 'Mark as Information Required'), ('status:Completed', 'Mark as Completed'),
                              ('status:Cancelled', 'Mark as Cancelled')],
                     export=['request_id', 'full_name', 'mobile', 'email', 'get_service_title', 'service_charge', 'portal_fee', 'status', 'contact_preference', 'created_at']),
    'membership': dict(model=MembershipEnquiry, title='Memberships', icon='bi-person-badge', queue=True,
                       cols=['name', 'mobile', 'preferred_plan', 'membership_code', 'status', 'created_at'],
                       search=['name', 'mobile', 'email', 'membership_code'],
                       edit=['status', 'membership_code', 'open_date', 'valid_till', 'admin_notes'],
                       done=['Active', 'Answered', 'Closed'], filters=['status', 'preferred_plan'], date=True,
                       actions=[('approve', 'Verify & Approve (code + 1-year validity)'), ('status:Active', 'Mark as Active'), ('status:Closed', 'Mark as Closed')]),
    'contact': dict(model=ContactEnquiry, title='Contact enquiries', icon='bi-chat-dots', queue=True,
                    cols=['name', 'mobile', 'message', 'status', 'created_at'],
                    search=['name', 'mobile', 'message'], edit=['status', 'admin_notes'],
                    done=['Answered', 'Closed'], filters=['status'], date=True,
                    actions=[('status:Processing', 'Mark as Processing'), ('status:Answered', 'Mark as Answered'), ('status:Closed', 'Mark as Closed')]),
    'pwd': dict(model=PwDRequest, title='PwD requests', icon='bi-universal-access', queue=True,
                cols=['name', 'mobile', 'assistance_type', 'service_needed', 'status', 'created_at'],
                search=['name', 'mobile', 'service_needed', 'details'], edit=['status', 'admin_notes'],
                done=['Answered', 'Closed'], filters=['status', 'assistance_type'], date=True,
                actions=[('status:Processing', 'Mark as Processing'), ('status:Answered', 'Mark as Answered'), ('status:Closed', 'Mark as Closed')]),
    'complaints': dict(model=ComplaintSuggestion, title='Complaints & suggestions', icon='bi-megaphone', queue=True,
                       cols=['reference_no', 'entry_type', 'name', 'subject', 'priority', 'status', 'created_at'],
                       search=['reference_no', 'name', 'mobile', 'subject', 'details'],
                       edit=['status', 'priority', 'assigned_to', 'action_taken', 'response_date', 'resolution', 'admin_notes'],
                       done=['Resolved', 'Closed'], doc='private_complaint_document', doc_arg='reference_no',
                       filters=['entry_type', 'status', 'priority', 'is_member', 'assigned_to'], date=True,
                       actions=[('status:Under Review', 'Mark as Under Review'), ('status:Action Required', 'Mark as Action Required'),
                                ('status:Escalated', 'Mark as Escalated'), ('status:Resolved', 'Mark as Resolved'), ('status:Closed', 'Mark as Closed')]),
    # ---- admin only ----
    'services': dict(model=Service, title='Services', icon='bi-grid', cols=['title', 'category', 'homline_charge', 'is_featured'], search=['title', 'short_summary'], filters=['category', 'is_featured']),
    'categories': dict(model=Category, title='Categories', icon='bi-tags', cols=['name', 'order'], search=['name']),
    'updates': dict(model=Update, title='Updates', icon='bi-newspaper', cols=['title', 'category_tag', 'published_at'], search=['title', 'summary'], filters=['category_tag', 'is_featured']),
    'plans': dict(model=MembershipPlan, title='Membership plans', icon='bi-award', cols=['name', 'price', 'is_popular', 'order'], search=['name'], filters=['is_popular']),
    'faqs': dict(model=FAQ, title='FAQs', icon='bi-question-circle', cols=['question', 'category', 'order'], search=['question', 'answer'], filters=['category']),
    'announcements': dict(model=Announcement, title='Announcements', icon='bi-bell', cols=['message', 'badge_text', 'is_active', 'order'], search=['message'], filters=['is_active']),
    'reviews': dict(model=CustomerReview, title='Customer reviews', icon='bi-star', cols=['customer_name', 'service_used', 'rating', 'is_verified'], search=['customer_name', 'review_text'], filters=['rating', 'is_verified']),
}
# Staff can work requests/enquiries (view, add, change; never delete) and only view site content.
STAFF_WORK_MODELS = ['servicerequest', 'servicerequestlog', 'membershipenquiry', 'contactenquiry', 'pwdrequest', 'complaintsuggestion', 'customerreview']
STAFF_VIEW_MODELS = ['category', 'service', 'update', 'membershipplan', 'faq', 'announcement']


def staff_permissions():
    codenames = [f'{a}_{m}' for m in STAFF_WORK_MODELS for a in ('view', 'add', 'change')]
    codenames += [f'view_{m}' for m in STAFF_VIEW_MODELS]
    return Permission.objects.filter(content_type__app_label='core', codename__in=codenames)

USER_COLS = ['username', 'email', 'role', 'is_active', 'date_joined']


def _cell(obj, name):
    val = getattr(obj, name, '')
    val = val() if callable(val) else val
    if isinstance(val, bool):
        return 'Yes' if val else 'No'
    disp = getattr(obj, f'get_{name}_display', None)
    return disp() if disp else ('' if val is None else val)


def _form_class(cfg, full=False):
    """Staff edit only cfg['edit'] on queue items; creating, and admins editing, get every editable field."""
    if cfg.get('queue') and not full:
        return forms.modelform_factory(cfg['model'], fields=cfg['edit'])
    return forms.modelform_factory(cfg['model'], fields='__all__', exclude=cfg.get('exclude'))


def _digits(mobile):
    d = ''.join(c for c in mobile if c.isdigit())
    return '91' + d if len(d) == 10 else d


def row_links(key, obj):
    """Quick-action links shown on queue rows (WhatsApp / call / receipt / tracking / card)."""
    import urllib.parse
    mobile = getattr(obj, 'mobile', '')
    if key == 'requests':
        msg = f'Hi {obj.full_name}, HOMline support here regarding your Service Request #{obj.request_id} ({obj.get_service_title()}). Current Status: {obj.status}.'
        extra = {'receipt': f'/receipt/{obj.request_id}', 'track': f'/track/{obj.request_id}'}
    elif key == 'membership':
        plan = obj.preferred_plan.name if obj.preferred_plan else 'HOMline Membership'
        if obj.status in ('Approved', 'Active') and obj.membership_code:
            valid = obj.valid_till.strftime('%d-%m-%Y') if obj.valid_till else '1 Year'
            opened = obj.open_date.strftime('%d-%m-%Y') if obj.open_date else 'Today'
            msg = (f'Dear {obj.name}, Greetings from HOMline DIGI seva! Your {plan} has been APPROVED! Unique Membership Code: {obj.membership_code}. '
                   f'Valid Till: {valid}. Open Date: {opened}. You can view and download your official Membership Card on our website. Thank you for choosing HOMline!')
        else:
            msg = f'Hi {obj.name}, HOMline support team here regarding your enquiry for {plan}.'
        extra = {'card': f'/membership/card/{obj.membership_code}'} if obj.membership_code else {}
    elif key == 'pwd':
        msg, extra = f'Hi {obj.name}, HOMline PwD-Friendly Assistance Desk here regarding your request for {obj.service_needed}. How can we support you best?', {}
    elif key == 'complaints':
        msg, extra = f'Hi {obj.name}, HOMline management team following up on your {obj.entry_type} ({obj.reference_no}).', {}
    elif key == 'contact':
        msg, extra = f'Hi {obj.name}, HOMline is following up on your contact enquiry.', {}
    else:
        return {}
    return {'wa': f'https://wa.me/{_digits(mobile)}?text={urllib.parse.quote(msg)}', 'tel': f'tel:{mobile}', **extra}


def filter_defs(cfg):
    """Filter dropdown definitions (name, label, options) for a section."""
    model, out = cfg['model'], []
    for name in cfg.get('filters', []):
        f = model._meta.get_field(name)
        if f.choices:
            opts = [{'value': str(v), 'label': str(l)} for v, l in f.choices]
        elif f.is_relation:
            opts = [{'value': str(o.pk), 'label': str(o)} for o in f.related_model.objects.all()[:200]]
        elif f.get_internal_type() == 'BooleanField':
            opts = [{'value': 'true', 'label': 'Yes'}, {'value': 'false', 'label': 'No'}]
        else:
            opts = [{'value': str(v), 'label': str(v)} for v in model.objects.order_by(name).values_list(name, flat=True).distinct()[:50]]
        out.append({'name': name, 'label': str(f.verbose_name).title(), 'options': opts})
    return out


def apply_filters(cfg, qs, params):
    from django.db.models import Q
    q = (params.get('q') or '').strip()
    if q:
        cond = Q()
        for f in cfg['search']:
            cond |= Q(**{f'{f}__icontains': q})
        qs = qs.filter(cond)
    for name in cfg.get('filters', []):
        v = params.get(name)
        if v not in (None, ''):
            qs = qs.filter(**{name: {'true': True, 'false': False}.get(v, v)})
    if cfg.get('date'):
        field = 'published_at' if cfg['model'] is Update else 'created_at'
        if params.get('date_from'):
            qs = qs.filter(**{f'{field}__date__gte': params['date_from']})
        if params.get('date_to'):
            qs = qs.filter(**{f'{field}__date__lte': params['date_to']})
    return qs


def approve_membership(obj):
    """Generate a unique code and 1-year validity (same rules the Django admin action used)."""
    import secrets
    from datetime import timedelta
    from django.utils import timezone
    if not obj.membership_code:
        while True:
            code = f'HOM-MBR-{timezone.localdate().year}-{secrets.token_hex(5).upper()}'
            if not MembershipEnquiry.objects.filter(membership_code=code).exists():
                break
        obj.membership_code = code
    obj.status = 'Approved'
    obj.open_date = obj.open_date or timezone.localdate()
    obj.valid_till = obj.valid_till or timezone.localdate() + timedelta(days=365)
    obj.save()


class UserForm(forms.ModelForm):
    ROLES = [('customer', 'Customer (no panel access)'), ('staff', 'Staff'), ('admin', 'Admin')]
    role = forms.ChoiceField(choices=ROLES)
    password = forms.CharField(required=False, widget=forms.PasswordInput(render_value=False),
                               help_text='Required for new users. Leave blank to keep the current password.')

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'is_active']

    def __init__(self, *a, **kw):
        super().__init__(*a, **kw)
        u = self.instance
        self.fields['role'].initial = 'admin' if u.is_superuser else 'staff' if u.is_staff else 'customer'

    def clean_password(self):
        pw = self.cleaned_data['password']
        if not self.instance.pk and not pw:
            raise forms.ValidationError('Password is required.')
        return pw

    def save(self, commit=True):
        u = super().save(commit=False)
        role = self.cleaned_data['role']
        u.is_superuser, u.is_staff = role == 'admin', role in ('admin', 'staff')
        if self.cleaned_data['password']:
            u.set_password(self.cleaned_data['password'])
        u.save()
        # the private document download views check these model permissions
        u.user_permissions.set(staff_permissions() if role == 'staff' else [])
        return u


def _role(u):
    return 'Admin' if u.is_superuser else 'Staff' if u.is_staff else 'Customer'
