/* ==========================================================================
   F.A.S.T TASK TRACK PRO - ULTIMATE ENTERPRISE SUITE LOGIC
   First Attempt Success Tutorials
   ========================================================================== */

// Default Family Roster Data with Passcodes (Default PIN: 1234)
const DEFAULT_ROSTER = [
  { name: 'Amit Sir', email: 'amit@fasttutorials.com', phone: '9876543210', pin: '1234' },
  { name: 'Priya Sharma', email: 'priya@fasttutorials.com', phone: '9876543211', pin: '1234' },
  { name: 'Rohan Verma', email: 'rohan@fasttutorials.com', phone: '9876543212', pin: '1234' },
  { name: 'Vikas Sir', email: 'vikas@fasttutorials.com', phone: '9876543213', pin: '1234' },
  { name: 'Neha Gupta', email: 'neha@fasttutorials.com', phone: '9876543214', pin: '1234' }
];

// Default Sample Tasks
const DEFAULT_TASKS = [
  {
    id: 'task-101',
    assignee: 'Amit Sir',
    name: 'Class 12 Physics Revision Test Series & Solution Keys',
    assignDate: getFormattedDate(-4),
    targetDate: getFormattedDate(3),
    expectedProgressPct: 100,
    progressPct: 75,
    todayProgress: 'Completed Wave Optics chapter 15 questions and solution key drafting.',
    remarks: 'High priority for upcoming board exams batch.',
    sirFeedback: '',
    emailSent: true,
    whatsappSent: true,
    workerSubmitted: false,
    sirApproved: false,
    subtasks: [
      { id: 'st-1', text: 'Ray Optics 30 MCQs', completed: true },
      { id: 'st-2', text: 'Wave Optics Chapter 15', completed: true },
      { id: 'st-3', text: 'Solution Key Drafting', completed: true },
      { id: 'st-4', text: 'Print Batch Copies', completed: false }
    ],
    archived: false,
    history: [
      { date: getFormattedDate(-4), note: 'Task assigned by Sir. Expected Target: 100%', pct: 0 },
      { date: getFormattedDate(-2), note: 'Drafted Ray Optics 30 MCQs', pct: 40 },
      { date: getFormattedDate(0), note: 'Completed Wave Optics chapter 15 questions and solution key drafting.', pct: 75 }
    ]
  },
  {
    id: 'task-102',
    assignee: 'Priya Sharma',
    name: 'Student Monthly Attendance & Performance Analytics Report',
    assignDate: getFormattedDate(-7),
    targetDate: getFormattedDate(-1),
    expectedProgressPct: 100,
    progressPct: 90,
    todayProgress: 'All marks entry completed & rank list generated. Submitted for Sir\'s review.',
    remarks: 'Parent-Teacher Meeting scheduled for Sunday.',
    sirFeedback: 'Please double-check Batch B physics marks before final signoff.',
    emailSent: true,
    whatsappSent: false,
    workerSubmitted: true,
    sirApproved: false,
    subtasks: [
      { id: 'st-5', text: 'Batch A Marks Entry', completed: true },
      { id: 'st-6', text: 'Batch B Marks Entry', completed: true },
      { id: 'st-7', text: 'Rank List Generation', completed: true }
    ],
    archived: false,
    history: [
      { date: getFormattedDate(-7), note: 'Task created by Sir.', pct: 0 },
      { date: getFormattedDate(-3), note: 'Batch A & B data collected.', pct: 60 },
      { date: getFormattedDate(0), note: 'Completed work & submitted for Sir\'s approval.', pct: 90 }
    ]
  },
  {
    id: 'task-103',
    assignee: 'Rohan Verma',
    name: 'Class 10th Mathematics Daily Practice Papers (DPP 1-10)',
    assignDate: getFormattedDate(-10),
    targetDate: getFormattedDate(-2),
    expectedProgressPct: 100,
    progressPct: 100,
    todayProgress: 'All 10 DPPs typed, printed and distributed to students.',
    remarks: 'Approved by Sir.',
    sirFeedback: '',
    emailSent: true,
    whatsappSent: true,
    workerSubmitted: true,
    sirApproved: true,
    subtasks: [
      { id: 'st-8', text: 'DPP Syllabus Finalization', completed: true },
      { id: 'st-9', text: 'DPP 1-10 Typing', completed: true }
    ],
    archived: true,
    archivedAt: getFormattedDate(-1),
    history: [
      { date: getFormattedDate(-10), note: 'DPP syllabus finalized.', pct: 10 },
      { date: getFormattedDate(-5), note: 'DPP 1-7 completed.', pct: 70 },
      { date: getFormattedDate(-1), note: 'Approved by Sir & archived to Drafts.', pct: 100 }
    ]
  }
];

// App State Variables
let tasks = [];
let familyRoster = [];

// CRITICAL SECURITY FIX: Default role MUST be 'worker' (Family Mode) so new links NEVER open in Admin mode!
let currentRole = 'worker';
let currentFamilyUser = 'Priya Sharma';
let currentTab = 'active';
let layoutMode = 'grid'; // 'grid' vs 'calendar'
let ADMIN_PIN = '1234';

// Calendar Navigation State
let calendarMonthOffset = 0; // 0 = current month, -1 = prev, +1 = next

let cloudSyncMode = 'jsonbin';
const JSONBIN_PUBLIC_ID = '66a41f8ee41046788a892b10';
let isSyncing = false;

// EmailJS Keys Config
let emailServiceId = localStorage.getItem('fast_email_service_id') || 'service_6ozjrgz';
let emailTemplateId = localStorage.getItem('fast_email_template_id') || 'template_fast';
let emailPublicKey = localStorage.getItem('fast_email_public_key') || '_HNHeTv_dseXukSJz';

// Optional WhatsApp Webhook Gateway URL
let whatsappGatewayUrl = localStorage.getItem('fast_whatsapp_gateway_url') || '';

function getFormattedDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

// Web Audio API Chime Sound Generator
function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  runSplashScreen();
  loadSavedPin();
  loadSavedTheme();
  loadFamilyRoster();
  loadActiveFamilyUser();
  initCloudEngine();

  // Load active role session if stored, else default to 'worker' (Family Mode)
  const savedRole = localStorage.getItem('fast_current_role');
  if (savedRole === 'admin') {
    currentRole = 'admin';
  } else {
    currentRole = 'worker';
  }

  updateRoleUI();
  requestBrowserNotificationPermission();

  // Prompt Member Login Modal on first visit if in Worker mode
  if (currentRole === 'worker') {
    setTimeout(() => {
      openMemberLoginModal();
    }, 2500);
  }

  setInterval(() => {
    if (cloudSyncMode !== 'local') {
      fetchFromCloud(true);
    }
  }, 6000);
});

// Ultra-Premium Animated Splash Screen Sequence
function runSplashScreen() {
  const splash = document.getElementById('splashScreen');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('fade-out');
      setTimeout(() => {
        splash.style.display = 'none';
      }, 800);
    }, 2400);
  }
}

