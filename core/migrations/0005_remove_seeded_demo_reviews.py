from django.db import migrations


DEMO_REVIEW_TEXTS = (
    'HOMline made my passport renewal so simple! They verified my documents over WhatsApp and booked the PSK slot in just one day. Exceptional guidance.',
    'I was struggling with photo and DOB corrections on the NSDL portal. HOMline corrected the application and kept me informed at every step.',
    'Very trustworthy and quick. They resized my documents to exact portal dimensions and submitted my exam form without any hassle. Highly recommended!',
    'Got my shop registered under MSME within 48 hours. Transparent charges and polite customer support via WhatsApp.',
)


def remove_seeded_demo_reviews(apps, schema_editor):
    CustomerReview = apps.get_model('core', 'CustomerReview')
    CustomerReview.objects.filter(review_text__in=DEMO_REVIEW_TEXTS).delete()


class Migration(migrations.Migration):
    dependencies = [('core', '0004_alter_servicerequest_request_id')]

    operations = [
        migrations.RunPython(remove_seeded_demo_reviews, migrations.RunPython.noop),
    ]
