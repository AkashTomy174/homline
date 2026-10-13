from django.db import migrations

STATUS_MAP = {'Pending': 'Received', 'Processing': 'Under Review', 'Answered': 'Resolved'}


def forward(apps, schema_editor):
    C = apps.get_model('core', 'ComplaintSuggestion')
    for old, new in STATUS_MAP.items():
        C.objects.filter(status=old).update(status=new)
    counters = {}
    for c in C.objects.filter(reference_no__isnull=True).order_by('created_at', 'id'):
        day = c.created_at.strftime('%Y%m%d')
        counters[day] = counters.get(day, 0) + 1
        c.reference_no = f"HOM-CMP-{day}-{counters[day]:03d}"
        c.save(update_fields=['reference_no'])


def backward(apps, schema_editor):
    C = apps.get_model('core', 'ComplaintSuggestion')
    for new, old in {'Received': 'Pending', 'Under Review': 'Processing', 'Resolved': 'Answered'}.items():
        C.objects.filter(status=new).update(status=old)


class Migration(migrations.Migration):
    dependencies = [('core', '0010_complaint_form_v2')]
    operations = [migrations.RunPython(forward, backward)]
