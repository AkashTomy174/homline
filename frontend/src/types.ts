export interface User {
  id: number; username: string; email: string; first_name: string;
  is_staff: boolean; is_superuser: boolean; date_joined: string; role: 'customer' | 'staff' | 'admin';
}
export interface Category { id: number; name: string; slug: string; description: string; icon_class: string; order: number }
export interface Service {
  id: number; slug: string; title: string; category: Category; short_summary: string; description: string;
  required_documents: string; homline_charge: string; third_party_fee: string; processing_time: string;
  is_featured: boolean; badge: string; icon_class: string;
}
export interface UpdateItem { id: number; slug: string; title: string; category_tag: string; summary: string; content: string; published_at: string; is_featured: boolean }
export interface Faq { id: number; question: string; answer: string; category: string; order: number }
export interface Plan { id: number; name: string; tagline: string; price: string; is_popular: boolean; features: string; welcome_benefits: string; order: number }
export interface Announcement { id: number; message: string; badge_text: string; link_url: string }
export interface TimelineEntry { status: string; title: string; created_at: string }
export interface TrackedRequest {
  request_id: string; full_name: string; mobile?: string; email?: string | null; service_title: string;
  requirement_details?: string; contact_preference: string; category: string; service_charge: string; portal_fee: string;
  status: string; created_at: string; updated_at: string; timeline: TimelineEntry[];
}
export interface Membership {
  id: number; name: string; place: string; plan: string; status: string; membership_code: string | null;
  open_date: string | null; valid_till: string | null; created_at: string; masked_mobile?: string; qr_code_url?: string;
}