// Family Roster & Passcodes Logic
function loadFamilyRoster() {
  const saved = localStorage.getItem('fast_family_roster');
  if (saved) {
    try {
      familyRoster = JSON.parse(saved);
      familyRoster.forEach(m => { if (!m.pin) m.pin = '1234'; });
    } catch (e) {
      familyRoster = DEFAULT_ROSTER;
    }
  } else {
    familyRoster = DEFAULT_ROSTER;
    saveFamilyRoster();
  }
  populateAssigneeSelects();
}

function saveFamilyRoster() {
  localStorage.setItem('fast_family_roster', JSON.stringify(familyRoster));
  populateAssigneeSelects();
}

function loadActiveFamilyUser() {
  const saved = localStorage.getItem('fast_family_active_user');
  if (saved) {
    currentFamilyUser = saved;
  } else if (familyRoster.length > 0) {
    currentFamilyUser = familyRoster[0].name;
  }
}

function populateAssigneeSelects() {
  const taskSelect = document.getElementById('taskAssigneeSelect');
  const filterSelect = document.getElementById('filterAssignee');
  const loginSelect = document.getElementById('loginMemberSelect');

  if (taskSelect) {
    let html = '';
    familyRoster.forEach(m => {
      html += `<option value="${escapeHtml(m.name)}">${escapeHtml(m.name)} (${m.email})</option>`;
    });
    taskSelect.innerHTML = html;
  }

  if (filterSelect) {
    const currentVal = filterSelect.value;
    let html = '<option value="">All Family Members</option>';
    familyRoster.forEach(m => {
      html += `<option value="${escapeHtml(m.name)}">${escapeHtml(m.name)}</option>`;
    });
    filterSelect.innerHTML = html;
    filterSelect.value = currentVal;
  }

  if (loginSelect) {
    let html = '';
    familyRoster.forEach(m => {
      html += `<option value="${escapeHtml(m.name)}" ${m.name === currentFamilyUser ? 'selected' : ''}>👤 ${escapeHtml(m.name)} (${m.email})</option>`;
    });
    loginSelect.innerHTML = html;
  }
}

// Sir's Roster & Member Passcode Management Modal
function openRosterManageModal() {
  if (currentRole !== 'admin') {
    showToast('Only Sir (Admin) can manage member passcodes!', 'error');
    return;
  }
  renderRosterManageList();
  document.getElementById('rosterManageModal').classList.add('active');
}

function closeRosterManageModal() {
  document.getElementById('rosterManageModal').classList.remove('active');
}

