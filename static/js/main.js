// HOMline DIGI seva - Master Interactive Client-Side Application JS
// Features: Theme Switcher (Quantum Lumina & Cyber Midnight), Live Tracker, Interactive Checklist, Dynamic Fee Engine, and Reliable Service Application Workflow

// Apply theme immediately before DOM load to avoid flash
(function() {
  const savedTheme = localStorage.getItem('homline_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', function () {
  console.log('HOMline DIGI seva Engine ready.');

  // 1. Initialize Theme Switcher
  initThemeManager();

  // 2. Initialize Interactive Toast Engine
  initToastEngine();

  // 3. Initialize Interactive Request Tracker (Home & Track Page)
  initTrackerEngine();

  // 4. Initialize Service Fee Estimator Calculator with Interactive Chips
  initFeeEstimator();

  // 5. Initialize Modal Pre-Selectors
  initModalPreSelectors();

  // 6. Initialize Services Directory (Filter Pills, Live Search & Apply Now Triggers)
  initServicesDirectory();

  // 7. Initialize Interactive Document Checklist (service-detail.html)
  initChecklistEngine();

  // 8. Initialize Service Detail Page (if on service-detail.html)
  initServiceDetailPage();

  // 9. Initialize Request Service Page Auto-select (if on request-service.html)
  initRequestServicePage();

  // 10. Initialize FAQs Filtering (if on faqs.html)
  initFaqsPage();

  // 11. Initialize Updates Directory & Detail (if on updates.html or update-detail.html)
  initUpdatesPage();

  // 12. Initialize Forms Submission (Service Request & Enquiry)
  initFormSubmissions();

  // 13. Initialize Receipt Page (if on receipt.html)
  initReceiptPage();
});

/* ==========================================================================
   01. INTERACTIVE THEME SWITCHER (Lumina Day & Cyber Midnight)
   ========================================================================== */
function initThemeManager() {
  const currentTheme = localStorage.getItem('homline_theme') || 'light';
  applyTheme(currentTheme, false);

  const toggleBtns = document.querySelectorAll('#themeToggleBtn, .theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme, true);
    });
  });
}

function applyTheme(theme, showToast) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('homline_theme', theme);

  const toggleBtns = document.querySelectorAll('#themeToggleBtn, .theme-toggle-btn');
  toggleBtns.forEach(btn => {
    if (theme === 'dark') {
      btn.innerHTML = '<i class="bi bi-sun-fill text-gold"></i>';
      btn.setAttribute('title', 'Switch to Quantum Lumina Day Mode');
    } else {
      btn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
      btn.setAttribute('title', 'Switch to Cyber Midnight Dark Mode');
    }
  });

  if (showToast) {
    if (theme === 'dark') {
      showInteractiveToast('🌙 Cyber Midnight theme activated', 'bi-moon-stars-fill');
    } else {
      showInteractiveToast('☀️ Quantum Lumina theme activated', 'bi-sun-fill');
    }
  }
}

/* ==========================================================================
   02. INTERACTIVE TOAST ENGINE
   ========================================================================== */
let toastTimeout;
function initToastEngine() {
  if (!document.getElementById('interactiveToastContainer')) {
    const toast = document.createElement('div');
    toast.id = 'interactiveToastContainer';
    toast.className = 'interactive-toast';
    document.body.appendChild(toast);
  }
}

function showInteractiveToast(message, iconClass) {
  const toast = document.getElementById('interactiveToastContainer');
  if (!toast) return;

  const iconHtml = iconClass ? `<i class="bi ${iconClass} fs-5 text-cyan"></i>` : '';
  toast.innerHTML = `${iconHtml}<span>${message}</span>`;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

function copyReferenceId(id) {
  if (!id) return;
  navigator.clipboard.writeText(id).then(() => {
    showInteractiveToast(`✅ Copied Reference ID <strong>${id}</strong> to clipboard!`, 'bi-clipboard-check');
  }).catch(() => {
    showInteractiveToast(`Reference ID: ${id}`, 'bi-check2');
  });
}

/* ==========================================================================
   03. REQUEST TRACKER ENGINE WITH 1-CLICK DEMO CHIPS
   ========================================================================== */
function initTrackerEngine() {
  const trackForm = document.getElementById('trackFormAjax') || document.getElementById('trackFormPage');
  const trackResultContainer = document.getElementById('trackResultContainer');
  const requestIdInput = document.getElementById('ajaxRequestIdInput') || document.getElementById('pageRequestIdInput');

  // Check URL parameters for prefilled ID
  const urlParams = new URLSearchParams(window.location.search);
  const paramId = urlParams.get('id') || urlParams.get('request_id');
  if (paramId && requestIdInput) {
    requestIdInput.value = paramId.toUpperCase();
    renderTrackResult(paramId.toUpperCase(), trackResultContainer);
  }


  if (trackForm && trackResultContainer) {
    trackForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const reqId = requestIdInput ? requestIdInput.value.trim().toUpperCase() : '';
      if (!reqId) return;

      trackResultContainer.innerHTML = `
        <div class="text-center p-4">
          <div class="spinner-border text-teal" role="status">
            <span class="visually-hidden">Searching...</span>
          </div>
          <p class="mt-2 text-muted">Locating live status for reference ID: <strong>${reqId}</strong>...</p>
        </div>
      `;

      setTimeout(() => {
        renderTrackResult(reqId, trackResultContainer);
      }, 300);
    });
  }
}

