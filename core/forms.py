from django import forms
import re
from .models import (
    ServiceRequest, MembershipEnquiry, Service, MembershipPlan, 
    PwDRequest, ComplaintSuggestion
)

class ServiceRequestForm(forms.ModelForm):
    class Meta:
        model = ServiceRequest
        fields = [
            'full_name', 'mobile', 'email', 'service', 
            'service_name_manual', 'requirement_details', 
            'contact_preference', 'document_upload'
        ]
        widgets = {
            'full_name': forms.TextInput(attrs={
                'class': 'form-control form-control-lg',
                'placeholder': 'Enter your full name',
                'required': True
            }),
            'mobile': forms.TextInput(attrs={
                'class': 'form-control form-control-lg',
                'placeholder': 'Enter your mobile number',
                'required': True
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control form-control-lg',
                'placeholder': 'name@example.com (optional)'
            }),
            'service': forms.Select(attrs={
                'class': 'form-select form-select-lg',
                'id': 'serviceSelect'
            }),
            'service_name_manual': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Specify if service is not in list'
            }),
            'requirement_details': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Describe your service request or requirement in detail...',
                'required': True
            }),
            'contact_preference': forms.Select(attrs={
                'class': 'form-select',
            }),
            'document_upload': forms.FileInput(attrs={
                'class': 'form-control',
                'accept': '.pdf,.doc,.docx,.jpg,.jpeg,.png'
            }),
        }

    def clean_mobile(self):
        mobile = self.cleaned_data['mobile'].strip()
        digits = re.sub(r'\D', '', mobile)
        if not 7 <= len(digits) <= 15:
            raise forms.ValidationError('Enter a valid phone number with 7 to 15 digits.')
        return mobile

    def clean_document_upload(self):
        upload = self.cleaned_data.get('document_upload')
        if upload:
            allowed_extensions = {'.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'}
            extension = '.' + upload.name.rsplit('.', 1)[-1].lower() if '.' in upload.name else ''
            if extension not in allowed_extensions:
                raise forms.ValidationError('Upload a PDF, DOC, DOCX, JPG or PNG file.')
            if upload.size > 10 * 1024 * 1024:
                raise forms.ValidationError('The uploaded file must be 10 MB or smaller.')
        return upload


class TrackRequestForm(forms.Form):
    request_id = forms.CharField(
        max_length=30,
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-lg text-uppercase font-monospace fw-bold',
            'placeholder': 'Enter Request ID (e.g. HOM-2026-X8F9)',
            'required': True
        })
    )


class MembershipEnquiryForm(forms.ModelForm):
    class Meta:
        model = MembershipEnquiry
        fields = ['name', 'mobile', 'email', 'place', 'preferred_plan', 'notes']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Your Full Name', 'required': True}),
            'mobile': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Mobile Number', 'required': True}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email Address'}),
            'place': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'City / Town / District', 'required': True}),
            'preferred_plan': forms.Select(attrs={'class': 'form-select'}),
            'notes': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Any specific requirement or message'}),
        }

    def clean_mobile(self):
        mobile = self.cleaned_data['mobile'].strip()
        digits = re.sub(r'\D', '', mobile)
        if not 7 <= len(digits) <= 15:
            raise forms.ValidationError('Enter a valid phone number with 7 to 15 digits.')
        return mobile


class PwDRequestForm(forms.ModelForm):
    class Meta:
        model = PwDRequest
        fields = ['name', 'mobile', 'place', 'assistance_type', 'service_needed', 'details']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control form-control-lg', 'placeholder': 'Enter your name', 'required': True}),
            'mobile': forms.TextInput(attrs={'class': 'form-control form-control-lg', 'placeholder': 'WhatsApp / Phone Number', 'required': True}),
            'place': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Your location / locality', 'required': True}),
            'assistance_type': forms.Select(attrs={'class': 'form-select'}),
            'service_needed': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. Disability Certificate, Pension, Ticket Booking, PAN card', 'required': True}),
            'details': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Tell us how we can assist you comfortably (audio call, doorstep desk, etc.)'}),
        }

    def clean_mobile(self):
        mobile = self.cleaned_data['mobile'].strip()
        digits = re.sub(r'\D', '', mobile)
        if not 7 <= len(digits) <= 15:
            raise forms.ValidationError('Enter a valid phone number with 7 to 15 digits.')
        return mobile