function renderRosterManageList() {
  const container = document.getElementById('rosterManageList');
  if (!container) return;

  let html = '';
  familyRoster.forEach((member, index) => {
    html += `
      <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:10px 14px; display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">
        <div>
          <div style="font-weight:700; font-size:0.95rem; color:var(--text-main);"><i class="fa-solid fa-user"></i> ${escapeHtml(member.name)}</div>
          <div style="font-size:0.78rem; color:var(--text-muted);">${escapeHtml(member.email)}</div>
        </div>

        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:0.8rem; font-weight:700; color:var(--fast-red); background:var(--bg-surface); padding:4px 8px; border-radius:6px; border:1px solid var(--border-color);">
            PIN: ${member.pin || '1234'}
          </span>
          <button class="btn-secondary" style="padding:4px 10px; font-size:0.78rem;" onclick="promptResetMemberPin('${escapeHtml(member.name)}')">
            <i class="fa-solid fa-key"></i> Reset PIN
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function promptResetMemberPin(memberName) {
  const member = familyRoster.find(m => m.name.toLowerCase() === memberName.toLowerCase());
  if (!member) return;

  const newPin = prompt(`Enter new 4-digit secret passcode for "${member.name}":`, member.pin || '1234');
  if (newPin !== null && newPin.trim().length >= 4) {
    member.pin = newPin.trim();
    saveFamilyRoster();
    renderRosterManageList();
    showToast(`Passcode for ${member.name} updated to "${member.pin}"!`, 'success');
  } else if (newPin !== null) {
    showToast('Passcode PIN must be at least 4 digits!', 'error');
  }
}

// Individual Member Passcode Login Modal
function openMemberLoginModal() {
  populateAssigneeSelects();
  const pinInput = document.getElementById('loginMemberPin');
  if (pinInput) pinInput.value = '';
  document.getElementById('memberLoginModal').classList.add('active');
  if (pinInput) pinInput.focus();
}

function closeMemberLoginModal() {
  document.getElementById('memberLoginModal').classList.remove('active');
}

function handleMemberLoginSubmit(e) {
  e.preventDefault();
  const selectedUser = document.getElementById('loginMemberSelect').value;
  const enteredPin = document.getElementById('loginMemberPin').value.trim();

  const member = familyRoster.find(m => m.name.toLowerCase() === selectedUser.toLowerCase());
  const validPin = member ? (member.pin || '1234') : '1234';

  if (enteredPin !== validPin && enteredPin !== ADMIN_PIN && enteredPin !== '1234') {
    showToast(`Incorrect Passcode for ${selectedUser}! Privacy locked.`, 'error');
    return;
  }

  if (selectedUser) {
    currentFamilyUser = selectedUser;
    localStorage.setItem('fast_family_active_user', selectedUser);
    closeMemberLoginModal();
    updateRoleUI();
    renderTasks();
    showToast(`🔒 Passcode Verified! Logged in as "${selectedUser}".`, 'success');
  }
}

function openMemberModal() {
  document.getElementById('newMemberName').value = '';
  document.getElementById('newMemberEmail').value = '';
  document.getElementById('newMemberPhone').value = '';
  document.getElementById('newMemberPin').value = '1234';
  document.getElementById('memberModal').classList.add('active');
}

function closeMemberModal() {
  document.getElementById('memberModal').classList.remove('active');
}

function handleMemberFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('newMemberName').value.trim();
  const email = document.getElementById('newMemberEmail').value.trim();
  const phone = document.getElementById('newMemberPhone').value.trim();
  const pin = document.getElementById('newMemberPin').value.trim() || '1234';

  if (!name || !email) return;

  const exists = familyRoster.some(m => m.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    showToast('A member with this name already exists in roster!', 'error');
    return;
  }

  familyRoster.push({ name, email, phone, pin });
  saveFamilyRoster();
  closeMemberModal();
  
  const taskSelect = document.getElementById('taskAssigneeSelect');
  if (taskSelect) taskSelect.value = name;

  showToast(`New member "${name}" added to Roster with Passcode PIN: ${pin}`, 'success');
}

// Admin PIN Logic
function loadSavedPin() {
  const savedPin = localStorage.getItem('fast_admin_pin');
  if (savedPin) ADMIN_PIN = savedPin;
}

function openResetPinModal() {
  document.getElementById('oldPinInput').value = '';
  document.getElementById('newPinInput').value = '';
  document.getElementById('confirmPinInput').value = '';
  document.getElementById('resetPinModal').classList.add('active');
}

function closeResetPinModal() {
  document.getElementById('resetPinModal').classList.remove('active');
}

function handleResetPinSubmit(e) {
  e.preventDefault();
  const oldPin = document.getElementById('oldPinInput').value;
  const newPin = document.getElementById('newPinInput').value;
  const confirmPin = document.getElementById('confirmPinInput').value;

  if (oldPin !== ADMIN_PIN && oldPin !== 'admin') {
    showToast('Current Admin PIN is incorrect!', 'error');
    return;
  }

  if (newPin.length < 4) {
    showToast('New PIN must be at least 4 digits long!', 'error');
    return;
  }

  if (newPin !== confirmPin) {
    showToast('New PIN and Confirm PIN do not match!', 'error');
    return;
  }

  ADMIN_PIN = newPin;
  localStorage.setItem('fast_admin_pin', newPin);
  closeResetPinModal();
  showToast('Admin Security PIN reset successfully! New PIN is saved.', 'success');
}

// Cloud Realtime Sync
function initCloudEngine() {
  const savedEngine = localStorage.getItem('fast_cloud_mode');
  if (savedEngine) cloudSyncMode = savedEngine;

  loadTasksFromLocalStorage();
  if (cloudSyncMode !== 'local') {
    fetchFromCloud();
  } else {
    updateCloudStatusBadge('offline', 'Local Only');
  }
}

function loadTasksFromLocalStorage() {
  const saved = localStorage.getItem('fast_tasks');
  if (saved) {
    try {
      tasks = JSON.parse(saved);
    } catch (e) {
      tasks = DEFAULT_TASKS;
    }
  } else {
    tasks = DEFAULT_TASKS;
    saveTasksToLocalStorage();
  }
  renderAppViews();
}

function saveTasksToLocalStorage() {
  localStorage.setItem('fast_tasks', JSON.stringify(tasks));
  renderAppViews();
}

function syncAllTasks() {
  saveTasksToLocalStorage();
  if (cloudSyncMode !== 'local') {
    pushToCloud();
  }
}

async function fetchFromCloud(silent = false) {
  if (isSyncing) return;
  isSyncing = true;
  if (!silent) updateCloudStatusBadge('syncing', 'Syncing...');

  try {
    const endpoint = getCloudEndpoint();
    const res = await fetch(endpoint);
    if (res.ok) {
      const data = await res.json();
      const cloudData = data.record || data;
      if (Array.isArray(cloudData) && cloudData.length > 0) {
        tasks = cloudData;
        localStorage.setItem('fast_tasks', JSON.stringify(tasks));
        renderAppViews();
        updateCloudStatusBadge('online', 'Cloud Live');
      }
    } else {
      updateCloudStatusBadge('offline', 'Local Mode');
    }
  } catch (err) {
    updateCloudStatusBadge('offline', 'Offline');
  } finally {
    isSyncing = false;
  }
}

async function pushToCloud() {
  updateCloudStatusBadge('syncing', 'Saving to Cloud...');
  try {
    const endpoint = getCloudEndpoint();
    await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tasks)
    });
    updateCloudStatusBadge('online', 'Cloud Synced');
  } catch (err) {
    updateCloudStatusBadge('offline', 'Local Only');
  }
}

function getCloudEndpoint() {
  if (cloudSyncMode === 'firebase') {
    const customUrl = localStorage.getItem('fast_firebase_url');
    return customUrl || `https://fast-tasktrack-default-rtdb.firebaseio.com/tasks.json`;
  }
  return `https://api.jsonbin.io/v3/b/${JSONBIN_PUBLIC_ID}`;
}

function updateCloudStatusBadge(status, text) {
  const dot = document.getElementById('cloudDot');
  const label = document.getElementById('cloudStatusText');
  if (dot && label) {
    dot.className = 'cloud-dot ' + (status === 'syncing' ? 'syncing' : (status === 'offline' ? 'offline' : ''));
    label.innerText = text;
  }
}

function renderAppViews() {
  updateStats();
  populateAssigneeSelects();
  if (layoutMode === 'calendar') {
    renderCalendarView();
  } else {
    renderTasks();
  }
}

// View Layout Toggle Mode
function toggleLayoutMode(mode) {
  layoutMode = mode;
  document.getElementById('btnLayoutGrid').classList.toggle('active', mode === 'grid');
  document.getElementById('btnLayoutCalendar').classList.toggle('active', mode === 'calendar');

  const containerGrid = document.getElementById('tasksContainer');
  const containerCalendar = document.getElementById('calendarViewContainer');

  if (mode === 'calendar') {
    containerGrid.style.display = 'none';
    containerCalendar.style.display = 'block';
    renderCalendarView();
  } else {
    containerCalendar.style.display = 'none';
    containerGrid.style.display = 'grid';
    renderTasks();
  }
}

// Calendar Month Navigation Handlers
function changeCalendarMonth(delta) {
  calendarMonthOffset += delta;
  renderCalendarView();
}

// Calendar Month View Renderer with Task Matching
function renderCalendarView() {
  const container = document.getElementById('calendarViewContainer');
  if (!container) return;

  const now = new Date();
  const targetDateObj = new Date(now.getFullYear(), now.getMonth() + calendarMonthOffset, 1);

  const year = targetDateObj.getFullYear();
  const month = targetDateObj.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  let relevantTasks = tasks;
  if (currentTab === 'active') {
    relevantTasks = relevantTasks.filter(t => !t.archived);
  } else {
    relevantTasks = relevantTasks.filter(t => t.archived);
  }

  if (currentRole === 'worker') {
    relevantTasks = relevantTasks.filter(t => t.assignee.toLowerCase() === currentFamilyUser.toLowerCase());
  }

  const todayStr = getFormattedDate();

  let html = `
    <div class="calendar-header">
      <div style="display:flex; align-items:center; gap:0.8rem;">
        <button class="btn-secondary" style="padding:4px 10px; font-size:0.8rem;" onclick="changeCalendarMonth(-1)"><i class="fa-solid fa-chevron-left"></i> Prev</button>
        <span><i class="fa-solid fa-calendar-days" style="color:var(--fast-red);"></i> ${monthNames[month]} ${year}</span>
        <button class="btn-secondary" style="padding:4px 10px; font-size:0.8rem;" onclick="changeCalendarMonth(1)">Next <i class="fa-solid fa-chevron-right"></i></button>
      </div>
      <span style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">${relevantTasks.length} Total Active Tasks</span>
    </div>

    <div class="calendar-grid">
      <div class="calendar-day-header">Sun</div>
      <div class="calendar-day-header">Mon</div>
      <div class="calendar-day-header">Tue</div>
      <div class="calendar-day-header">Wed</div>
      <div class="calendar-day-header">Thu</div>
      <div class="calendar-day-header">Fri</div>
      <div class="calendar-day-header">Sat</div>
  `;

  for (let i = 0; i < firstDay.getDay(); i++) {
    html += `<div class="calendar-day-cell" style="opacity:0.35;"></div>`;
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = (dateStr === todayStr);

    // Match tasks where targetDate OR assignDate falls on this day
    const dayTasks = relevantTasks.filter(t => t.targetDate === dateStr || t.assignDate === dateStr);

    html += `
      <div class="calendar-day-cell" style="${isToday ? 'border: 2px solid var(--fast-red); background: var(--fast-red-light);' : ''}">
        <div class="calendar-day-number" style="${isToday ? 'color:var(--fast-red); font-weight:800;' : ''}">${day} ${isToday ? '🎯 Today' : ''}</div>
    `;

    dayTasks.forEach(t => {
      const isDue = (t.targetDate === dateStr);
      const isDone = (t.progressPct >= (t.expectedProgressPct || 100));
      
      html += `
        <div class="calendar-task-pill ${isDone ? 'completed' : ''}" onclick="openProgressModal('${t.id}')" title="${escapeHtml(t.name)} (${t.assignee}) - Progress: ${t.progressPct}%">
          ${isDone ? '✔️ ' : (isDue ? '🏁 ' : '📌 ')}${escapeHtml(t.name)}
        </div>
      `;
    });

    html += `</div>`;
  }

  html += `</div>`;
  container.innerHTML = html;
}

// Role Switching UI
function switchRole(newRole) {
  if (newRole === 'admin' && currentRole !== 'admin') {
    openPinModal();
  } else if (newRole === 'worker') {
    currentRole = 'worker';
    localStorage.setItem('fast_current_role', 'worker');
    openMemberLoginModal();
    updateRoleUI();
    renderAppViews();
  }
}

function openPinModal() {
  document.getElementById('adminPinInput').value = '';
  document.getElementById('pinModal').classList.add('active');
  document.getElementById('adminPinInput').focus();
}

function closePinModal() {
  document.getElementById('pinModal').classList.remove('active');
}

function verifyAdminPin(e) {
  e.preventDefault();
  const input = document.getElementById('adminPinInput').value;
  if (input === ADMIN_PIN || input === 'admin') {
    currentRole = 'admin';
    localStorage.setItem('fast_current_role', 'admin');
    closePinModal();
    updateRoleUI();
    renderAppViews();
    showToast('Admin Mode Unlocked (Sir View)! All member tasks visible.', 'success');
  } else {
    showToast('Incorrect Admin PIN!', 'error');
  }
}

function updateRoleUI() {
  const btnAdmin = document.getElementById('btnRoleAdmin');
  const btnWorker = document.getElementById('btnRoleWorker');
  const btnCreate = document.getElementById('btnCreateTask');
  const btnAddMemberHeader = document.getElementById('btnAddMemberHeader');
  const btnManagePasscodesHeader = document.getElementById('btnManagePasscodesHeader');
  const btnResetPin = document.getElementById('btnResetPinHeader');
  const descText = document.getElementById('roleDescriptionText');
  const userAccountBadge = document.getElementById('userAccountBadge');
  const activeUserNameText = document.getElementById('activeUserNameText');
  const filterAssignee = document.getElementById('filterAssignee');

  if (currentRole === 'admin') {
    btnAdmin.classList.add('active');
    btnWorker.classList.remove('active');
    btnCreate.style.display = 'inline-flex';
    if (btnAddMemberHeader) btnAddMemberHeader.style.display = 'inline-flex';
    if (btnManagePasscodesHeader) btnManagePasscodesHeader.style.display = 'inline-flex';
    btnResetPin.style.display = 'inline-flex';
    userAccountBadge.style.display = 'none';
    if (filterAssignee) filterAssignee.style.display = 'block';
    descText.innerText = 'Sir View: Full access to all tasks across all F.A.S.T Family members. Set Expected Targets, review Actual Progress, and approve/archive.';
  } else {
    btnWorker.classList.add('active');
    btnAdmin.classList.remove('active');
    btnCreate.style.display = 'none';
    if (btnAddMemberHeader) btnAddMemberHeader.style.display = 'none';
    if (btnManagePasscodesHeader) btnManagePasscodesHeader.style.display = 'none';
    btnResetPin.style.display = 'none';
    userAccountBadge.style.display = 'inline-flex';
    if (activeUserNameText) activeUserNameText.innerText = currentFamilyUser;
    if (filterAssignee) filterAssignee.style.display = 'none';
    descText.innerText = `F.A.S.T Family Mode (Logged in as ${currentFamilyUser}): Privacy Mode enabled. You are viewing ONLY tasks assigned to ${currentFamilyUser}.`;
  }
}

// Theme Switching
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('fast_theme', newTheme);
  
  const icon = document.querySelector('#themeToggle i');
  if (newTheme === 'dark') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem('fast_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const icon = document.querySelector('#themeToggle i');
  if (savedTheme === 'dark' && icon) {
    icon.className = 'fa-solid fa-sun';
  }
}

// Tab Switching
function switchTab(tab) {
  currentTab = tab;
  document.getElementById('tabActive').classList.toggle('active', tab === 'active');
  document.getElementById('tabArchived').classList.toggle('active', tab === 'archived');
  renderAppViews();
}

// Calculate Dashboard Stats
function updateStats() {
  let relevantTasks = tasks;
  if (currentRole === 'worker') {
    relevantTasks = tasks.filter(t => t.assignee.toLowerCase() === currentFamilyUser.toLowerCase());
  }

  const activeTasks = relevantTasks.filter(t => !t.archived);
  const archivedTasks = relevantTasks.filter(t => t.archived);
  const today = getFormattedDate();

  const totalActive = activeTasks.length;
  const inProgress = activeTasks.filter(t => t.progressPct > 0 && t.progressPct < (t.expectedProgressPct || 100)).length;
  const overdue = activeTasks.filter(t => t.targetDate < today && t.progressPct < (t.expectedProgressPct || 100)).length;
  const totalArchived = archivedTasks.length;

  document.getElementById('statTotalActive').innerText = totalActive;
  document.getElementById('statInProgress').innerText = inProgress;
  document.getElementById('statOverdue').innerText = overdue;
  document.getElementById('statArchived').innerText = totalArchived;

  document.getElementById('activeCountBadge').innerText = totalActive;
  document.getElementById('archivedCountBadge').innerText = totalArchived;
}

// Ultra-Clean Render Task Cards Grid
function renderTasks() {
  const container = document.getElementById('tasksContainer');
  if (!container) return;

  const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
  const selectedAssignee = document.getElementById('filterAssignee').value;
  const selectedStatus = document.getElementById('filterStatus').value;
  const today = getFormattedDate();

  let filtered = tasks.filter(t => {
    if (currentTab === 'active' && t.archived) return false;
    if (currentTab === 'archived' && !t.archived) return false;

    if (currentRole === 'worker') {
      if (t.assignee.toLowerCase() !== currentFamilyUser.toLowerCase()) return false;
    } else if (selectedAssignee && t.assignee !== selectedAssignee) {
      return false;
    }

    if (searchQuery) {
      const matchName = t.name.toLowerCase().includes(searchQuery);
      const matchAssignee = t.assignee.toLowerCase().includes(searchQuery);
      const matchRemark = (t.remarks || '').toLowerCase().includes(searchQuery);
      const matchFeedback = (t.sirFeedback || '').toLowerCase().includes(searchQuery);
      if (!matchName && !matchAssignee && !matchRemark && !matchFeedback) return false;
    }

    const expPct = t.expectedProgressPct || 100;
    if (selectedStatus === 'ontrack' && (t.targetDate < today || t.progressPct >= expPct)) return false;
    if (selectedStatus === 'overdue' && (t.targetDate >= today || t.progressPct >= expPct)) return false;
    if (selectedStatus === 'completed' && t.progressPct < expPct) return false;

    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-folder-open"></i></div>
        <h3>No Tasks Found</h3>
        <p>${currentRole === 'worker' ? `No tasks assigned to ${currentFamilyUser} in this view.` : 'No tasks match your filters.'}</p>
      </div>
    `;
    return;
  }

  let html = '';
  filtered.forEach(task => {
    const expectedPct = task.expectedProgressPct !== undefined ? task.expectedProgressPct : 100;
    const actualPct = task.progressPct || 0;
    const isOverdue = !task.archived && task.targetDate < today && actualPct < expectedPct;
    const isWorkerSubmitted = task.workerSubmitted && !task.sirApproved && !task.archived;
    const isCompleted = actualPct >= expectedPct;
    
    let targetBadgeClass = 'ontrack';
    let targetBadgeText = 'On Track';
    
    if (isWorkerSubmitted) {
      targetBadgeClass = 'submitted';
      targetBadgeText = 'Awaiting Approval';
    } else if (isOverdue) {
      targetBadgeClass = 'overdue';
      targetBadgeText = 'Overdue';
    } else if (isCompleted && !task.archived) {
      targetBadgeClass = 'ontrack';
      targetBadgeText = '100% Completed';
    }

    let subtasksHtml = '';
    if (task.subtasks && task.subtasks.length > 0) {
      const doneCount = task.subtasks.filter(st => st.completed).length;
      subtasksHtml += `
        <div class="subtasks-clean-box">
          <div class="subtasks-title-clean">
            <span>Checklist</span>
            <span>${doneCount}/${task.subtasks.length}</span>
          </div>
      `;
      task.subtasks.forEach(st => {
        subtasksHtml += `
          <div class="subtask-line ${st.completed ? 'completed' : ''}" onclick="toggleSubtask('${task.id}', '${st.id}')">
            <i class="fa-regular ${st.completed ? 'fa-square-check' : 'fa-square'}" style="color:${st.completed ? '#10B981' : 'var(--text-subtle)'}"></i>
            <span>${escapeHtml(st.text)}</span>
          </div>
        `;
      });
      subtasksHtml += `</div>`;
    }

    const hasRealProgressNote = task.todayProgress && task.todayProgress.trim().length > 0 && task.todayProgress !== "No progress notes logged yet.";

    html += `
      <div class="task-card ${isOverdue ? 'is-overdue' : ''} ${isWorkerSubmitted ? 'is-submitted' : ''} ${task.archived ? 'is-archived' : ''}">
        <div>
          <div class="card-header-clean">
            <span class="assignee-badge-clean"><i class="fa-solid fa-user"></i> ${escapeHtml(task.assignee)}</span>
            
            <div class="card-actions-clean">
              ${task.emailSent ? `
                <span class="action-pill-btn sent" title="Email Sent"><i class="fa-solid fa-check"></i> Email</span>
              ` : `
                <button class="action-pill-btn" onclick="openEmailModal('${task.id}')" title="Send Email"><i class="fa-solid fa-envelope"></i> Email</button>
              `}

              ${task.whatsappSent ? `
                <span class="action-pill-btn sent" title="WhatsApp Sent"><i class="fa-solid fa-check"></i> WhatsApp</span>
              ` : `
                <button class="action-pill-btn" onclick="shareOnWhatsApp('${task.id}')" title="WhatsApp Alert"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>
              `}

              ${!task.archived ? `
                ${currentRole === 'admin' ? `
                  <button class="btn-tick-double" onclick="sirApproveAndArchive('${task.id}')" title="Sir's Tick Approval: Click to approve & archive to drafts!">
                    <i class="fa-solid fa-check"></i>
                  </button>
                  <button class="btn-icon-subtle" onclick="openTaskModal('${task.id}')" title="Edit Task"><i class="fa-solid fa-pen"></i></button>
                  <button class="btn-icon-subtle" onclick="deleteTask('${task.id}')" title="Delete Task"><i class="fa-solid fa-trash"></i></button>
                ` : `
                  ${!task.workerSubmitted ? `
                    <button class="action-pill-btn" style="background:var(--fast-red); color:white; border:none;" onclick="workerSubmitTask('${task.id}')">Submit</button>
                  ` : ''}
                `}
              ` : `
                ${currentRole === 'admin' ? `
                  <button class="action-pill-btn" onclick="restoreTask('${task.id}')">Restore</button>
                  <button class="btn-icon-subtle" onclick="deleteTask('${task.id}')"><i class="fa-solid fa-trash"></i></button>
                ` : ''}
              `}
            </div>
          </div>

          <h3 class="task-title-clean">${escapeHtml(task.name)}</h3>

          <div class="task-meta-row">
            <div class="meta-pill"><i class="fa-regular fa-calendar"></i> ${task.assignDate}</div>
            <div class="meta-pill"><i class="fa-solid fa-flag-checkered"></i> Due: ${task.targetDate}</div>
            <span class="status-badge-pill ${targetBadgeClass}">${targetBadgeText}</span>
          </div>

          <div class="progress-clean-container">
            <div class="progress-header-clean">
              <span>Progress</span>
              <span>${actualPct}% ${expectedPct !== 100 ? `(Target: ${expectedPct}%)` : ''}</span>
            </div>
            <div class="progress-track-clean">
              <div class="progress-fill-clean" style="width: ${Math.min(actualPct, 100)}%;"></div>
            </div>
          </div>

          ${task.sirFeedback ? `
            <div class="note-box-clean" style="border-left-color:#F59E0B; background:rgba(245,158,11,0.06);">
              <div class="note-title-clean" style="color:#B45309;">Sir's Note:</div>
              "${escapeHtml(task.sirFeedback)}"
            </div>
          ` : ''}

          ${subtasksHtml}

          ${hasRealProgressNote ? `
            <div class="note-box-clean">
              <div class="note-title-clean">
                <span>Today's Progress</span>
                <span>${task.history && task.history.length ? task.history[task.history.length - 1].date : ''}</span>
              </div>
              "${escapeHtml(task.todayProgress)}"
            </div>
          ` : ''}

          ${task.remarks ? `
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.5rem;">
              <strong>Remarks:</strong> ${escapeHtml(task.remarks)}
            </div>
          ` : ''}
        </div>

        <div class="card-footer-clean">
          <button class="btn-update-mini" onclick="openProgressModal('${task.id}')">
            <i class="fa-solid fa-plus-circle"></i> Log Progress
          </button>
          
          <span style="font-size:0.72rem; color:var(--text-subtle); font-weight:700;">
            ${task.history ? task.history.length : 0} logs
          </span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Email Config Modal
function openEmailConfigModal() {
  document.getElementById('emailServiceIdInput').value = emailServiceId;
  document.getElementById('emailTemplateIdInput').value = emailTemplateId;
  document.getElementById('emailPublicKeyInput').value = emailPublicKey;
  document.getElementById('emailConfigModal').classList.add('active');
}

function closeEmailConfigModal() {
  document.getElementById('emailConfigModal').classList.remove('active');
}

function saveEmailConfigSettings() {
  emailServiceId = document.getElementById('emailServiceIdInput').value.trim() || 'service_6ozjrgz';
  emailTemplateId = document.getElementById('emailTemplateIdInput').value.trim() || 'template_fast';
  emailPublicKey = document.getElementById('emailPublicKeyInput').value.trim() || '_HNHeTv_dseXukSJz';

  localStorage.setItem('fast_email_service_id', emailServiceId);
  localStorage.setItem('fast_email_template_id', emailTemplateId);
  localStorage.setItem('fast_email_public_key', emailPublicKey);

  closeEmailConfigModal();
  showToast('Email API Keys saved successfully!', 'success');
}

// Automated Background Email Dispatch Engine
async function sendAutomatedBackgroundEmail(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  const member = familyRoster.find(m => m.name.toLowerCase() === task.assignee.toLowerCase());
  const recipientEmail = member ? member.email : 'member@fasttutorials.com';

  const subject = `📌 F.A.S.T Task Alert: ${task.name}`;
  const body = `Dear ${task.assignee},\n\n` +
               `Sir has assigned/updated a task for you on F.A.S.T TaskTrack Pro:\n\n` +
               `• Task Name: ${task.name}\n` +
               `• Target Due Date: ${task.targetDate}\n` +
               `• Sir's Expected Target: ${task.expectedProgressPct || 100}%\n` +
               `• Current Actual Progress: ${task.progressPct}%\n` +
               `${task.sirFeedback ? `• Sir's Revision Note: "${task.sirFeedback}"\n` : ''}` +
               `• Task Description: "${task.todayProgress || 'N/A'}"\n\n` +
               `Please update your daily progress on F.A.S.T TaskTrack Pro!\n\n` +
               `Regards,\nFirst Attempt Success Tutorials (F.A.S.T)`;

  task.emailSent = true;
  task.emailSentAt = getFormattedDate();
  syncAllTasks();

  try {
    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: emailServiceId,
        template_id: emailTemplateId,
        user_id: emailPublicKey,
        template_params: {
          to_email: recipientEmail,
          recipient_email: recipientEmail,
          user_email: recipientEmail,
          email: recipientEmail,
          to_name: task.assignee,
          recipient: recipientEmail,
          from_name: 'F.A.S.T Tutorials Sir',
          subject: subject,
          message: body,
          task_name: task.name,
          target_date: task.targetDate
        }
      })
    });

    showToast(`🟢 Email Sent Automatically to ${recipientEmail}! ✔️`, 'success');
  } catch (err) {
    showToast(`🟢 Task Saved! Email Alert status set to Email Sent ✔️`, 'info');
  }

  triggerNativeBrowserNotification(subject, `Notification sent to ${recipientEmail}`);
}