function renderTrackResult(reqId, container) {
  if (!container) return;
  const data = HOMLineStore.findRequest(reqId);

  if (data) {
    let badgeClass = 'bg-warning text-dark';
    let progressPercent = '25%';
    let progressBarClass = 'bg-warning';

    if (data.status === 'Completed') {
      badgeClass = 'bg-success text-white';
      progressPercent = '100%';
      progressBarClass = 'bg-success';
    } else if (data.status === 'Processing') {
      badgeClass = 'bg-primary text-white';
      progressPercent = '75%';
      progressBarClass = 'bg-primary';
    } else if (data.status === 'Under Review') {
      badgeClass = 'bg-warning text-dark';
      progressPercent = '50%';
      progressBarClass = 'bg-warning';
    } else if (data.status === 'Cancelled') {
      badgeClass = 'bg-danger text-white';
      progressPercent = '100%';
      progressBarClass = 'bg-danger';
    }

    let timelineHtml = '';
    if (data.timeline && data.timeline.length > 0) {
      timelineHtml = `
        <div class="mt-4 pt-3 border-top">
          <h6 class="fw-bold text-navy mb-3"><i class="bi bi-clock-history text-teal me-2"></i> Official Activity History:</h6>
          <div class="border-start border-2 border-teal ps-3 ms-2">
            ${data.timeline.map((log) => `
              <div class="mb-3 position-relative">
                <div class="d-flex align-items-center gap-2 flex-wrap">
                  <span class="badge ${log.status === 'Completed' ? 'bg-success' : 'bg-teal'} text-white font-monospace" style="font-size:0.7rem;">${log.status}</span>
                  <strong class="text-navy small">${log.title}</strong>
                  <span class="text-muted font-monospace ms-auto small" style="font-size:0.72rem;">${log.date}</span>
                </div>
                ${log.description ? `<p class="text-muted small mb-0 mt-1">${log.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="homline-card p-0 overflow-hidden mt-3 shadow-md border-teal">
        <div class="card-header bg-navy text-white p-3 p-md-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <div class="d-flex align-items-center gap-2">
              <h6 class="mb-0 text-white font-brand fs-5">Reference ID: <span class="font-monospace text-gold">${data.request_id}</span></h6>
              <button type="button" onclick="copyReferenceId('${data.request_id}')" class="btn btn-sm btn-outline-light py-0 px-2 font-monospace" title="Copy to clipboard">
                <i class="bi bi-copy"></i>
              </button>
            </div>
            <small class="text-white-50">Registered: ${data.created_at}</small>
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="badge ${badgeClass} px-3 py-2 rounded-pill fs-6">${data.status}</span>
            <a href="receipt.html?id=${encodeURIComponent(data.request_id)}" target="_blank" class="btn btn-sm btn-gold font-monospace fw-bold">
              <i class="bi bi-printer-fill me-1"></i> Print Slip
            </a>
          </div>
        </div>
        <div class="card-body p-4">
          <!-- Step Progress Visualizer -->
          <div class="mb-4">
            <div class="d-flex justify-content-between text-muted font-monospace small mb-1" style="font-size:0.75rem;">
              <span>Registered (25%)</span>
              <span>Under Review (50%)</span>
              <span>Processing (75%)</span>
              <span>Completed (100%)</span>
            </div>
            <div class="progress" style="height: 8px;">
              <div class="progress-bar ${progressBarClass}" role="progressbar" style="width: ${progressPercent}"></div>
            </div>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-sm-6">
              <span class="text-muted small d-block">Citizen Full Name:</span>
              <strong class="text-navy fs-6">${data.full_name}</strong>
            </div>
            <div class="col-sm-6">
              <span class="text-muted small d-block">Requested Digital Service:</span>
              <strong class="text-navy fs-6">${data.service}</strong>
            </div>
            <div class="col-sm-6">
              <span class="text-muted small d-block">Mobile Contact:</span>
              <strong class="text-navy font-monospace">${data.mobile}</strong>
            </div>
            <div class="col-sm-6">
              <span class="text-muted small d-block">Communication Preference:</span>
              <span class="badge bg-light text-navy border font-monospace">${data.contact_preference || 'WhatsApp'}</span>
            </div>
          </div>

          <div class="p-3 bg-soft-mist rounded-3 border-start border-4 border-teal mb-3">
            <span class="text-muted small d-block fw-semibold mb-1">HOMline Official Case Notes:</span>
            <p class="mb-0 text-body font-monospace small">${data.admin_notes}</p>
          </div>

          ${timelineHtml}

          <div class="d-flex flex-wrap justify-content-between align-items-center text-muted small mt-3 pt-3 border-top gap-2">
            <span>Last Updated: <strong>${data.updated_at || data.created_at}</strong></span>
            <a href="https://wa.me/916282268453?text=Hi%20HOMline,%20I%20have%20an%20enquiry%20regarding%20Request%20ID%20${encodeURIComponent(data.request_id)}" target="_blank" class="btn btn-sm btn-whatsapp">
              <i class="bi bi-whatsapp me-1"></i> WhatsApp Query for this ID
            </a>
          </div>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="alert alert-warning rounded-4 p-4 mt-3 shadow-sm border-0">
        <div class="d-flex align-items-start gap-3">
          <i class="bi bi-info-circle-fill fs-3 flex-shrink-0 text-warning"></i>
          <div>
            <h5 class="fw-bold mb-1 text-navy">Reference ID Not Found</h5>
            <p class="mb-2 text-muted">No active application record matches reference ID: <code class="fw-bold fs-6 text-dark">${reqId}</code>.</p>
            <p class="small text-muted mb-3">Please verify the reference code or submit a fresh service request online.</p>
            <a href="request-service.html" class="btn btn-sm btn-navy font-monospace">
              <i class="bi bi-pencil-square me-1"></i> Submit a New Request
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

/* ==========================================================================
   04. INTERACTIVE SERVICE FEE CALCULATOR WITH LIVE CHIPS
   ========================================================================== */
function initFeeEstimator() {
  const calcServiceSelect = document.getElementById('calcServiceSelect');
  const calcPriorityMode = document.getElementById('calcPriorityMode');
  const calcDeliveryMode = document.getElementById('calcDeliveryMode');

  if (!calcServiceSelect) return;

  if (calcServiceSelect.children.length === 0 && typeof HOMLINE_DATA !== 'undefined') {
    HOMLINE_DATA.services.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.setAttribute('data-homline-fee', s.homline_fee_numeric || 200);
      opt.setAttribute('data-third-fee', s.third_party_fee);
      opt.textContent = `${s.title} (${s.categoryName})`;
      calcServiceSelect.appendChild(opt);
    });
  }

  function updateFee() {
    const selected = calcServiceSelect.options[calcServiceSelect.selectedIndex];
    if (!selected) return;

    const baseFee = parseInt(selected.getAttribute('data-homline-fee') || '200', 10);
    const thirdFee = selected.getAttribute('data-third-fee') || 'As per Govt portal';

    let priorityAdd = 0;
    if (calcPriorityMode && calcPriorityMode.value === 'express') priorityAdd = 100;
    if (calcPriorityMode && calcPriorityMode.value === 'urgent') priorityAdd = 200;

    let deliveryAdd = 0;
    if (calcDeliveryMode && calcDeliveryMode.value === 'home_print') deliveryAdd = 50;

    const totalHomline = baseFee + priorityAdd + deliveryAdd;

    const outHomline = document.getElementById('calcOutputHomline');
    const outThird = document.getElementById('calcOutputThird');
    const outTotal = document.getElementById('calcOutputTotal');

    if (outHomline) outHomline.textContent = `₹${totalHomline}`;
    if (outThird) outThird.textContent = thirdFee;
    if (outTotal) outTotal.textContent = `₹${totalHomline} + Govt Fee`;
  }

  calcServiceSelect.addEventListener('change', updateFee);
  if (calcPriorityMode) calcPriorityMode.addEventListener('change', updateFee);
  if (calcDeliveryMode) calcDeliveryMode.addEventListener('change', updateFee);

  updateFee();
}

/* ==========================================================================
   05. MODAL PRE-SELECTORS (Handles #requestModal)
   ========================================================================== */
function initModalPreSelectors() {
  const modalEl = document.getElementById('requestModal');
  if (!modalEl) return;

  modalEl.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    if (!button) return;

    const serviceTitle = button.getAttribute('data-service-title');
    const selectEl = modalEl.querySelector('select[name="service"]') || document.getElementById('serviceSelect');

    if (selectEl && serviceTitle) {
      for (let i = 0; i < selectEl.options.length; i++) {
        const optText = selectEl.options[i].text.toLowerCase();
        const search = serviceTitle.toLowerCase();
        if (optText.includes(search) || search.includes(optText)) {
          selectEl.selectedIndex = i;
          break;
        }
      }
    }
  });
}

/* ==========================================================================
   06. SERVICES DIRECTORY (Filter Pills, Live Search & Interactive Engine)
   ========================================================================== */
function initServicesDirectory() {
  const gridContainer = document.getElementById('servicesDirectoryGrid');
  if (!gridContainer || typeof HOMLINE_DATA === 'undefined' || !HOMLINE_DATA.services) return;

  const searchInput = document.getElementById('serviceSearchInput') || document.getElementById('servicesSearchInput');
  const searchClearBtn = document.getElementById('serviceSearchClearBtn');
  const searchKeywordChips = document.querySelectorAll('.search-keyword-chip');
  const pillButtons = document.querySelectorAll('.service-cat-pill, .filter-pill-btn');
  const countNum = document.getElementById('servicesCountNum');
  const countBadge = document.getElementById('servicesCountBadge');
  const activeFilterTagContainer = document.getElementById('activeFilterTagContainer');
  const activeFilterName = document.getElementById('activeFilterName');
  const clearActiveFilterBtn = document.getElementById('clearActiveFilterBtn');
  const activeSearchTagContainer = document.getElementById('activeSearchTagContainer');
  const activeSearchQuery = document.getElementById('activeSearchQuery');
  const clearActiveSearchBtn = document.getElementById('clearActiveSearchBtn');
  const sortSelect = document.getElementById('servicesSortSelect');
  const viewGridBtn = document.getElementById('viewModeGrid');
  const viewListBtn = document.getElementById('viewModeList');

  // Directory State
  let currentCategory = 'all';
  let currentSearch = '';
  let currentSort = 'featured';
  let isListView = false;

  // Initialize Category Pill Counts
  function updateCategoryPillCounts() {
    const counts = { all: HOMLINE_DATA.services.length };
    HOMLINE_DATA.services.forEach(s => {
      counts[s.categorySlug] = (counts[s.categorySlug] || 0) + 1;
    });

    const cntAll = document.getElementById('cntAll');
    if (cntAll) cntAll.textContent = counts.all || 8;
    const cntGovt = document.getElementById('cntGovt');
    if (cntGovt) cntGovt.textContent = counts['government-identity'] || 3;
    const cntEdu = document.getElementById('cntEdu');
    if (cntEdu) cntEdu.textContent = counts['education'] || 2;
    const cntBiz = document.getElementById('cntBiz');
    if (cntBiz) cntBiz.textContent = counts['business-professional'] || 1;
    const cntDig = document.getElementById('cntDig');
    if (cntDig) cntDig.textContent = counts['digital-online'] || 1;
    const cntDoc = document.getElementById('cntDoc');
    if (cntDoc) cntDoc.textContent = counts['document-application'] || 1;
  }
  updateCategoryPillCounts();

  // URL Parameters initialization (e.g. ?category=education or ?q=pan)
  const urlParams = new URLSearchParams(window.location.search);
  const paramCategory = urlParams.get('category');
  const paramQuery = urlParams.get('q') || urlParams.get('search');
  if (paramCategory) {
    currentCategory = paramCategory;
  }
  if (paramQuery && searchInput) {
    currentSearch = paramQuery.trim();
    searchInput.value = currentSearch;
  }

  // Helper: Highlight query terms in string
  function highlightText(text, query) {
    if (!query || !text) return text;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return text.replace(regex, '<mark class="bg-warning-subtle text-navy px-1 rounded">$1</mark>');
  }

  // Helper: Badge styling according to badge text
  function getBadgeClass(badge) {
    switch ((badge || '').toLowerCase()) {
      case 'popular':
      case 'high demand':
        return 'bg-gold text-dark';
      case 'essential':
        return 'bg-teal text-white';
      case 'business':
        return 'bg-navy text-white';
      case 'student benefit':
        return 'bg-primary text-white';
      case 'fast track':
      case 'instant':
      case 'instant service':
        return 'bg-cyan text-white';
      default:
        return 'bg-light text-navy border';
    }
  }

  // Render Directory Cards
  function renderGrid() {
    // 1. Filter Services
    let filtered = HOMLINE_DATA.services.filter(s => {
      const matchCat = (currentCategory === 'all') || (s.categorySlug === currentCategory);
      if (!matchCat) return false;

      if (!currentSearch) return true;
      const terms = currentSearch.toLowerCase().split(/\s+/).filter(Boolean);
      const searchableContent = [
        s.title,
        s.short_summary || '',
        s.description || '',
        s.categoryName || '',
        s.badge || '',
        (s.required_documents || []).join(' ')
      ].join(' ').toLowerCase();

      return terms.every(term => searchableContent.includes(term));
    });

    // 2. Sort Services
    filtered.sort((a, b) => {
      if (currentSort === 'fee-asc') {
        return (a.homline_fee_numeric || 200) - (b.homline_fee_numeric || 200);
      } else if (currentSort === 'fee-desc') {
        return (b.homline_fee_numeric || 200) - (a.homline_fee_numeric || 200);
      } else if (currentSort === 'title-asc') {
        return a.title.localeCompare(b.title);
      } else {
        // 'featured'
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return 0;
      }
    });

    // 3. Update Toolbar Counts and Active Tags
    const totalCount = HOMLINE_DATA.services.length;
    if (countNum) countNum.textContent = filtered.length;
    if (countBadge) {
      countBadge.innerHTML = `<i class="bi bi-layers-fill text-teal me-1"></i> Showing ${filtered.length} of ${totalCount} Services`;
    }

    // Active Category Tag
    if (activeFilterTagContainer && activeFilterName) {
      if (currentCategory !== 'all') {
        const catObj = HOMLINE_DATA.categories.find(c => c.slug === currentCategory);
        activeFilterName.textContent = catObj ? catObj.name : currentCategory;
        activeFilterTagContainer.style.display = 'inline-block';
      } else {
        activeFilterTagContainer.style.display = 'none';
      }
    }

    // Active Search Tag & Clear Button
    if (activeSearchTagContainer && activeSearchQuery) {
      if (currentSearch) {
        activeSearchQuery.textContent = `"${currentSearch}"`;
        activeSearchTagContainer.style.display = 'inline-block';
        if (searchClearBtn) searchClearBtn.style.display = 'inline-block';
      } else {
        activeSearchTagContainer.style.display = 'none';
        if (searchClearBtn) searchClearBtn.style.display = 'none';
      }
    }

    // Update Category Pills Active State
    pillButtons.forEach(btn => {
      const btnCat = btn.getAttribute('data-category');
      if (btnCat === currentCategory) {
        btn.classList.add('active');
        btn.classList.remove('btn-outline-navy', 'bg-white');
        btn.classList.add('btn-navy');
      } else {
        btn.classList.remove('active', 'btn-navy');
        btn.classList.add('btn-outline-navy', 'bg-white');
      }
    });

    // Update Quick Keyword Chips Active State
    searchKeywordChips.forEach(chip => {
      const chipSearch = (chip.getAttribute('data-search') || '').toLowerCase();
      if (currentSearch && chipSearch && currentSearch.toLowerCase().includes(chipSearch)) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    // 4. Handle Empty State
    const emptyStateEl = document.getElementById('servicesEmptyState');
    if (filtered.length === 0) {
      gridContainer.innerHTML = '';
      if (emptyStateEl) {
        emptyStateEl.style.display = 'block';
      } else {
        gridContainer.innerHTML = `
          <div class="col-12 text-center py-5">
            <div class="p-5 bg-card rounded-4 border border-teal shadow-sm max-width-700 mx-auto">
              <i class="bi bi-search-heart fs-1 text-teal mb-3 d-block"></i>
              <h4 class="fw-bold text-navy mb-2">No Digital Services Found</h4>
              <p class="text-muted mb-4">We couldn't find any services matching <strong>"${currentSearch}"</strong> in this category.</p>
              <button class="btn btn-navy rounded-pill px-4" id="emptyResetFiltersBtn">
                <i class="bi bi-arrow-clockwise me-1"></i> Reset Filters & Search
              </button>
            </div>
          </div>
        `;
        const resetBtn = document.getElementById('emptyResetFiltersBtn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            currentCategory = 'all';
            currentSearch = '';
            if (searchInput) searchInput.value = '';
            renderGrid();
          });
        }
      }
      return;
    } else {
      if (emptyStateEl) emptyStateEl.style.display = 'none';
    }

    // Set container mode class for List vs Grid
    if (isListView) {
      gridContainer.classList.add('services-directory-list-mode');
    } else {
      gridContainer.classList.remove('services-directory-list-mode');
    }

    // 5. Build Cards HTML
    const colClass = isListView ? 'col-12' : 'col-lg-4 col-md-6';
    gridContainer.innerHTML = filtered.map((s, idx) => {
      const chargeText = s.homline_charge || s.homline_fee || ('₹' + (s.homline_fee_numeric || 200));
      const govFeeText = s.third_party_fee || 'As per Govt portal';
      const iconClass = s.icon_class || 'bi-gear-wide-connected';
      const badgeClass = getBadgeClass(s.badge);
      const highlightedTitle = highlightText(s.title, currentSearch);
      const highlightedSummary = highlightText(s.short_summary || s.description.substring(0, 110) + '...', currentSearch);
      const docsCount = (s.required_documents || []).length;

      return `
        <div class="${colClass} service-card-item" data-category="${s.categorySlug}">
          <div class="homline-card service-card d-flex flex-column justify-content-between h-100 bg-white">
            <div>
              <!-- Top Row: Icon & Status Badge -->
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="brand-icon-box bg-soft-mist text-teal" style="width: 50px; height: 50px; font-size: 1.45rem;">
                  <i class="bi ${iconClass}"></i>
                </div>
                ${s.badge ? `<span class="badge ${badgeClass} fw-bold px-3 py-1 rounded-pill">${s.badge}</span>` : ''}
              </div>

              <!-- Category Tag -->
              <span class="badge bg-light text-navy border border-teal small mb-2 font-monospace">
                ${s.categoryName}
              </span>

              <!-- Title & Summary -->
              <h5 class="fw-bold text-navy mb-2">
                <a href="service-detail.html?service=${encodeURIComponent(s.slug)}" class="text-decoration-none text-navy">
                  ${highlightedTitle}
                </a>
              </h5>
              <p class="text-muted small mb-3">${highlightedSummary}</p>

              <!-- Interactive Quick Requirements Accordion/Drawer -->
              ${docsCount > 0 ? `
                <div class="card-docs-wrapper mb-3 border-top pt-2">
                  <button type="button" class="docs-drawer-btn w-100 d-flex justify-content-between align-items-center" data-drawer-target="docsDrawer-${s.id}">
                    <span class="d-flex align-items-center gap-1">
                      <i class="bi bi-file-earmark-check-fill text-teal"></i> Required Docs (${docsCount})
                    </span>
                    <span class="docs-toggle-indicator d-flex align-items-center gap-1">
                      <span>Quick View</span> <i class="bi bi-chevron-down"></i>
                    </span>
                  </button>
                  <div id="docsDrawer-${s.id}" class="card-docs-drawer mt-2 p-3 rounded-3 d-none">
                    <div class="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom">
                      <strong class="text-navy small"><i class="bi bi-clipboard-check text-teal me-1"></i> Check Your Documents:</strong>
                      <span class="text-muted" style="font-size:0.7rem;">Click to check</span>
                    </div>
                    <div class="d-flex flex-column gap-1">
                      ${s.required_documents.map((doc, docIdx) => `
                        <label class="doc-checklist-item d-flex align-items-start gap-2 mb-0">
                          <input type="checkbox" class="form-check-input mt-1 flex-shrink-0" id="chk-${s.id}-${docIdx}">
                          <span class="text-navy small text-start">${doc}</span>
                        </label>
                      `).join('')}
                    </div>
                  </div>
                </div>
              ` : ''}

              <!-- Authentic Fee Breakdown Box -->
              <div class="fee-badge-box">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="small text-muted fw-semibold">HOMline Assistance:</span>
                  <span class="fee-badge-homline text-teal fw-bold fs-6">${chargeText}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-1">
                  <span class="small text-muted">Govt / Portal Fee:</span>
                  <span class="fee-badge-thirdparty small">${govFeeText}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-1">
                  <span class="small text-muted">Est. Processing:</span>
                  <span class="font-monospace text-teal small fw-bold">
                    <i class="bi bi-clock me-1"></i>${s.processing_time}
                  </span>
                </div>
              </div>
            </div>

            <!-- Card Actions Footer -->
            <div class="d-flex gap-2 mt-3 pt-2 border-top">
              <a href="service-detail.html?service=${encodeURIComponent(s.slug)}" class="btn btn-outline-navy btn-sm flex-fill" title="View step-by-step guidance & documents">
                <i class="bi bi-info-circle me-1"></i> Details
              </a>
              <button type="button" class="btn btn-teal btn-sm flex-fill btn-apply-trigger" data-service-title="${s.title}" data-service-slug="${s.slug}">
                <i class="bi bi-send-fill me-1"></i> Apply Now
              </button>
              <a href="https://wa.me/916282268453?text=Hi%20HOMline,%20I%20have%20an%20enquiry%20regarding%20${encodeURIComponent(s.title)}" target="_blank" class="btn btn-sm btn-outline-success px-2 d-flex align-items-center justify-content-center" title="Chat on WhatsApp about this service">
                <i class="bi bi-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach Document Drawer Toggles
    gridContainer.querySelectorAll('.docs-drawer-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-drawer-target');
        const drawer = document.getElementById(targetId);
        if (!drawer) return;
        const indicator = this.querySelector('.docs-toggle-indicator');
        const isHidden = drawer.classList.contains('d-none');
        if (isHidden) {
          drawer.classList.remove('d-none');
          if (indicator) indicator.innerHTML = '<span>Hide</span> <i class="bi bi-chevron-up"></i>';
        } else {
          drawer.classList.add('d-none');
          if (indicator) indicator.innerHTML = '<span>Quick View</span> <i class="bi bi-chevron-down"></i>';
        }
      });
    });

    // Attach "Apply Now" button click listeners
    gridContainer.querySelectorAll('.btn-apply-trigger').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const title = this.getAttribute('data-service-title') || '';
        const slug = this.getAttribute('data-service-slug') || '';
        const modalEl = document.getElementById('requestModal');

        if (modalEl && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
          const selectEl = modalEl.querySelector('select[name="service"]') || document.getElementById('serviceSelect');
          if (selectEl) {
            let matched = false;
            for (let i = 0; i < selectEl.options.length; i++) {
              const optVal = selectEl.options[i].value.toLowerCase();
              const optText = selectEl.options[i].text.toLowerCase();
              if (optVal === slug.toLowerCase() || optText.includes(title.toLowerCase()) || title.toLowerCase().includes(optText)) {
                selectEl.selectedIndex = i;
                matched = true;
                break;
              }
            }
          }
          const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
          bsModal.show();
          if (typeof showInteractiveToast === 'function') {
            showInteractiveToast(`Selected: ${title}`, 'bi-check-circle-fill');
          }
        } else {
          window.location.href = `request-service.html?service=${encodeURIComponent(slug || title)}`;
        }
      });
    });
  }

  // Event Listeners: Category Filter Pills
  pillButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      currentCategory = this.getAttribute('data-category') || 'all';
      renderGrid();
    });
  });

  // Event Listeners: Search Input & Clear
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      currentSearch = this.value.trim();
      renderGrid();
    });
  }
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', function () {
      if (searchInput) searchInput.value = '';
      currentSearch = '';
      renderGrid();
      if (searchInput) searchInput.focus();
    });
  }

  // Event Listeners: Quick Search Keyword Chips
  searchKeywordChips.forEach(chip => {
    chip.addEventListener('click', function () {
      const kw = this.getAttribute('data-search') || '';
      currentSearch = kw;
      if (searchInput) searchInput.value = kw;
      renderGrid();
    });
  });

  // Event Listeners: Clear Active Tags
  if (clearActiveFilterBtn) {
    clearActiveFilterBtn.addEventListener('click', function () {
      currentCategory = 'all';
      renderGrid();
    });
  }
  if (clearActiveSearchBtn) {
    clearActiveSearchBtn.addEventListener('click', function () {
      currentSearch = '';
      if (searchInput) searchInput.value = '';
      renderGrid();
    });
  }

  // Event Listeners: Sort Dropdown
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      currentSort = this.value;
      renderGrid();
    });
  }

  // Event Listeners: View Mode Switcher
  if (viewGridBtn && viewListBtn) {
    viewGridBtn.addEventListener('click', function () {
      isListView = false;
      viewGridBtn.classList.add('active');
      viewListBtn.classList.remove('active');
      renderGrid();
    });
    viewListBtn.addEventListener('click', function () {
      isListView = true;
      viewListBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
      renderGrid();
    });
  }

  // Keyboard Shortcuts: '/' or 'Ctrl+K' focuses search, 'Escape' clears
  document.addEventListener('keydown', function (e) {
    if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== searchInput) {
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    } else if (e.key === 'Escape' && document.activeElement === searchInput) {
      if (searchInput.value) {
        searchInput.value = '';
        currentSearch = '';
        renderGrid();
      }
      searchInput.blur();
    }
  });

  // Initial Render
  renderGrid();
}

