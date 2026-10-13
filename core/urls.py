from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('about/', views.about_view, name='about'),
    path('services/', views.services_list_view, name='services_list'),
    path('services/<slug:slug>/', views.service_detail_view, name='service_detail'),
    path('how-it-works/', views.how_it_works_view, name='how_it_works'),
    path('membership/', views.membership_view, name='membership'),
    path('updates/', views.updates_list_view, name='updates_list'),
    path('updates/<slug:slug>/', views.update_detail_view, name='update_detail'),
    path('faqs/', views.faqs_view, name='faqs'),
    path('contact/', views.contact_view, name='contact'),
    path('track/', views.track_request_view, name='track_request'),
    path('track/<str:request_id>/', views.track_request_view, name='track_request_with_id'),
    path('staff/requests/<str:request_id>/document/', views.private_request_document_view, name='private_request_document'),
    path('request/', views.request_service_view, name='request_service'),
    path('receipt/<str:request_id>/', views.receipt_view, name='receipt'),
    path('policy/<str:policy_name>/', views.policy_view, name='policy'),
    path('pwd-request/', views.pwd_request_view, name='pwd_request'),
    path('complaint-suggestion/', views.complaint_suggestion_view, name='complaint_suggestion'),
    path('membership/card/<str:membership_code>/', views.membership_card_view, name='membership_card'),
    path('membership/check/', views.check_membership_view, name='check_membership'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('logout/', views.logout_view, name='logout'),
]