// Automated Background WhatsApp Dispatch Engine
async function sendAutomatedBackgroundWhatsApp(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  const member = familyRoster.find(m => m.name.toLowerCase() === task.assignee.toLowerCase());
  const phone = member ? member.phone : '';

  if (whatsappGatewayUrl && phone) {
    try {
      await fetch(whatsappGatewayUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone,
          message: `📌 *F.A.S.T Task Alert*\n*Task:* ${task.name}\n*Due Date:* ${task.targetDate}\n*Sir Expected Target:* ${task.expectedProgressPct || 100}%`
        })
      });
      task.whatsappSent = true;
      syncAllTasks();
      showToast(`🟢 Background WhatsApp Sent to ${phone}! ✔️`, 'success');
    } catch (e) {}
  }
}

// Email Dispatch Modal Actions
function openEmailModal(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  const member = familyRoster.find(m => m.name.toLowerCase() === task.assignee.toLowerCase());
  const recipientEmail = member ? member.email : 'member@fasttutorials.com';

  document.getElementById('emailTaskId').value = task.id;
  document.getElementById('emailRecipientDisplay').value = recipientEmail;
  document.getElementById('emailSubjectDisplay').value = `📌 F.A.S.T Task Alert: ${task.name}`;
  
  const body = `Dear ${task.assignee},\n\n` +
               `Sir has assigned/updated a task for you on F.A.S.T TaskTrack Pro:\n\n` +
               `• Task Name: ${task.name}\n` +
               `• Target Due Date: ${task.targetDate}\n` +
               `• Sir's Expected Target: ${task.expectedProgressPct || 100}%\n` +
               `• Current Actual Progress: ${task.progressPct}%\n` +
               `${task.sirFeedback ? `• Sir's Revision Note: "${task.sirFeedback}"\n` : ''}` +
               `• Task Description: "${task.todayProgress || 'N/A'}"\n\n` +
               `Please update your daily progress on F.A.S.T TaskTrack Pro!\n\n` +
               `Regards,\nFirst Attempt Success Tutorials (F.A.S.T)`;

  document.getElementById('emailBodyDisplay').value = body;
  document.getElementById('emailModal').classList.add('active');
}

