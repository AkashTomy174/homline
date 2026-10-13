import os
import uuid
from django.conf import settings
from django.utils import timezone
from django.db import models
from django.utils.text import slugify

def generate_request_id():
    return f"HOM-{timezone.localdate().year}-{uuid.uuid4().hex[:16].upper()}"

def service_document_path(instance, filename):
    """Random storage name: no user-controlled path, no overwrites. Original name kept in a model field."""
    ext = os.path.splitext(filename)[1].lower()
    return f"service_docs/{timezone.localdate():%Y/%m}/{uuid.uuid4().hex}{ext}"


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    icon_class = models.CharField(max_length=50, default="bi-grid", help_text="Bootstrap icon class e.g. bi-shield-check")
    order = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Service(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='services')
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, blank=True)
    short_summary = models.TextField()
    description = models.TextField()
    required_documents = models.TextField(help_text="Line separated or bullet points of required documents")
    homline_charge = models.CharField(max_length=100, default="₹150 - ₹300", help_text="HOMline service charge")
    third_party_fee = models.CharField(max_length=150, default="As per Government / Official portal rates", help_text="Third-party / Application fee")
    processing_time = models.CharField(max_length=100, default="2 - 5 Working Days")
    is_featured = models.BooleanField(default=True)
    badge = models.CharField(max_length=50, blank=True, help_text="e.g. Popular, Essential, Fast Track")
    icon_class = models.CharField(max_length=50, default="bi-file-earmark-check")

    class Meta:
        ordering = ['category', 'title']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Update(models.Model):
    TAG_CHOICES = [
        ('Service Update', 'Service Update'),
        ('Important Notice', 'Important Notice'),
        ('Service Availability Update', 'Service Availability Update'),
        ('General News', 'General News'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    category_tag = models.CharField(max_length=50, choices=TAG_CHOICES, default='Service Update')
    summary = models.TextField()
    content = models.TextField()
    published_at = models.DateTimeField(auto_now_add=True)
    is_featured = models.BooleanField(default=True, help_text="Show on Homepage top 3 updates")

    class Meta:
        ordering = ['-published_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class MembershipPlan(models.Model):
    name = models.CharField(max_length=100)
    tagline = models.CharField(max_length=200)
    price = models.CharField(max_length=50, help_text="e.g. ₹499 / year")
    is_popular = models.BooleanField(default=False)
    features = models.TextField(help_text="One feature per line")
    welcome_benefits = models.TextField(help_text="One welcome benefit per line")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.name

    def get_features_list(self):
        return [f.strip() for f in self.features.split('\n') if f.strip()]

    def get_welcome_benefits_list(self):
        return [b.strip() for b in self.welcome_benefits.split('\n') if b.strip()]


class Announcement(models.Model):
    message = models.CharField(max_length=255, help_text="Announcement text to display in the top bar")
    badge_text = models.CharField(max_length=30, default="NEW", help_text="Badge label e.g. NEW, UPDATE, NOTICE")
    link_url = models.CharField(max_length=255, blank=True, help_text="Optional link e.g. /services/ or https://...")
    is_active = models.BooleanField(default=True, help_text="Show in top announcement bar")
    order = models.IntegerField(default=0, help_text="Order in rotation")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"[{self.badge_text}] {self.message}"


class MembershipEnquiry(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Approved', 'Approved'),
        ('Active', 'Active'),
        ('Answered', 'Answered'),
        ('Closed', 'Closed'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='membership_enquiries')
    name = models.CharField(max_length=120)
    mobile = models.CharField(max_length=20, db_index=True)
    email = models.EmailField(blank=True, null=True)
    place = models.CharField(max_length=150, blank=True, default="Kerala")
    preferred_plan = models.ForeignKey(MembershipPlan, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    membership_code = models.CharField(max_length=50, blank=True, null=True, unique=True, help_text="Unique Member ID, e.g. HOM-MBR-2026-0123")
    open_date = models.DateField(null=True, blank=True)
    valid_till = models.DateField(null=True, blank=True)
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Membership enquiry & card'
        verbose_name_plural = 'Membership enquiries & cards'

    def __str__(self):
        code_str = f" [{self.membership_code}]" if self.membership_code else ""
        return f"Enquiry from {self.name} - {self.mobile}{code_str} ({self.status})"


class ContactEnquiry(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Answered', 'Answered'),
        ('Closed', 'Closed'),
    ]

    name = models.CharField(max_length=120)
    mobile = models.CharField(max_length=20)
    message = models.TextField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact enquiry'
        verbose_name_plural = 'Contact enquiries'

    def __str__(self):
        return f"Contact enquiry from {self.name} ({self.status}) - {self.mobile}"


class PwDRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Answered', 'Answered'),
        ('Closed', 'Closed'),
    ]

    ASSISTANCE_CHOICES = [
        ('Doorstep Visit Assistance', 'Doorstep Visit Assistance'),
        ('WhatsApp / Chat Support', 'WhatsApp / Chat Support'),
        ('Direct Phone Call Support', 'Direct Phone Call Support'),
        ('Mobility / Senior Support', 'Mobility / Senior Support'),
        ('Voice / Visual Support', 'Voice / Visual Support'),
        ('General Assistance', 'General Assistance'),
    ]

    name = models.CharField(max_length=120)
    mobile = models.CharField(max_length=20)
    place = models.CharField(max_length=150, blank=True)
    assistance_type = models.CharField(max_length=50, choices=ASSISTANCE_CHOICES, default='Doorstep Visit Assistance')
    service_needed = models.CharField(max_length=200)
    details = models.TextField(blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'PwD Request'
        verbose_name_plural = 'PwD Requests'

    def __str__(self):
        return f"PwD Request from {self.name} ({self.place or 'Kerala'}) - {self.status}"


def complaint_document_path(instance, filename):
    ext = os.path.splitext(filename)[1].lower()
    return f"complaint_docs/{timezone.localdate():%Y/%m}/{uuid.uuid4().hex}{ext}"


def generate_complaint_reference():
    """HOM-CMP-YYYYMMDD-NNN, NNN = running number for the day."""
    today = timezone.localdate()
    prefix = f"HOM-CMP-{today:%Y%m%d}-"
    n = ComplaintSuggestion.objects.filter(reference_no__startswith=prefix).count() + 1
    while ComplaintSuggestion.objects.filter(reference_no=f"{prefix}{n:03d}").exists():
        n += 1
    return f"{prefix}{n:03d}"


class ComplaintSuggestion(models.Model):
    TYPE_CHOICES = [
        ('Complaint', 'Complaint'),
        ('Suggestion', 'Suggestion'),
        ('General Feedback', 'General Feedback'),
        ('Accessibility Concern', 'Accessibility Concern'),
        ('Service Issue', 'Service Issue'),
        ('Appreciation', 'Appreciation'),
        ('Other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('Received', 'Received'),
        ('Under Review', 'Under Review'),
        ('Action Required', 'Action Required'),
        ('Escalated', 'Escalated'),
        ('Resolved', 'Resolved'),
        ('Closed', 'Closed'),
    ]

    PRIORITY_CHOICES = [('Low', 'Low'), ('Normal', 'Normal'), ('High', 'High'), ('Urgent', 'Urgent')]
    MEMBER_CHOICES = [('Yes', 'Yes'), ('No', 'No'), ('Not Sure', 'Not Sure')]
    RESPONSE_CHOICES = [
        ('Call', 'Call'), ('WhatsApp', 'WhatsApp'), ('Email', 'Email'), ('None', 'No response needed'),
    ]
    TIME_CHOICES = [
        ('Anytime', 'Anytime'), ('Morning', 'Morning'), ('Afternoon', 'Afternoon'), ('Evening', 'Evening'),
    ]

    reference_no = models.CharField(max_length=30, unique=True, null=True, blank=True, editable=False)
    entry_type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='Complaint')
    name = models.CharField(max_length=120)
    mobile = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    is_member = models.CharField(max_length=10, choices=MEMBER_CHOICES, default='No')
    membership_id = models.CharField(max_length=50, blank=True)
    related_to_service = models.BooleanField(default=False)
    service_name = models.CharField(max_length=150, blank=True)
    related_reference = models.CharField(max_length=50, blank=True, help_text="Service request / reference number, if any")
    subject = models.CharField(max_length=200)
    details = models.TextField()
    supporting_document = models.FileField(upload_to=complaint_document_path, blank=True, null=True)
    document_original_name = models.CharField(max_length=255, blank=True)
    preferred_response = models.CharField(max_length=20, choices=RESPONSE_CHOICES, default='Call')
    preferred_time = models.CharField(max_length=20, choices=TIME_CHOICES, default='Anytime')
    consent = models.BooleanField(default=False)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='Normal')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Received')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_complaints')
    action_taken = models.TextField(blank=True)
    response_date = models.DateField(null=True, blank=True)
    resolution = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Complaint / Suggestion'
        verbose_name_plural = 'Complaints & Suggestions'

    def save(self, *args, **kwargs):
        if not self.reference_no:
            self.reference_no = generate_complaint_reference()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.entry_type}] {self.subject} by {self.name} ({self.status})"


class ServiceRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Under Review', 'Under Review'),
        ('Processing', 'Processing'),
        ('Information Required', 'Information Required'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]

    CONTACT_CHOICES = [
        ('WhatsApp', 'WhatsApp'),
        ('Call', 'Call'),
        ('Email', 'Email'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='service_requests')
    request_id = models.CharField(max_length=30, unique=True, default=generate_request_id)
    full_name = models.CharField(max_length=120)
    mobile = models.CharField(max_length=20, db_index=True)
    email = models.EmailField(blank=True, null=True)
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True)
    service_name_manual = models.CharField(max_length=150, blank=True, help_text="Used if custom service requested")
    requirement_details = models.TextField()
    contact_preference = models.CharField(max_length=20, choices=CONTACT_CHOICES, default='WhatsApp')
    document_upload = models.FileField(upload_to=service_document_path, blank=True, null=True)
    document_original_name = models.CharField(max_length=255, blank=True)
    service_charge = models.CharField(max_length=100, default="₹150", blank=True, help_text="HOMline Assistance Charge (client can view on track page)")
    portal_fee = models.CharField(max_length=100, default="As per Govt portal", blank=True, help_text="Official / Portal Fee (client can view on track page)")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    admin_notes = models.TextField(blank=True, help_text="Notes visible or status updates")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.request_id} - {self.full_name} ({self.status})"

    def get_service_title(self):
        if self.service:
            return self.service.title
        return self.service_name_manual or "General Digital Assistance"


class ServiceRequestLog(models.Model):
    request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE, related_name='timeline_logs')
    status = models.CharField(max_length=50)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Log [{self.status}] for {self.request.request_id}"


class FAQ(models.Model):
    CATEGORY_CHOICES = [
        ('General', 'General'),
        ('Fees & Charges', 'Fees & Charges'),
        ('Processing & Approvals', 'Processing & Approvals'),
        ('Privacy & Safety', 'Privacy & Safety'),
    ]

    question = models.CharField(max_length=255)
    answer = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='General')
    order = models.IntegerField(default=0)

    class Meta:
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"
        ordering = ['order', 'id']

    def __str__(self):
        return self.question


class CustomerReview(models.Model):
    customer_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100, default="Kerala, India")
    rating = models.IntegerField(default=5)
    service_used = models.CharField(max_length=150)
    review_text = models.TextField()
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.customer_name}"
