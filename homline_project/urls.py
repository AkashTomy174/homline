from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path, re_path

from core import views

urlpatterns = [
    path('healthz/', views.health_view, name='health'),
    path('api/', include('core.api_urls')),
    path('staff/requests/<str:request_id>/document/', views.private_request_document_view, name='private_request_document'),
    path('staff/complaints/<str:reference_no>/document/', views.private_complaint_document_view, name='private_complaint_document'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Everything else is a React route (static/ and media/ are served by WhiteNoise; api/, staff/ and healthz/ are above).
urlpatterns += [re_path(r'^(?!static/|media/|api/|staff/)(?P<path>.*)$', views.spa_view, name='spa')]