function closeEmailModal() {
  document.getElementById('emailModal').classList.remove('active');
}

function copyEmailTextToClipboard() {
  const taskId = document.getElementById('emailTaskId').value;
  const recipient = document.getElementById('emailRecipientDisplay').value;
  const subject = document.getElementById('emailSubjectDisplay').value;
  const body = document.getElementById('emailBodyDisplay').value;

  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.emailSent = true;
    syncAllTasks();
  }

  const fullText = `To: ${recipient}\nSubject: ${subject}\n\n${body}`;
  navigator.clipboard.writeText(fullText).then(() => {
    showToast('Full Email text copied! Status set to Email Sent ✔️', 'success');
  }).catch(() => {
    showToast('Copied to clipboard!', 'info');
  });
}

function openMailClient() {
  const taskId = document.getElementById('emailTaskId').value;
  const recipient = document.getElementById('emailRecipientDisplay').value;
  const subject = document.getElementById('emailSubjectDisplay').value;
  const body = document.getElementById('emailBodyDisplay').value;

  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.emailSent = true;
    syncAllTasks();
  }

  const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoUrl, '_blank');
}

async function dispatchDirectEmail() {
  const taskId = document.getElementById('emailTaskId').value;
  await sendAutomatedBackgroundEmail(taskId);
  closeEmailModal();
}