class ComplaintSuggestionForm(forms.ModelForm):
    class Meta:
        model = ComplaintSuggestion
        fields = ['entry_type', 'name', 'mobile', 'email', 'subject', 'details']
        widgets = {
            'entry_type': forms.Select(attrs={'class': 'form-select'}),
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Your Full Name', 'required': True}),
            'mobile': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Mobile Number', 'required': True}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email Address (optional)'}),
            'subject': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Brief Subject / Topic', 'required': True}),
            'details': forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'Share your complaint or suggestion in detail...', 'required': True}),
        }

    def clean_mobile(self):
        mobile = self.cleaned_data['mobile'].strip()
        digits = re.sub(r'\D', '', mobile)
        if not 7 <= len(digits) <= 15:
            raise forms.ValidationError('Enter a valid phone number with 7 to 15 digits.')
        return mobile


class QuickContactForm(forms.Form):
    name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Your Name', 'required': True}))
    mobile = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Mobile Number', 'required': True}))
    message = forms.CharField(widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'How can HOMline help you today?', 'required': True}))

    def clean_mobile(self):
        mobile = self.cleaned_data['mobile'].strip()
        digits = re.sub(r'\D', '', mobile)
        if not 7 <= len(digits) <= 15:
            raise forms.ValidationError('Enter a valid phone number with 7 to 15 digits.')
        return mobile


from django.contrib.auth.models import User

class UserLoginForm(forms.Form):
    username = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Enter username or email',
            'required': True,
            'autocomplete': 'username',
        })
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Enter password',
            'required': True,
            'autocomplete': 'current-password',
        })
    )
    remember_me = forms.BooleanField(
        required=False,
        initial=True,
        widget=forms.CheckboxInput(attrs={'class': 'form-check-input'})
    )


class UserRegistrationForm(forms.ModelForm):
    full_name = forms.CharField(
        max_length=120,
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Full Name',
            'required': True,
        })
    )
    mobile = forms.CharField(
        max_length=20,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Mobile Number (for WhatsApp updates)',
        })
    )
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Email Address',
            'required': True,
        })
    )
    password = forms.CharField(
        min_length=6,
        widget=forms.PasswordInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Create Password (min 6 characters)',
            'required': True,
        })
    )
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Confirm Password',
            'required': True,
        })
    )

    class Meta:
        model = User
        fields = ['username', 'email']
        widgets = {
            'username': forms.TextInput(attrs={
                'class': 'form-control form-control-lg',
                'placeholder': 'Choose a Username',
                'required': True,
            }),
        }

    def clean_username(self):
        username = self.cleaned_data['username'].strip().lower()
        if User.objects.filter(username__iexact=username).exists():
            raise forms.ValidationError('This username is already taken. Please choose another.')
        return username

    def clean_email(self):
        email = self.cleaned_data['email'].strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError('An account with this email already exists.')
        return email

    def clean_mobile(self):
        mobile = self.cleaned_data.get('mobile', '').strip()
        if mobile:
            digits = re.sub(r'\D', '', mobile)
            if not 7 <= len(digits) <= 15:
                raise forms.ValidationError('Enter a valid phone number with 7 to 15 digits.')
        return mobile

    def clean(self):
        cleaned_data = super().clean()
        p1 = cleaned_data.get('password')
        p2 = cleaned_data.get('confirm_password')
        if p1 and p2 and p1 != p2:
            self.add_error('confirm_password', 'Passwords do not match.')
        return cleaned_data


class UserProfileForm(forms.ModelForm):
    first_name = forms.CharField(
        max_length=120,
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Full Name'})
    )
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email Address'})
    )

    class Meta:
        model = User
        fields = ['first_name', 'email']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user_instance = kwargs.get('instance')

    def clean_email(self):
        email = self.cleaned_data['email'].strip().lower()
        query = User.objects.filter(email__iexact=email)
        if self.user_instance:
            query = query.exclude(pk=self.user_instance.pk)
        if query.exists():
            raise forms.ValidationError('This email address is already used by another account.')
        return email


class LinkRequestForm(forms.Form):
    request_id = forms.CharField(
        max_length=40,
        widget=forms.TextInput(attrs={
            'class': 'form-control text-uppercase font-monospace fw-bold',
            'placeholder': 'Enter Request ID (e.g. HOM-2026-X8F9)',
            'required': True
        })
    )