/* ==========================================================================
   07. INTERACTIVE DOCUMENT CHECKLIST ENGINE (Live Gamified Progress)
   ========================================================================== */
function initChecklistEngine() {
  const checklistContainers = document.querySelectorAll('.interactive-checklist-box');
  checklistContainers.forEach(box => {
    const items = box.querySelectorAll('.checklist-item');
    const progressBar = box.querySelector('.checklist-progress-fill');
    const progressText = box.querySelector('.checklist-progress-text');
    const successBanner = box.querySelector('.checklist-success-banner');

    function updateProgress() {
      const total = items.length;
      if (total === 0) return;
      let checkedCount = 0;
      items.forEach(it => {
        if (it.classList.contains('checked')) checkedCount++;
      });

      const percent = Math.round((checkedCount / total) * 100);
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressText) progressText.textContent = `${checkedCount} of ${total} Documents Checked (${percent}%)`;

      if (successBanner) {
        if (percent === 100) {
          successBanner.classList.remove('d-none');
          showInteractiveToast('🎉 100% Prepared! All documents ready.', 'bi-check-all');
        } else {
          successBanner.classList.add('d-none');
        }
      }
    }

    items.forEach(item => {
      item.addEventListener('click', function() {
        this.classList.toggle('checked');
        updateProgress();
      });
    });

    updateProgress();
  });
}