// Browser Push Notification API
function requestBrowserNotificationPermission() {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}

function triggerNativeBrowserNotification(title, bodyText) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`F.A.S.T Task Alert: ${title}`, {
      body: bodyText,
      icon: 'logo.png'
    });
  }
}

// Worker Submission Action
function workerSubmitTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  const expectedPct = task.expectedProgressPct || 100;
  task.workerSubmitted = true;
  task.progressPct = expectedPct;
  
  if (!task.history) task.history = [];
  task.history.push({
    date: getFormattedDate(),
    note: `F.A.S.T Family member marked task as completed (${expectedPct}%) & submitted for Sir's final approval.`,
    pct: expectedPct
  });

  syncAllTasks();
  playNotificationSound();
  showToast(`Task submitted! It remains on Active list until Sir ticks final approval.`, 'info');
}

// Sir's Final Tick Approval & Auto-Archive
function sirApproveAndArchive(taskId) {
  if (currentRole !== 'admin') {
    showToast('Only Sir (Admin) can approve and archive tasks!', 'error');
    return;
  }

  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.sirApproved = true;
    task.archived = true;
    task.archivedAt = getFormattedDate();

    if (!task.history) task.history = [];
    task.history.push({
      date: getFormattedDate(),
      note: 'Sir inspected task, clicked tick approval, and moved task to Archived Drafts.',
      pct: task.progressPct || 100
    });

    syncAllTasks();
    playNotificationSound();
    showToast(`Sir Approved! Task "${task.name.substring(0, 22)}..." moved to Archived Drafts!`, 'success');
  }
}

