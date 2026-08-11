// RGM Converts Portal JS Logic

let activeTab = 'converts';
let crusadesList = [];
let convertsData = [];
let attendanceData = [];
let usersData = [];
let editingConvertId = null;
let editingAttendanceId = null;
let editingUserId = null;

// Bulk entry session state
// { crusadeId, crusadeTitle, date, serviceName, ministerName, count: 0 }
let sessionState = null;

// On Page Load
document.addEventListener('DOMContentLoaded', () => {
  verifySession();
});

// Verification API Session checks
async function verifySession() {
  const token = sessionStorage.getItem('rgm_converts_token');
  if (!token) {
    redirectToLogin();
    return;
  }

  try {
    const res = await fetch('/api/converts-portal/verify', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error('Session invalid');
    }

    const data = await res.json();
    setupDashboardHeader(data.admin);
    
    // Load Crusades lookup list first (needed for both filters and forms)
    await loadCrusadesLookup();

    // Default to converts tab
    switchTab('converts');

  } catch (err) {
    console.error('Session verification failed:', err);
    clearSession();
    redirectToLogin();
  }
}

function setupDashboardHeader(admin) {
  document.getElementById('adminGreeting').textContent = `Welcome, ${admin.full_name}`;
  document.getElementById('adminRoleBadge').textContent = admin.role;

  // If Super Admin, show User Accounts tab
  if (admin.role === 'super_admin') {
    document.getElementById('tab-users').style.display = 'block';
  }
}

function clearSession() {
  sessionStorage.removeItem('rgm_converts_token');
  sessionStorage.removeItem('rgm_converts_username');
  sessionStorage.removeItem('rgm_converts_fullname');
  sessionStorage.removeItem('rgm_converts_role');
}

function redirectToLogin() {
  location.href = 'login.html';
}

function handleLogout() {
  clearSession();
  redirectToLogin();
}

