// HOMline DIGI seva - Master Static Database & Store

const HOMLINE_DATA = {
  brand: {
    name: "HOMline DIGI seva",
    tagline: "Digital Services. Simplified for You.",
    parentOrg: "AMDG Group",
    phone: "6282268453",
    phoneFormatted: "+91 62822 68453",
    whatsappLink: "https://wa.me/916282268453",
    email: "homlinedigital@gmail.com",
    website: "https://www.amdgmedia.co.in",
    workingHours: "Mon - Sat: 9:00 AM - 8:00 PM (Online requests 24×7)"
  },

  categories: [
    {
      id: 1,
      slug: "government-identity",
      name: "Government & Identity",
      description: "PAN card, passport appointment assistance, voter ID online, and essential identity documents.",
      icon_class: "bi-card-heading",
      badgeText: "3 Services",
      order: 1
    },
    {
      id: 2,
      slug: "education",
      name: "Education & Exams",
      description: "Academic entrance forms, university admission applications, and student scholarship guidance.",
      icon_class: "bi-mortarboard-fill",
      badgeText: "2 Services",
      order: 2
    },
    {
      id: 3,
      slug: "business-professional",
      name: "Business & Professional",
      description: "Udyam MSME government registration, FSSAI food license, and small business digital compliance.",
      icon_class: "bi-briefcase-fill",
      badgeText: "1 Service",
      order: 3
    },
    {
      id: 4,
      slug: "digital-online",
      name: "Digital & Online",
      description: "State e-district revenue certificates (Income, Domicile, Caste) and online portal downloads.",
      icon_class: "bi-globe2",
      badgeText: "1 Service",
      order: 4
    },
    {
      id: 5,
      slug: "document-application",
      name: "Document & Application",
      description: "Strict document resizing, image compression, merged PDFs, and portal formatting assistance.",
      icon_class: "bi-file-earmark-text-fill",
      badgeText: "1 Service",
      order: 5
    },
    {
      id: 6,
      slug: "creative-printing-travel",
      name: "Creative, Printing & Travel",
      description: "Ticket bookings, poster designs, website development, DTP, laminations, and framing services.",
      icon_class: "bi-palette-fill",
      badgeText: "6 Services",
      order: 6
    }
  ],

  announcements: [
    {
      badge: "DIGITAL SERVICES",
      message: "All Internet Service at your fingertip, Designed to Easy Access and Reduce Travel.",
      link: "services.html"
    },
    {
      badge: "PwD-FRIENDLY",
      message: "“Accessible digital empowerment for all abilities — no travel required.” Dedicated door desk support available.",
      link: "index.html#pwd-section"
    },
    {
      badge: "NEW SERVICES",
      message: "Ticket Bookings, Poster Designs, Website Designs, DTP, Laminations & Framing now live!",
      link: "services.html"
    }
  ],

  services: [
    {
      id: "srv-pan",
      slug: "pan-card-services",
      categorySlug: "government-identity",
      categoryName: "Government & Identity",
      title: "PAN Card (New / Correction / Update)",
      short_summary: "Hassle-free application for fresh PAN allocation, data corrections, name change or duplicate reprint.",
      description: "HOMline assists you in preparing and submitting your PAN card application through supported online portals. Whether you need a fresh PAN for employment or banking, or need corrections in existing details (Name, Date of Birth, Father's Name, Address, Photo/Signature mismatch), our specialists guide you through each documentation requirement to ensure rejection-free submission.",
      required_documents: [
        "Proof of Identity (Aadhaar Card, Voter ID, or Passport)",
        "Proof of Address (Aadhaar, Electricity/Water Bill, or Bank Statement)",
        "Proof of Date of Birth (Birth Certificate or SSLC/10th Marksheet)",
        "2 Recent Passport-size Photographs (for physical card dispatch)"
      ],
      homline_charge: "₹150 - ₹250",
      homline_fee: "₹150 - ₹250",
      homline_fee_numeric: 200,
      third_party_fee: "₹107 (Standard Government Portal Fee)",
      processing_time: "2 - 5 Working Days (e-PAN)",
      is_featured: true,
      badge: "Popular",
      icon_class: "bi-credit-card-2-front-fill"
    },
    {
      id: "srv-passport",
      slug: "passport-application-assistance",
      categorySlug: "government-identity",
      categoryName: "Government & Identity",
      title: "Passport Online Application & Appointment",
      short_summary: "Complete assistance for fresh passport, re-issue, address update and PSK appointment booking.",
      description: "Navigating Passport Seva portals can be complex with strict document upload criteria and limited appointment slots. HOMline provides end-to-end guidance for fresh applications, passport renewals, Tatkaal requests, fee payment coordination, and slot booking at your nearest Passport Seva Kendra (PSK) or Post Office PSK.",
      required_documents: [
        "Aadhaar Card with linked active mobile number",
        "Proof of Birth (Birth Certificate or School Leaving Certificate)",
        "Proof of Present Address (Voter ID, Bank Passbook with photo, or Utility Bill)",
        "Existing Passport copy (Front & Back pages, for re-issue/renewal)"
      ],
      homline_charge: "₹300 - ₹500",
      homline_fee: "₹300 - ₹500",
      homline_fee_numeric: 350,
      third_party_fee: "₹1,500 (Fresh/Normal) / ₹2,000 (Tatkal)",
      processing_time: "Appointment Slot within 24-48 hrs",
      is_featured: true,
      badge: "Essential",
      icon_class: "bi-passport-fill"
    },
    {
      id: "srv-voter",
      slug: "voter-id-services",
      categorySlug: "government-identity",
      categoryName: "Government & Identity",
      title: "Voter ID Card Services",
      short_summary: "Form 6 new registration, constituency transfer, address change & digital e-EPIC download.",
      description: "Comprehensive guidance for voter registration on the Election Commission / National Voters Service Portal (NVSP). We assist with Form 6 (New Voter Enrollment for 18+), Form 8 (Correction, Shifting of Residence & Duplicate Card Request), and instant e-EPIC digital voter identity card downloads.",
      required_documents: [
        "Aadhaar Card or Photo Identity Proof",
        "Proof of Address (Ration Card, Electricity Bill, or Registered Rent Agreement)",
        "1 Passport-size Color Photograph",
        "Existing Voter ID card number (if applying for corrections/transfers)"
      ],
      homline_charge: "₹100 - ₹200",
      homline_fee: "₹100 - ₹200",
      homline_fee_numeric: 150,
      third_party_fee: "Free / Minimal Official Portal Charge",
      processing_time: "3 - 7 Working Days",
      is_featured: false,
      badge: "Digital",
      icon_class: "bi-person-badge-fill"
    },
    {
      id: "srv-exam",
      slug: "academic-exam-registrations",
      categorySlug: "education",
      categoryName: "Education & Exams",
      title: "Academic Exam & Admission Registrations",
      short_summary: "Guided registration and online form submission for entrance exams, universities & boards.",
      description: "Avoid costly mistakes or application disqualification during high-stakes entrance exams (CUET, NEET, KEAM, State PSC, University UG/PG admissions). HOMline verifies your eligibility guidelines, converts mark lists and certificates into required sizes, and facilitates timely submission before portal deadlines.",
      required_documents: [
        "10th & 12th Standard Marksheets and Passing Certificates",
        "Caste / Category / EWS Certificate (if applicable for reservations)",
        "Passport Photo and Signature scanned to exact pixel and KB specs",
        "Active Mobile Number and Email ID for OTP validations"
      ],
      homline_charge: "₹150 - ₹300",
      homline_fee: "₹150 - ₹300",
      homline_fee_numeric: 200,
      third_party_fee: "As per respective exam board / university fee",
      processing_time: "Same Day Submission",
      is_featured: true,
      badge: "High Demand",
      icon_class: "bi-journal-bookmark-fill"
    },
    {
      id: "srv-scholarship",
      slug: "scholarship-portal-assistance",
      categorySlug: "education",
      categoryName: "Education & Exams",
      title: "Student Scholarship Portal Assistance",
      short_summary: "Online application guidance for State, National Scholarship Portal (NSP) & private grants.",
      description: "Step-by-step assistance for eligible students applying for National Scholarship Portal (NSP), State Minority Scholarships, Post-Matric grants, Merit awards, and private foundation scholarships. We ensure all certificates match official guidelines to prevent verification delays at institute levels.",
      required_documents: [
        "Student Aadhaar Card & Active Bank Account Passbook",
        "Current Family Income Certificate & Community/Caste Certificate",
        "Current Academic Fee Receipt & Previous Examination Marksheet",
        "Institution Bonafide / Verification Form signed by Head of Institute"
      ],
      homline_charge: "₹150 - ₹250",
      homline_fee: "₹150 - ₹250",
      homline_fee_numeric: 180,
      third_party_fee: "Free (Govt / NSP Portal)",
      processing_time: "1 - 3 Working Days",
      is_featured: false,
      badge: "Student Benefit",
      icon_class: "bi-mortarboard"
    },
    {
      id: "srv-msme",
      slug: "udyam-msme-fssai-registration",
      categorySlug: "business-professional",
      categoryName: "Business & Professional",
      title: "Udyam MSME & FSSAI Registration",
      short_summary: "Government MSME recognition & Food License (FSSAI) application guidance for small businesses.",
      description: "Formalize your retail shop, manufacturing unit, or commercial enterprise with official Government of India Udyam MSME registration and FSSAI basic food license online assistance. Proper registration unlocks priority sector bank loans, government tenders, subsidies, and legally compliant operation.",
      required_documents: [
        "Aadhaar Card & PAN Card of Proprietor, Partners, or Directors",
        "Business Operating Address Proof (Electricity Bill, Rent Agreement)",
        "Business Name, Nature of Operations, and Employee Count",
        "Bank Account details (Cancelled Cheque or Passbook copy)"
      ],
      homline_charge: "₹250 - ₹450",
      homline_fee: "₹250 - ₹450",
      homline_fee_numeric: 300,
      third_party_fee: "₹100 (FSSAI 1 Yr Basic) / ₹0 (Udyam Govt portal)",
      processing_time: "2 - 4 Working Days",
      is_featured: true,
      badge: "Business",
      icon_class: "bi-building-check"
    },
    {
      id: "srv-certificate",
      slug: "digital-certificates-download",
      categorySlug: "digital-online",
      categoryName: "Digital & Online",
      title: "Digital Certificates & Online Downloads",
      short_summary: "Assistance downloading Income, Caste, Relationship & Domicile e-Certificates.",
      description: "Assistance applying for and tracking state revenue e-Certificates (Income, Nativity, Community, Family Relationship, Non-Creamy Layer, Possession Certificate) through official e-District portals. We help compile required revenue records so your local village/tehsil office can approve smoothly.",
      required_documents: [
        "Ration Card & Aadhaar Card of Applicant & Family Members",
        "Land Tax Receipt / Property Documents (for valuation or possession)",
        "Salary Slip or Income Proof (for income certificate)",
        "Application Reference Number (if already submitted and tracking)"
      ],
      homline_charge: "₹100 - ₹200",
      homline_fee: "₹100 - ₹200",
      homline_fee_numeric: 150,
      third_party_fee: "₹15 - ₹30 (e-District Official Fee)",
      processing_time: "3 - 7 Working Days (Subject to Revenue Dept)",
      is_featured: false,
      badge: "Fast Track",
      icon_class: "bi-file-earmark-lock-fill"
    },
    {
      id: "srv-docformat",
      slug: "document-formatting-optimization",
      categorySlug: "document-application",
      categoryName: "Document & Application",
      title: "Document Formatting & Size Optimization",
      short_summary: "Professional scan, PDF conversion, image compression & portal upload formatting.",
      description: "Struggling with strict document upload criteria on government or recruitment portals (e.g. max 50KB JPEG, specific 300 DPI resolution, merged multi-page PDF under 200KB, or custom signature dimensions)? Send your raw document photos via WhatsApp to HOMline for rapid, lossless compression and pixel-perfect preparation.",
      required_documents: [
        "Original clear photos or scans of your document via WhatsApp",
        "Specific portal guidelines (Max KB, Allowed format: PDF/JPG/PNG)"
      ],
      homline_charge: "₹50 - ₹100",
      homline_fee: "₹50 - ₹100",
      homline_fee_numeric: 80,
      third_party_fee: "None",
      processing_time: "Instant / Within 1 Hour",
      is_featured: true,
      badge: "Instant Service",
      icon_class: "bi-aspect-ratio-fill"
    },
    {
      id: "srv-tickets",
      slug: "ticket-bookings",
      categorySlug: "creative-printing-travel",
      categoryName: "Creative, Printing & Travel",
      title: "Ticket Bookings (Bus, Train, Flight)",
      short_summary: "Confirmed seat bookings for IRCTC Indian Railways, KSRTC / private sleeper buses & domestic/international flights.",
      description: "Fast and reliable online ticket reservations for trains (general & Tatkal), inter-state buses, and air tickets. Receive instant confirmations, boarding passes, and cancellation assistance directly on WhatsApp.",
      required_documents: [
        "Passenger Government ID (Aadhaar, Voter ID, or Passport)",
        "Travel Origin, Destination & Date of Journey",
        "Berth / Seat Preferences & Active Mobile Number"
      ],
      homline_charge: "₹50 - ₹150",
      homline_fee: "₹50 - ₹150",
      homline_fee_numeric: 80,
      third_party_fee: "Actual Fare as per IRCTC / Airline / Bus Operator",
      processing_time: "Instant / Under 30 Mins",
      is_featured: true,
      badge: "Fast Booking",
      icon_class: "bi-ticket-perforated-fill"
    },
    {
      id: "srv-posters",
      slug: "design-posters",
      categorySlug: "creative-printing-travel",
      categoryName: "Creative, Printing & Travel",
      title: "Design Posters & Social Media Banners",
      short_summary: "Custom graphic designs for family functions, announcements, business flyers, and digital marketing banners.",
      description: "Professional digital graphic design crafted by AMDG Media designers. Eye-catching posters for weddings, birthday celebrations, shop promotions, parish notices, obituary tributes, and Instagram/WhatsApp status announcements.",
      required_documents: [
        "Event or business text content & details",
        "High-resolution photos / brand logo (if any)",
        "Preferred size (A4, Flex banner, Story 9:16, or Square)"
      ],
      homline_charge: "₹150 - ₹400",
      homline_fee: "₹150 - ₹400",
      homline_fee_numeric: 250,
      third_party_fee: "Printing / Flex charges extra if physical delivery required",
      processing_time: "Same Day / Within 24 Hours",
      is_featured: true,
      badge: "Creative Wing",
      icon_class: "bi-image-fill"
    },
    {
      id: "srv-websites",
      slug: "website-designs",
      categorySlug: "creative-printing-travel",
      categoryName: "Creative, Printing & Travel",
      title: "Website Designs & Digital Landing Pages",
      short_summary: "Clean, mobile-first responsive websites, landing pages & digital portfolios for businesses.",
      description: "Modern, rapid-loading website design and business landing page setup powered by AMDG Media. Features mobile-first layouts, WhatsApp quick-chat buttons, Google Maps location integration, and SEO best practices.",
      required_documents: [
        "Business Profile & Services Offered",
        "Owner Contact Details & Address",
        "Logo and Photos of products / premises"
      ],
      homline_charge: "₹1,999 - ₹4,999",
      homline_fee: "₹1,999 - ₹4,999",
      homline_fee_numeric: 2500,
      third_party_fee: "Domain & Hosting at actual provider pricing",
      processing_time: "3 - 7 Working Days",
      is_featured: true,
      badge: "AMDG Tech",
      icon_class: "bi-window-fullscreen"
    },
    {
      id: "srv-dtp",
      slug: "dtp-services",
      categorySlug: "creative-printing-travel",
      categoryName: "Creative, Printing & Travel",
      title: "DTP (Desktop Publishing) & Malayalam / English Typing",
      short_summary: "Accurate Malayalam & English computer typing, formatting of legal agreements, project reports & bio-data.",
      description: "High-speed and error-free Desktop Publishing (DTP) in Malayalam (Unicode / ML-TT fonts) and English. We type and format rental agreements, affidavits, CV/resumes, school/college project reports, church notices, and government representations.",
      required_documents: [
        "Rough handwritten draft, scanned notes, or voice note of text",
        "Specific paper format (A4, Legal, Stamp paper)"
      ],
      homline_charge: "₹40 - ₹100 per page",
      homline_fee: "₹40 - ₹100 per page",
      homline_fee_numeric: 60,
      third_party_fee: "Stamp paper / Legal paper at actuals",
      processing_time: "Same Day / 2 - 4 Hours",
      is_featured: false,
      badge: "Doorstep Print",
      icon_class: "bi-fonts"
    },
    {
      id: "srv-laminations",
      slug: "laminations",
      categorySlug: "creative-printing-travel",
      categoryName: "Creative, Printing & Travel",
      title: "Laminations (ID Cards, Certificates & Documents)",
      short_summary: "Heavy-duty heat lamination for academic certificates, Aadhaar / Voter PVC cards, land tax receipts & records.",
      description: "Protect your irreplaceable paper records from moisture, tearing, and aging. We provide premium 250-micron pouch heat lamination for SSLC/Degree marksheets, property documents, birth certificates, and identity cards with doorstep pickup and delivery.",
      required_documents: [
        "Physical document or printed copies to be laminated",
        "Preferred size (ID Card, A4, or Legal)"
      ],
      homline_charge: "₹30 - ₹70 per item",
      homline_fee: "₹30 - ₹70 per item",
      homline_fee_numeric: 40,
      third_party_fee: "None",
      processing_time: "Doorstep Pickup / Same Day Return",
      is_featured: false,
      badge: "Protection",
      icon_class: "bi-layers-fill"
    },
    {
      id: "srv-frameworks",
      slug: "frame-works",
      categorySlug: "creative-printing-travel",
      categoryName: "Creative, Printing & Travel",
      title: "Frame Works & Custom Photo Mounting",
      short_summary: "Artistic wooden, synthetic & acrylic framing for family portraits, religious icons, awards & certificates.",
      description: "Cherish your proud achievements and family milestones with custom-crafted frames. High-clarity glass / acrylic facing, durable synthetic/wooden borders, and doorstep delivery handled with utmost care.",
      required_documents: [
        "Photo file for high-res printing or original picture to be framed",
        "Frame size preference (8x10, 10x12, 12x18, or custom)",
        "Border style selection (Classic Gold, Elegant Teak, Minimal Black)"
      ],
      homline_charge: "₹250 - ₹950",
      homline_fee: "₹250 - ₹950",
      homline_fee_numeric: 350,
      third_party_fee: "None",
      processing_time: "2 - 3 Working Days",
      is_featured: true,
      badge: "Art & Decor",
      icon_class: "bi-gem"
    }
  ],

  updates: [
    {
      slug: "new-digital-services-added",
      title: "New Digital Assistance Services Added to HOMline Directory",
      category_tag: "Service Update",
      date: "10 Oct 2026",
      summary: "We have expanded our catalog to support passport appointment bookings, Udyam MSME setup, and entrance exam form filling.",
      content: "HOMline DIGI seva is pleased to announce expanded support for essential digital applications across Kerala and nationwide. Customers can now request step-by-step assistance for Passport Seva Kendra appointments, FSSAI registration, and national scholarship portals directly from our portal or via dedicated WhatsApp support at 6282268453."
    },
    {
      slug: "important-notice-fee-transparency",
      title: "Important Notice: Third-Party & Government Fee Transparency",
      category_tag: "Important Notice",
      date: "08 Oct 2026",
      summary: "HOMline maintains strict separation between our nominal service fee and official government charges.",
      content: "To guarantee 100% transparency, every service listed on HOMline clearly distinguishes between the HOMline Service Charge (our consultation, document formatting, and submission fee) and official Third-Party or Government Portal fees. Official fees are paid directly to government treasuries or authorized payment gateways without any hidden markups."
    },
    {
      slug: "academic-registration-window-update",
      title: "High-Volume Academic Registration Window - Fast-Track Slot Booking",
      category_tag: "Service Availability Update",
      date: "05 Oct 2026",
      summary: "Dedicated WhatsApp assistance line active for student admissions & scholarship applications.",
      content: "Due to upcoming central and state entrance registration deadlines, our support team has enabled express queue handling for students. Message us on WhatsApp 6282268453 for rapid document formatting, photo resizing to strict portal guidelines, and error-free portal submission."
    },
    {
      slug: "homline-support-schedule-notice",
      title: "HOMline Support Operating Hours & Holiday Schedule",
      category_tag: "General News",
      date: "01 Oct 2026",
      summary: "Submit online requests 24x7. Support team responds Monday to Saturday 9:00 AM - 8:00 PM.",
      content: "You can submit service requests and track your reference IDs on homline.com 24 hours a day, 7 days a week. Direct telephone and WhatsApp representative support is active Monday through Saturday from 9 AM to 8 PM IST. Requests received outside hours are processed first thing next morning."
    }
  ],

  membershipPlans: [
    {
      id: "plan-basic",
      name: "Basic Member",
      tagline: "Essential support for individuals needing regular digital assistance.",
      price: "₹299",
      billing: "/ year",
      is_popular: false,
      features: [
        "Priority queue for routine online requests",
        "10% discount on all HOMline service charges",
        "Free document scan & compression formatting",
        "Direct WhatsApp dedicated line access",
        "Real-time status tracking via portal"
      ],
      welcome_benefits: [
        "₹50 welcome voucher towards your first service request",
        "Free digital document storage guidance & checklist"
      ]
    },
    {
      id: "plan-gold",
      name: "Gold DIGI Member",
      tagline: "Complete digital coverage for families and frequent service users.",
      price: "₹599",
      billing: "/ year",
      is_popular: true,
      features: [
        "Highest priority handling for all applications",
        "25% discount on all HOMline service charges",
        "Free instant SMS & WhatsApp status alerts",
        "Dedicated HOMline digital personal assistant",
        "Coverage for up to 4 family members",
        "Emergency weekend submission support"
      ],
      welcome_benefits: [
        "₹150 welcome credit voucher applied instantly",
        "1 Free PAN Card / Certificate service assistance included"
      ]
    },
    {
      id: "plan-enterprise",
      name: "Premium Enterprise",
      tagline: "Tailored support for small businesses, retail shops, and institutions.",
      price: "₹1,499",
      billing: "/ year",
      is_popular: false,
      features: [
        "Unlimited business document formatting & compliance checks",
        "35% discount on all service assistance fees",
        "Dedicated account manager & priority phone access",
        "Monthly service summary reports & portal monitoring",
        "GST & commercial license renewal alerts"
      ],
      welcome_benefits: [
        "₹300 welcome credit voucher",
        "Free Udyam MSME application guidance included"
      ]
    }
  ],

  faqs: [
    {
      id: 1,
      category: "General",
      question: "What is HOMline DIGI seva?",
      answer: "HOMline DIGI seva is an accessible digital service assistance platform that helps customers navigate, prepare, format documents for, and submit supported online government, educational, business, and portal applications with ease — right from the comfort of their home."
    },
    {
      id: 2,
      category: "General",
      question: "How can I request a digital service?",
      answer: "You can request assistance in 3 easy ways: 1) Fill out our online Request Form on this website, 2) Send a message on WhatsApp to 6282268453, or 3) Call HOMline directly at 6282268453."
    },
    {
      id: 3,
      category: "General",
      question: "Is HOMline available 24×7?",
      answer: "Yes! Online requests and enquiries can be submitted through our website 24 hours a day, 7 days a week. Our live support team operates Monday through Saturday from 9:00 AM to 8:00 PM IST."
    },
    {
      id: 4,
      category: "Fees & Charges",
      question: "How much does a service cost?",
      answer: "Every service card clearly specifies our nominal HOMline Service Charge (for consultation, document formatting, and submission support) and, where applicable, any separate official Government or Portal fee. We believe in 100% transparent pricing without hidden markups."
    },
    {
      id: 5,
      category: "Processing & Approvals",
      question: "Do you guarantee application approval?",
      answer: "No. HOMline provides expert application guidance, document formatting, and accurate data entry. Eligibility, verification, approval timelines, and final decisions remain exclusively with the respective government department, university, or authorized institution."
    },
    {
      id: 6,
      category: "Fees & Charges",
      question: "Can I cancel my request and get a refund?",
      answer: "Yes, cancellation and refund eligibility are subject to HOMline policies. If work on your application has not yet commenced on the portal, a full or partial refund of our service fee can be issued upon request."
    },
    {
      id: 7,
      category: "Privacy & Safety",
      question: "Are my personal documents and data safe?",
      answer: "Absolutely. HOMline adheres strictly to confidentiality and privacy best practices. Your documents (Aadhaar, Marksheets, Certificates) are accessed solely for completing your requested application and are never shared with unauthorized third parties."
    }
  ],

  reviews: [
    {
      customer_name: "Anish Kumar",
      location: "Kochi, Kerala",
      rating: 5,
      service_used: "Passport Application Assistance",
      review_text: "HOMline made my passport renewal so simple! They verified all my documents over WhatsApp, guided me through the fee payment, and booked the PSK slot in just one day. Exceptional guidance without visiting any agent shop.",
      is_verified: true
    },
    {
      customer_name: "Dr. Mariamma Joseph",
      location: "Kottayam, Kerala",
      rating: 5,
      service_used: "PAN Card Correction",
      review_text: "I had issues with photo and DOB mismatch on the NSDL portal. HOMline corrected the application details and kept me informed through WhatsApp at every step. Received my physical card within a week!",
      is_verified: true
    },
    {
      customer_name: "Rahul Nair",
      location: "Thiruvananthapuram",
      rating: 5,
      service_used: "CUET Exam Registration",
      review_text: "Very trustworthy and quick. They resized my documents to exact portal dimensions and submitted my exam form without any technical hassle. Highly recommended for students!",
      is_verified: true
    },
    {
      customer_name: "Saji Varghese",
      location: "Thrissur, Kerala",
      rating: 5,
      service_used: "Udyam MSME License",
      review_text: "Got my retail shop registered under MSME within 48 hours. Transparent charges, polite customer support via WhatsApp, and immediate tracking reference.",
      is_verified: true
    }
  ],

  initialRequests: []
};

// LocalStorage Store Management Helpers
const HOMLineStore = {
  getRequests: function () {
    try {
      const stored = localStorage.getItem('homline_service_requests');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Filter out any legacy dummy records so storage is 100% fresh
        const clean = parsed.filter(r => 
          !r.request_id.startsWith('HOM-2026-DEMO') && 
          !r.request_id.startsWith('HOM-2026-COMPLETED') && 
          !r.request_id.startsWith('HOM-2026-REVIEW')
        );
        return clean;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  },

  saveRequest: function (reqData) {
    const requests = this.getRequests();
    requests.unshift(reqData);
    try {
      localStorage.setItem('homline_service_requests', JSON.stringify(requests));
    } catch (e) {
      console.error(e);
    }
    return reqData;
  },

  findRequest: function (reqId) {
    if (!reqId) return null;
    const cleanId = reqId.trim().toUpperCase();
    const requests = this.getRequests();
    return requests.find(r => r.request_id.toUpperCase() === cleanId) || null;
  },

  generateRequestId: function () {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `HOM-2026-${code}`;
  }
};