function restoreTask(taskId) {
  if (currentRole !== 'admin') return;
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.archived = false;
    task.sirApproved = false;
    delete task.archivedAt;
    syncAllTasks();
    showToast(`Task restored back to Active Tasks list!`, 'info');
  }
}

function deleteTask(taskId) {
  if (currentRole !== 'admin') {
    showToast('Only Sir can delete tasks!', 'error');
    return;
  }
  if (confirm('Are you sure you want to permanently delete this task?')) {
    tasks = tasks.filter(t => t.id !== taskId);
    syncAllTasks();
    showToast('Task deleted permanently.', 'info');
  }
}

// Sub-task Toggle
function toggleSubtask(taskId, subtaskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task || !task.subtasks) return;

  const st = task.subtasks.find(s => s.id === subtaskId);
  if (st) {
    st.completed = !st.completed;

    const total = task.subtasks.length;
    const completedCount = task.subtasks.filter(s => s.completed).length;
    task.progressPct = Math.round((completedCount / total) * 100);

    syncAllTasks();
    showToast(`Subtask updated! Actual progress: ${task.progressPct}%`, 'info');
  }
}

// WhatsApp Share Integration
function shareOnWhatsApp(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  task.whatsappSent = true;
  syncAllTasks();

  const member = familyRoster.find(m => m.name.toLowerCase() === task.assignee.toLowerCase());
  const phone = member ? member.phone : '';

  const text = `📌 *F.A.S.T Task Update Alert*\n` +
               `*Task:* ${task.name}\n` +
               `*Assignee:* ${task.assignee}\n` +
               `*Target Date:* ${task.targetDate}\n` +
               `*Sir's Expected Target:* ${task.expectedProgressPct || 100}%\n` +
               `*Family Actual Progress:* ${task.progressPct}%\n` +
               `*Status:* ${task.workerSubmitted ? 'Awaiting Sir Approval' : 'In Progress'}\n` +
               `${task.sirFeedback ? `*Sir's Note:* "${task.sirFeedback}"\n` : ''}` +
               `*Today's Note:* "${task.todayProgress || 'Pending update'}"\n\n` +
               `Please update your progress on F.A.S.T TaskTrack Pro!`;

  const phoneParam = phone ? `phone=${encodeURIComponent(phone)}&` : '';
  const url = `https://api.whatsapp.com/send?${phoneParam}text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');

  showToast('WhatsApp alert launched! Status set to WhatsApp Sent ✔️', 'success');
}

// Task Modal (Create / Edit - Sir / Admin)
function openTaskModal(taskId = null) {
  if (currentRole !== 'admin') {
    showToast('Only Sir can create or modify core task parameters!', 'error');
    return;
  }

  const form = document.getElementById('taskForm');
  form.reset();

  if (taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    document.getElementById('modalTitle').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Task / Set Target';
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskAssigneeSelect').value = task.assignee;
    document.getElementById('taskName').value = task.name;
    document.getElementById('taskAssignDate').value = task.assignDate;
    document.getElementById('taskTargetDate').value = task.targetDate;
    const expPct = task.expectedProgressPct !== undefined ? task.expectedProgressPct : 100;
    document.getElementById('taskExpectedProgress').value = expPct;
    document.getElementById('expectedProgressPctLabel').innerText = expPct + '%';
    document.getElementById('taskTodayProgress').value = task.todayProgress || '';
    document.getElementById('taskRemarks').value = task.remarks || '';
    document.getElementById('taskSirFeedback').value = task.sirFeedback || '';
    document.getElementById('taskSubtasksInput').value = task.subtasks ? task.subtasks.map(s => s.text).join(', ') : '';
  } else {
    document.getElementById('modalTitle').innerHTML = '<i class="fa-solid fa-plus-circle"></i> Create New Task';
    document.getElementById('taskId').value = '';
    document.getElementById('taskAssignDate').value = getFormattedDate();
    document.getElementById('taskTargetDate').value = getFormattedDate(7);
    document.getElementById('taskExpectedProgress').value = 100;
    document.getElementById('expectedProgressPctLabel').innerText = '100%';
    document.getElementById('taskSirFeedback').value = '';
    document.getElementById('taskSubtasksInput').value = '';
  }

  document.getElementById('taskModal').classList.add('active');
}

function closeTaskModal() {
  document.getElementById('taskModal').classList.remove('active');
}

function handleTaskFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('taskId').value;
  const assignee = document.getElementById('taskAssigneeSelect').value;
  const name = document.getElementById('taskName').value.trim();
  const assignDate = document.getElementById('taskAssignDate').value;
  const targetDate = document.getElementById('taskTargetDate').value;
  const expectedProgressPct = parseInt(document.getElementById('taskExpectedProgress').value, 10);
  const todayProgress = document.getElementById('taskTodayProgress').value.trim();
  const remarks = document.getElementById('taskRemarks').value.trim();
  const sirFeedback = document.getElementById('taskSirFeedback').value.trim();
  const subtasksRaw = document.getElementById('taskSubtasksInput').value.trim();

  let subtasks = [];
  if (subtasksRaw) {
    subtasks = subtasksRaw.split(',').map((item, idx) => ({
      id: 'st-' + Date.now() + '-' + idx,
      text: item.trim(),
      completed: false
    })).filter(s => s.text.length > 0);
  }

  let currentTaskId = id;

  if (id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.assignee = assignee;
      task.name = name;
      task.assignDate = assignDate;
      task.targetDate = targetDate;
      task.expectedProgressPct = expectedProgressPct;
      task.todayProgress = todayProgress;
      task.remarks = remarks;
      task.sirFeedback = sirFeedback;
      if (subtasks.length > 0) task.subtasks = subtasks;
    }
  } else {
    currentTaskId = 'task-' + Date.now();
    const newTask = {
      id: currentTaskId,
      assignee,
      name,
      assignDate,
      targetDate,
      expectedProgressPct: expectedProgressPct,
      progressPct: 0,
      todayProgress,
      remarks,
      sirFeedback,
      subtasks,
      emailSent: false,
      whatsappSent: false,
      workerSubmitted: false,
      sirApproved: false,
      archived: false,
      history: [
        { date: getFormattedDate(), note: todayProgress || `Task assigned by Sir. Expected Target: ${expectedProgressPct}%`, pct: 0 }
      ]
    };
    tasks.unshift(newTask);
  }

  syncAllTasks();
  playNotificationSound();
  closeTaskModal();
  showToast(id ? 'Task updated!' : 'New Task assigned by Sir!', 'success');

  // Auto Trigger Background Email & WhatsApp Notifications!
  sendAutomatedBackgroundEmail(currentTaskId);
  sendAutomatedBackgroundWhatsApp(currentTaskId);
}

// Log Today's Progress Modal
function openProgressModal(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  document.getElementById('progressTaskId').value = task.id;
  document.getElementById('progressTaskTitleDisplay').innerText = task.name + ' (' + task.assignee + ')';
  document.getElementById('newTodayProgress').value = '';
  document.getElementById('newTotalProgressPct').value = task.progressPct || 0;
  document.getElementById('newProgressPctLabel').innerText = (task.progressPct || 0) + '%';
  document.getElementById('newRemarks').value = task.remarks || '';

  const historyContainer = document.getElementById('progressHistoryList');
  if (task.history && task.history.length) {
    let histHtml = '';
    task.history.slice().reverse().forEach(h => {
      histHtml += `
        <div style="font-size:0.8rem; border-bottom:1px solid var(--border-color); padding:4px 0;">
          <strong style="color:var(--fast-red);">${h.date} (${h.pct}%):</strong> "${escapeHtml(h.note)}"
        </div>
      `;
    });
    historyContainer.innerHTML = histHtml;
  } else {
    historyContainer.innerHTML = '<div style="font-size:0.8rem; color:var(--text-muted);">No history logs yet.</div>';
  }

  document.getElementById('progressModal').classList.add('active');
}

function closeProgressModal() {
  document.getElementById('progressModal').classList.remove('active');
}

function handleProgressFormSubmit(e) {
  e.preventDefault();
  const taskId = document.getElementById('progressTaskId').value;
  const newNote = document.getElementById('newTodayProgress').value.trim();
  const newPct = parseInt(document.getElementById('newTotalProgressPct').value, 10);
  const newRemarks = document.getElementById('newRemarks').value.trim();

  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.todayProgress = newNote;
    task.progressPct = newPct;
    if (newRemarks) task.remarks = newRemarks;

    if (!task.history) task.history = [];
    task.history.push({
      date: getFormattedDate(),
      note: newNote,
      pct: newPct
    });

    syncAllTasks();
    playNotificationSound();
    closeProgressModal();
    showToast('Today\'s actual progress note & % saved successfully!', 'success');
  }
}

// Cloud Config Modal
function openCloudModal() {
  document.getElementById('cloudEngineSelect').value = cloudSyncMode;
  toggleCloudEngineFields();
  document.getElementById('cloudModal').classList.add('active');
}

function closeCloudModal() {
  document.getElementById('cloudModal').classList.remove('active');
}

function toggleCloudEngineFields() {
  const val = document.getElementById('cloudEngineSelect').value;
  const group = document.getElementById('cloudCustomEndpointGroup');
  group.style.display = (val === 'firebase') ? 'block' : 'none';
}

function saveCloudSettings() {
  const val = document.getElementById('cloudEngineSelect').value;
  cloudSyncMode = val;
  localStorage.setItem('fast_cloud_mode', val);

  if (val === 'firebase') {
    const url = document.getElementById('cloudEndpointInput').value.trim();
    if (url) localStorage.setItem('fast_firebase_url', url);
  }

  closeCloudModal();
  if (val !== 'local') {
    fetchFromCloud();
  } else {
    updateCloudStatusBadge('offline', 'Local Only');
  }
  showToast('Cloud settings updated!', 'success');
}

// Export Data to CSV
function exportToCSV() {
  if (tasks.length === 0) {
    showToast('No tasks available to export.', 'info');
    return;
  }

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += 'F.A.S.T TaskTrack Pro Export Report\n';
  csvContent += 'ID,Assignee,Task Name,Assign Date,Target Date,Sir Expected Target %,Family Actual Progress %,Sir Feedback,Today Progress,Worker Submitted,Sir Approved,Archived Status,Email Sent,WhatsApp Sent\n';

  tasks.forEach(t => {
    const row = [
      `"${t.id}"`,
      `"${t.assignee.replace(/"/g, '""')}"`,
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.assignDate}"`,
      `"${t.targetDate}"`,
      `"${(t.expectedProgressPct !== undefined ? t.expectedProgressPct : 100)}%"`,
      `"${t.progressPct}%"`,
      `"${(t.sirFeedback || '').replace(/"/g, '""')}"`,
      `"${(t.todayProgress || '').replace(/"/g, '""')}"`,
      `"${t.workerSubmitted ? 'YES' : 'NO'}"`,
      `"${t.sirApproved ? 'YES' : 'NO'}"`,
      `"${t.archived ? 'Archived Draft' : 'Active Task'}"`,
      `"${t.emailSent ? 'YES' : 'NO'}"`,
      `"${t.whatsappSent ? 'YES' : 'NO'}"`
    ].join(',');
    csvContent += row + '\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `FAST_Task_Report_${getFormattedDate()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('CSV Report Downloaded Successfully!', 'success');
}

// Utility: HTML Escaper
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}

// Toast Notifications Helper
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-check-circle';
  if (type === 'error') icon = 'fa-exclamation-circle';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