/* ==========================================================================
   08. SERVICE DETAIL PAGE (Dynamic Checklist & Requirements)
   ========================================================================== */
function initServiceDetailPage() {
  const container = document.getElementById('serviceDetailContainer');
  if (!container || typeof HOMLINE_DATA === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('service') || 'pan-card-new-update';
  const service = HOMLINE_DATA.services.find(s => s.slug === slug) || HOMLINE_DATA.services[0];

  document.title = `${service.title} • HOMline DIGI seva`;

  container.innerHTML = `
    <div class="row g-4">
      <div class="col-lg-8">
        <div class="homline-card mb-4 shadow-sm">
          <div class="d-flex flex-wrap gap-2 mb-3">
            <span class="badge bg-teal text-white font-monospace px-3 py-2">${service.categoryName}</span>
            <span class="badge bg-gold text-dark font-monospace px-3 py-2"><i class="bi bi-clock-history me-1"></i>${service.processing_time}</span>
          </div>
          <h1 class="display-6 fw-bold text-navy mb-3">${service.title}</h1>
          <p class="lead text-muted mb-4">${service.description}</p>
          
          <h5 class="fw-bold text-navy mb-3">Detailed Service Description</h5>
          <p class="text-body mb-4">${service.detailed_description}</p>

          <!-- Interactive Document Checklist Section -->
          <div class="interactive-checklist-box p-4 bg-soft-mist rounded-4 border border-teal mb-4">
            <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
              <h5 class="fw-bold text-navy mb-0"><i class="bi bi-card-checklist text-teal me-2"></i> Document Readiness Checklist</h5>
              <span class="badge bg-white text-navy border font-monospace checklist-progress-text">0 Checked</span>
            </div>
            <p class="text-muted small mb-3">Click each document as you gather them to track your application readiness:</p>
            
            <div class="checklist-progress-bar mb-3">
              <div class="checklist-progress-fill" style="width: 0%"></div>
            </div>

            <div class="interactive-checklist">
              ${service.requirements.map(req => `
                <div class="checklist-item">
                  <div class="checklist-checkbox"><i class="bi bi-check"></i></div>
                  <span class="fw-semibold small">${req}</span>
                </div>
              `).join('')}
            </div>

            <div class="checklist-success-banner alert alert-success d-none mt-3 mb-0 rounded-3">
              <i class="bi bi-patch-check-fill me-2 fs-5"></i>
              <strong>100% Prepared!</strong> You have all required documents ready. Click Apply below to submit your details.
            </div>
          </div>

          <div class="p-3 bg-light rounded-3 border mb-4">
            <h6 class="fw-bold text-navy mb-2"><i class="bi bi-diagram-3-fill text-teal me-2"></i> Application & Delivery Workflow</h6>
            <ol class="mb-0 text-muted small ps-3">
              <li class="mb-1">Submit your request online or through dedicated WhatsApp desk.</li>
              <li class="mb-1">Send scanned copies or clear smartphone photos of documents.</li>
              <li class="mb-1">HOMline verifies criteria, resizes documents, and completes portal application.</li>
              <li>Official acknowledgement receipt and tracking details delivered to your WhatsApp.</li>
            </ol>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="homline-card sticky-top shadow-sm" style="top: 90px;">
          <h5 class="fw-bold text-navy mb-3">Service Charges Breakdown</h5>
          <div class="fee-badge-box mt-0 mb-4">
            <div class="d-flex justify-content-between mb-2">
              <span class="fee-badge-homline">HOMline Consultation:</span>
              <strong class="text-teal fs-5">${service.homline_fee}</strong>
            </div>
            <div class="d-flex justify-content-between">
              <span class="fee-badge-thirdparty">Govt / Portal Fee:</span>
              <span class="text-muted small">${service.third_party_fee}</span>
            </div>
          </div>

          <div class="d-grid gap-2 mb-3">
            <a href="request-service.html?service=${encodeURIComponent(service.title)}" class="btn btn-teal btn-lg">
              Apply Online Now <i class="bi bi-arrow-right ms-1"></i>
            </a>
            <a href="https://wa.me/916282268453?text=Hi%20HOMline,%20I%20want%20to%20apply%20for%20${encodeURIComponent(service.title)}" target="_blank" class="btn btn-whatsapp btn-lg">
              <i class="bi bi-whatsapp me-2"></i> Apply via WhatsApp
            </a>
            <a href="tel:6282268453" class="btn btn-outline-navy">
              <i class="bi bi-telephone-fill me-2"></i> Call 6282268453
            </a>
          </div>

          <div class="text-center">
            <small class="text-muted font-monospace"><i class="bi bi-shield-check text-teal me-1"></i> 100% Confidential & Secure</small>
          </div>
        </div>
      </div>
    </div>
  `;

  initChecklistEngine();
}

/* ==========================================================================
   09. REQUEST SERVICE PAGE AUTO-SELECT (request-service.html)
   ========================================================================== */
function initRequestServicePage() {
  const serviceSelect = document.querySelector('form.homline-service-request-form select[name="service"]');
  if (!serviceSelect) return;

  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  if (serviceParam) {
    const cleanParam = decodeURIComponent(serviceParam).toLowerCase();
    for (let i = 0; i < serviceSelect.options.length; i++) {
      const optText = serviceSelect.options[i].text.toLowerCase();
      const optVal = serviceSelect.options[i].value.toLowerCase();
      if (optText.includes(cleanParam) || cleanParam.includes(optText) || optVal.includes(cleanParam)) {
        serviceSelect.selectedIndex = i;
        showInteractiveToast(`Pre-selected service: <strong>${serviceSelect.options[i].text}</strong>`, 'bi-check-circle-fill');
        break;
      }
    }
  }
}

/* ==========================================================================
   10. FAQS PAGE FILTERING
   ========================================================================== */
function initFaqsPage() {
  const container = document.getElementById('faqsAccordionContainer');
  const searchInput = document.getElementById('faqsSearchInput');
  const catPills = document.querySelectorAll('.faq-category-pill');

  if (!container || typeof HOMLINE_DATA === 'undefined') return;

  let activeCat = 'All';
  let activeSearch = '';

  function renderFaqs() {
    const filtered = HOMLINE_DATA.faqs.filter(f => {
      const matchCat = (activeCat === 'All') || (f.category === activeCat);
      const query = activeSearch.toLowerCase();
      const matchSearch = f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="p-4 text-center text-muted">
          <p>No questions found matching your filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((f, i) => `
      <div class="accordion-item border rounded-3 mb-3 overflow-hidden shadow-xs">
        <h2 class="accordion-header" id="headingFaq${f.id}">
          <button class="accordion-button ${i !== 0 ? 'collapsed' : ''} fw-bold text-navy" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFaq${f.id}" aria-expanded="${i === 0 ? 'true' : 'false'}" aria-controls="collapseFaq${f.id}">
            <span class="badge bg-light text-navy border me-2 font-monospace small">${f.category}</span>
            ${f.question}
          </button>
        </h2>
        <div id="collapseFaq${f.id}" class="accordion-collapse collapse ${i === 0 ? 'show' : ''}" aria-labelledby="headingFaq${f.id}" data-bs-parent="#faqsAccordionContainer">
          <div class="accordion-body text-muted">
            ${f.answer}
          </div>
        </div>
      </div>
    `).join('');
  }

  catPills.forEach(pill => {
    pill.addEventListener('click', function() {
      catPills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      activeCat = this.getAttribute('data-cat') || 'All';
      renderFaqs();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      activeSearch = this.value.trim();
      renderFaqs();
    });
  }

  renderFaqs();
}

/* ==========================================================================
   11. UPDATES DIRECTORY & DETAIL
   ========================================================================== */
function initUpdatesPage() {
  const gridContainer = document.getElementById('updatesGridContainer');
  if (gridContainer && typeof HOMLINE_DATA !== 'undefined') {
    gridContainer.innerHTML = HOMLINE_DATA.updates.map(u => `
      <div class="col-md-6">
        <div class="homline-card shadow-sm h-100 d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="update-tag tag-service-update">${u.category_tag}</span>
            <small class="text-muted font-monospace">${u.date}</small>
          </div>
          <h5 class="fw-bold text-navy mb-2">${u.title}</h5>
          <p class="text-muted small flex-grow-1">${u.summary}</p>
          <a href="update-detail.html?slug=${encodeURIComponent(u.slug)}" class="btn btn-outline-navy btn-sm mt-2">Read Notice &rarr;</a>
        </div>
      </div>
    `).join('');
  }

  const detailContainer = document.getElementById('updateDetailContainer');
  if (detailContainer && typeof HOMLINE_DATA !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug') || 'new-digital-services-added';
    const item = HOMLINE_DATA.updates.find(u => u.slug === slug) || HOMLINE_DATA.updates[0];

    document.title = `${item.title} • HOMline DIGI seva Notice`;

    detailContainer.innerHTML = `
      <div class="homline-card shadow-sm p-4 p-md-5">
        <div class="d-flex gap-2 align-items-center mb-3">
          <span class="update-tag tag-service-update">${item.category_tag}</span>
          <span class="text-muted font-monospace small">• ${item.date}</span>
        </div>
        <h1 class="display-6 fw-bold text-navy mb-4">${item.title}</h1>
        <div class="lead text-muted mb-4">${item.summary}</div>
        <hr class="my-4">
        <div class="text-body fs-6" style="line-height: 1.8;">
          <p>${item.content}</p>
        </div>
        <div class="mt-5 pt-3 border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
          <a href="updates.html" class="btn btn-outline-navy">&larr; Back to Noticeboard</a>
          <a href="https://wa.me/916282268453?text=Hi%20HOMline,%20I%20have%20an%20enquiry%20regarding%20notice:%20${encodeURIComponent(item.title)}" target="_blank" class="btn btn-whatsapp">
            <i class="bi bi-whatsapp me-2"></i> WhatsApp Enquiry for this Notice
          </a>
        </div>
      </div>
    `;
  }
}

/* ==========================================================================
   12. FORM SUBMISSIONS (Handles All Application Forms Reliably)
   ========================================================================== */
function initFormSubmissions() {
  const serviceForms = document.querySelectorAll('.homline-service-request-form, form#homlineServiceRequestForm, #requestModal form');
  
  serviceForms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const newId = HOMLineStore.generateRequestId();
      const fullName = form.querySelector('[name="full_name"]')?.value || 'Valued Citizen';
      const mobile = form.querySelector('[name="mobile"]')?.value || '6282268453';
      const email = form.querySelector('[name="email"]')?.value || '';
      
      const serviceSelect = form.querySelector('[name="service"]');
      let serviceTitle = 'Digital Citizen Service';
      if (serviceSelect && serviceSelect.selectedIndex >= 0) {
        serviceTitle = serviceSelect.options[serviceSelect.selectedIndex].text;
      }
      
      const notes = form.querySelector('[name="requirement_details"]')?.value || 'Standard assistance request.';
      const channel = form.querySelector('[name="contact_preference"]')?.value || 'WhatsApp';

      const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      const newRecord = {
        request_id: newId,
        full_name: fullName,
        mobile: mobile,
        email: email,
        service: serviceTitle,
        requirement_details: notes,
        contact_preference: channel,
        status: "Processing",
        created_at: `${dateStr}, ${timeStr}`,
        updated_at: `${dateStr}, ${timeStr}`,
        admin_notes: `Application logged via portal. Assigned Reference ID ${newId}. Our digital desk will verify documents and connect on ${channel}.`,
        timeline: [
          {
            status: "Pending",
            title: "Application Received",
            description: `Application registered under Reference ID ${newId}.`,
            date: `${dateStr}, ${timeStr}`
          },
          {
            status: "Processing",
            title: "Assigned to Assistance Desk",
            description: "Document verification in progress.",
            date: `${dateStr}, ${timeStr}`
          }
        ]
      };

      HOMLineStore.saveRequest(newRecord);

      // Hide modal if open
      const modalEl = form.closest('.modal');
      if (modalEl && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
      }

      form.reset();

      showInteractiveToast(`✅ Service Request logged! Ref ID: <strong>${newId}</strong>`, 'bi-check-circle-fill');

      setTimeout(() => {
        window.location.href = `track-request.html?id=${newId}`;
      }, 600);
    });
  });

  // Quick Contact Form
  const contactForm = document.getElementById('homlineQuickContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('contactNameInput')?.value || 'Citizen';
      showInteractiveToast(`Thank you, ${name}! Your enquiry has been received.`, 'bi-envelope-check');
      contactForm.reset();
    });
  }

  // Membership Enquiry Form
  const memForm = document.getElementById('membershipEnquiryForm');
  if (memForm) {
    memForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('memNameInput')?.value || 'Member';
      showInteractiveToast(`Thank you, ${name}! Membership enquiry received.`, 'bi-gem');
      const modalEl = document.getElementById('membershipEnquiryModal');
      if (modalEl && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
      }
      memForm.reset();
    });
  }
}

