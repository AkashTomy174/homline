from django import forms
import re
from .models import ServiceRequest, MembershipEnquiry, Service, MembershipPlan

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
        fields = ['name', 'mobile', 'email', 'preferred_plan', 'notes']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Your Full Name', 'required': True}),
            'mobile': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Mobile Number', 'required': True}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email Address'}),
            'preferred_plan': forms.Select(attrs={'class': 'form-select'}),
            'notes': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Any specific requirement or message'}),
        }


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
