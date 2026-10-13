from .models import Announcement
from .forms import PwDRequestForm, ComplaintSuggestionForm

def global_site_context(request):
    try:
        announcements = Announcement.objects.filter(is_active=True).order_by('order', '-created_at')
    except Exception:
        announcements = []

    return {
        'site_announcements': announcements,
        'pwd_global_form': PwDRequestForm(),
        'complaint_global_form': ComplaintSuggestionForm(),
    }