function getAuthHeaders() {
  const token = sessionStorage.getItem('rgm_converts_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

// Dialog management
function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  if (id === 'convertModal') {
    document.getElementById('convertForm').reset();
    editingConvertId = null;
  } else if (id === 'attendanceModal') {
    document.getElementById('attendanceForm').reset();
    editingAttendanceId = null;
    document.getElementById('attendanceModalTitle').textContent = 'Log Attendance Register';
  } else if (id === 'adminUserModal') {
    document.getElementById('adminUserForm').reset();
    document.getElementById('adminUserField').disabled = false;
    document.getElementById('adminPasswordField').required = true;
    editingUserId = null;
  } else if (id === 'passwordChangeModal') {
    document.getElementById('passwordForm').reset();
  } else if (id === 'prayerModal') {
    document.getElementById('prayerLogForm').reset();
  } else if (id === 'partnersModal') {
    document.getElementById('partnersForm').reset();
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// Fetch Crusades lookup helper
async function loadCrusadesLookup() {
  try {
    const res = await fetch('/api/converts-portal/crusades', {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('rgm_converts_token')}` }
    });
    if (res.ok) {
      crusadesList = await res.json();
    }
  } catch (err) {
    console.error('Failed to load crusades lookup:', err);
  }
}

// Tab router
function switchTab(tabName) {
  activeTab = tabName;
  
  // Highlight tab button
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`tab-${tabName}`);
  if (activeBtn) activeBtn.classList.add('active');

  // Render tab container structures
  const container = document.getElementById('tabContent');
  
  if (tabName === 'converts') {
    renderConvertsTab(container);
  } else if (tabName === 'attendance') {
    renderAttendanceTab(container);
  } else if (tabName === 'prayers') {
    renderPrayersTab(container);
  } else if (tabName === 'partners') {
    renderPartnersTab(container);
  } else if (tabName === 'crossover') {
    renderCrossoverTab(container);
  } else if (tabName === 'discussions') {
    renderDiscussionsTab(container);
  } else if (tabName === 'subscribers') {
    renderSubscribersTab(container);
  } else if (tabName === 'export') {
    renderExportTab(container);
  } else if (tabName === 'users') {
    renderUsersTab(container);
  }
}

// ----------------------------------------------------
// TABS & UI RENDERING
// ----------------------------------------------------

// 👥 CONVERTS TAB ROUTINES
function renderConvertsTab(container) {
  // ---- Session banner (shown when a bulk entry session is active) ----
  const sessionBanner = sessionState ? `
    <div class="session-banner">
      <div class="session-info">
        <span class="session-label">ACTIVE BULK SESSION</span>
        <span><strong>${escapeHTML(sessionState.serviceName)}</strong> &middot; ${escapeHTML(sessionState.crusadeTitle)} &middot; ${escapeHTML(sessionState.date)} &middot; Min: ${escapeHTML(sessionState.ministerName)}</span>
      </div>
      <div class="session-stats">
        <span class="session-count" id="sessionCount">${sessionState.count} added</span>
        <button class="btn btn-outline btn-sm" onclick="endSessionPrompt()">Close &amp; Save Session</button>
      </div>
    </div>

    <div class="quick-add-panel">
      <h4 style="margin:0 0 14px; color:var(--dawn-gold); font-family:var(--mono); font-size:0.8rem; text-transform:uppercase; letter-spacing:0.07em;">Quick Add Convert</h4>
      <div class="quick-add-row">
        <input type="text" id="quickName" placeholder="Full Name *" autocomplete="off" onkeydown="if(event.key==='Enter') quickAddConvert()">
        <input type="tel" id="quickPhone" placeholder="Phone Number" autocomplete="off" onkeydown="if(event.key==='Enter') quickAddConvert()">
        <input type="text" id="quickChurch" placeholder="Church / Denomination" autocomplete="off" onkeydown="if(event.key==='Enter') quickAddConvert()">
        <button class="btn btn-primary" onclick="quickAddConvert()">+ Add</button>
      </div>
      <p id="quickFeedback" style="font-size:0.82rem; margin:10px 0 0; min-height:18px; color:#81c784;"></p>
    </div>
  ` : `
    <div class="session-start-bar">
      <div>
        <strong style="color:var(--parchment);">Entering multiple converts?</strong>
        <span style="opacity:0.7; font-size:0.88rem;"> Start a session to set shared fields once for the entire group.</span>
      </div>
      <button class="btn btn-primary btn-sm" onclick="openSessionModal()">Start Bulk Entry Session</button>
    </div>
  `;

  container.innerHTML = `
    ${sessionBanner}

    <!-- Stats Row -->
    <div class="stats-grid">
      <div class="stat-card">
        <h4>Total Converts Registered</h4>
        <div class="val" id="stat-total">-</div>
      </div>
      <div class="stat-card">
        <h4>Remaining to Call</h4>
        <div class="val" id="stat-remaining" style="color:#c9a24a;">-</div>
      </div>
      <div class="stat-card">
        <h4>Successfully Contacted</h4>
        <div class="val" id="stat-contacted" style="color:#81c784;">-</div>
      </div>
      <div class="stat-card">
        <h4>Requires Home Visits</h4>
        <div class="val" id="stat-visit" style="color:#64b5f6;">-</div>
      </div>
    </div>

    <!-- Filter Toolbar Row 1 -->
    <div class="filter-bar">
      <div class="filter-group">
        <label for="filterSearch">Search by Name / Phone / Church / Notes</label>
        <input type="text" id="filterSearch" placeholder="Type query and press Enter..." onkeydown="if(event.key==='Enter') loadConvertsData()">
      </div>
      <div class="filter-group">
        <label for="filterCrusade">Crusade Location</label>
        <select id="filterCrusade" onchange="loadConvertsData()">
          <option value="">All Crusades</option>
          ${crusadesList.map(c => `<option value="${c.id}">${c.title} (${c.date_range})</option>`).join('')}
        </select>
      </div>
      <div class="filter-group">
        <label for="filterStatus">Engagement Status</label>
        <select id="filterStatus" onchange="loadConvertsData()">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="contacted">Contacted</option>
          <option value="no_answer">No Answer</option>
          <option value="needs_visit">Needs Visit</option>
        </select>
      </div>
    </div>

    <!-- Filter Toolbar Row 2 -->
    <div class="filter-bar" style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr; margin-top:-16px;">
      <div class="filter-group">
        <label for="filterDateFrom">Registered From</label>
        <input type="date" id="filterDateFrom" onchange="loadConvertsData()">
      </div>
      <div class="filter-group">
        <label for="filterDateTo">Registered To</label>
        <input type="date" id="filterDateTo" onchange="loadConvertsData()">
      </div>
      <div class="filter-group">
        <label for="filterContactFrom">Last Contact From</label>
        <input type="date" id="filterContactFrom" onchange="loadConvertsData()">
      </div>
      <div class="filter-group">
        <label for="filterContactTo">Last Contact To</label>
        <input type="date" id="filterContactTo" onchange="loadConvertsData()">
      </div>
      <div class="filter-group">
        <label for="filterHasPhone">Phone Number</label>
        <select id="filterHasPhone" onchange="loadConvertsData()">
          <option value="">All Converts</option>
          <option value="yes">Has Phone Only</option>
          <option value="no">No Phone Only</option>
        </select>
      </div>
    </div>

    <!-- Filter Toolbar Row 3 — Session Filters -->
    <div class="filter-bar" style="grid-template-columns: 1fr 1fr 1fr; margin-top:-16px;">
      <div class="filter-group">
        <label for="filterServiceDate">Service Date</label>
        <input type="date" id="filterServiceDate" onchange="loadConvertsData()">
      </div>
      <div class="filter-group">
        <label for="filterServiceName">Service Name / Split</label>
        <input type="text" id="filterServiceName" placeholder="e.g. Morning Session" onkeydown="if(event.key==='Enter') loadConvertsData()">
      </div>
      <div class="filter-group">
        <label for="filterMinisterName">Ministering Name</label>
        <input type="text" id="filterMinisterName" placeholder="e.g. Pastor Alick" onkeydown="if(event.key==='Enter') loadConvertsData()">
      </div>
    </div>

    <!-- Actions & List Row -->
    <div class="action-bar">
      <h2>Converts Registry</h2>
      <div style="display:flex; gap:10px; align-items:center;">
        <div class="filter-group" style="flex-direction:row; align-items:center; gap:8px; margin:0;">
          <label for="sortConverts" style="white-space:nowrap; margin:0;">Sort by</label>
          <select id="sortConverts" onchange="sortConverts()" style="margin:0; padding:6px 10px; font-size:0.82rem;">
            <option value="created_desc">Date Registered ↓ (newest)</option>
            <option value="created_asc">Date Registered ↑ (oldest)</option>
            <option value="name_asc">Name A → Z</option>
            <option value="name_desc">Name Z → A</option>
            <option value="contact_desc">Last Contact ↓ (recent)</option>
            <option value="contact_asc">Last Contact ↑ (oldest)</option>
            <option value="status">Status (grouped)</option>
          </select>
        </div>
        <button class="btn btn-outline btn-sm" onclick="openNewConvertModal()">+ Single Entry</button>
      </div>
    </div>

    <div class="table-wrap">
      <table class="portal-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Contact Details</th>
            <th>Target Church</th>
            <th>Crusade Campaign</th>
            <th>Service Session</th>
            <th>Last Contact</th>
            <th>Log Agent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="convertsTableBody">
          <tr><td colspan="9" style="text-align:center; opacity:0.6;">Loading converts list...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  // Fetch data
  loadConvertsData();

  // Focus the quick add name field if session is active
  if (sessionState) {
    setTimeout(() => document.getElementById('quickName')?.focus(), 100);
  }
}

async function loadConvertsData() {
  const tableBody = document.getElementById('convertsTableBody');
  if (!tableBody) return;

  const searchQuery = document.getElementById('filterSearch').value.trim();
  const crusadeId = document.getElementById('filterCrusade').value;
  const status = document.getElementById('filterStatus').value;
  const dateFrom = document.getElementById('filterDateFrom').value;
  const dateTo = document.getElementById('filterDateTo').value;
  const lastContactFrom = document.getElementById('filterContactFrom').value;
  const lastContactTo = document.getElementById('filterContactTo').value;
  const hasPhone = document.getElementById('filterHasPhone').value;
  const serviceDate = document.getElementById('filterServiceDate').value;
  const serviceName = document.getElementById('filterServiceName').value.trim();
  const ministerName = document.getElementById('filterMinisterName').value.trim();

  let apiPath = '/api/converts-portal/converts';
  const queryParams = [];
  if (searchQuery) queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
  if (crusadeId) queryParams.push(`crusade_id=${crusadeId}`);
  if (status) queryParams.push(`follow_up_status=${status}`);
  if (dateFrom) queryParams.push(`date_from=${dateFrom}`);
  if (dateTo) queryParams.push(`date_to=${dateTo}`);
  if (lastContactFrom) queryParams.push(`last_contact_from=${lastContactFrom}`);
  if (lastContactTo) queryParams.push(`last_contact_to=${lastContactTo}`);
  if (hasPhone) queryParams.push(`has_phone=${hasPhone}`);
  if (serviceDate) queryParams.push(`service_date=${serviceDate}`);
  if (serviceName) queryParams.push(`service_name=${encodeURIComponent(serviceName)}`);
  if (ministerName) queryParams.push(`ministering_name=${encodeURIComponent(ministerName)}`);

  if (queryParams.length) {
    apiPath += '?' + queryParams.join('&');
  }

  try {
    const res = await fetch(apiPath, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Auth or database read failure');

    convertsData = await res.json();
    sortConverts();
    calculateConvertsStats(convertsData);
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:#ff6b6b;">Failed to load converts. Session expired or D1 server overloaded.</td></tr>`;
  }
}

function calculateConvertsStats(data) {
  const total = data.length;
  const contacted = data.filter(c => c.follow_up_status === 'contacted').length;
  const visit = data.filter(c => c.follow_up_status === 'needs_visit').length;
  const remaining = data.filter(c => c.follow_up_status === 'pending' || c.follow_up_status === 'no_answer').length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-remaining').textContent = remaining;
  document.getElementById('stat-contacted').textContent = contacted;
  document.getElementById('stat-visit').textContent = visit;
}

function renderConvertsList(data, tbody) {
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; opacity:0.6;">No converts match selected search filters.</td></tr>`;
    return;
  }

  const role = sessionStorage.getItem('rgm_converts_role');
  const showDelete = role === 'super_admin';

  tbody.innerHTML = data.map(c => {
    // Phone click behaviors
    let contactHTML = '<em>None</em>';
    if (c.phone) {
      const cleanPhone = c.phone.replace(/\s+/g, '');
      if (cleanPhone.includes('881') || cleanPhone.startsWith('881') || cleanPhone.endsWith('881') || cleanPhone.startsWith('+265881') || cleanPhone.startsWith('265881')) {
        // Formulate WhatsApp link
        const waNum = cleanPhone.startsWith('+') ? cleanPhone.substring(1) : (cleanPhone.startsWith('0') ? '265' + cleanPhone.substring(1) : cleanPhone);
        contactHTML = `<a href="https://wa.me/${waNum}" target="_blank" rel="noopener" title="Open WhatsApp Chat">💬 WhatsApp: ${escapeHTML(c.phone)}</a>`;
      } else {
        // Dialer link
        contactHTML = `<a href="tel:${cleanPhone}" title="Make a phone call">📞 Call: ${escapeHTML(c.phone)}</a>`;
      }
    }

    // Format service session info beautifully
    let serviceSessionHTML = '<em>N/A</em>';
    if (c.service_name) {
      serviceSessionHTML = `<strong>${escapeHTML(c.service_name)}</strong>`;
      if (c.service_date) {
        serviceSessionHTML += `<br/><span style="font-size:0.75rem; opacity:0.7;">${escapeHTML(c.service_date)}</span>`;
      }
      if (c.ministering_name) {
        serviceSessionHTML += `<br/><span style="font-size:0.72rem; opacity:0.6;">Min: ${escapeHTML(c.ministering_name)}</span>`;
      }
    }

    return `
      <tr>
        <td><span class="badge badge-${c.follow_up_status}">${escapeHTML(c.follow_up_status)}</span></td>
        <td><strong>${escapeHTML(c.name)}</strong></td>
        <td>${contactHTML}</td>
        <td>${escapeHTML(c.church || 'No preference')}</td>
        <td>${escapeHTML(c.crusade_title || 'General Outreach')}</td>
        <td>${serviceSessionHTML}</td>
        <td>${c.last_contact_date ? escapeHTML(c.last_contact_date) : '<em>Never</em>'}</td>
        <td>${escapeHTML(c.updated_by_name || 'System')}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-outline btn-sm" onclick="editConvert(${c.id})">Call/Edit</button>
            ${showDelete ? `<button class="btn btn-danger btn-sm" onclick="deleteConvert(${c.id})">Delete</button>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function sortConverts() {
  const sortEl = document.getElementById('sortConverts');
  const sortVal = sortEl ? sortEl.value : 'created_desc';
  const tableBody = document.getElementById('convertsTableBody');
  if (!tableBody || !convertsData.length) {
    if (tableBody) renderConvertsList(convertsData, tableBody);
    return;
  }

  const STATUS_ORDER = { pending: 0, no_answer: 1, needs_visit: 2, contacted: 3 };

  const sorted = [...convertsData].sort((a, b) => {
    switch (sortVal) {
      case 'created_asc':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'created_desc':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'contact_desc':
        // Nulls (never contacted) go to the bottom
        if (!a.last_contact_date && !b.last_contact_date) return 0;
        if (!a.last_contact_date) return 1;
        if (!b.last_contact_date) return -1;
        return new Date(b.last_contact_date) - new Date(a.last_contact_date);
      case 'contact_asc':
        if (!a.last_contact_date && !b.last_contact_date) return 0;
        if (!a.last_contact_date) return 1;
        if (!b.last_contact_date) return -1;
        return new Date(a.last_contact_date) - new Date(b.last_contact_date);
      case 'status':
        return (STATUS_ORDER[a.follow_up_status] ?? 99) - (STATUS_ORDER[b.follow_up_status] ?? 99);
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  renderConvertsList(sorted, tableBody);
}

// ============================================================
// BULK ENTRY SESSION FUNCTIONS
// ============================================================

function openSessionModal() {
  const sel = document.getElementById('sessionCrusadeField');
  if (sel) {
    sel.innerHTML = `<option value="">Select Crusade</option>` +
      crusadesList.map(c => `<option value="${c.id}" data-title="${escapeHTML(c.title)}">${escapeHTML(c.title)} (${escapeHTML(c.date_range || '')})</option>`).join('');
  }
  // Default date to today
  const dateField = document.getElementById('sessionDateField');
  if (dateField && !dateField.value) {
    dateField.value = new Date().toISOString().split('T')[0];
  }
  openModal('sessionModal');
}

function startSession(e) {
  e.preventDefault();
  const crusadeSelect = document.getElementById('sessionCrusadeField');
  const crusadeId = crusadeSelect.value;
  const crusadeTitle = crusadeId
    ? crusadeSelect.options[crusadeSelect.selectedIndex].dataset.title
    : 'General Outreach';
  const date = document.getElementById('sessionDateField').value;
  const serviceName = document.getElementById('sessionServiceField').value.trim();
  const ministerName = document.getElementById('sessionPreacherField').value.trim();

  sessionState = { crusadeId, crusadeTitle, date, serviceName, ministerName, count: 0 };

  closeModal('sessionModal');
  document.getElementById('sessionForm').reset();

  // Re-render converts tab to show session banner
  switchTab('converts');
  showToast('Bulk session started. Enter converts below.');
}

async function quickAddConvert() {
  if (!sessionState) return;

  const nameField = document.getElementById('quickName');
  const phoneField = document.getElementById('quickPhone');
  const churchField = document.getElementById('quickChurch');
  const feedback = document.getElementById('quickFeedback');

  const name = nameField.value.trim();
  if (!name) {
    feedback.style.color = '#e57373';
    feedback.textContent = 'Name is required.';
    nameField.focus();
    return;
  }

  feedback.style.color = 'rgba(247,243,234,0.5)';
  feedback.textContent = 'Saving...';

  const payload = {
    name,
    phone: phoneField.value.trim() || null,
    church: churchField.value.trim() || null,
    crusade_id: sessionState.crusadeId || null,
    service_date: sessionState.date || null,
    service_name: sessionState.serviceName || null,
    ministering_name: sessionState.ministerName || null,
    follow_up_status: 'pending',
    follow_up_notes: `Added during bulk session: ${sessionState.serviceName} (${sessionState.date})`,
    last_contact_date: null
  };

  try {
    const res = await fetch('/api/converts-portal/converts', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Save failed');
    }

    // Increment counter
    sessionState.count++;
    const countEl = document.getElementById('sessionCount');
    if (countEl) countEl.textContent = `${sessionState.count} added`;

    // Show confirmation, clear name/phone/church for next entry
    feedback.style.color = '#81c784';
    feedback.textContent = `Saved: ${name}`;

    nameField.value = '';
    phoneField.value = '';
    churchField.value = '';
    nameField.focus();

    // Silently refresh the table in the background
    loadConvertsData();

  } catch (err) {
    feedback.style.color = '#e57373';
    feedback.textContent = 'Error: ' + err.message;
  }
}

function endSessionPrompt() {
  if (!sessionState) return;

  // Pre-fill the close session modal
  document.getElementById('closeSessionCount').value = sessionState.count;
  document.getElementById('closeSessionSummary').textContent =
    `${sessionState.serviceName} · ${sessionState.crusadeTitle} · ${sessionState.date} · Min: ${sessionState.ministerName}`;

  openModal('closeSessionModal');
}

async function closeSession(e) {
  e.preventDefault();
  if (!sessionState) return;

  const finalCount = parseInt(document.getElementById('closeSessionCount').value, 10);
  if (isNaN(finalCount) || finalCount < 0) {
    alert('Please enter a valid attendance count.');
    return;
  }

  // Create the attendance register entry automatically
  const payload = {
    crusade_id: sessionState.crusadeId || null,
    service_date: sessionState.date,
    service_name: sessionState.serviceName,
    ministering_name: sessionState.ministerName,
    attendance_count: finalCount
  };

  try {
    const res = await fetch('/api/converts-portal/attendance', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Attendance register save failed');
    }

    const savedCount = sessionState.count;
    sessionState = null;
    closeModal('closeSessionModal');
    document.getElementById('closeSessionForm').reset();

    showToast(`Session closed. ${savedCount} converts saved, attendance register created.`);
    switchTab('converts');

  } catch (err) {
    alert('Error closing session: ' + err.message);
  }
}

// 📋 ATTENDANCE REGISTER TAB ROUTINES
function renderAttendanceTab(container) {
  container.innerHTML = `
    <div class="filter-bar" style="grid-template-columns: 2fr 1fr; margin-bottom: 24px;">
      <div class="filter-group">
        <label for="filterAttCrusade">Select Crusade Campaign</label>
        <select id="filterAttCrusade" onchange="loadAttendanceData()">
          <option value="">All Campaign Outreaches</option>
          ${crusadesList.map(c => `<option value="${c.id}">${c.title} (${c.date_range})</option>`).join('')}
        </select>
      </div>
      <div style="display:flex; justify-content: flex-end; align-items: end;">
        <button class="btn btn-primary" onclick="openNewAttendanceModal()">+ Log Attendance Register</button>
      </div>
    </div>

    <div class="action-bar">
      <h2>Service Attendance Register Logs</h2>
    </div>

    <div class="table-wrap">
      <table class="portal-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Crusade Event</th>
            <th>Service Name/Split</th>
            <th>Ministering Preacher</th>
            <th>Attendance Count</th>
            <th>Authorized By</th>
            <th>Logged At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="attendanceTableBody">
          <tr><td colspan="8" style="text-align:center; opacity:0.6;">Loading register database...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  loadAttendanceData();
}

async function loadAttendanceData() {
  const tableBody = document.getElementById('attendanceTableBody');
  if (!tableBody) return;

  const crusadeId = document.getElementById('filterAttCrusade').value;
  let apiPath = '/api/converts-portal/attendance';
  if (crusadeId) apiPath += `?crusade_id=${crusadeId}`;

  try {
    const res = await fetch(apiPath, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Data read failed');
    attendanceData = await res.json();
    renderAttendanceList(attendanceData, tableBody);
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#ff6b6b;">Failed to load attendance list. Session expired or server D1 failure.</td></tr>`;
  }
}

function renderAttendanceList(data, tbody) {
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; opacity:0.6;">No registers found in the database.</td></tr>`;
    return;
  }

  const role = sessionStorage.getItem('rgm_converts_role');
  const showDelete = role === 'super_admin';

  tbody.innerHTML = data.map(r => `
    <tr>
      <td><strong>${escapeHTML(r.service_date)}</strong></td>
      <td>${escapeHTML(r.crusade_title || 'General Outreach')}</td>
      <td>${escapeHTML(r.service_name)}</td>
      <td>${escapeHTML(r.ministering_name)}</td>
      <td><strong>${r.attendance_count.toLocaleString()}</strong></td>
      <td>${escapeHTML(r.authorized_by_name || 'System')}</td>
      <td style="font-size:0.75rem; opacity:0.7;">${escapeHTML(r.created_at)}</td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-outline btn-sm" onclick="editAttendance(${r.id})">Edit</button>
          ${showDelete ? `<button class="btn btn-danger btn-sm" onclick="deleteAttendance(${r.id})">Delete</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

// 📥 EXPORT & BACKUPS TAB
function renderExportTab(container) {
  const role = sessionStorage.getItem('rgm_converts_role');
  if (role !== 'super_admin') {
    container.innerHTML = `
      <div style="background:rgba(244,67,54,0.1); border:1px solid rgba(244,67,54,0.3); padding:20px; border-radius:6px;">
        <h3>Access Restricted</h3>
        <p>Sorry, only accounts with the <strong>Super Admin</strong> role can export CSV databases or trigger backups.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <h2>Database Backup &amp; Recovery</h2>
    <p style="opacity:0.8; margin-bottom:32px; max-width:680px;">Download complete spreadsheet snapshots of the converts follow-up registry and split-service attendance logs for recovery backups, offline printing, or Excel analysis.</p>
    
    <div style="display:flex; flex-direction:column; gap:20px;">
      <div class="export-card">
        <h3>1. New Converts Database Backup</h3>
        <p style="opacity:0.75; font-size:0.9rem; margin-bottom:20px;">Downloads a comprehensive spreadsheet with converts details, denonimational preferences, status, telephone details, and follow-up journal logs.</p>
        <button class="btn btn-primary" onclick="downloadBackup('converts')">📥 Export Converts (.csv)</button>
      </div>

      <div class="export-card">
        <h3>2. Attendance Register Backup</h3>
        <p style="opacity:0.75; font-size:0.9rem; margin-bottom:20px;">Downloads a detailed log listing attendance data for split-services and crusades along with preacher audit signatures.</p>
        <button class="btn btn-primary" onclick="downloadBackup('attendance')">📥 Export Attendance Ledger (.csv)</button>
      </div>
    </div>
  `;
}

async function downloadBackup(type) {
  try {
    const res = await fetch(`/api/converts-portal/export?type=${type}`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('rgm_converts_token')}` }
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to extract database backup.');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'converts' ? `rgm_converts_roster_${new Date().toISOString().split('T')[0]}.csv` : `rgm_attendance_register_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showToast('Spreadsheet downloaded successfully');
  } catch (err) {
    alert('Export Error: ' + err.message);
  }
}

// ⚙️ USER ACCOUNTS TAB
function renderUsersTab(container) {
  container.innerHTML = `
    <div class="action-bar">
      <h2>Portal Administrator Accounts</h2>
      <button class="btn btn-primary" onclick="openNewAdminModal()">+ Create Admin User</button>
    </div>

    <div class="table-wrap">
      <table class="portal-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Assigned Role</th>
            <th>Account Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="usersTableBody">
          <tr><td colspan="5" style="text-align:center; opacity:0.6;">Loading user accounts...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  loadUsersData();
}

async function loadUsersData() {
  const tableBody = document.getElementById('usersTableBody');
  if (!tableBody) return;

  try {
    const res = await fetch('/api/converts-portal/admins', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Authorization failed');
    usersData = await res.json();
    renderUsersList(usersData, tableBody);
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#ff6b6b;">Failed to load user accounts. Only Super Admins can access this list.</td></tr>`;
  }
}

function renderUsersList(data, tbody) {
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; opacity:0.6;">No administrators registered.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(u => `
    <tr>
      <td><code>${escapeHTML(u.username)}</code></td>
      <td><strong>${escapeHTML(u.full_name)}</strong></td>
      <td><span class="admin-badge">${escapeHTML(u.role)}</span></td>
      <td style="font-size:0.8rem; opacity:0.75;">${escapeHTML(u.created_at)}</td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-outline btn-sm" onclick="editAdminUser(${u.id})">Edit/Reset</button>
          <button class="btn btn-danger btn-sm" onclick="deleteAdminUser(${u.id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ----------------------------------------------------
// FORM INITIALIZERS & MODAL OPENERS
// ----------------------------------------------------

function openNewConvertModal() {
  document.getElementById('convertModalTitle').textContent = 'New Convert Record';
  
  // Populate crusade dropdown
  const crusadeSelect = document.getElementById('convertCrusadeField');
  crusadeSelect.innerHTML = `<option value="">Select Crusade Location</option>` +
    crusadesList.map(c => `<option value="${c.id}">${escapeHTML(c.title)}</option>`).join('');

  // Default dates
  document.getElementById('convertContactDateField').value = '';

  openModal('convertModal');
}

async function editConvert(id) {
  const convert = convertsData.find(c => c.id === id);
  if (!convert) return;

  editingConvertId = id;
  document.getElementById('convertModalTitle').textContent = 'Edit Convert Card / Log Call';
  
  // Populate crusade dropdown
  const crusadeSelect = document.getElementById('convertCrusadeField');
  crusadeSelect.innerHTML = `<option value="">Select Crusade Location</option>` +
    crusadesList.map(c => `<option value="${c.id}">${escapeHTML(c.title)}</option>`).join('');

  // Set field values
  document.getElementById('convertIdField').value = convert.id;
  document.getElementById('convertNameField').value = convert.name;
  document.getElementById('convertPhoneField').value = convert.phone || '';
  document.getElementById('convertChurchField').value = convert.church || '';
  document.getElementById('convertCrusadeField').value = convert.crusade_id || '';
  document.getElementById('convertStatusField').value = convert.follow_up_status;
  document.getElementById('convertNotesField').value = convert.follow_up_notes || '';
  
  // Set contact date or default to today's date if they are logging a call
  if (convert.last_contact_date) {
    document.getElementById('convertContactDateField').value = convert.last_contact_date;
  } else {
    // If never contacted, helper autofills today's date in local YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('convertContactDateField').value = today;
  }

  openModal('convertModal');
}

async function deleteConvert(id) {
  if (!confirm('Are you sure you want to permanently delete this convert record? This action is irreversible.')) return;

  try {
    const res = await fetch(`/api/converts-portal/converts?id=${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Delete failed');
    }

    showToast('Record deleted successfully');
    loadConvertsData();
  } catch (err) {
    alert('Delete Error: ' + err.message);
  }
}

function openNewAttendanceModal() {
  editingAttendanceId = null;
  document.getElementById('attendanceModalTitle').textContent = 'Log Attendance Register';

  const crusadeSelect = document.getElementById('attCrusadeField');
  crusadeSelect.innerHTML = `<option value="">Select Crusade</option>` +
    crusadesList.map(c => `<option value="${c.id}">${escapeHTML(c.title)}</option>`).join('');

  // Autofill today's date
  document.getElementById('attDateField').value = new Date().toISOString().split('T')[0];

  openModal('attendanceModal');
}

function editAttendance(id) {
  const record = attendanceData.find(r => r.id === id);
  if (!record) return;

  editingAttendanceId = id;
  document.getElementById('attendanceModalTitle').textContent = 'Edit Attendance Register';

  // Populate crusade dropdown and pre-select the current crusade
  const crusadeSelect = document.getElementById('attCrusadeField');
  crusadeSelect.innerHTML = `<option value="">Select Crusade</option>` +
    crusadesList.map(c => `<option value="${c.id}">${escapeHTML(c.title)}</option>`).join('');
  crusadeSelect.value = record.crusade_id || '';

  // Populate all fields
  document.getElementById('attDateField').value = record.service_date;
  document.getElementById('attNameField').value = record.service_name;
  document.getElementById('attPreacherField').value = record.ministering_name;
  document.getElementById('attCountField').value = record.attendance_count;

  openModal('attendanceModal');
}

async function deleteAttendance(id) {
  if (!confirm('Are you sure you want to permanently delete this service register?')) return;

  try {
    const res = await fetch(`/api/converts-portal/attendance?id=${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Delete failed');
    }

    showToast('Register log deleted');
    loadAttendanceData();
  } catch (err) {
    alert('Delete Error: ' + err.message);
  }
}

function openNewAdminModal() {
  document.getElementById('adminUserTitle').textContent = 'Create Administrator Account';
  document.getElementById('adminUserIdField').value = '';
  document.getElementById('adminUserField').disabled = false;
  document.getElementById('adminPasswordField').required = true;
  openModal('adminUserModal');
}

function editAdminUser(id) {
  const user = usersData.find(u => u.id === id);
  if (!user) return;

  editingUserId = id;
  document.getElementById('adminUserTitle').textContent = 'Edit Admin Details / Reset Password';
  document.getElementById('adminUserIdField').value = user.id;
  
  const userField = document.getElementById('adminUserField');
  userField.value = user.username;
  userField.disabled = true; // Username is immutable
  
  document.getElementById('adminNameField').value = user.full_name;
  document.getElementById('adminRoleField').value = user.role;
  
  // Password is not required on edit unless they want to override it
  const pwField = document.getElementById('adminPasswordField');
  pwField.value = '';
  pwField.required = false;
  pwField.placeholder = '(Leave blank to keep existing password)';

  openModal('adminUserModal');
}

async function deleteAdminUser(id) {
  if (!confirm('Are you sure you want to permanently revoke this administrator account? All active sessions will be terminated.')) return;

  try {
    const res = await fetch(`/api/converts-portal/admins?id=${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Delete failed');
    }

    showToast('User account revoked successfully');
    loadUsersData();
  } catch (err) {
    alert('Delete Error: ' + err.message);
  }
}

function openPasswordModal() {
  openModal('passwordChangeModal');
}

// ----------------------------------------------------
// FORM ACTIONS SUBMISSIONS
// ----------------------------------------------------

async function submitConvertForm(e) {
  e.preventDefault();
  
  const id = document.getElementById('convertIdField').value;
  const payload = {
    name: document.getElementById('convertNameField').value,
    phone: document.getElementById('convertPhoneField').value,
    church: document.getElementById('convertChurchField').value,
    crusade_id: document.getElementById('convertCrusadeField').value,
    follow_up_status: document.getElementById('convertStatusField').value,
    follow_up_notes: document.getElementById('convertNotesField').value,
    last_contact_date: document.getElementById('convertContactDateField').value
  };

  const isEdit = !!editingConvertId;
  const url = '/api/converts-portal/converts';
  const method = isEdit ? 'PUT' : 'POST';

  if (isEdit) {
    payload.id = editingConvertId;
  }

  try {
    const res = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Form submit error');
    }

    closeModal('convertModal');
    showToast(isEdit ? 'Convert card updated successfully' : 'Convert card created successfully');
    loadConvertsData();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function submitAttendanceForm(e) {
  e.preventDefault();

  const isEdit = !!editingAttendanceId;

  const payload = {
    crusade_id: document.getElementById('attCrusadeField').value,
    service_date: document.getElementById('attDateField').value,
    service_name: document.getElementById('attNameField').value,
    ministering_name: document.getElementById('attPreacherField').value,
    attendance_count: document.getElementById('attCountField').value
  };

  if (isEdit) {
    payload.id = editingAttendanceId;
  }

  try {
    const res = await fetch('/api/converts-portal/attendance', {
      method: isEdit ? 'PUT' : 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Submit failed');
    }

    closeModal('attendanceModal');
    showToast(isEdit ? 'Attendance register updated' : 'Attendance register authorized');
    loadAttendanceData();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function submitAdminUserForm(e) {
  e.preventDefault();

  const isEdit = !!editingUserId;
  const url = '/api/converts-portal/admins';
  const method = isEdit ? 'PUT' : 'POST';

  const payload = {
    full_name: document.getElementById('adminNameField').value,
    role: document.getElementById('adminRoleField').value
  };

  const pw = document.getElementById('adminPasswordField').value;
  if (pw) {
    payload.new_password = pw;
  }

  if (isEdit) {
    payload.id = editingUserId;
  } else {
    payload.username = document.getElementById('adminUserField').value;
    payload.password = pw;
  }

  try {
    const res = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to save account');
    }

    closeModal('adminUserModal');
    showToast(isEdit ? 'User details updated' : 'User account created');
    loadUsersData();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function submitPasswordForm(e) {
  e.preventDefault();

  const current_password = document.getElementById('passwordCurrentField').value;
  const new_password = document.getElementById('passwordNewField').value;
  
  // Retrieve target ID of current logged-in user from token/greeting context
  // JWT stores user id, but we can also parse or read session details
  // An easy trick is parsing the token or simply updating ourselves:
  // Our backend /api/portal/admins PUT validates self edit matching context.data.admin.id
  // So we just need to decode token, or we can look up username or send token session id
  // Let's decode admin id from verify storage (our check on boot saves role and greeting)
  // Let's read from verify, wait, we can fetch active admin id
  
  try {
    // Get active user data by calling verify
    const verifyRes = await fetch('/api/converts-portal/verify', {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('rgm_converts_token')}` }
    });
    if (!verifyRes.ok) throw new Error('Verify failed');
    const verifyData = await verifyRes.json();
    const myId = verifyData.admin.id;

    const res = await fetch('/api/converts-portal/admins', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        id: myId,
        current_password,
        new_password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Credentials mismatch');
    }

    closeModal('passwordChangeModal');
    alert('Password updated successfully. You will be redirected to log in again.');
    handleLogout();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// Simple HTML escaping helper
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================
// PRAYER REQUESTS TAB ROUTINES
// ============================================================
let prayersData = [];

function renderPrayersTab(container) {
  container.innerHTML = `
    <!-- Filter Toolbar -->
    <div class="filter-bar" style="grid-template-columns: 2fr 1fr;">
      <div class="filter-group">
        <label for="filterPrayerSearch">Search by Name/Phone/Text</label>
        <input type="text" id="filterPrayerSearch" placeholder="Type query and press enter..." onkeydown="if(event.key==='Enter') loadPrayersData()">
      </div>
      <div class="filter-group">
        <label for="filterPrayerStatus">Follow-Up Status</label>
        <select id="filterPrayerStatus" onchange="loadPrayersData()">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="prayed">Prayed For</option>
          <option value="followed_up">Followed Up / Counseled</option>
        </select>
      </div>
    </div>

    <!-- Actions & List Row -->
    <div class="action-bar">
      <h2>Spiritual &amp; Pastoral Support Tickets</h2>
    </div>

    <div class="table-wrap">
      <table class="portal-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Submitted By</th>
            <th>Contact Details</th>
            <th>Prayer Request Details</th>
            <th>Submitted Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="prayersTableBody">
          <tr><td colspan="6" style="text-align:center; opacity:0.6;">Loading prayer requests...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  loadPrayersData();
}

async function loadPrayersData() {
  const tableBody = document.getElementById('prayersTableBody');
  if (!tableBody) return;

  const searchQuery = document.getElementById('filterPrayerSearch').value.trim();
  const status = document.getElementById('filterPrayerStatus').value;

  let apiPath = '/api/converts-portal/prayer-requests';
  const queryParams = [];
  if (searchQuery) queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
  if (status) queryParams.push(`status=${status}`);
  
  if (queryParams.length) {
    apiPath += '?' + queryParams.join('&');
  }

  try {
    const res = await fetch(apiPath, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Data fetch failed');
    prayersData = await res.json();
    renderPrayersList(prayersData, tableBody);
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#ff6b6b;">Failed to load prayer requests. Session expired or database error.</td></tr>`;
  }
}

function renderPrayersList(data, tbody) {
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; opacity:0.6;">No prayer requests match selected filters.</td></tr>`;
    return;
  }

  const role = sessionStorage.getItem('rgm_converts_role');
  const showDelete = role === 'super_admin';

  tbody.innerHTML = data.map(p => {
    // Contact string formatting
    let contactHTML = '<em>None</em>';
    const cleanPhone = p.phone ? p.phone.replace(/\s+/g, '') : '';
    
    if (p.phone && p.email) {
      contactHTML = `
        <div><a href="tel:${cleanPhone}">📞 ${escapeHTML(p.phone)}</a></div>
        <div style="font-size:0.8rem; margin-top:4px;"><a href="mailto:${p.email}">✉️ ${escapeHTML(p.email)}</a></div>
      `;
    } else if (p.phone) {
      contactHTML = `<a href="tel:${cleanPhone}">📞 ${escapeHTML(p.phone)}</a>`;
    } else if (p.email) {
      contactHTML = `<a href="mailto:${p.email}">✉️ ${escapeHTML(p.email)}</a>`;
    }

    // Status badge class
    let badgeClass = 'badge-pending';
    if (p.status === 'prayed') badgeClass = 'badge-contacted'; // green
    if (p.status === 'followed_up') badgeClass = 'badge-needs-visit'; // blue

    return `
      <tr>
        <td><span class="badge ${badgeClass}">${escapeHTML(p.status)}</span></td>
        <td><strong>${escapeHTML(p.name)}</strong></td>
        <td>${contactHTML}</td>
        <td>
          <div style="max-width:320px; white-space: nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHTML(p.request_text)}">
            ${escapeHTML(p.request_text)}
          </div>
        </td>
        <td style="font-size:0.8rem; opacity:0.75;">${escapeHTML(p.created_at)}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-outline btn-sm" onclick="editPrayerRequest(${p.id})">Counsel/Log</button>
            ${showDelete ? `<button class="btn btn-danger btn-sm" onclick="deletePrayerRequest(${p.id})">Delete</button>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function editPrayerRequest(id) {
  const prayer = prayersData.find(p => p.id === id);
  if (!prayer) return;

  document.getElementById('prayerIdField').value = prayer.id;
  document.getElementById('prayerNameField').value = prayer.name;
  
  // Format contacts display
  let contactInfo = '';
  if (prayer.phone && prayer.email) contactInfo = `${prayer.phone}  |  ${prayer.email}`;
  else if (prayer.phone) contactInfo = prayer.phone;
  else if (prayer.email) contactInfo = prayer.email;
  else contactInfo = 'None provided';
  
  document.getElementById('prayerContactField').value = contactInfo;
  document.getElementById('prayerTextField').value = prayer.request_text;
  document.getElementById('prayerStatusField').value = prayer.status;
  document.getElementById('prayerNotesField').value = prayer.notes || '';

  openModal('prayerModal');
}

async function submitPrayerLogForm(e) {
  e.preventDefault();
  
  const id = document.getElementById('prayerIdField').value;
  const status = document.getElementById('prayerStatusField').value;
  const notes = document.getElementById('prayerNotesField').value;

  try {
    const res = await fetch('/api/converts-portal/prayer-requests', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id, status, notes })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Submission error');
    }

    closeModal('prayerModal');
    showToast('Pastoral notes saved successfully');
    loadPrayersData();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function deletePrayerRequest(id) {
  if (!confirm('Are you sure you want to permanently delete this prayer request record?')) return;

  try {
    const res = await fetch(`/api/converts-portal/prayer-requests?id=${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Delete failed');
    }

    showToast('Record deleted successfully');
    loadPrayersData();
  } catch (err) {
    alert('Delete Error: ' + err.message);
  }
}

// ============================================================
// PARTNERS TAB ROUTINES
// ============================================================
let partnersSubTab = 'registrations';
let partnersData = [];

function renderPartnersTab(container) {
  container.innerHTML = `
    <div class="action-bar">
      <h2>Partner Management</h2>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-outline btn-sm" id="partnerSubTabReg" onclick="switchPartnersSubTab('registrations')" style="border:1px solid var(--dawn-gold); color:var(--dawn-gold);">Registrations</button>
        <button class="btn btn-outline btn-sm" id="partnerSubTabTst" onclick="switchPartnersSubTab('testimonies')" style="border:1px solid var(--line); color:rgba(247,243,234,0.65);">Testimonies</button>
      </div>
    </div>

    <div class="filter-bar" style="grid-template-columns:2fr 1fr;" id="partnerFilterBar">
      <div class="filter-group">
        <label for="filterPartnerSearch">Search by Name</label>
        <input type="text" id="filterPartnerSearch" placeholder="Type to filter..." oninput="filterPartnersTable()">
      </div>
      <div class="filter-group" id="partnerStatusFilter">
        <label for="filterPartnerStatus">Status</label>
        <select id="filterPartnerStatus" onchange="loadPartnersData()">
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="active">Active</option>
        </select>
      </div>
    </div>

    <div class="table-wrap">
      <table class="portal-table" id="partnersTable">
        <thead id="partnersTableHead"></thead>
        <tbody id="partnersTableBody"><tr><td colspan="7" style="text-align:center; padding:32px; opacity:0.5;">Loading...</td></tr></tbody>
      </table>
    </div>
  `;

  partnersSubTab = 'registrations';
  loadPartnersData();
}

function switchPartnersSubTab(subTab) {
  partnersSubTab = subTab;
  const regBtn = document.getElementById('partnerSubTabReg');
  const tstBtn = document.getElementById('partnerSubTabTst');
  const statusFilter = document.getElementById('partnerStatusFilter');

  if (subTab === 'registrations') {
    regBtn.style.color = 'var(--dawn-gold)';
    regBtn.style.borderColor = 'var(--dawn-gold)';
    tstBtn.style.color = 'rgba(247,243,234,0.65)';
    tstBtn.style.borderColor = 'var(--line)';
    if (statusFilter) statusFilter.style.display = 'flex';
  } else {
    tstBtn.style.color = 'var(--dawn-gold)';
    tstBtn.style.borderColor = 'var(--dawn-gold)';
    regBtn.style.color = 'rgba(247,243,234,0.65)';
    regBtn.style.borderColor = 'var(--line)';
    if (statusFilter) statusFilter.style.display = 'none';
  }

  loadPartnersData();
}

async function loadPartnersData() {
  const tbody = document.getElementById('partnersTableBody');
  const thead = document.getElementById('partnersTableHead');
  if (!tbody) return;

  const statusEl = document.getElementById('filterPartnerStatus');
  const status = statusEl ? statusEl.value : '';

  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:32px; opacity:0.5;">Loading...</td></tr>`;

  try {
    let url = `/api/converts-portal/partners?type=${partnersSubTab}`;
    if (partnersSubTab === 'registrations' && status) {
      url += `&status=${encodeURIComponent(status)}`;
    }

    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch');
    partnersData = await res.json();

    if (partnersSubTab === 'registrations') {
      thead.innerHTML = `<tr>
        <th>Status</th><th>Name</th><th>Type</th><th>Contact</th><th>Message</th><th>Date</th><th>Actions</th>
      </tr>`;
      renderRegistrationsList(partnersData, tbody);
    } else {
      thead.innerHTML = `<tr>
        <th>Approved</th><th>Name</th><th>Role</th><th>Story Snippet</th><th>Date</th><th>Actions</th>
      </tr>`;
      renderTestimoniesList(partnersData, tbody);
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:32px; color:#e57373;">Error loading data: ${escapeHTML(err.message)}</td></tr>`;
  }
}

function filterPartnersTable() {
  const query = (document.getElementById('filterPartnerSearch')?.value || '').toLowerCase();
  const rows = document.querySelectorAll('#partnersTableBody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
}

function renderRegistrationsList(data, tbody) {
  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:32px; opacity:0.5;">No partner registrations found.</td></tr>`;
    return;
  }

  const typeLabels = { prayer: '🙏 Prayer', volunteer: '🤝 Volunteer', church: '⛪ Church' };
  const statusColors = {
    new: 'badge-pending',
    contacted: 'badge-contacted',
    active: 'badge-needs-visit'
  };

  tbody.innerHTML = data.map(r => {
    const contact = [r.email, r.phone].filter(Boolean).join(' / ') || '—';
    const snippet = r.message ? escapeHTML(r.message.substring(0, 60)) + (r.message.length > 60 ? '…' : '') : '<em style="opacity:0.4;">—</em>';
    const date = r.created_at ? new Date(r.created_at).toLocaleDateString() : '—';
    const typeLabel = typeLabels[r.partnership_type] || r.partnership_type;
    return `<tr>
      <td><span class="badge ${statusColors[r.status] || 'badge-pending'}">${escapeHTML(r.status)}</span></td>
      <td>${escapeHTML(r.name)}</td>
      <td>${typeLabel}</td>
      <td style="font-size:0.82rem;">${escapeHTML(contact)}</td>
      <td style="font-size:0.82rem; max-width:200px;">${snippet}</td>
      <td style="font-size:0.82rem;">${date}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="openPartnerRegistrationModal(${r.id}, '${escapeHTML(r.name)}', '${escapeHTML(typeLabel)}', '${r.status}')">Update Status</button>
        <button class="btn btn-danger btn-sm" style="margin-left:6px;" onclick="deletePartnerRecord(${r.id}, 'registration')">Delete</button>
      </td>
    </tr>`;
  }).join('');
}

function renderTestimoniesList(data, tbody) {
  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:32px; opacity:0.5;">No partner testimonies found.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(t => {
    const approvedBadge = t.approved
      ? `<span class="badge badge-contacted">Approved</span>`
      : `<span class="badge badge-no-answer">Pending</span>`;
    const snippet = t.testimony ? escapeHTML(t.testimony.substring(0, 70)) + (t.testimony.length > 70 ? '…' : '') : '';
    const date = t.created_at ? new Date(t.created_at).toLocaleDateString() : '—';
    const approveLabel = t.approved ? 'Reject' : 'Approve';
    const approveVal = t.approved ? 0 : 1;
    return `<tr>
      <td>${approvedBadge}</td>
      <td>${escapeHTML(t.name)}</td>
      <td style="font-size:0.82rem;">${escapeHTML(t.role || '—')}</td>
      <td style="font-size:0.82rem; max-width:220px;">${snippet}</td>
      <td style="font-size:0.82rem;">${date}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="approveTestimony(${t.id}, ${approveVal})">${approveLabel}</button>
        <button class="btn btn-danger btn-sm" style="margin-left:6px;" onclick="deletePartnerRecord(${t.id}, 'testimony')">Delete</button>
      </td>
    </tr>`;
  }).join('');
}

function openPartnerRegistrationModal(id, name, type, status) {
  document.getElementById('partnerRecordId').value = id;
  document.getElementById('partnerRecordType').value = 'registration';
  document.getElementById('partnerNameField').value = name;
  document.getElementById('partnerTypeField').value = type;
  document.getElementById('partnerStatusSelect').value = status;
  document.getElementById('partnersModalTitle').textContent = 'Update Partner Status';
  openModal('partnersModal');
}

async function submitPartnerStatusForm(e) {
  e.preventDefault();
  const id = document.getElementById('partnerRecordId').value;
  const type = document.getElementById('partnerRecordType').value;
  const status = document.getElementById('partnerStatusSelect').value;

  try {
    const res = await fetch('/api/converts-portal/partners', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ type, id: parseInt(id), status })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Update failed');

    closeModal('partnersModal');
    showToast('Partner status updated successfully');
    loadPartnersData();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function approveTestimony(id, approved) {
  const label = approved ? 'approve' : 'reject';
  if (!confirm(`Are you sure you want to ${label} this testimony?`)) return;

  try {
    const res = await fetch('/api/converts-portal/partners', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ type: 'testimony', id, approved })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Update failed');

    showToast(`Testimony ${approved ? 'approved' : 'rejected'} successfully`);
    loadPartnersData();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function deletePartnerRecord(id, type) {
  const label = type === 'registration' ? 'partner registration' : 'testimony';
  if (!confirm(`Are you sure you want to permanently delete this ${label}? This cannot be undone.`)) return;

  try {
    const res = await fetch(`/api/converts-portal/partners?id=${id}&type=${type}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Delete failed');
    }

    showToast('Record deleted successfully');
    loadPartnersData();
  } catch (err) {
    alert('Delete Error: ' + err.message);
  }
}

// =============================================
// SUBSCRIBERS TAB
// =============================================
let subscribersData = [];

function renderSubscribersTab(container) {
  container.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
      <div>
        <h3 style="margin:0; font-size:1.25rem;">Newsletter Subscribers</h3>
        <p style="margin:4px 0 0; opacity:0.6; font-size:0.85rem;">Manage email subscribers from the site footer signup form.</p>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-outline btn-sm" onclick="exportSubscribersCSV()">&#8595; Export CSV</button>
        <button class="btn btn-primary btn-sm" onclick="openNewsletterModal()">✉️ Compose Broadcast</button>
      </div>
    </div>
    <div style="display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap;">
      <button class="tab-btn active" onclick="filterSubscribers('', this)">All</button>
      <button class="tab-btn" onclick="filterSubscribers('subscribed', this)">Subscribed</button>
      <button class="tab-btn" onclick="filterSubscribers('unsubscribed', this)">Unsubscribed</button>
    </div>
    <div style="margin-bottom:12px;">
      <input type="text" id="subscriberSearch" placeholder="Search by email..." oninput="filterSubscriberSearch()" style="padding:9px 14px; border:1px solid var(--line); border-radius:4px; background:rgba(255,255,255,0.04); color:inherit; width:100%; max-width:340px; font-size:0.9rem;">
    </div>
    <div class="table-wrap">
      <table class="portal-table" id="subscribersTable">
        <thead><tr><th>#</th><th>Email</th><th>Status</th><th>Subscribed On</th><th>Actions</th></tr></thead>
        <tbody id="subscribersTableBody"><tr><td colspan="5" style="text-align:center; padding:32px; opacity:0.5;">Loading...</td></tr></tbody>
      </table>
    </div>
    <p id="subscriberCount" style="margin-top:12px; font-size:0.82rem; opacity:0.6;"></p>
  `;
  loadSubscribersData();
}

async function loadSubscribersData(status = '') {
  const tbody = document.getElementById('subscribersTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:32px; opacity:0.5;">Loading...</td></tr>';

  try {
    const url = status
      ? `/api/converts-portal/subscribers?status=${status}`
      : '/api/converts-portal/subscribers';
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch subscribers');
    subscribersData = await res.json();
    renderSubscriberRows(subscribersData, tbody);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:#e57373; text-align:center; padding:24px;">Error: ${escapeHTML(err.message)}</td></tr>`;
  }
}

let currentSubscriberStatus = '';

function filterSubscribers(status, btn) {
  currentSubscriberStatus = status;
  document.querySelectorAll('#tab-content-subscribers .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  loadSubscribersData(status);
}

function filterSubscriberSearch() {
  const q = document.getElementById('subscriberSearch').value.toLowerCase();
  const tbody = document.getElementById('subscribersTableBody');
  if (!tbody) return;
  const filtered = subscribersData.filter(s => s.email.toLowerCase().includes(q));
  renderSubscriberRows(filtered, tbody);
}

function renderSubscriberRows(data, tbody) {
  const countEl = document.getElementById('subscriberCount');
  if (countEl) countEl.textContent = `Showing ${data.length} subscriber${data.length !== 1 ? 's' : ''}`;

  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:32px; opacity:0.5;">No subscribers found.</td></tr>';
    return;
  }

  tbody.innerHTML = data.map((s, i) => {
    const statusBadge = s.status === 'subscribed'
      ? '<span style="color:#81c784; font-weight:600;">Subscribed</span>'
      : '<span style="color:#e57373; font-weight:600;">Unsubscribed</span>';
    const toggleLabel = s.status === 'subscribed' ? 'Unsubscribe' : 'Re-subscribe';
    const toggleStatus = s.status === 'subscribed' ? 'unsubscribed' : 'subscribed';
    const date = s.created_at ? new Date(s.created_at).toLocaleDateString() : 'N/A';
    return `<tr>
      <td>${i + 1}</td>
      <td>${escapeHTML(s.email)}</td>
      <td>${statusBadge}</td>
      <td>${date}</td>
      <td style="display:flex; gap:8px; flex-wrap:wrap;">
        <button class="btn btn-outline btn-sm" onclick="toggleSubscriberStatus(${s.id}, '${toggleStatus}')">${toggleLabel}</button>
        <button class="btn btn-sm" style="background:rgba(244,67,54,0.12); color:#e57373; border:1px solid rgba(244,67,54,0.2);" onclick="deleteSubscriber(${s.id})">Delete</button>
      </td>
    </tr>`;
  }).join('');
}

async function toggleSubscriberStatus(id, status) {
  try {
    const res = await fetch('/api/converts-portal/subscribers', {
      method: 'PUT',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    if (!res.ok) throw new Error('Update failed');
    showToast(`Subscriber ${status === 'subscribed' ? 're-subscribed' : 'unsubscribed'} successfully`);
    loadSubscribersData(currentSubscriberStatus);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function deleteSubscriber(id) {
  if (!confirm('Permanently delete this subscriber?')) return;
  try {
    const res = await fetch(`/api/converts-portal/subscribers?id=${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Delete failed');
    showToast('Subscriber deleted');
    loadSubscribersData(currentSubscriberStatus);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

function exportSubscribersCSV() {
  if (!subscribersData.length) { showToast('No subscribers to export'); return; }
  const rows = [['Email', 'Status', 'Subscribed On']];
  subscribersData.forEach(s => {
    rows.push([
      s.email,
      s.status,
      s.created_at ? new Date(s.created_at).toLocaleDateString() : ''
    ]);
  });
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rgm-newsletter-subscribers-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// =============================================
// DISCUSSIONS TAB
// =============================================
let discussionsData = [];
let editingTopicId = null;

function renderDiscussionsTab(container) {
  container.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
      <div>
        <h3 style="margin:0; font-size:1.25rem;">Community Discussions</h3>
        <p style="margin:4px 0 0; opacity:0.6; font-size:0.85rem;">Post and manage discussion topics for the community.</p>
      </div>
      <button class="btn btn-primary" onclick="openTopicForm()">+ New Topic</button>
    </div>

    <div id="topicFormWrap" style="display:none; background:rgba(255,255,255,0.03); border:1px solid var(--line); border-radius:8px; padding:24px; margin-bottom:24px;">
      <h4 style="margin:0 0 16px;" id="topicFormTitle">New Discussion Topic</h4>
      <div style="display:flex; flex-direction:column; gap:14px;">
        <div class="form-group">
          <label>Title *</label>
          <input type="text" id="dTopicTitle" placeholder="Discussion title" style="background:rgba(255,255,255,0.04); border:1px solid var(--line); color:inherit; padding:10px; border-radius:4px; width:100%; box-sizing:border-box;">
        </div>
        <div class="form-group">
          <label>Body *</label>
          <textarea id="dTopicBody" rows="5" placeholder="Write your discussion prompt or opening thoughts..." style="background:rgba(255,255,255,0.04); border:1px solid var(--line); color:inherit; padding:10px; border-radius:4px; width:100%; box-sizing:border-box; resize:vertical;"></textarea>
        </div>
        <div style="display:flex; gap:16px; flex-wrap:wrap;">
          <div class="form-group" style="flex:1; min-width:180px;">
            <label>Category</label>
            <select id="dTopicCategory" style="background:rgba(20,20,30,0.8); border:1px solid var(--line); color:inherit; padding:10px; border-radius:4px; width:100%;">
              <option value="general">General</option>
              <option value="bible-study">Bible Study</option>
              <option value="prayer">Prayer Focus</option>
              <option value="testimony">Testimony</option>
            </select>
          </div>
          <div class="form-group" style="display:flex; align-items:flex-end; gap:8px;">
            <input type="checkbox" id="dTopicPinned" style="width:18px; height:18px;">
            <label for="dTopicPinned" style="margin:0; cursor:pointer;">Pin this topic</label>
          </div>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-primary" onclick="saveTopic()">Save Topic</button>
          <button class="btn btn-outline" onclick="closeTopicForm()">Cancel</button>
        </div>
        <p id="topicFormMsg" style="display:none; font-size:0.85rem; margin:0;"></p>
      </div>
    </div>

    <div class="table-wrap">
      <table class="portal-table" id="discussionsTable">
        <thead><tr><th>Pinned</th><th>Title</th><th>Category</th><th>Replies</th><th>Posted By</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody id="discussionsTableBody"><tr><td colspan="7" style="text-align:center; padding:32px; opacity:0.5;">Loading...</td></tr></tbody>
      </table>
    </div>
  `;
  loadDiscussionsData();
}

function openTopicForm(topic) {
  editingTopicId = topic ? topic.id : null;
  document.getElementById('topicFormTitle').textContent = topic ? 'Edit Topic' : 'New Discussion Topic';
  document.getElementById('dTopicTitle').value = topic ? topic.title : '';
  document.getElementById('dTopicBody').value = topic ? topic.body : '';
  document.getElementById('dTopicCategory').value = topic ? topic.category : 'general';
  document.getElementById('dTopicPinned').checked = topic ? !!topic.pinned : false;
  document.getElementById('topicFormMsg').style.display = 'none';
  document.getElementById('topicFormWrap').style.display = 'block';
  document.getElementById('topicFormWrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeTopicForm() {
  document.getElementById('topicFormWrap').style.display = 'none';
  editingTopicId = null;
}

async function saveTopic() {
  const title = document.getElementById('dTopicTitle').value.trim();
  const body = document.getElementById('dTopicBody').value.trim();
  const category = document.getElementById('dTopicCategory').value;
  const pinned = document.getElementById('dTopicPinned').checked;
  const msg = document.getElementById('topicFormMsg');

  if (!title || !body) {
    msg.textContent = 'Title and body are required.';
    msg.style.color = '#e57373';
    msg.style.display = 'block';
    return;
  }

  try {
    const method = editingTopicId ? 'PUT' : 'POST';
    const payload = editingTopicId
      ? { id: editingTopicId, title, body, category, pinned }
      : { title, body, category, pinned };

    const res = await fetch('/api/converts-portal/discussions', {
      method,
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Save failed');
    showToast(editingTopicId ? 'Topic updated' : 'Topic created successfully');
    closeTopicForm();
    loadDiscussionsData();
  } catch (err) {
    msg.textContent = 'Error: ' + err.message;
    msg.style.color = '#e57373';
    msg.style.display = 'block';
  }
}

async function loadDiscussionsData() {
  const tbody = document.getElementById('discussionsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:32px; opacity:0.5;">Loading...</td></tr>';
  try {
    const res = await fetch('/api/converts-portal/discussions', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed');
    discussionsData = await res.json();
    renderDiscussionRows(discussionsData, tbody);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="color:#e57373; padding:24px; text-align:center;">Error: ${escapeHTML(err.message)}</td></tr>`;
  }
}

function renderDiscussionRows(data, tbody) {
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:32px; opacity:0.5;">No discussions yet. Create your first topic above.</td></tr>';
    return;
  }
  const catLabels = { 'bible-study': 'Bible Study', 'prayer': 'Prayer Focus', 'testimony': 'Testimony', 'general': 'General' };
  tbody.innerHTML = data.map(d => {
    const pinnedBadge = d.pinned ? '<span style="color:var(--dawn-gold); font-weight:700;">Yes</span>' : 'No';
    const date = d.created_at ? new Date(d.created_at).toLocaleDateString() : 'N/A';
    return `<tr>
      <td>${pinnedBadge}</td>
      <td><strong>${escapeHTML(d.title)}</strong></td>
      <td>${catLabels[d.category] || d.category}</td>
      <td>${d.reply_count || 0}</td>
      <td>${escapeHTML(d.created_by)}</td>
      <td>${date}</td>
      <td style="display:flex; gap:8px; flex-wrap:wrap;">
        <button class="btn btn-outline btn-sm" onclick="openTopicForm(discussionsData.find(x => x.id === ${d.id}))">Edit</button>
        <button class="btn btn-sm" style="background:rgba(244,67,54,0.12); color:#e57373; border:1px solid rgba(244,67,54,0.2);" onclick="deleteTopic(${d.id})">Delete</button>
      </td>
    </tr>`;
  }).join('');
}

async function deleteTopic(id) {
  if (!confirm('Delete this discussion topic and all its replies? This cannot be undone.')) return;
  try {
    const res = await fetch(`/api/converts-portal/discussions?id=${id}&type=topic`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Delete failed');
    showToast('Topic deleted');
    loadDiscussionsData();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// Newsletter Broadcast Modal and submit
function openNewsletterModal() {
  document.getElementById('newsletterForm').reset();
  const statusDiv = document.getElementById('newsletterSendStatus');
  statusDiv.style.display = 'none';
  statusDiv.innerHTML = '';
  
  // Set some sensible default "From" inputs if desired
  document.getElementById('newsFromName').value = 'Revealed Gospel Ministries';
  
  openModal('newsletterModal');
}

async function submitBroadcastNewsletter(e) {
  e.preventDefault();
  
  const fromName = document.getElementById('newsFromName').value.trim();
  const fromEmail = document.getElementById('newsFromEmail').value.trim();
  const subject = document.getElementById('newsSubject').value.trim();
  const htmlBody = document.getElementById('newsHtmlBody').value.trim();
  
  const submitBtn = document.getElementById('newsletterSubmitBtn');
  const statusDiv = document.getElementById('newsletterSendStatus');
  
  if (!confirm('Are you sure you want to send this newsletter to all active subscribers? This action cannot be canceled once started.')) {
    return;
  }
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending Broadcast...';
  
  statusDiv.style.display = 'block';
  statusDiv.style.background = 'rgba(255, 255, 255, 0.05)';
  statusDiv.style.color = '#fff';
  statusDiv.innerHTML = 'Connecting to D1 and sending campaign... Please do not close this window.';
  
  try {
    const res = await fetch('/api/converts-portal/send-newsletter', {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fromName, fromEmail, subject, htmlBody })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Failed to send broadcast');
    }
    
    statusDiv.style.background = 'rgba(76, 175, 80, 0.12)';
    statusDiv.style.color = '#81c784';
    
    let resultMsg = `<strong>Broadcast Completed!</strong><br>
                     Total Sent Successfully: ${data.sent_count}<br>
                     Total Failed: ${data.fail_count || 0}`;
                     
    if (data.errors && data.errors.length > 0) {
      resultMsg += `<br><br><strong>Errors (first 10 shown):</strong><br>` + 
                   data.errors.map(err => escapeHTML(err)).join('<br>');
    }
    
    statusDiv.innerHTML = resultMsg;
    showToast('Newsletter broadcast completed');
    
  } catch (err) {
    statusDiv.style.background = 'rgba(244, 67, 54, 0.12)';
    statusDiv.style.color = '#e57373';
    statusDiv.innerHTML = '<strong>Error Sending Newsletter:</strong><br>' + escapeHTML(err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send to Subscribers';
  }
}

// =============================================
// CROSSOVER TAB
// =============================================
let crossoverSubTab = 'registrations';

function renderCrossoverTab(container) {
  container.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
      <div>
        <h3 style="margin:0; font-size:1.25rem;">Crossover Night 2026</h3>
        <p style="margin:4px 0 0; opacity:0.6; font-size:0.85rem;">Manage RSVP registrations and prayer petitions submitted for the annual crossover event.</p>
      </div>
      <button class="btn btn-outline btn-sm" onclick="exportCrossoverCSV()">&#8595; Export CSV</button>
    </div>
    <div style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap;">
      <button class="tab-btn ${crossoverSubTab === 'registrations' ? 'active' : ''}" onclick="switchCrossoverSub('registrations', this)">🎟️ RSVPs</button>
      <button class="tab-btn ${crossoverSubTab === 'prayers' ? 'active' : ''}" onclick="switchCrossoverSub('prayers', this)">🙏 Prayer Petitions</button>
    </div>
    <div class="table-wrap">
      <table class="portal-table" id="crossoverTable">
        <thead id="crossoverThead"></thead>
        <tbody id="crossoverTableBody"><tr><td colspan="6" style="text-align:center; padding:32px; opacity:0.5;">Loading...</td></tr></tbody>
      </table>
    </div>
    <p id="crossoverCount" style="margin-top:12px; font-size:0.82rem; opacity:0.6;"></p>
  `;
  loadCrossoverData();
}

function switchCrossoverSub(sub, btn) {
  crossoverSubTab = sub;
  document.querySelectorAll('#tab-content .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadCrossoverData();
}

async function loadCrossoverData() {
  const tbody = document.getElementById('crossoverTableBody');
  const thead = document.getElementById('crossoverThead');
  const count = document.getElementById('crossoverCount');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:32px; opacity:0.5;">Loading...</td></tr>';

  if (crossoverSubTab === 'registrations') {
    thead.innerHTML = '<tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Guests</th><th>Date</th></tr>';
  } else {
    thead.innerHTML = '<tr><th>#</th><th>Name</th><th>Prayer Request</th><th>Date</th><th>Actions</th></tr>';
  }

  try {
    const res = await fetch(`/api/converts-portal/crossover?type=${crossoverSubTab}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load');
    const data = await res.json();
    renderCrossoverRows(data, tbody, count);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="color:#e57373; padding:24px; text-align:center;">Error: ${escapeHTML(err.message)}</td></tr>`;
  }
}

function renderCrossoverRows(data, tbody, countEl) {
  if (!data.length) {
    const label = crossoverSubTab === 'registrations' ? 'RSVPs' : 'prayer petitions';
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:32px; opacity:0.5;">No ${label} yet.</td></tr>`;
    if (countEl) countEl.textContent = '';
    return;
  }

  if (countEl) {
    const label = crossoverSubTab === 'registrations' ? 'registrations' : 'prayer petitions';
    countEl.textContent = `${data.length} ${label} total`;
  }

  if (crossoverSubTab === 'registrations') {
    tbody.innerHTML = data.map((r, i) => {
      const date = r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A';
      const seats = (parseInt(r.guests_count) || 0) + 1;
      return `<tr>
        <td>${i + 1}</td>
        <td><strong>${escapeHTML(r.name)}</strong></td>
        <td>${escapeHTML(r.email || '-')}</td>
        <td>${escapeHTML(r.phone || '-')}</td>
        <td>${seats} seat${seats !== 1 ? 's' : ''}</td>
        <td>${date}</td>
      </tr>`;
    }).join('');
  } else {
    tbody.innerHTML = data.map((p, i) => {
      const date = p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A';
      return `<tr>
        <td>${i + 1}</td>
        <td><strong>${escapeHTML(p.name)}</strong></td>
        <td style="max-width:320px; white-space:pre-wrap;">${escapeHTML(p.prayer_request)}</td>
        <td>${date}</td>
        <td>
          <button class="btn btn-sm" style="background:rgba(244,67,54,0.12); color:#e57373; border:1px solid rgba(244,67,54,0.2);" onclick="deleteCrossoverRecord(${p.id}, 'prayer')">Delete</button>
        </td>
      </tr>`;
    }).join('');
  }
}

async function deleteCrossoverRecord(id, type) {
  if (!confirm('Delete this record? This cannot be undone.')) return;
  try {
    const res = await fetch(`/api/converts-portal/crossover?id=${id}&type=${type}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Delete failed');
    showToast('Record deleted');
    loadCrossoverData();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

function exportCrossoverCSV() {
  const rows = document.querySelectorAll('#crossoverTable tbody tr');
  const headers = [...document.querySelectorAll('#crossoverTable thead th')].map(th => th.textContent);
  const lines = [headers.join(',')];
  rows.forEach(row => {
    const cols = [...row.querySelectorAll('td')].map(td => '"' + td.textContent.replace(/"/g, '""') + '"');
    if (cols.length > 1) lines.push(cols.join(','));
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rgm-crossover-${crossoverSubTab}-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
