# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Desk staff and admins** of HOMline DIGI seva: a small team working request queues all day on laptops and phones. They call or WhatsApp customers, update statuses, add walk-in requests, approve memberships, export lists. Confirmed by the owner.
- **Customers**: everyday Kerala citizens, often on a phone, with mixed digital comfort including senior citizens and persons with disabilities. They come to check a request's status, open their receipt or membership card, and sometimes link an older Request ID. Confirmed by the owner.

## Product Purpose
HOMline DIGI seva is an independent digital-service assistance desk (not a government office) run under AMDG Group. Customers submit requests for government and digital services (PAN, passport, voter ID, exam forms, tickets, printing, design) and HOMline staff do the filing. The dashboards exist so staff can move requests through to completion quickly, and customers can see where their request stands without calling.

## Positioning
Doorstep-style help made digital: a human desk behind every request. The customer always has a private Request ID, a receipt and a visible timeline; staff always have a WhatsApp/call button on the row.

## Operating Context
- Request statuses: Pending, Under Review, Processing, Information Required, Completed, Cancelled. Memberships, contact enquiries, PwD requests and complaints have their own queues.
- Staff work in bulk (select rows, mark status, export CSV) and one record at a time (edit, add timeline entry, download the customer's document).
- Roles: Admin (full control, content, users) and Staff (work queues; cannot delete or edit site content).
- Customers' public tracker is protected only by the unguessable Request ID.

## Capabilities and Constraints
- React + TypeScript (Vite) frontend on a Django REST API, served by Django; Bootstrap 5 and Bootstrap Icons already loaded; existing brand CSS in `static/css/style.css`.
- Everything must work on a free-tier host (cold starts up to a minute): lists must not flicker, submit buttons lock while sending.
- Live search and filters (debounced); URL holds filter state.

## Brand Commitments
Name "HOMline DIGI seva", logo at `static/images/logo.png`, navy / teal / gold accents already used across the public site. "Connecting Convenience" tagline. Helpline 6282268453.

## Evidence on Hand
Real request, membership and complaint data only in the local database. No customer testimonials or metrics may be invented.

## Product Principles
1. A customer should never need to call just to learn their status.
2. Staff speed beats decoration: the next action is always one click from the row.
3. Plain language and large targets: seniors and PwD users are core customers, not edge cases.
4. Role limits are visible: staff never see controls they cannot use.

## Accessibility & Inclusion
Seniors and PwD customers are a named audience: high contrast, large touch targets, readable type sizes, keyboard and screen-reader support, no information carried by color alone (status badges carry text).