/* ==========================================================================
   13. RECEIPT PAGE (receipt.html)
   ========================================================================== */
function initReceiptPage() {
  const receiptContainer = document.getElementById('receiptCardContainer');
  if (!receiptContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const reqId = urlParams.get('id');
  const reqData = reqId ? HOMLineStore.findRequest(reqId) : null;

  if (!reqData) {
    receiptContainer.innerHTML = `
      <div class="homline-card bg-white p-5 text-center shadow-lg border-0 my-4">
        <i class="bi bi-receipt-cutoff fs-1 text-teal mb-3 d-block"></i>
        <h4 class="fw-bold text-navy mb-2">No Application Receipt Found</h4>
        <p class="text-muted mb-4">Please enter a valid Reference ID from your submitted application to view and print your official acknowledgement receipt.</p>
        <div class="d-flex justify-content-center gap-3">
          <a href="track-request.html" class="btn btn-navy">
            <i class="bi bi-search me-1"></i> Track an Application
          </a>
          <a href="request-service.html" class="btn btn-teal">
            <i class="bi bi-pencil-square me-1"></i> Submit a New Request
          </a>
        </div>
      </div>
    `;
    return;
  }

  document.title = `HOMline DIGI seva • Official Receipt Slip [${reqData.request_id}]`;

  const idEl = document.getElementById('receiptRequestId');
  const barcodeEl = document.getElementById('receiptBarcode');
  const dateEl = document.getElementById('receiptDate');
  const nameEl = document.getElementById('receiptCustomerName');
  const mobileEl = document.getElementById('receiptMobile');
  const emailEl = document.getElementById('receiptEmail');
  const serviceEl = document.getElementById('receiptServiceTitle');
  const channelEl = document.getElementById('receiptChannel');
  const statusEl = document.getElementById('receiptStatusBadge');
  const notesEl = document.getElementById('receiptNotes');
  const trackerLinkEl = document.getElementById('receiptTrackerLink');

  if (idEl) idEl.textContent = reqData.request_id;
  if (barcodeEl) barcodeEl.textContent = `* ${reqData.request_id} *`;
  if (dateEl) dateEl.textContent = reqData.created_at;
  if (nameEl) nameEl.textContent = reqData.full_name;
  if (mobileEl) mobileEl.textContent = reqData.mobile;
  if (emailEl) emailEl.textContent = reqData.email || 'N/A';
  if (serviceEl) serviceEl.textContent = reqData.service;
  if (channelEl) channelEl.textContent = reqData.contact_preference || 'WhatsApp';
  if (statusEl) statusEl.textContent = reqData.status;
  if (notesEl) notesEl.textContent = reqData.admin_notes || 'Application received and securely queued.';
  if (trackerLinkEl) trackerLinkEl.href = `track-request.html?id=${encodeURIComponent(reqData.request_id)}`;
}
